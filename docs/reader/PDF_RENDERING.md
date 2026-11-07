# PDF Rendering & Page Management Architecture

## Single Source of Truth
The book's authentic curriculum content is sourced directly from a standard multi-page PDF file. Covers and discovery posters are treated as separate, decoupled image assets.

## Integration & Lifecycle Management (`src/services/pdfService.ts`)

1. **On-Demand Document Loading**:
   - PDFs are loaded into memory only when the user selects and opens a book.
   - The document proxy is memoized in `documentCache` to avoid repeated network requests.

2. **Isolated Canvas Rendering**:
   - `renderPdfPageToCanvas(pdfDoc, pdfUrl, pageNumber, targetWidth)` scales the PDF viewport proportionally to fit the A4 page container without stretching.
   - Rendered page outputs are cached in a bounded LRU memory map (`pageCanvasCache`, maximum 24 pages).

3. **Background Prefetching**:
   - When the current spread (P_k, P_{k+1}) is displayed, `prefetchPdfPages` kicks off background rendering for (P_{k+2}, P_{k+3}) to guarantee instantaneous page flips.

4. **Task Cancellation & Resource Cleanup**:
   - In-flight render promises are registered in `activeRenderTasks`.
   - Rapid navigation cancels obsolete rendering tasks before initiating new ones.
   - Closing or switching books invokes `clearPdfRenderTasks()` and purges temporary offscreen canvases.

5. **Graceful Error Handling**:
   - Books with missing or unreadable PDFs display an informative, user-friendly unavailable-content banner rather than crashing or freezing WebGL.
