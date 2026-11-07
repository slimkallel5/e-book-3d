import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLibraryStore } from '../../store/useLibraryStore';
import { BOOKS_DATA } from '../../data/books';
import { EDUCATION_LEVELS } from '../../data/educationLevels';
import { BookSpread3D } from './BookSpread3D';
import {
  loadPdfDocument,
  renderPdfPageToCanvas,
  prefetchPdfPages,
  clearPdfRenderTasks
} from '../../services/pdfService';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  AlertCircle,
  Loader2,
  BookOpen,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface BookReaderProps {
  onClose?: () => void;
}

export const BookReader: React.FC<BookReaderProps> = ({ onClose }) => {
  const selectedBookId = useLibraryStore((s) => s.selectedBookId);
  const selectBook = useLibraryStore((s) => s.selectBook);
  const language = useLibraryStore((s) => s.language);

  const book = BOOKS_DATA.find((b) => b.id === selectedBookId);
  const level = book ? EDUCATION_LEVELS.find((l) => l.id === book.educationLevelId) : null;

  const [pdfDoc, setPdfDoc] = useState<any | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoadingPdf, setIsLoadingPdf] = useState<boolean>(true);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const [currentSpreadIndex, setCurrentSpreadIndex] = useState<number>(0);
  const [leftCanvas, setLeftCanvas] = useState<HTMLCanvasElement | null>(null);
  const [rightCanvas, setRightCanvas] = useState<HTMLCanvasElement | null>(null);

  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [turnDirection, setTurnDirection] = useState<'forward' | 'backward' | null>(null);
  const [turnProgress, setTurnProgress] = useState<number>(0);
  const [turningCanvasFront, setTurningCanvasFront] = useState<HTMLCanvasElement | null>(null);
  const [turningCanvasBack, setTurningCanvasBack] = useState<HTMLCanvasElement | null>(null);

  // Mouse & Touch Dragging State
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragProgress, setDragProgress] = useState<number>(0);
  const [dragDirection, setDragDirection] = useState<'forward' | 'backward' | null>(null);

  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [isOpening, setIsOpening] = useState<boolean>(true);

  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  const handleClose = useCallback(() => {
    clearPdfRenderTasks();
    if (onClose) onClose();
    else selectBook(null);
  }, [onClose, selectBook]);

  useEffect(() => {
    if (!book) return;

    let isMounted = true;
    setIsLoadingPdf(true);
    setPdfError(null);
    setCurrentSpreadIndex(0);
    setLeftCanvas(null);
    setRightCanvas(null);
    setIsOpening(true);

    const timer = setTimeout(() => {
      setIsOpening(false);
    }, 450);

    const pdfUrl = book.content?.pdfUrl;
    if (!pdfUrl) {
      setIsLoadingPdf(false);
      setPdfError(
        language === 'ar'
          ? 'المحتوى الرقمي لهذا الكتاب غير متاح حالياً.'
          : language === 'fr'
          ? 'Le contenu numérique de cet ouvrage n’est pas disponible.'
          : 'The digital PDF content for this book is currently unavailable.'
      );
      return;
    }

    loadPdfDocument(pdfUrl)
      .then((doc) => {
        if (!isMounted) return;
        setPdfDoc(doc);
        setTotalPages(doc.numPages);
        setIsLoadingPdf(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Failed to load PDF in reader:', err);
        setIsLoadingPdf(false);
        setPdfError(
          language === 'ar'
            ? 'تعذر تحميل ملف الكتاب بصيغة PDF. تأكد من توفر الملف.'
            : language === 'fr'
            ? 'Impossible de charger le fichier PDF de l’ouvrage.'
            : 'Unable to load the book PDF file. Please verify availability.'
        );
      });

    return () => {
      isMounted = false;
      clearTimeout(timer);
      clearPdfRenderTasks();
    };
  }, [book, language]);

  useEffect(() => {
    if (!pdfDoc || !book) return;

    let isMounted = true;
    const page1Num = currentSpreadIndex * 2 + 1;
    const page2Num = currentSpreadIndex * 2 + 2;
    const pdfUrl = book.content.pdfUrl;

    const renderCurrentSpread = async () => {
      try {
        if (page1Num <= totalPages) {
          const res1 = await renderPdfPageToCanvas(pdfDoc, pdfUrl, page1Num, 900);
          if (isMounted) setLeftCanvas(res1.canvas);
        } else {
          if (isMounted) setLeftCanvas(null);
        }

        if (page2Num <= totalPages) {
          const res2 = await renderPdfPageToCanvas(pdfDoc, pdfUrl, page2Num, 900);
          if (isMounted) setRightCanvas(res2.canvas);
        } else {
          if (isMounted) setRightCanvas(null);
        }

        prefetchPdfPages(pdfDoc, pdfUrl, page2Num + 1, page2Num + 2, 900);
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.error('Spread rendering error:', err);
        }
      }
    };

    renderCurrentSpread();

    return () => {
      isMounted = false;
    };
  }, [pdfDoc, currentSpreadIndex, totalPages, book]);

  const maxSpreads = Math.max(1, Math.ceil(totalPages / 2));
  const canGoNext = currentSpreadIndex < maxSpreads - 1;
  const canGoPrev = currentSpreadIndex > 0;

  const prepareTurningCanvases = useCallback(async (dir: 'forward' | 'backward') => {
    if (!pdfDoc || !book) return;
    const pdfUrl = book.content.pdfUrl;

    if (dir === 'forward') {
      const currentPageRightNum = currentSpreadIndex * 2 + 2;
      const nextSpreadLeftNum = (currentSpreadIndex + 1) * 2 + 1;
      const nextSpreadRightNum = (currentSpreadIndex + 1) * 2 + 2;

      try {
        const frontRes = await renderPdfPageToCanvas(pdfDoc, pdfUrl, currentPageRightNum, 900);
        const backRes = await renderPdfPageToCanvas(pdfDoc, pdfUrl, nextSpreadLeftNum, 900);
        setTurningCanvasFront(frontRes.canvas);
        setTurningCanvasBack(backRes.canvas);

        if (nextSpreadRightNum <= totalPages) {
          renderPdfPageToCanvas(pdfDoc, pdfUrl, nextSpreadRightNum, 900).then((res) => {
            setRightCanvas(res.canvas);
          });
        }
      } catch (e) {
        console.error('Error preparing forward canvases:', e);
      }
    } else {
      const currentLeftNum = currentSpreadIndex * 2 + 1;
      const prevSpreadLeftNum = (currentSpreadIndex - 1) * 2 + 1;
      const prevSpreadRightNum = (currentSpreadIndex - 1) * 2 + 2;

      try {
        const backRes = await renderPdfPageToCanvas(pdfDoc, pdfUrl, currentLeftNum, 900);
        const frontRes = await renderPdfPageToCanvas(pdfDoc, pdfUrl, prevSpreadRightNum, 900);
        setTurningCanvasFront(frontRes.canvas);
        setTurningCanvasBack(backRes.canvas);

        if (prevSpreadLeftNum <= totalPages) {
          renderPdfPageToCanvas(pdfDoc, pdfUrl, prevSpreadLeftNum, 900).then((res) => {
            setLeftCanvas(res.canvas);
          });
        }
      } catch (e) {
        console.error('Error preparing backward canvases:', e);
      }
    }
  }, [pdfDoc, book, currentSpreadIndex, totalPages]);

  const handleNextPage = useCallback(async () => {
    if (isAnimating || isDragging || !canGoNext || !pdfDoc || !book) return;

    setIsAnimating(true);
    setTurnDirection('forward');

    await prepareTurningCanvases('forward');

    const duration = 400;
    const startTime = performance.now();

    const animateFrame = (now: number) => {
      const elapsed = now - startTime;
      const rawProgress = Math.min(1, elapsed / duration);
      const progress =
        rawProgress < 0.5
          ? 4 * rawProgress * rawProgress * rawProgress
          : 1 - Math.pow(-2 * rawProgress + 2, 3) / 2;

      setTurnProgress(progress);

      if (rawProgress < 1) {
        requestAnimationFrame(animateFrame);
      } else {
        setCurrentSpreadIndex((prev) => prev + 1);
        setIsAnimating(false);
        setTurnDirection(null);
        setTurnProgress(0);
        setTurningCanvasFront(null);
        setTurningCanvasBack(null);
      }
    };

    requestAnimationFrame(animateFrame);
  }, [isAnimating, isDragging, canGoNext, pdfDoc, book, prepareTurningCanvases]);

  const handlePrevPage = useCallback(async () => {
    if (isAnimating || isDragging || !canGoPrev || !pdfDoc || !book) return;

    setIsAnimating(true);
    setTurnDirection('backward');

    await prepareTurningCanvases('backward');

    const duration = 400;
    const startTime = performance.now();

    const animateFrame = (now: number) => {
      const elapsed = now - startTime;
      const rawProgress = Math.min(1, elapsed / duration);
      const progress =
        rawProgress < 0.5
          ? 4 * rawProgress * rawProgress * rawProgress
          : 1 - Math.pow(-2 * rawProgress + 2, 3) / 2;

      setTurnProgress(progress);

      if (rawProgress < 1) {
        requestAnimationFrame(animateFrame);
      } else {
        setCurrentSpreadIndex((prev) => prev - 1);
        setIsAnimating(false);
        setTurnDirection(null);
        setTurnProgress(0);
        setTurningCanvasFront(null);
        setTurningCanvasBack(null);
      }
    };

    requestAnimationFrame(animateFrame);
  }, [isAnimating, isDragging, canGoPrev, pdfDoc, book, prepareTurningCanvases]);

  // Pointer Drag Handlers
  const handleStartDrag = useCallback(async (dir: 'forward' | 'backward', initialProgress: number) => {
    if (isAnimating || isDragging) return;
    setIsDragging(true);
    setDragDirection(dir);
    setDragProgress(initialProgress);
    await prepareTurningCanvases(dir);
  }, [isAnimating, isDragging, prepareTurningCanvases]);

  const handleUpdateDrag = useCallback((prog: number) => {
    if (!isDragging) return;
    setDragProgress(prog);
  }, [isDragging]);

  const handleEndDrag = useCallback((completed: boolean) => {
    if (!isDragging || !dragDirection) return;

    const startProg = dragProgress;
    const targetProg = completed ? 1 : 0;
    const duration = 280;
    const startTime = performance.now();

    setIsAnimating(true);
    setIsDragging(false);

    const animateRelease = (now: number) => {
      const elapsed = now - startTime;
      const ratio = Math.min(1, elapsed / duration);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - ratio, 3);
      const currentProg = startProg + (targetProg - startProg) * eased;

      setDragProgress(currentProg);

      if (ratio < 1) {
        requestAnimationFrame(animateRelease);
      } else {
        if (completed) {
          if (dragDirection === 'forward') {
            setCurrentSpreadIndex((prev) => prev + 1);
          } else {
            setCurrentSpreadIndex((prev) => prev - 1);
          }
        }
        setIsAnimating(false);
        setDragDirection(null);
        setDragProgress(0);
        setTurningCanvasFront(null);
        setTurningCanvasBack(null);
      }
    };

    requestAnimationFrame(animateRelease);
  }, [isDragging, dragDirection, dragProgress]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (language === 'ar') handlePrevPage();
        else handleNextPage();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (language === 'ar') handleNextPage();
        else handlePrevPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose, handleNextPage, handlePrevPage, language]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        if (language === 'ar') handlePrevPage();
        else handleNextPage();
      } else {
        if (language === 'ar') handleNextPage();
        else handlePrevPage();
      }
    }
  };

  if (!book) return null;

  const title = book.title[language] || book.title.ar;
  const author = book.author[language] || book.author.ar;
  const levelName = level ? (level.shortName[language] || level.shortName.ar) : '';
  const pageStart = currentSpreadIndex * 2 + 1;
  const pageEnd = Math.min(totalPages, currentSpreadIndex * 2 + 2);

  return (
    <div
      data-testid="direct-book-reader"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 35,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'rgba(248, 241, 229, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        opacity: isOpening ? 0.4 : 1,
        transform: isOpening ? 'scale(0.97)' : 'scale(1)',
        color: 'var(--color-text-primary)'
      }}
    >
      <header
        data-testid="reader-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 24px',
          background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          boxShadow: '0 4px 16px var(--color-shadow)',
          zIndex: 40,
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            data-testid="close-reader-btn"
            onClick={handleClose}
            className="glass-panel-interactive"
            style={{
              padding: '7px 14px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--color-text-primary)',
              background: 'var(--color-surface-secondary)',
              border: '1px solid var(--color-border)',
              fontWeight: 700,
              fontSize: '0.84rem'
            }}
            title={language === 'ar' ? 'إغلاق الكتاب' : 'Close book'}
          >
            {language === 'ar' ? <ArrowRight size={16} color="var(--color-primary)" /> : <ArrowLeft size={16} color="var(--color-primary)" />}
            <span>{language === 'ar' ? 'إغلاق والعودة' : language === 'fr' ? 'Fermer' : 'Close Reader'}</span>
          </button>

          {level && (
            <span
              style={{
                fontSize: '0.74rem',
                padding: '4px 10px',
                borderRadius: '14px',
                background: level.badgeColor || 'var(--color-primary)',
                color: '#ffffff',
                fontWeight: 700
              }}
            >
              {levelName}
            </span>
          )}
        </div>

        <div style={{ textAlign: 'center', flex: 1, minWidth: '220px' }}>
          <h1
            style={{
              fontSize: '1.08rem',
              fontWeight: 800,
              color: 'var(--color-text-primary)',
              margin: 0,
              lineHeight: 1.3
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: '0.78rem',
              color: 'var(--color-text-secondary)',
              margin: 0,
              fontWeight: 600
            }}
          >
            {author} {book.publisher ? `· ${book.publisher[language] || book.publisher.ar}` : ''}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {!isLoadingPdf && !pdfError && totalPages > 0 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                background: 'var(--color-surface-secondary)',
                borderRadius: '10px',
                border: '1px solid var(--color-border)',
                fontSize: '0.8rem',
                color: 'var(--color-text-primary)',
                fontWeight: 700
              }}
            >
              <BookOpen size={14} color="var(--color-primary)" />
              <span>
                {language === 'ar'
                  ? `الصفحات ${pageStart}-${pageEnd} من ${totalPages}`
                  : `Pages ${pageStart}-${pageEnd} of ${totalPages}`}
              </span>
            </div>
          )}

          <button
            data-testid="reader-prev-btn"
            onClick={handlePrevPage}
            disabled={!canGoPrev || isAnimating}
            className="glass-panel-interactive"
            style={{
              padding: '6px',
              borderRadius: '8px',
              color: 'var(--color-text-primary)',
              background: 'var(--color-surface-secondary)',
              border: '1px solid var(--color-border)',
              opacity: canGoPrev && !isAnimating ? 1 : 0.4,
              cursor: canGoPrev && !isAnimating ? 'pointer' : 'not-allowed',
              display: 'flex'
            }}
            title={language === 'ar' ? 'الصفحة السابقة' : 'Previous page'}
          >
            {language === 'ar' ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          <button
            data-testid="reader-next-btn"
            onClick={handleNextPage}
            disabled={!canGoNext || isAnimating}
            className="glass-panel-interactive"
            style={{
              padding: '6px',
              borderRadius: '8px',
              color: 'var(--color-text-primary)',
              background: 'var(--color-surface-secondary)',
              border: '1px solid var(--color-border)',
              opacity: canGoNext && !isAnimating ? 1 : 0.4,
              cursor: canGoNext && !isAnimating ? 'pointer' : 'not-allowed',
              display: 'flex'
            }}
            title={language === 'ar' ? 'الصفحة التالية' : 'Next page'}
          >
            {language === 'ar' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>

          <button
            data-testid="reader-zoom-btn"
            onClick={() => setZoomLevel((z) => (z === 1.0 ? 1.25 : 1.0))}
            className="glass-panel-interactive"
            style={{
              padding: '6px',
              borderRadius: '8px',
              color: 'var(--color-text-primary)',
              background: 'var(--color-surface-secondary)',
              border: '1px solid var(--color-border)',
              display: 'flex'
            }}
            title={zoomLevel === 1.0 ? 'Zoom In' : 'Zoom Out'}
          >
            {zoomLevel === 1.0 ? <ZoomIn size={18} /> : <ZoomOut size={18} />}
          </button>

          {book.content?.pdfUrl && (
            <a
              data-testid="reader-download-btn"
              href={book.content.pdfUrl}
              download={`${book.id}.pdf`}
              className="glass-panel-interactive"
              style={{
                padding: '6px',
                borderRadius: '8px',
                color: 'var(--color-text-primary)',
                background: 'var(--color-surface-secondary)',
                border: '1px solid var(--color-border)',
                display: 'flex'
              }}
              title={language === 'ar' ? 'تحميل الكتاب' : 'Download PDF'}
            >
              <Download size={18} />
            </a>
          )}

          <button
            onClick={handleClose}
            className="glass-panel-interactive"
            style={{
              padding: '6px',
              borderRadius: '8px',
              color: 'var(--color-text-secondary)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex'
            }}
            title={language === 'ar' ? 'إغلاق' : 'Close'}
          >
            <X size={20} />
          </button>
        </div>
      </header>

      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px 24px',
          overflow: 'auto',
          position: 'relative'
        }}
      >
        {isLoadingPdf && (
          <div
            data-testid="reader-loading-state"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              color: 'var(--color-text-primary)'
            }}
          >
            <Loader2 size={36} className="animate-spin text-amber-600" />
            <p style={{ fontWeight: 700, fontSize: '0.92rem' }}>
              {language === 'ar'
                ? 'جاري فتح وتحميل صفحات الكتاب...'
                : language === 'fr'
                ? 'Chargement et ouverture de l’ouvrage...'
                : 'Opening and rendering book pages...'}
            </p>
          </div>
        )}

        {!isLoadingPdf && pdfError && (
          <div
            data-testid="reader-error-state"
            style={{
              maxWidth: '460px',
              padding: '24px 32px',
              borderRadius: '16px',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-danger)',
              boxShadow: '0 12px 32px var(--color-shadow)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <AlertCircle size={40} color="var(--color-danger)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-danger)', margin: 0 }}>
              {language === 'ar'
                ? 'المحتوى غير متاح'
                : language === 'fr'
                ? 'Contenu indisponible'
                : 'Content Unavailable'}
            </h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
              {pdfError}
            </p>
            <button
              onClick={handleClose}
              className="glass-panel-interactive"
              style={{
                marginTop: '8px',
                padding: '8px 20px',
                borderRadius: '10px',
                background: 'var(--color-surface-secondary)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text-primary)',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}
            >
              {language === 'ar' ? 'العودة للمكتبة' : 'Return to Library'}
            </button>
          </div>
        )}

        {!isLoadingPdf && !pdfError && (
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${zoomLevel})`,
              transition: 'transform 0.25s ease'
            }}
          >
            <BookSpread3D
              leftCanvas={leftCanvas}
              rightCanvas={rightCanvas}
              turningCanvasFront={turningCanvasFront}
              turningCanvasBack={turningCanvasBack}
              turnDirection={turnDirection}
              turnProgress={turnProgress}
              isAnimating={isAnimating}
              coverColor={book.coverStyle?.primaryColor || '#c99a62'}
              canGoNext={canGoNext}
              canGoPrev={canGoPrev}
              isDragging={isDragging}
              dragProgress={dragProgress}
              dragDirection={dragDirection}
              onStartDrag={handleStartDrag}
              onUpdateDrag={handleUpdateDrag}
              onEndDrag={handleEndDrag}
              onPageClick={(isRightSide) => {
                if (isRightSide) {
                  if (language === 'ar') handlePrevPage();
                  else handleNextPage();
                } else {
                  if (language === 'ar') handleNextPage();
                  else handlePrevPage();
                }
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
};
