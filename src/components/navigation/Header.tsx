import React, { useState, useEffect, useRef } from 'react';
import { useLibraryStore } from '../../store/useLibraryStore';
import { EDUCATION_LEVELS } from '../../data/educationLevels';
import {
  BookOpen,
  Search,
  Globe,
  ShoppingBag,
  RotateCcw,
  Layers,
  ChevronDown,
  User
} from 'lucide-react';
import { Language } from '../../types/education';

interface HeaderProps {
  onOpenSearch: () => void;
  basketButtonRef?: React.RefObject<HTMLButtonElement | null>;
  basketBouncing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  basketButtonRef,
  basketBouncing = false
}) => {
  const language = useLibraryStore((s) => s.language);
  const setLanguage = useLibraryStore((s) => s.setLanguage);
  const activeLevelId = useLibraryStore((s) => s.activeLevelId);
  const setActiveLevelId = useLibraryStore((s) => s.setActiveLevelId);
  const resetView = useLibraryStore((s) => s.resetView);
  const basket = useLibraryStore((s) => s.basket);
  const setIsBasketOpen = useLibraryStore((s) => s.setIsBasketOpen);

  const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const basketCount = basket.reduce((acc, item) => acc + item.quantity, 0);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsLevelDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeLevel = EDUCATION_LEVELS.find((l) => l.id === activeLevelId);

  return (
    <header
      className="glass-panel"
      style={{
        position: 'absolute',
        top: '16px',
        left: '20px',
        right: '20px',
        zIndex: 30,
        borderRadius: '16px',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
    >
      {/* Brand / Logo */}
      <div
        onClick={resetView}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          flexShrink: 0
        }}
        title={language === 'ar' ? 'الرئيسية' : 'Home'}
      >
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #c4823f, #e5b364)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1e140d',
            boxShadow: '0 4px 14px rgba(229, 179, 100, 0.35)',
            transition: 'transform 0.2s ease'
          }}
        >
          <BookOpen size={24} />
        </div>
        <div className="brand-text-container">
          <h1 style={{ fontSize: '1.15rem', lineHeight: '1.2', color: '#f8fafc', fontWeight: 800 }}>
            {language === 'ar'
              ? 'المكتبة التعليمية 3D'
              : language === 'fr'
              ? 'Bibliothèque 3D'
              : '3D Library'}
          </h1>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>
            {language === 'ar'
              ? 'كتب تونس المدرسية'
              : language === 'fr'
              ? 'Manuels Scolaires Tunisiens'
              : 'Tunisian School Books'}
          </span>
        </div>
      </div>

      {/* Middle Controls: Search & Level Quick Jump */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1', maxWidth: '480px', justifyContent: 'center' }}>
        {/* Search Trigger Button */}
        <button
          data-testid="search-trigger-btn"
          onClick={onOpenSearch}
          className="glass-panel-interactive"
          style={{
            flex: 1,
            maxWidth: '280px',
            height: '38px',
            borderRadius: '10px',
            padding: '0 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#94a3b8',
            fontSize: '0.82rem',
            border: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          <Search size={16} color="#e5b364" />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {language === 'ar'
              ? 'ابحث عن كتاب، مادة، أو سنة...'
              : language === 'fr'
              ? 'Rechercher un manuel, matière...'
              : 'Search books, subjects, grades...'}
          </span>
          <kbd
            style={{
              marginLeft: language === 'ar' ? 0 : 'auto',
              marginRight: language === 'ar' ? 'auto' : 0,
              fontSize: '0.68rem',
              background: 'rgba(255,255,255,0.1)',
              padding: '2px 6px',
              borderRadius: '4px',
              color: '#cbd5e1'
            }}
          >
            ⌘K
          </kbd>
        </button>

        {/* Education Level Quick Selector Dropdown */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            data-testid="level-dropdown-btn"
            onClick={() => setIsLevelDropdownOpen(!isLevelDropdownOpen)}
            className="glass-panel-interactive"
            style={{
              height: '38px',
              padding: '0 12px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#f8fafc',
              fontSize: '0.82rem',
              border: '1px solid rgba(255,255,255,0.08)',
              whiteSpace: 'nowrap'
            }}
          >
            <Layers size={15} color="#e5b364" />
            <span style={{ maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {activeLevel ? (activeLevel.shortName[language] || activeLevel.shortName.ar) : (language === 'ar' ? 'السنوات' : 'Levels')}
            </span>
            <ChevronDown size={14} style={{ transform: isLevelDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
          </button>

          {isLevelDropdownOpen && (
            <div
              className="glass-panel"
              style={{
                position: 'absolute',
                top: '46px',
                right: language === 'ar' ? '0' : 'auto',
                left: language === 'ar' ? 'auto' : '0',
                width: '240px',
                borderRadius: '12px',
                padding: '8px',
                zIndex: 40,
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border-glow)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                maxHeight: '340px',
                overflowY: 'auto'
              }}
            >
              {EDUCATION_LEVELS.map((level) => {
                const isSelected = activeLevelId === level.id;
                return (
                  <button
                    key={level.id}
                    onClick={() => {
                      setActiveLevelId(level.id);
                      setIsLevelDropdownOpen(false);
                    }}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      background: isSelected ? 'rgba(229, 179, 100, 0.2)' : 'transparent',
                      color: isSelected ? '#fbbf24' : '#cbd5e1',
                      fontWeight: isSelected ? 700 : 500,
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      textAlign: language === 'ar' ? 'right' : 'left',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: level.badgeColor,
                        flexShrink: 0
                      }}
                    />
                    <span style={{ flex: 1 }}>{level.name[language] || level.name.ar}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls: Overview, Language, User, Basket */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {/* Reset Overview Camera */}
        <button
          onClick={resetView}
          className="glass-panel-interactive"
          title={language === 'ar' ? 'عرض المكتبة بالكامل' : 'Full Library View'}
          style={{
            height: '38px',
            padding: '0 12px',
            borderRadius: '10px',
            color: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.82rem',
            border: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          <RotateCcw size={15} />
          <span className="btn-label-desktop">
            {language === 'ar' ? 'المكتبة كاملة' : language === 'fr' ? 'Vue Globale' : 'Full View'}
          </span>
        </button>

        {/* Language Selector */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '10px',
            padding: '3px',
            border: '1px solid rgba(255,255,255,0.06)'
          }}
        >
          <Globe size={15} style={{ margin: '0 6px', color: '#cbd5e1' }} />
          {(['ar', 'fr', 'en'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                border: 'none',
                background: language === lang ? '#c4823f' : 'transparent',
                color: language === lang ? '#ffffff' : '#94a3b8',
                fontWeight: language === lang ? 700 : 500,
                fontSize: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>

        {/* User Account Placeholder */}
        <div
          title={language === 'ar' ? 'حساب الزائر' : 'Guest Account'}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#94a3b8',
            cursor: 'default'
          }}
        >
          <User size={16} />
        </div>

        {/* Shopping Basket Trigger Button with bounce effect */}
        <button
          ref={basketButtonRef}
          data-testid="shopping-basket-btn"
          onClick={() => setIsBasketOpen(true)}
          className={`glass-panel-interactive ${basketBouncing ? 'basket-bounce-active' : ''}`}
          title={language === 'ar' ? 'سلة المشتريات' : 'Shopping Basket'}
          style={{
            height: '38px',
            padding: '0 14px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#f8fafc',
            border: basketCount > 0 ? '1px solid #e5b364' : '1px solid rgba(255,255,255,0.08)',
            background: basketCount > 0 ? 'rgba(229, 179, 100, 0.15)' : 'var(--bg-glass)',
            cursor: 'pointer',
            transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          <ShoppingBag size={18} color="#e5b364" />
          <span
            data-testid="basket-counter"
            style={{
              fontWeight: 700,
              fontSize: '0.88rem',
              color: basketCount > 0 ? '#fbbf24' : '#f8fafc',
              minWidth: '16px',
              textAlign: 'center'
            }}
          >
            {basketCount}
          </span>
        </button>
      </div>
    </header>
  );
};
