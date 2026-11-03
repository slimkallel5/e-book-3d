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
  const selectedBookId = useLibraryStore((s) => s.selectedBookId);
  const resetView = useLibraryStore((s) => s.resetView);
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

  const currentLevel = EDUCATION_LEVELS.find((l) => l.id === activeLevelId) || EDUCATION_LEVELS[0];
  const currentLevelBooks = BOOKS_DATA.filter((b) => b.educationLevelId === currentLevel.id);

  const handlePrevLevel = () => {
    const currentIndex = EDUCATION_LEVELS.findIndex((l) => l.id === activeLevelId);
    const prevIndex = (currentIndex - 1 + EDUCATION_LEVELS.length) % EDUCATION_LEVELS.length;
    setActiveLevelId(EDUCATION_LEVELS[prevIndex].id);
  };

  const handleNextLevel = () => {
    const currentIndex = EDUCATION_LEVELS.findIndex((l) => l.id === activeLevelId);
    const nextIndex = (currentIndex + 1) % EDUCATION_LEVELS.length;
    setActiveLevelId(EDUCATION_LEVELS[nextIndex].id);
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
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
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

      {/* Shelf Mode Floating Info Banner (Appears when viewing a focused row) */}
      {viewMode === 'shelf' && (
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
            borderLeft: `4px solid ${currentLevel.badgeColor}`
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
                background: currentLevel.badgeColor,
                color: '#ffffff',
                padding: '2px 8px',
                borderRadius: '10px',
                fontWeight: 600
              }}>
                {currentLevel.code}
              </span>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
                {currentLevel.name[language] || currentLevel.name.ar}
              </h2>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
              {currentLevel.description[language] || currentLevel.description.ar}
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
            onClick={resetView}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              marginLeft: '4px'
            }}
            title={language === 'ar' ? 'إغلاق العرض' : 'Close shelf view'}
          >
            <X size={16} />
          </button>
        </div>
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
        {EDUCATION_LEVELS.map((level) => {
          const isSelected = activeLevelId === level.id && viewMode === 'shelf';
          return (
            <button
              key={level.id}
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
