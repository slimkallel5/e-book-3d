import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { LibraryScene } from './scenes/LibraryScene';
import { WebGLFallback } from './components/ui/WebGLFallback';
import { BookReader } from './components/reader/BookReader';
import { Header } from './components/navigation/Header';
import { SearchModal } from './components/navigation/SearchModal';
import { BasketDrawer } from './components/basket/BasketDrawer';
import { FlyingBookEffect } from './components/basket/FlyingBookEffect';
import GlassyCarousel, { GlassyCarouselItem } from './components/ui/glassy-coverflow-carousel';
import { bookToCarouselItem } from './utils/bookCarouselAdapter';
import { useLibraryStore } from './store/useLibraryStore';
import { EDUCATION_LEVELS } from './data/educationLevels';
import { BOOKS_DATA } from './data/books';
import { Book } from './types/book';
import {
  Layers,
  ChevronLeft,
  ChevronRight,
  Eye,
  ShoppingCart,
  X,
  Sparkles
} from 'lucide-react';

export const App: React.FC = () => {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [basketBouncing, setBasketBouncing] = useState(false);
  const [addedToast, setAddedToast] = useState<string | null>(null);
  const [flyingBook, setFlyingBook] = useState<{
    book: Book;
    startPos: { x: number; y: number };
  } | null>(null);

  const basketButtonRef = useRef<HTMLButtonElement | null>(null);

  const language = useLibraryStore((s) => s.language);
  const activeLevelId = useLibraryStore((s) => s.activeLevelId);
  const setActiveLevelId = useLibraryStore((s) => s.setActiveLevelId);
  const viewMode = useLibraryStore((s) => s.viewMode);
  const isCarouselOpen = useLibraryStore((s) => s.isCarouselOpen);
  const setIsCarouselOpen = useLibraryStore((s) => s.setIsCarouselOpen);
  const carouselActiveIndex = useLibraryStore((s) => s.carouselActiveIndex);
  const setCarouselActiveIndex = useLibraryStore((s) => s.setCarouselActiveIndex);
  const selectedBookId = useLibraryStore((s) => s.selectedBookId);
  const selectBook = useLibraryStore((s) => s.selectBook);
  const addToBasket = useLibraryStore((s) => s.addToBasket);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setHasWebGL(Boolean(gl));
    } catch {
      setHasWebGL(false);
    }
  }, []);

  // Global keyboard shortcut: Command/Ctrl + K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!hasWebGL) {
    return <WebGLFallback />;
  }

  const isAllLevels = activeLevelId === 'all';
  const currentLevel = isAllLevels ? null : (EDUCATION_LEVELS.find((l) => l.id === activeLevelId) || EDUCATION_LEVELS[0]);
  const currentLevelBooks = useMemo(() => {
    return isAllLevels
      ? BOOKS_DATA
      : BOOKS_DATA.filter((b) => b.educationLevelId === currentLevel?.id);
  }, [isAllLevels, currentLevel?.id]);

  const carouselItems: GlassyCarouselItem[] = useMemo(() => {
    return currentLevelBooks.map((book) => bookToCarouselItem(book, language));
  }, [currentLevelBooks, language]);

  const activeBook: Book | undefined = currentLevelBooks[carouselActiveIndex] || currentLevelBooks[0];
  const activeBookLevel = activeBook ? EDUCATION_LEVELS.find((l) => l.id === activeBook.educationLevelId) : null;

  const handlePrevLevel = () => {
    if (isAllLevels) {
      setActiveLevelId(EDUCATION_LEVELS[EDUCATION_LEVELS.length - 1].id);
      return;
    }
    const currentIndex = EDUCATION_LEVELS.findIndex((l) => l.id === activeLevelId);
    if (currentIndex <= 0) {
      setActiveLevelId('all');
    } else {
      setActiveLevelId(EDUCATION_LEVELS[currentIndex - 1].id);
    }
  };

  const handleNextLevel = () => {
    if (isAllLevels) {
      setActiveLevelId(EDUCATION_LEVELS[0].id);
      return;
    }
    const currentIndex = EDUCATION_LEVELS.findIndex((l) => l.id === activeLevelId);
    if (currentIndex >= EDUCATION_LEVELS.length - 1) {
      setActiveLevelId('all');
    } else {
      setActiveLevelId(EDUCATION_LEVELS[currentIndex + 1].id);
    }
  };

  const handleSelectCarouselItem = (_item: GlassyCarouselItem, idx: number) => {
    setCarouselActiveIndex(idx);
  };

  const handleInspectSelectedBook = () => {
    if (activeBook) {
      selectBook(activeBook.id);
    }
  };

  const handleAddBookWithAnimation = (book: Book, e: React.MouseEvent<HTMLButtonElement>) => {
    addToBasket(book);
    const rect = e.currentTarget.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    const bookTitle = book.title[language] || book.title.ar;
    setAddedToast(bookTitle);
    setTimeout(() => {
      setAddedToast(null);
    }, 2800);

    setFlyingBook({
      book,
      startPos: { x: startX, y: startY }
    });
  };

  const handleFlyingBookComplete = () => {
    setFlyingBook(null);
    setBasketBouncing(true);
    setTimeout(() => {
      setBasketBouncing(false);
    }, 700);
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* 3D Canvas Viewport */}
      <div className="canvas-container">
        <Canvas
          shadows
          dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 1.25) : 1}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true
          }}
          onCreated={({ gl }) => {
            gl.setClearColor('#F8F1E5');
          }}
        >
          <LibraryScene />
        </Canvas>
      </div>

      {/* Floating Header UI */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        basketButtonRef={basketButtonRef}
        basketBouncing={basketBouncing}
      />

      {/* Added to Basket Toast Notification */}
      {addedToast && (
        <div
          data-testid="basket-toast"
          className="glass-panel"
          style={{
            position: 'absolute',
            top: '80px',
            right: language === 'ar' ? 'auto' : '28px',
            left: language === 'ar' ? '28px' : 'auto',
            zIndex: 45,
            padding: '10px 18px',
            borderRadius: '12px',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-primary)',
            boxShadow: '0 8px 24px rgba(217, 155, 61, 0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'fadeIn 0.25s ease'
          }}
        >
          <Sparkles size={16} color="var(--color-primary)" />
          <div style={{ fontSize: '0.84rem', color: 'var(--color-text-primary)' }}>
            <span style={{ fontWeight: 700 }}>
              {language === 'ar' ? 'تمت إضافة' : language === 'fr' ? 'Ajouté :' : 'Added:'}
            </span>{' '}
            <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{addedToast}</span>{' '}
            <span>{language === 'ar' ? 'إلى السلة' : language === 'fr' ? 'au panier' : 'to basket'}</span>
          </div>
        </div>
      )}

      {/* Glassy Coverflow Carousel Book Showcase Layer */}
      {isCarouselOpen && carouselItems.length > 0 && (
        <div
          data-testid="glassy-carousel-layer"
          style={{
            position: 'absolute',
            top: '82px',
            bottom: '78px',
            left: 'clamp(380px, 42%, 660px)',
            right: '28px',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            paddingLeft: language === 'ar' ? '0' : '24px',
            paddingRight: language === 'ar' ? '24px' : '0',
            pointerEvents: 'none'
          }}
        >
          {/* Level Info HUD Banner */}
          <div
            className="glass-panel"
            style={{
              pointerEvents: 'auto',
              borderRadius: '14px',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              marginBottom: '6px',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              boxShadow: '0 4px 16px var(--color-shadow)',
              borderLeft: `4px solid ${currentLevel ? currentLevel.badgeColor : 'var(--color-primary)'}`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={handlePrevLevel}
                className="glass-panel-interactive"
                style={{
                  padding: '5px',
                  borderRadius: '50%',
                  color: 'var(--color-text-primary)',
                  display: 'flex',
                  background: 'var(--color-surface-secondary)',
                  border: '1px solid var(--color-border)'
                }}
                title={language === 'ar' ? 'السنة السابقة' : 'Previous Year'}
              >
                {language === 'ar' ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>

              <span style={{
                fontSize: '0.72rem',
                background: currentLevel ? currentLevel.badgeColor : 'var(--color-primary)',
                color: '#ffffff',
                padding: '2px 8px',
                borderRadius: '10px',
                fontWeight: 700
              }}>
                {currentLevel ? currentLevel.code : (language === 'ar' ? 'الكل' : language === 'fr' ? 'Tous' : 'ALL')}
              </span>

              <h2 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--color-text-primary)', margin: 0 }}>
                {currentLevel
                  ? (currentLevel.name[language] || currentLevel.name.ar)
                  : (language === 'ar' ? 'جميع المستويات التعليمية' : language === 'fr' ? 'Tous les niveaux scolaires' : 'All Education Levels')}
              </h2>

              <button
                onClick={handleNextLevel}
                className="glass-panel-interactive"
                style={{
                  padding: '5px',
                  borderRadius: '50%',
                  color: 'var(--color-text-primary)',
                  display: 'flex',
                  background: 'var(--color-surface-secondary)',
                  border: '1px solid var(--color-border)'
                }}
                title={language === 'ar' ? 'السنة التالية' : 'Next Year'}
              >
                {language === 'ar' ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
              </button>
            </div>

            <button
              data-testid="close-carousel-btn"
              onClick={() => setIsCarouselOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex'
              }}
              title={language === 'ar' ? 'إغلاق القائمة' : 'Close'}
            >
              <X size={18} />
            </button>
          </div>

          {/* Embedded Glassy Coverflow Carousel */}
          <div
            style={{
              position: 'relative',
              flex: 1,
              minHeight: 0,
              pointerEvents: 'auto',
              borderRadius: '16px',
              overflow: 'visible'
            }}
          >
            <GlassyCarousel
              items={carouselItems}
              layout="poster"
              initialIndex={Math.min(carouselActiveIndex, carouselItems.length - 1)}
              autoPlay={false}
              interval={4000}
              hideControls={false}
              label={language === 'ar' ? 'معرض الكتب المدرسية' : language === 'fr' ? 'Collection de manuels' : 'Textbook Collection'}
              onSelect={handleSelectCarouselItem}
              onItemClick={(item) => selectBook(item.id)}
              style={{
                height: '100%',
                maxHeight: '100%',
                minHeight: '340px',
                background: 'transparent'
              }}
            />
          </div>

          {/* Grouped Selected Book Product Information & Actions Underneath 3D Carousel */}
          {activeBook && (
            <div
              data-testid="selected-book-product-panel"
              className="glass-panel"
              style={{
                pointerEvents: 'auto',
                marginTop: '10px',
                padding: '12px 18px',
                borderRadius: '16px',
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                boxShadow: '0 8px 24px var(--color-shadow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                flexWrap: 'wrap'
              }}
            >
              {/* Left/Main Side: Book Title, Subject / Category / Level, Price */}
              <div style={{ flex: '1', minWidth: '220px', textAlign: language === 'ar' ? 'right' : 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                  <h3
                    data-testid="selected-book-title"
                    style={{
                      fontSize: '1.08rem',
                      fontWeight: 800,
                      color: 'var(--color-text-primary)',
                      margin: 0,
                      lineHeight: 1.2
                    }}
                  >
                    {activeBook.title[language] || activeBook.title.ar}
                  </h3>
                  {activeBookLevel && (
                    <span
                      style={{
                        fontSize: '0.7rem',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        background: activeBookLevel.badgeColor,
                        color: '#ffffff',
                        fontWeight: 700
                      }}
                    >
                      {activeBookLevel.shortName[language] || activeBookLevel.shortName.ar}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                  <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                    {activeBook.subject[language] || activeBook.subject.ar}
                  </span>
                  <span>•</span>
                  <span>{activeBook.author[language] || activeBook.author.ar}</span>
                  <span>•</span>
                  {/* Price Tag */}
                  <span
                    data-testid="selected-book-price"
                    style={{
                      fontWeight: 850,
                      fontSize: '1rem',
                      color: 'var(--color-primary)',
                      background: 'var(--color-surface-secondary)',
                      padding: '2px 8px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)'
                    }}
                  >
                    {activeBook.price.toFixed(3)} {activeBook.currency[language] || activeBook.currency.ar}
                  </span>
                </div>
              </div>

              {/* Actions: Add to Basket & 3D Preview grouped together */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                <button
                  data-testid="add-carousel-book-btn"
                  onClick={(e) => handleAddBookWithAnimation(activeBook, e)}
                  className="glass-panel-interactive"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    border: 'none',
                    background: 'linear-gradient(135deg, var(--color-success), #1f6448)',
                    boxShadow: '0 4px 12px rgba(40, 122, 88, 0.25)'
                  }}
                >
                  <ShoppingCart size={15} />
                  <span>{language === 'ar' ? 'إضافة للسلة' : language === 'fr' ? 'Ajouter au panier' : 'Add to Basket'}</span>
                </button>

                <button
                  data-testid="inspect-3d-btn"
                  onClick={handleInspectSelectedBook}
                  className="glass-panel-interactive"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)',
                    border: '1px solid var(--color-border)',
                    background: 'linear-gradient(135deg, var(--color-surface-secondary), var(--color-surface))'
                  }}
                >
                  <Eye size={15} color="var(--color-primary)" />
                  <span>{language === 'ar' ? 'معاينة 3D' : language === 'fr' ? 'Inspecter 3D' : '3D Preview'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Direct 3D Book Reader Presentation */}
      {selectedBookId && (viewMode === 'book-detail' || viewMode === 'book-open') && (
        <BookReader onClose={() => selectBook(null)} />
      )}

      {/* Flying Miniature Book Effect */}
      {flyingBook && (
        <FlyingBookEffect
          book={flyingBook.book}
          startPos={flyingBook.startPos}
          targetElement={basketButtonRef.current}
          onComplete={handleFlyingBookComplete}
        />
      )}

      {/* Global Search Dialog Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Shopping Basket Drawer */}
      <BasketDrawer />

      {/* Education Levels Bottom Shelf Selector Dock - Always visible */}
      <div
        className="glass-panel"
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 15,
          borderRadius: '30px',
          padding: '6px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          maxWidth: '94vw',
          overflowX: 'auto',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          boxShadow: '0 8px 24px var(--color-shadow)'
        }}
      >
        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', padding: '0 8px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
          <Layers size={14} color="var(--color-primary)" />
          {language === 'ar' ? 'السنوات الدراسية:' : language === 'fr' ? 'Niveaux:' : 'Years:'}
        </span>
        {/* All Levels Button */}
        <button
          data-testid="dock-level-all"
          onClick={() => setActiveLevelId('all')}
          style={{
            border: activeLevelId === 'all' && isCarouselOpen ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
            background: activeLevelId === 'all' && isCarouselOpen ? 'var(--color-primary)' : 'var(--color-surface-secondary)',
            color: activeLevelId === 'all' && isCarouselOpen ? '#ffffff' : 'var(--color-text-primary)',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: activeLevelId === 'all' && isCarouselOpen ? 750 : 550,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease'
          }}
        >
          {language === 'ar' ? 'جميع المستويات' : language === 'fr' ? 'Tous les niveaux' : 'All Levels'}
        </button>
        {EDUCATION_LEVELS.map((level) => {
          const isSelected = activeLevelId === level.id && isCarouselOpen;
          return (
            <button
              key={level.id}
              data-testid={`dock-level-${level.id}`}
              onClick={() => setActiveLevelId(level.id)}
              style={{
                border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                background: isSelected ? 'var(--color-primary)' : 'var(--color-surface-secondary)',
                color: isSelected ? '#ffffff' : 'var(--color-text-primary)',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: isSelected ? 750 : 550,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              {level.shortName[language] || level.shortName.ar}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default App;
