import * as pdfjsLib from 'pdfjs-dist';

if (typeof window !== 'undefined' && 'Worker' in window) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

export interface PdfDocumentProxy {
  numPages: number;
  getPage: (pageNumber: number) => Promise<any>;
  destroy: () => Promise<void>;
}

export interface RenderedPageResult {
  pageNumber: number;
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
}

const documentCache = new Map<string, any>();
const pageCanvasCache = new Map<string, HTMLCanvasElement>();
const activeRenderTasks = new Map<string, any>();

export async function loadPdfDocument(pdfUrl: string): Promise<any> {
  if (documentCache.has(pdfUrl)) {
    return documentCache.get(pdfUrl);
  }

  try {
    const loadingTask = pdfjsLib.getDocument({
      url: pdfUrl,
      cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/cmaps/`,
      cMapPacked: true
    });

    const pdfDoc = await loadingTask.promise;
    documentCache.set(pdfUrl, pdfDoc);
    return pdfDoc;
  } catch (error) {
    console.error(`Failed to load PDF document from "${pdfUrl}":`, error);
    throw error;
  }
}

export async function renderPdfPageToCanvas(
  pdfDoc: any,
  pdfUrl: string,
  pageNumber: number,
  targetWidth: number = 800
): Promise<RenderedPageResult> {
  const cacheKey = `${pdfUrl}_p${pageNumber}_w${targetWidth}`;

  if (pageCanvasCache.has(cacheKey)) {
    const cachedCanvas = pageCanvasCache.get(cacheKey)!;
    return {
      pageNumber,
      canvas: cachedCanvas,
      width: cachedCanvas.width,
      height: cachedCanvas.height
    };
  }

  if (activeRenderTasks.has(cacheKey)) {
    try {
      activeRenderTasks.get(cacheKey).cancel();
    } catch {
      // Ignore
    }
    activeRenderTasks.delete(cacheKey);
  }

  const page = await pdfDoc.getPage(pageNumber);
  const unscaledViewport = page.getViewport({ scale: 1.0 });

  const desiredWidth = targetWidth;
  const scale = desiredWidth / unscaledViewport.width;
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement('canvas');
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);

  const context = canvas.getContext('2d', { alpha: false });
  if (!context) {
    throw new Error('Could not get 2D context from canvas');
  }

  context.fillStyle = '#faf8f5';
  context.fillRect(0, 0, canvas.width, canvas.height);

  const renderContext = {
    canvasContext: context,
    viewport: viewport
  };

  const renderTask = page.render(renderContext);
  activeRenderTasks.set(cacheKey, renderTask);

  try {
    await renderTask.promise;
    activeRenderTasks.delete(cacheKey);

    if (pageCanvasCache.size > 24) {
      const firstKey = pageCanvasCache.keys().next().value;
      if (firstKey) pageCanvasCache.delete(firstKey);
    }

    pageCanvasCache.set(cacheKey, canvas);

    return {
      pageNumber,
      canvas,
      width: canvas.width,
      height: canvas.height
    };
  } catch (error: any) {
    activeRenderTasks.delete(cacheKey);
    if (error?.name === 'RenderingCancelledException') {
      throw error;
    }
    console.error(`Error rendering PDF page ${pageNumber}:`, error);
    throw error;
  }
}

export async function prefetchPdfPages(
  pdfDoc: any,
  pdfUrl: string,
  startPage: number,
  endPage: number,
  targetWidth: number = 800
): Promise<void> {
  const boundedStart = Math.max(1, startPage);
  const boundedEnd = Math.min(pdfDoc.numPages, endPage);

  for (let p = boundedStart; p <= boundedEnd; p++) {
    const key = `${pdfUrl}_p${p}_w${targetWidth}`;
    if (!pageCanvasCache.has(key)) {
      renderPdfPageToCanvas(pdfDoc, pdfUrl, p, targetWidth).catch(() => {});
    }
  }
}

export function clearPdfRenderTasks(): void {
  for (const [, task] of activeRenderTasks) {
    try {
      task.cancel();
    } catch {
      // Ignore
    }
  }
  activeRenderTasks.clear();
}
