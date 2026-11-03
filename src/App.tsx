import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { LibraryScene } from './scenes/LibraryScene';
import { WebGLFallback } from './components/ui/WebGLFallback';
import { useLibraryStore } from './store/useLibraryStore';
import { EDUCATION_LEVELS } from './data/educationLevels';
import { BookOpen, Layers, ShoppingBag, Globe, RotateCcw } from 'lucide-react';
import { Language } from './types/education';

export const App: React.FC = () => {
  const [hasWebGL, setHasWebGL] = useState(true);

  const language = useLibraryStore((s) => s.language);
  const setLanguage = useLibraryStore((s) => s.setLanguage);
  const activeLevelId = useLibraryStore((s) => s.activeLevelId);
  const setActiveLevelId = useLibraryStore((s) => s.setActiveLevelId);
  const viewMode = useLibraryStore((s) => s.viewMode);
  const resetView = useLibraryStore((s) => s.resetView);
  const basket = useLibraryStore((s) => s.basket);

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

  if (!hasWebGL) {
    return <WebGLFallback />;
  }

  const basketCount = basket.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* 3D Canvas Viewport */}
      <div className="canvas-container">
        <Canvas
          shadows
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          onCreated={({ gl }) => {
            gl.setClearColor('#0d0f12');
          }}
        >
          <LibraryScene />
        </Canvas>
      </div>

      {/* Floating Header UI */}
      <header
        className="glass-panel"
        style={{
          position: 'absolute',
          top: '16px',
          left: '20px',
          right: '20px',
          zIndex: 10,
          borderRadius: '16px',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}
      >
        {/* Brand / Logo */}
        <div
          onClick={resetView}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #c4823f, #e5b364)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1e140d',
            boxShadow: '0 4px 12px rgba(229, 179, 100, 0.3)'
          }}>
            <BookOpen size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', lineHeight: '1.2', color: '#f8fafc' }}>
              {language === 'ar' ? 'المكتبة التعليمية ثلاثية الأبعاد' : language === 'fr' ? 'Bibliothèque Éducative 3D' : '3D Educational Library'}
            </h1>
            <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
              {language === 'ar' ? 'تجربة تفاعلية غامرة لاقتناء الكتب المدرسية' : language === 'fr' ? 'Expérience interactive immersive' : 'Immersive standalone virtual bookstore'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Reset Overview Camera */}
          <button
            onClick={resetView}
            className="glass-panel-interactive"
            title={language === 'ar' ? 'عرض المكتبة بالكامل' : 'Full Library View'}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              color: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem'
            }}
          >
            <RotateCcw size={16} />
            <span>{language === 'ar' ? 'المكتبة كاملة' : language === 'fr' ? 'Vue Globale' : 'Full View'}</span>
          </button>

          {/* Language Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '3px' }}>
            <Globe size={16} style={{ margin: '0 6px', color: '#cbd5e1' }} />
            {(['ar', 'fr', 'en'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  background: language === lang ? '#c4823f' : 'transparent',
                  color: language === lang ? '#ffffff' : '#94a3b8',
                  fontWeight: language === lang ? 700 : 500,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Shopping Basket Placeholder */}
          <div
            className="glass-panel-interactive"
            style={{
              position: 'relative',
              padding: '8px 16px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#f8fafc'
            }}
          >
            <ShoppingBag size={20} color="#e5b364" />
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
              {basketCount}
            </span>
          </div>
        </div>
      </header>

      {/* Education Levels Bottom Shelf Selector Dock */}
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
    </div>
  );
};

export default App;
