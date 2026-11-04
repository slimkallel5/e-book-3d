import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { LibraryScene } from './scenes/LibraryScene';
import { WebGLFallback } from './components/ui/WebGLFallback';
import { BookDetailOverlay } from './components/book/BookDetailOverlay';
import { Header } from './components/navigation/Header';
import { SearchModal } from './components/navigation/SearchModal';
import { BasketDrawer } from './components/basket/BasketDrawer';
import { FlyingBookEffect } from './components/basket/FlyingBookEffect';
import { MainWebsiteContent } from './components/layout/MainWebsiteContent';
import { useLibraryStore } from './store/useLibraryStore';
import { EDUCATION_LEVELS } from './data/educationLevels';
import { BOOKS_DATA } from './data/books';
import { Book } from './types/book';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Compass
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
      {/* Top Floating Global Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        basketButtonRef={basketButtonRef}
        basketBouncing={basketBouncing}
      />

      {/* Main Split Layout: LEFT 33% (3D Library) + RIGHT 67% (Main Website Content) */}
      <div className="app-layout" style={{ paddingTop: '72px' }}>
        {/* LEFT 33%: Fixed Realistic 3D Virtual Library */}
        <section
          className="library-pane"
          aria-label="3D Virtual Bookshelf Library"
        >
          {/* Subtle Live Badge indicator */}
          <div className="library-pane-badge">
            <span className="library-live-dot" />
            <Compass size={14} />
            <span>{language === 'ar' ? 'المكتبة التفاعلية 3D' : language === 'fr' ? 'Rayon 3D Interactif' : 'Live 3D Bookshelf'}</span>
          </div>

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

          {/* Shelf Mode Floating Info Banner inside 33% pane */}
          {viewMode === 'shelf' && (
            <div
              className="glass-panel animate-fade-in"
              style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 20,
                borderRadius: '12px',
                padding: '8px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: 'var(--shadow-md)',
                borderLeft: `4px solid ${currentLevel.badgeColor}`,
                maxWidth: '90%'
              }}
            >
              <button
                onClick={handlePrevLevel}
                className="glass-panel-interactive"
                style={{ padding: '4px', borderRadius: '50%', color: '#f8fafc', display: 'flex' }}
                title={language === 'ar' ? 'السنة السابقة' : 'Previous Year'}
              >
                {language === 'ar' ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>

              <div style={{ textAlign: 'center', minWidth: 0 }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc', display: 'block' }}>
                  {currentLevel.name[language] || currentLevel.name.ar}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 600 }}>
                  {currentLevelBooks.length} {language === 'ar' ? 'كتب متوفرة' : 'books'}
                </span>
              </div>

              <button
                onClick={handleNextLevel}
                className="glass-panel-interactive"
                style={{ padding: '4px', borderRadius: '50%', color: '#f8fafc', display: 'flex' }}
                title={language === 'ar' ? 'السنة التالية' : 'Next Year'}
              >
                {language === 'ar' ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
              </button>

              <button
                onClick={resetView}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex'
                }}
                title={language === 'ar' ? 'إغلاق العرض' : 'Close shelf view'}
              >
                <X size={15} />
              </button>
            </div>
          )}
        </section>

        {/* RIGHT 67%: Main Website Content Area */}
        <main
          className="main-content-pane"
          aria-label="Main Website Content"
        >
          <MainWebsiteContent
            onOpenSearch={() => setIsSearchOpen(true)}
            onAddBookWithAnimation={handleAddBookWithAnimation}
          />
        </main>
      </div>

      {/* Book Inspection & Reading HUD Overlay (Modal on top of everything) */}
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
    </div>
  );
};

export default App;
