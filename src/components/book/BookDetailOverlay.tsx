import React from 'react';
import { useLibraryStore } from '../../store/useLibraryStore';
import { BOOKS_DATA } from '../../data/books';
import {
  BookOpen,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  RotateCcw
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

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '80px 24px 30px'
      }}
    >
      {/* Top Floating Info Bar (Book Title, Subject & Back button) */}
      <div
        className="glass-panel animate-fade-in"
        style={{
          pointerEvents: 'auto',
          alignSelf: 'center',
          borderRadius: '16px',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          boxShadow: 'var(--shadow-lg)',
          maxWidth: '850px',
          width: '90%'
        }}
      >
        <button
          onClick={handleClose}
          className="glass-panel-interactive"
          style={{
            padding: '8px 14px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#f8fafc',
            fontSize: '0.88rem'
          }}
        >
          {language === 'ar' ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
          <span>{language === 'ar' ? 'العودة إلى الرف' : language === 'fr' ? 'Retour aux rayons' : 'Back to Shelf'}</span>
        </button>

        <div style={{ flex: 1, minWidth: 0, textAlign: language === 'ar' ? 'right' : 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '0.72rem',
                padding: '2px 8px',
                borderRadius: '8px',
                background: book.coverStyle.accentColor || '#e5b364',
                color: '#1e140d',
                fontWeight: 700
              }}
            >
              {book.subject[language] || book.subject.ar}
            </span>
            <h2
              style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: '#f8fafc',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {book.title[language] || book.title.ar}
            </h2>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
            {book.author[language] || book.author.ar} • {book.publishYear} • {book.pagesCount}{' '}
            {language === 'ar' ? 'صفحة' : 'pages'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>
              {language === 'ar' ? 'السعر الرسمي' : 'Price'}
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbbf24' }}>
              {book.price.toFixed(3)}{' '}
              <span style={{ fontSize: '0.85rem' }}>{book.currency[language] || book.currency.ar}</span>
            </span>
          </div>

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
              padding: '10px 18px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #c4823f, #e5b364)',
              color: '#1e140d',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(229, 179, 100, 0.4)'
            }}
          >
            <ShoppingBag size={18} />
            <span>{language === 'ar' ? 'إضافة للسلة' : language === 'fr' ? 'Ajouter au panier' : 'Add to Basket'}</span>
          </button>
        </div>
      </div>

      {/* Center Drag Hint (shown when book is closed) */}
      {!isBookOpen && (
        <div
          className="animate-fade-in"
          style={{
            alignSelf: 'center',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '6px 16px',
            borderRadius: '20px',
            color: '#cbd5e1',
            fontSize: '0.8rem',
            userSelect: 'none'
          }}
        >
          <RotateCcw size={14} className="spin-slow" />
          <span>
            {language === 'ar'
              ? 'اسحب بالفأرة أو بإصبعك لتدوير الكتاب 360 درجة ومعاينته'
              : language === 'fr'
              ? 'Glissez pour faire pivoter le manuel à 360°'
              : 'Drag to inspect and rotate book 360°'}
          </span>
        </div>
      )}

      {/* Bottom Floating Control Bar (Open/Close book & Next/Prev page flipping) */}
      <div
        className="glass-panel animate-fade-in"
        style={{
          pointerEvents: 'auto',
          alignSelf: 'center',
          borderRadius: '24px',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Toggle Open/Close Button */}
        <button
          data-testid="toggle-open-book-btn"
          onClick={handleToggleOpen}
          className="glass-panel-interactive"
          style={{
            padding: '10px 20px',
            borderRadius: '14px',
            background: isBookOpen ? 'rgba(239, 68, 68, 0.2)' : 'rgba(229, 179, 100, 0.25)',
            border: isBookOpen ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid #e5b364',
            color: isBookOpen ? '#fca5a5' : '#fbbf24',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.9rem'
          }}
        >
          <BookOpen size={18} />
          <span>
            {isBookOpen
              ? language === 'ar'
                ? 'إغلاق الكتاب'
                : language === 'fr'
                ? 'Fermer le manuel'
                : 'Close Book'
              : language === 'ar'
              ? 'فتح الكتاب وتصفح المحتوى'
              : language === 'fr'
              ? 'Ouvrir et feuilleter'
              : 'Open Book & Preview'}
          </span>
        </button>

        {/* Page Flipping Navigation Controls (Active only when book is open) */}
        {isBookOpen && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '1px', height: '24px', background: 'rgba(255, 255, 255, 0.15)' }} />

            <button
              data-testid="prev-page-btn"
              onClick={handlePrevPage}
              disabled={currentBookPage === 0}
              className="glass-panel-interactive"
              style={{
                padding: '8px',
                borderRadius: '50%',
                color: '#f8fafc',
                opacity: currentBookPage === 0 ? 0.35 : 1,
                cursor: currentBookPage === 0 ? 'not-allowed' : 'pointer',
                display: 'flex'
              }}
              title={language === 'ar' ? 'الصفحة السابقة' : 'Previous page'}
            >
              {language === 'ar' ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>

            <span
              style={{
                fontSize: '0.85rem',
                color: '#f1f5f9',
                fontWeight: 600,
                minWidth: '85px',
                textAlign: 'center'
              }}
            >
              {language === 'ar'
                ? `الصفحات ${currentBookPage * 2 + 1}-${currentBookPage * 2 + 2}`
                : `Pages ${currentBookPage * 2 + 1}-${currentBookPage * 2 + 2}`}
            </span>

            <button
              data-testid="next-page-btn"
              onClick={handleNextPage}
              disabled={currentBookPage >= totalSpreadCount - 1}
              className="glass-panel-interactive"
              style={{
                padding: '8px',
                borderRadius: '50%',
                color: '#f8fafc',
                opacity: currentBookPage >= totalSpreadCount - 1 ? 0.35 : 1,
                cursor: currentBookPage >= totalSpreadCount - 1 ? 'not-allowed' : 'pointer',
                display: 'flex'
              }}
              title={language === 'ar' ? 'الصفحة التالية' : 'Next page'}
            >
              {language === 'ar' ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
