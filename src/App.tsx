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
  X
} from 'lucide-react';

export const App: React.FC = () => {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [basketBouncing, setBasketBouncing] = useState(false);
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
    // Check for WebGL capability
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
          // Adaptive DPR: Clamp to 1.25 on high-density displays to avoid fragment shader fillrate bottlenecks, 1.0 on standard/mobile
          dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 1.25) : 1}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true
          }}
          onCreated={({ gl }) => {
            gl.setClearColor('#f3ebdd');
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

      {/* Glassy Coverflow Carousel Book Showcase Layer - Always visible even when book is inspected */}
      {isCarouselOpen && carouselItems.length > 0 && (
        <div
          data-testid="glassy-carousel-layer"
          style={{
            position: 'absolute',
            top: '74px',
            bottom: '76px',
            left: 'clamp(380px, 42%, 660px)',
            right: '28px',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            paddingLeft: '36px',
            pointerEvents: 'none'
          }}
        >
          {/* Level Info HUD Banner */}
          <div
            className="glass-panel animate-fade-in"
            style={{
              pointerEvents: 'auto',
              borderRadius: '14px',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              marginBottom: '4px',
              boxShadow: 'var(--shadow-md)',
              borderLeft: `4px solid ${currentLevel ? currentLevel.badgeColor : '#e5b364'}`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={handlePrevLevel}
                className="glass-panel-interactive"
                style={{ padding: '5px', borderRadius: '50%', color: '#f8fafc', display: 'flex' }}
                title={language === 'ar' ? 'السنة السابقة' : 'Previous Year'}
              >
                {language === 'ar' ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>

              <span style={{
                fontSize: '0.72rem',
                background: currentLevel ? currentLevel.badgeColor : 'linear-gradient(135deg, #e5b364, #945629)',
                color: '#ffffff',
                padding: '2px 8px',
                borderRadius: '10px',
                fontWeight: 600
              }}>
                {currentLevel ? currentLevel.code : (language === 'ar' ? 'الكل' : language === 'fr' ? 'Tous' : 'ALL')}
              </span>

              <h2 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                {currentLevel
                  ? (currentLevel.name[language] || currentLevel.name.ar)
                  : (language === 'ar' ? 'جميع المستويات التعليمية' : language === 'fr' ? 'Tous les niveaux scolaires' : 'All Education Levels')}
              </h2>

              <button
                onClick={handleNextLevel}
                className="glass-panel-interactive"
                style={{ padding: '5px', borderRadius: '50%', color: '#f8fafc', display: 'flex' }}
                title={language === 'ar' ? 'السنة التالية' : 'Next Year'}
              >
                {language === 'ar' ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
              </button>
            </div>

            {/* Quick Actions: 3D Inspect & Add to Basket for active book */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {activeBook && (
                <>
                  <button
                    data-testid="inspect-3d-btn"
                    onClick={handleInspectSelectedBook}
                    className="glass-panel-interactive"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '5px 12px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#fbbf24',
                      border: '1px solid rgba(229, 179, 100, 0.4)',
                      background: 'rgba(229, 179, 100, 0.12)'
                    }}
                  >
                    <Eye size={14} />
                    <span>{language === 'ar' ? 'معاينة 3D' : language === 'fr' ? 'Inspecter 3D' : '3D Inspect'}</span>
                  </button>
                  <button
                    data-testid="add-carousel-book-btn"
                    onClick={(e) => handleAddBookWithAnimation(activeBook, e)}
                    className="glass-panel-interactive"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '5px 12px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#ffffff',
                      border: '1px solid rgba(16, 185, 129, 0.5)',
                      background: 'rgba(16, 185, 129, 0.2)'
                    }}
                  >
                    <ShoppingCart size={14} />
                    <span>{language === 'ar' ? 'إضافة للسلة' : language === 'fr' ? 'Ajouter' : 'Add to cart'}</span>
                  </button>
                </>
              )}
              <button
                data-testid="close-carousel-btn"
                onClick={() => setIsCarouselOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex'
                }}
                title={language === 'ar' ? 'إغلاق القائمة' : 'Close'}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Embedded Glassy Coverflow Carousel */}
          <div
            style={{
              position: 'relative',
              flex: 1,
              minHeight: 0,
              pointerEvents: 'auto',
              borderRadius: '16px',
              overflow: 'hidden'
            }}
          >
            <GlassyCarousel
              items={carouselItems}
              layout="poster"
              initialIndex={Math.min(carouselActiveIndex, carouselItems.length - 1)}
              autoPlay={true}
              interval={3500}
              hideControls={true}
              label={language === 'ar' ? 'معرض الكتب المدرسية' : language === 'fr' ? 'Collection de manuels' : 'Textbook Collection'}
              onSelect={handleSelectCarouselItem}
              onItemClick={(item) => selectBook(item.id)}
              style={{
                height: '100%',
                maxHeight: '100%',
                minHeight: '440px',
                background: 'transparent'
              }}
            />
          </div>
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
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          maxWidth: '92vw',
          overflowX: 'auto',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', padding: '0 8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Layers size={14} />
            {language === 'ar' ? 'السنوات الدراسية:' : language === 'fr' ? 'Niveaux:' : 'Years:'}
          </span>
          {/* All Levels Button */}
          <button
            data-testid="dock-level-all"
            onClick={() => setActiveLevelId('all')}
            style={{
              border: activeLevelId === 'all' && isCarouselOpen ? '1px solid #e5b364' : '1px solid rgba(255,255,255,0.08)',
              background: activeLevelId === 'all' && isCarouselOpen ? 'rgba(229, 179, 100, 0.25)' : 'rgba(255,255,255,0.04)',
              color: activeLevelId === 'all' && isCarouselOpen ? '#fbbf24' : '#cbd5e1',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: activeLevelId === 'all' && isCarouselOpen ? 700 : 500,
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
                  border: isSelected ? '1px solid #e5b364' : '1px solid rgba(255,255,255,0.08)',
                  background: isSelected ? 'rgba(229, 179, 100, 0.25)' : 'rgba(255,255,255,0.04)',
                  color: isSelected ? '#fbbf24' : '#cbd5e1',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: isSelected ? 700 : 500,
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
