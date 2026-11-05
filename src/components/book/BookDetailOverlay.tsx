import React from 'react';
import { useLibraryStore } from '../../store/useLibraryStore';
import { BOOKS_DATA } from '../../data/books';
import { EDUCATION_LEVELS } from '../../data/educationLevels';
import {
  BookOpen,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  RotateCcw,
  X,
  Calendar,
  FileText
} from 'lucide-react';

interface BookDetailOverlayProps {
  onAddBookWithAnimation?: (book: any, e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const BookDetailOverlay: React.FC<BookDetailOverlayProps> = ({
  onAddBookWithAnimation
}) => {
  const selectedBookId = useLibraryStore((s) => s.selectedBookId);
  const selectBook = useLibraryStore((s) => s.selectBook);
  const isBookOpen = useLibraryStore((s) => s.isBookOpen);
  const setIsBookOpen = useLibraryStore((s) => s.setIsBookOpen);
  const currentBookPage = useLibraryStore((s) => s.currentBookPage);
  const setCurrentBookPage = useLibraryStore((s) => s.setCurrentBookPage);
  const language = useLibraryStore((s) => s.language);
  const addToBasket = useLibraryStore((s) => s.addToBasket);

  if (!selectedBookId) return null;

  const book = BOOKS_DATA.find((b) => b.id === selectedBookId);
  if (!book) return null;

  const level = EDUCATION_LEVELS.find((l) => l.id === book.educationLevelId);
  const totalSpreadCount = Math.max(1, Math.ceil(book.samplePages.length / 2));

  const handleNextPage = () => {
    if (currentBookPage < totalSpreadCount - 1) {
      setCurrentBookPage(currentBookPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentBookPage > 0) {
      setCurrentBookPage(currentBookPage - 1);
    }
  };

  const handleClose = () => {
    selectBook(null);
  };

  const handleToggleOpen = () => {
    setIsBookOpen(!isBookOpen);
  };

  const title = book.title[language] || book.title.ar;
  const author = book.author[language] || book.author.ar;
  const subject = book.subject[language] || book.subject.ar;
  const synopsis = book.synopsis[language] || book.synopsis.ar;
  const currency = book.currency[language] || book.currency.ar;
  const levelName = level ? (level.shortName[language] || level.shortName.ar) : '';

  return (
    <div
      data-testid="selected-book-overlay"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 25,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
    >
      {/* Central Grouped Card Container */}
      <div
        data-testid="selected-book-card-container"
        className="glass-panel animate-fade-in"
        style={{
          pointerEvents: 'auto',
          position: 'relative',
          width: 'min(92vw, 860px)',
          maxHeight: '88vh',
          borderRadius: '24px',
          background: 'rgba(15, 23, 42, 0.78)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(229, 179, 100, 0.35)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65), 0 0 30px rgba(229, 179, 100, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Card Header with Level Badge, Close button and Back link */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(255, 255, 255, 0.02)'
          }}
        >
          <button
            onClick={handleClose}
            className="glass-panel-interactive"
            style={{
              padding: '6px 12px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#cbd5e1',
              fontSize: '0.82rem',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            {language === 'ar' ? <ArrowRight size={15} /> : <ArrowLeft size={15} />}
            <span>{language === 'ar' ? 'العودة للمكتبة' : language === 'fr' ? 'Retour' : 'Back'}</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {level && (
              <span
                style={{
                  fontSize: '0.74rem',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  background: level.badgeColor || '#3b82f6',
                  color: '#ffffff',
                  fontWeight: 600
                }}
              >
                {levelName}
              </span>
            )}
            <span
              style={{
                fontSize: '0.74rem',
                padding: '3px 10px',
                borderRadius: '12px',
                background: book.coverStyle.accentColor || '#e5b364',
                color: '#1e140d',
                fontWeight: 700
              }}
            >
              {subject}
            </span>
          </div>

          <button
            data-testid="close-book-detail-btn"
            onClick={handleClose}
            className="glass-panel-interactive"
            style={{
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              color: '#94a3b8',
              border: 'none',
              background: 'transparent'
            }}
            title={language === 'ar' ? 'إغلاق' : 'Close'}
          >
            <X size={18} />
          </button>
        </div>

        {/* Card Body: Groups the 3D book inspection viewport & book metadata together */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(260px, 340px) 1fr',
            gap: '24px',
            padding: '24px',
            overflowY: 'auto'
          }}
          className="selected-book-body-grid"
        >
          {/* Left Column: Transparent Frame for 3D Book Viewing + Drag Hint */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              minHeight: '260px',
              background: 'radial-gradient(circle at center, rgba(229, 179, 100, 0.12) 0%, rgba(0,0,0,0) 70%)',
              borderRadius: '16px',
              border: '1px dashed rgba(229, 179, 100, 0.25)',
              padding: '12px'
            }}
          >
            {/* The 3D Book canvas renders right behind this centered viewport box */}
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(15, 23, 42, 0.8)',
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: '0.72rem',
                color: '#cbd5e1',
                pointerEvents: 'none'
              }}
            >
              <RotateCcw size={12} className="spin-slow" />
              <span>
                {language === 'ar'
                  ? 'اسحب بالفأرة لتدوير الكتاب 360°'
                  : language === 'fr'
                  ? 'Glissez pour pivoter 360°'
                  : 'Drag to inspect 360°'}
              </span>
            </div>
          </div>

          {/* Right Column: Name, Details & Actions Grouped in Middle */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              textAlign: language === 'ar' ? 'right' : 'left'
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  color: '#f8fafc',
                  lineHeight: 1.3,
                  marginBottom: '6px'
                }}
              >
                {title}
              </h2>

              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '12px' }}>
                <span style={{ color: '#fbbf24', fontWeight: 600 }}>{author}</span>
              </p>

              {/* Meta tags */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  flexWrap: 'wrap',
                  marginBottom: '16px',
                  fontSize: '0.78rem',
                  color: '#94a3b8'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={14} />
                  {book.publishYear}
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FileText size={14} />
                  {book.pagesCount} {language === 'ar' ? 'صفحة' : 'pages'}
                </span>
                <span>•</span>
                <span style={{ color: '#64748b' }}>ISBN: {book.isbn}</span>
              </div>

              {/* Synopsis preview */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  marginBottom: '18px'
                }}
              >
                <span
                  style={{
                    fontSize: '0.74rem',
                    color: '#fbbf24',
                    fontWeight: 700,
                    display: 'block',
                    marginBottom: '4px'
                  }}
                >
                  {language === 'ar' ? 'نبذة بيداغوجية:' : language === 'fr' ? 'Présentation:' : 'Overview:'}
                </span>
                <p
                  style={{
                    fontSize: '0.82rem',
                    color: '#e2e8f0',
                    lineHeight: 1.6,
                    maxHeight: '80px',
                    overflowY: 'auto'
                  }}
                >
                  {synopsis}
                </p>
              </div>
            </div>

            {/* Price & Action Buttons Container */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                paddingTop: '12px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>
                  {language === 'ar' ? 'السعر المقنن' : 'Official Price'}
                </span>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24' }}>
                  {book.price.toFixed(3)}{' '}
                  <span style={{ fontSize: '0.85rem' }}>{currency}</span>
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {/* Toggle Open/Close Book Spread */}
                <button
                  data-testid="toggle-open-book-btn"
                  onClick={handleToggleOpen}
                  className="glass-panel-interactive"
                  style={{
                    padding: '9px 16px',
                    borderRadius: '12px',
                    background: isBookOpen ? 'rgba(239, 68, 68, 0.2)' : 'rgba(229, 179, 100, 0.2)',
                    border: isBookOpen ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid #e5b364',
                    color: isBookOpen ? '#fca5a5' : '#fbbf24',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <BookOpen size={16} />
                  <span>
                    {isBookOpen
                      ? language === 'ar'
                        ? 'إغلاق'
                        : 'Close'
                      : language === 'ar'
                      ? 'تصفح المحتوى'
                      : 'Open Spread'}
                  </span>
                </button>

                {/* Add to Basket Button */}
                <button
                  data-testid="add-to-basket-btn"
                  onClick={(e) => {
                    if (onAddBookWithAnimation) {
                      onAddBookWithAnimation(book, e);
                    } else {
                      addToBasket(book);
                    }
                  }}
                  className="glass-panel-interactive"
                  style={{
                    padding: '9px 18px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #c4823f, #e5b364)',
                    color: '#1e140d',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 14px rgba(229, 179, 100, 0.4)'
                  }}
                >
                  <ShoppingBag size={16} />
                  <span>{language === 'ar' ? 'إضافة للسلة' : language === 'fr' ? 'Ajouter' : 'Add to Basket'}</span>
                </button>
              </div>
            </div>

            {/* If open, show pagination flip controls below */}
            {isBookOpen && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  marginTop: '12px',
                  padding: '6px 12px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '12px'
                }}
              >
                <button
                  data-testid="prev-page-btn"
                  onClick={handlePrevPage}
                  disabled={currentBookPage === 0}
                  className="glass-panel-interactive"
                  style={{
                    padding: '6px',
                    borderRadius: '50%',
                    color: '#f8fafc',
                    opacity: currentBookPage === 0 ? 0.35 : 1,
                    cursor: currentBookPage === 0 ? 'not-allowed' : 'pointer',
                    display: 'flex'
                  }}
                  title={language === 'ar' ? 'الصفحة السابقة' : 'Previous page'}
                >
                  {language === 'ar' ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>

                <span style={{ fontSize: '0.8rem', color: '#f1f5f9', fontWeight: 600 }}>
                  {language === 'ar'
                    ? `الصفحات ${currentBookPage * 2 + 1}-${currentBookPage * 2 + 2} من ${book.samplePages.length}`
                    : `Pages ${currentBookPage * 2 + 1}-${currentBookPage * 2 + 2} of ${book.samplePages.length}`}
                </span>

                <button
                  data-testid="next-page-btn"
                  onClick={handleNextPage}
                  disabled={currentBookPage >= totalSpreadCount - 1}
                  className="glass-panel-interactive"
                  style={{
                    padding: '6px',
                    borderRadius: '50%',
                    color: '#f8fafc',
                    opacity: currentBookPage >= totalSpreadCount - 1 ? 0.35 : 1,
                    cursor: currentBookPage >= totalSpreadCount - 1 ? 'not-allowed' : 'pointer',
                    display: 'flex'
                  }}
                  title={language === 'ar' ? 'الصفحة التالية' : 'Next page'}
                >
                  {language === 'ar' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
