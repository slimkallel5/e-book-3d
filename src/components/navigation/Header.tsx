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
  User,
  PlusCircle
} from 'lucide-react';
import { Language } from '../../types/education';
import { BookUploadModal } from '../admin/BookUploadModal';

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
  const [isUploadOpen, setIsUploadOpen] = useState(false);
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
        borderRadius: '18px',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        boxShadow: '0 8px 30px var(--color-shadow)'
      }}
    >
      {/* Group A: Application Identity */}
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
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 14px rgba(217, 155, 61, 0.35)',
            transition: 'transform 0.2s ease'
          }}
        >
          <BookOpen size={24} />
        </div>
        <div className="brand-text-container">
          <h1 style={{ fontSize: '1.15rem', lineHeight: '1.2', color: 'var(--color-text-primary)', fontWeight: 800 }}>
            {language === 'ar'
              ? 'المكتبة التعليمية 3D'
              : language === 'fr'
              ? 'Bibliothèque 3D'
              : '3D Library'}
          </h1>
          <span style={{ fontSize: '0.74rem', color: 'var(--color-text-secondary)', display: 'block', fontWeight: 500 }}>
            {language === 'ar'
              ? 'كتب تونس المدرسية'
              : language === 'fr'
              ? 'Manuels Scolaires Tunisiens'
              : 'Tunisian School Books'}
          </span>
        </div>
      </div>

      {/* Group D: Search & Education-Level Selection */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flex: '1',
          maxWidth: '520px',
          justifyContent: 'center'
        }}
      >
        {/* Search Trigger Button */}
        <button
          data-testid="search-trigger-btn"
          onClick={onOpenSearch}
          className="glass-panel-interactive"
          style={{
            flex: 1,
            maxWidth: '310px',
            height: '40px',
            borderRadius: '10px',
            padding: '0 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: 'var(--color-text-secondary)',
            fontSize: '0.82rem',
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface-secondary)'
          }}
        >
          <Search size={16} color="var(--color-primary)" style={{ flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, textAlign: language === 'ar' ? 'right' : 'left' }}>
            {language === 'ar'
              ? 'ابحث عن كتاب، مادة، أو سنة...'
              : language === 'fr'
              ? 'Rechercher un manuel, matière...'
              : 'Search books, subjects, grades...'}
          </span>
          <kbd
            style={{
              fontSize: '0.68rem',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              padding: '2px 6px',
              borderRadius: '4px',
              color: 'var(--color-text-muted)'
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
              height: '40px',
              padding: '0 12px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--color-text-primary)',
              fontSize: '0.82rem',
              fontWeight: 600,
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface-secondary)',
              whiteSpace: 'nowrap'
            }}
          >
            <Layers size={15} color="var(--color-primary)" />
            <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {activeLevel ? (activeLevel.shortName[language] || activeLevel.shortName.ar) : (language === 'ar' ? 'السنوات' : 'Levels')}
            </span>
            <ChevronDown size={14} style={{ transform: isLevelDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', color: 'var(--color-text-secondary)' }} />
          </button>

          {isLevelDropdownOpen && (
            <div
              className="glass-panel"
              style={{
                position: 'absolute',
                top: '48px',
                right: language === 'ar' ? '0' : 'auto',
                left: language === 'ar' ? 'auto' : '0',
                width: '250px',
                borderRadius: '12px',
                padding: '8px',
                zIndex: 40,
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                maxHeight: '340px',
                overflowY: 'auto'
              }}
            >
              <button
                onClick={() => {
                  setActiveLevelId('all');
                  setIsLevelDropdownOpen(false);
                }}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: activeLevelId === 'all' ? 'var(--color-primary)' : 'transparent',
                  color: activeLevelId === 'all' ? '#ffffff' : 'var(--color-text-primary)',
                  fontWeight: activeLevelId === 'all' ? 700 : 500,
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  textAlign: language === 'ar' ? 'right' : 'left'
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary)',
                    flexShrink: 0
                  }}
                />
                <span style={{ flex: 1 }}>{language === 'ar' ? 'جميع المستويات' : language === 'fr' ? 'Tous les niveaux' : 'All Levels'}</span>
              </button>
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
                      background: isSelected ? 'var(--color-surface-secondary)' : 'transparent',
                      color: isSelected ? 'var(--color-primary)' : 'var(--color-text-primary)',
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

      {/* Right Section: Group C (Language & Add Book) + Group B (Account & Basket) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {/* Group C: Language Selector & Add Book */}
        <button
          data-testid="open-upload-modal-btn"
          onClick={() => setIsUploadOpen(true)}
          className="glass-panel-interactive"
          title={language === 'ar' ? 'إضافة كتاب جديد' : 'Add New Book'}
          style={{
            height: '40px',
            padding: '0 12px',
            borderRadius: '10px',
            color: 'var(--color-text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.82rem',
            fontWeight: 600,
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface-secondary)'
          }}
        >
          <PlusCircle size={15} color="var(--color-primary)" />
          <span className="btn-label-desktop">
            {language === 'ar' ? 'إضافة كتاب' : language === 'fr' ? 'Ajouter' : 'Add Book'}
          </span>
        </button>

        {/* Reset Overview Camera */}
        <button
          onClick={resetView}
          className="glass-panel-interactive"
          title={language === 'ar' ? 'عرض المكتبة بالكامل' : 'Full Library View'}
          style={{
            height: '40px',
            padding: '0 12px',
            borderRadius: '10px',
            color: 'var(--color-text-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.82rem',
            fontWeight: 600,
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface-secondary)'
          }}
        >
          <RotateCcw size={15} color="var(--color-primary)" />
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
            background: 'var(--color-surface-secondary)',
            borderRadius: '10px',
            padding: '3px',
            border: '1px solid var(--color-border)'
          }}
        >
          <Globe size={15} style={{ margin: '0 6px', color: 'var(--color-text-secondary)' }} />
          {(['ar', 'fr', 'en'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                border: 'none',
                background: language === lang ? 'var(--color-primary)' : 'transparent',
                color: language === lang ? '#ffffff' : 'var(--color-text-secondary)',
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

        {/* Group B: User Account Placeholder */}
        <div
          title={language === 'ar' ? 'حساب الزائر' : 'Guest Account'}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'var(--color-surface-secondary)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text-secondary)',
            cursor: 'default'
          }}
        >
          <User size={16} />
        </div>

        {/* Group B: Shopping Basket Trigger Button with bounce effect */}
        <button
          ref={basketButtonRef}
          data-testid="shopping-basket-btn"
          onClick={() => setIsBasketOpen(true)}
          className={`glass-panel-interactive ${basketBouncing ? 'basket-bounce-active' : ''}`}
          title={language === 'ar' ? 'سلة المشتريات' : 'Shopping Basket'}
          style={{
            height: '40px',
            padding: '0 14px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--color-text-primary)',
            border: basketCount > 0 ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
            background: basketCount > 0 ? 'var(--color-surface-secondary)' : 'var(--color-surface)',
            cursor: 'pointer',
            transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
        >
          <ShoppingBag size={18} color="var(--color-primary)" />
          <span
            data-testid="basket-counter"
            style={{
              fontWeight: 800,
              fontSize: '0.88rem',
              color: basketCount > 0 ? 'var(--color-primary)' : 'var(--color-text-primary)',
              minWidth: '16px',
              textAlign: 'center'
            }}
          >
            {basketCount}
          </span>
        </button>
      </div>

      {/* Book Upload / Creator Modal */}
      <BookUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </header>
  );
};
