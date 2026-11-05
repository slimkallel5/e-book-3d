import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { LibraryScene } from './scenes/LibraryScene';
import { WebGLFallback } from './components/ui/WebGLFallback';
import { BookDetailOverlay } from './components/book/BookDetailOverlay';
import { Header } from './components/navigation/Header';
import { SearchModal } from './components/navigation/SearchModal';
import { BasketDrawer } from './components/basket/BasketDrawer';
import { FlyingBookEffect } from './components/basket/FlyingBookEffect';
import { useLibraryStore } from './store/useLibraryStore';
import { EDUCATION_LEVELS } from './data/educationLevels';
import { BOOKS_DATA } from './data/books';
import { Book } from './types/book';
import {
  Layers,
  ChevronLeft,
  ChevronRight,
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
  const currentLevelBooks = isAllLevels
    ? BOOKS_DATA
    : BOOKS_DATA.filter((b) => b.educationLevelId === currentLevel?.id);

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

  const handlePrevCard = () => {
    if (currentLevelBooks.length === 0) return;
    const prevIdx = (carouselActiveIndex - 1 + currentLevelBooks.length) % currentLevelBooks.length;
    setCarouselActiveIndex(prevIdx);
  };

  const handleNextCard = () => {
    if (currentLevelBooks.length === 0) return;
    const nextIdx = (carouselActiveIndex + 1) % currentLevelBooks.length;
    setCarouselActiveIndex(nextIdx);
  };

  const handleAddBookWithAnimation = (book: Book, e: React.MouseEvent<HTMLButtonElement>) => {
    // Add to basket state immediately so the basket count and drawer update right away
    addToBasket(book);

    // Get click location to spawn flying animation
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

    // Trigger basket bounce & glow animation in header
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
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true
          }}
          onCreated={({ gl }) => {
            gl.setClearColor('#0a0d12');
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

      {/* 3D Circular Carousel HUD Banner & Navigation Controls */}
      {isCarouselOpen && !selectedBookId && (
        <>
          {/* Top Level Info Banner */}
          <div
            className="glass-panel animate-fade-in"
            style={{
              position: 'absolute',
              top: '84px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10,
              borderRadius: '14px',
              padding: '10px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              boxShadow: 'var(--shadow-md)',
              borderLeft: `4px solid ${currentLevel ? currentLevel.badgeColor : '#e5b364'}`
            }}
          >
            <button
              onClick={handlePrevLevel}
              className="glass-panel-interactive"
              style={{ padding: '6px', borderRadius: '50%', color: '#f8fafc', display: 'flex' }}
              title={language === 'ar' ? 'السنة السابقة' : 'Previous Year'}
            >
              {language === 'ar' ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>

            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span style={{
                  fontSize: '0.75rem',
                  background: currentLevel ? currentLevel.badgeColor : 'linear-gradient(135deg, #e5b364, #945629)',
                  color: '#ffffff',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontWeight: 600
                }}>
                  {currentLevel ? currentLevel.code : (language === 'ar' ? 'الكل' : language === 'fr' ? 'Tous' : 'ALL')}
                </span>
                <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
                  {currentLevel
                    ? (currentLevel.name[language] || currentLevel.name.ar)
                    : (language === 'ar' ? 'جميع المستويات التعليمية' : language === 'fr' ? 'Tous les niveaux scolaires' : 'All Education Levels')}
                </h2>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                {currentLevel
                  ? (currentLevel.description[language] || currentLevel.description.ar)
                  : (language === 'ar' ? 'عرض شامل لكافة الكتب المدرسية والبرامج البيداغوجية' : language === 'fr' ? 'Catalogue complet de tous les manuels scolaires' : 'Complete catalog of all school textbooks')}
                {' • '}
                <span style={{ color: '#fbbf24', fontWeight: 600 }}>
                  {currentLevelBooks.length} {language === 'ar' ? 'كتب متوفرة' : language === 'fr' ? 'manuels disponibles' : 'books available'}
                </span>
              </p>
            </div>

            <button
              onClick={handleNextLevel}
              className="glass-panel-interactive"
              style={{ padding: '6px', borderRadius: '50%', color: '#f8fafc', display: 'flex' }}
              title={language === 'ar' ? 'السنة التالية' : 'Next Year'}
            >
              {language === 'ar' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>

            <button
              data-testid="close-carousel-btn"
              onClick={() => setIsCarouselOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                marginLeft: '4px'
              }}
              title={language === 'ar' ? 'إغلاق المعرض الدائري' : 'Close carousel'}
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Carousel Prev/Next Overlay Buttons in the center area */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: 'clamp(280px, 34%, 480px)',
              right: '30px',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              zIndex: 10,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <button
              data-testid="carousel-prev-btn"
              onClick={handlePrevCard}
              className="glass-panel-interactive"
              style={{
                pointerEvents: 'auto',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f8fafc',
                border: '1px solid rgba(229, 179, 100, 0.4)',
                background: 'rgba(15, 23, 42, 0.65)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                cursor: 'pointer'
              }}
              title={language === 'ar' ? 'الكتاب السابق' : 'Previous book'}
            >
              {language === 'ar' ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
            </button>

            <button
              data-testid="carousel-next-btn"
              onClick={handleNextCard}
              className="glass-panel-interactive"
              style={{
                pointerEvents: 'auto',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f8fafc',
                border: '1px solid rgba(229, 179, 100, 0.4)',
                background: 'rgba(15, 23, 42, 0.65)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                cursor: 'pointer'
              }}
              title={language === 'ar' ? 'الكتاب التالي' : 'Next book'}
            >
              {language === 'ar' ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
            </button>
          </div>
        </>
      )}

      {/* Book Inspection & Reading HUD Overlay */}
      {selectedBookId && (viewMode === 'book-detail' || viewMode === 'book-open') && (
        <BookDetailOverlay onAddBookWithAnimation={handleAddBookWithAnimation} />
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

      {/* Education Levels Bottom Shelf Selector Dock (Hidden when inspecting a book) */}
      {!selectedBookId && (
        <div
          className="glass-panel"
          style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          borderRadius: '30px',
          padding: '8px 14px',
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
            padding: '8px 14px',
            borderRadius: '20px',
            fontSize: '0.82rem',
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
                padding: '8px 14px',
                borderRadius: '20px',
                fontSize: '0.82rem',
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
      )}
    </div>
  );
};

export default App;
