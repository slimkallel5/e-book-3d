import React, { useState, useEffect, useRef } from 'react';
import { useLibraryStore } from '../../store/useLibraryStore';
import { BOOKS_DATA } from '../../data/books';
import { EDUCATION_LEVELS } from '../../data/educationLevels';
import { Book } from '../../types/book';
import { Search, X, BookOpen, ChevronRight, ChevronLeft, CornerDownLeft } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  const language = useLibraryStore((s) => s.language);
  const selectBook = useLibraryStore((s) => s.selectBook);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setSelectedSubjectFilter('all');
    }
  }, [isOpen]);

  // Keyboard shortcut: Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter books matching query
  const cleanQuery = query.trim().toLowerCase();

  const filteredBooks = BOOKS_DATA.filter((book) => {
    // Subject filter
    if (selectedSubjectFilter !== 'all') {
      const bookSubjAr = book.subject.ar;
      if (bookSubjAr !== selectedSubjectFilter) return false;
    }

    if (!cleanQuery) return true;

    const level = EDUCATION_LEVELS.find((l) => l.id === book.educationLevelId);

    const matchTitle =
      book.title.ar.toLowerCase().includes(cleanQuery) ||
      book.title.fr.toLowerCase().includes(cleanQuery) ||
      book.title.en.toLowerCase().includes(cleanQuery);

    const matchSubject =
      book.subject.ar.toLowerCase().includes(cleanQuery) ||
      book.subject.fr.toLowerCase().includes(cleanQuery) ||
      book.subject.en.toLowerCase().includes(cleanQuery);

    const matchAuthor =
      book.author.ar.toLowerCase().includes(cleanQuery) ||
      book.author.fr.toLowerCase().includes(cleanQuery) ||
      book.author.en.toLowerCase().includes(cleanQuery);

    const matchLevel = level
      ? level.name.ar.toLowerCase().includes(cleanQuery) ||
        level.name.fr.toLowerCase().includes(cleanQuery) ||
        level.name.en.toLowerCase().includes(cleanQuery) ||
        level.code.toLowerCase().includes(cleanQuery)
      : false;

    return matchTitle || matchSubject || matchAuthor || matchLevel;
  });

  // Extract unique subjects for pills
  const subjects = [
    'all',
    ...Array.from(new Set(BOOKS_DATA.map((b) => b.subject.ar)))
  ];

  const handleSelectBook = (book: Book) => {
    selectBook(book.id);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '80px',
        background: 'rgba(73, 53, 35, 0.45)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
      onClick={onClose}
    >
      <div
        data-testid="search-dialog"
        className="glass-panel"
        style={{
          width: '92%',
          maxWidth: '680px',
          borderRadius: '20px',
          boxShadow: 'var(--shadow-lg), 0 0 40px rgba(73, 53, 35, 0.15)',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '80vh',
          background: 'var(--color-surface)',
          color: 'var(--color-text-primary)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px 20px',
            borderBottom: '1px solid var(--color-border)',
            gap: '12px',
            background: 'var(--color-surface)'
          }}
        >
          <Search size={22} color="var(--color-primary)" />
          <input
            ref={inputRef}
            data-testid="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              language === 'ar'
                ? 'ابحث باسم الكتاب، المادة، السنة الدراسية أو المؤلف...'
                : language === 'fr'
                ? 'Rechercher par titre, matière, niveau ou auteur...'
                : 'Search by title, subject, grade level or author...'
            }
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--color-text-primary)',
              fontSize: '1.05rem',
              fontFamily: 'inherit'
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                background: 'var(--color-surface-secondary)',
                border: 'none',
                borderRadius: '50%',
                width: '26px',
                height: '26px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer'
              }}
            >
              <X size={14} />
            </button>
          )}
          <button
            onClick={onClose}
            className="glass-panel-interactive"
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              color: 'var(--color-text-secondary)',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface-secondary)'
            }}
          >
            <span>{language === 'ar' ? 'إغلاق' : language === 'fr' ? 'Fermer' : 'Close'}</span>
            <kbd style={{ fontSize: '0.65rem', background: 'var(--color-surface)', padding: '1px 5px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
              ESC
            </kbd>
          </button>
        </div>

        {/* Subject Filter Pills */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderBottom: '1px solid var(--color-border)',
            overflowX: 'auto',
            background: 'var(--color-surface-secondary)'
          }}
        >
          {subjects.map((subj) => {
            const isSelected = selectedSubjectFilter === subj;
            return (
              <button
                key={subj}
                onClick={() => setSelectedSubjectFilter(subj)}
                style={{
                  padding: '4px 12px',
                  borderRadius: '16px',
                  border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                  background: isSelected ? 'var(--color-primary)' : 'var(--color-surface)',
                  color: isSelected ? '#ffffff' : 'var(--color-text-secondary)',
                  fontSize: '0.78rem',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                {subj === 'all'
                  ? language === 'ar'
                    ? 'جميع المواد'
                    : language === 'fr'
                    ? 'Toutes les matières'
                    : 'All Subjects'
                  : subj}
              </button>
            );
          })}
        </div>

        {/* Results List */}
        <div
          data-testid="search-results-list"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          {filteredBooks.length === 0 ? (
            <div
              style={{
                padding: '48px 24px',
                textAlign: 'center',
                color: 'var(--color-text-secondary)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <BookOpen size={36} color="var(--color-primary)" />
              <p style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                {language === 'ar'
                  ? 'لم يتم العثور على أي كتب تطابق بحثك'
                  : language === 'fr'
                  ? 'Aucun manuel ne correspond à votre recherche'
                  : 'No books match your search'}
              </p>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                {language === 'ar'
                  ? 'جرب البحث بكلمات أخرى مثل "رياضيات"، "قراءة"، أو "الأساسي"'
                  : 'Try searching for "math", "lecture", or a specific grade'}
              </span>
            </div>
          ) : (
            filteredBooks.map((book) => {
              const level = EDUCATION_LEVELS.find((l) => l.id === book.educationLevelId);
              return (
                <div
                  key={book.id}
                  data-testid={`search-item-${book.id}`}
                  onClick={() => handleSelectBook(book)}
                  className="glass-panel-interactive"
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    cursor: 'pointer',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-surface)'
                  }}
                >
                  {/* Book Spine Color Indicator */}
                  <div
                    style={{
                      width: '36px',
                      height: '48px',
                      borderRadius: '4px',
                      background: book.coverStyle.primaryColor,
                      border: `2px solid ${book.coverStyle.accentColor || 'var(--color-primary)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                      flexShrink: 0
                    }}
                  >
                    <BookOpen size={18} />
                  </div>

                  {/* Book Metadata */}
                  <div style={{ flex: 1, minWidth: 0, textAlign: language === 'ar' ? 'right' : 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <h4
                        style={{
                          fontSize: '0.96rem',
                          fontWeight: 700,
                          color: 'var(--color-text-primary)',
                          margin: 0
                        }}
                      >
                        {book.title[language] || book.title.ar}
                      </h4>
                      {level && (
                        <span
                          style={{
                            fontSize: '0.7rem',
                            padding: '2px 6px',
                            borderRadius: '6px',
                            background: level.badgeColor,
                            color: '#ffffff',
                            fontWeight: 600
                          }}
                        >
                          {level.shortName[language] || level.shortName.ar}
                        </span>
                      )}
                    </div>

                    <p style={{ fontSize: '0.76rem', color: 'var(--color-text-secondary)', marginTop: '3px' }}>
                      <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                        {book.subject[language] || book.subject.ar}
                      </span>
                      {' • '}
                      <span>{book.author[language] || book.author.ar}</span>
                    </p>
                  </div>

                  {/* Price & Action */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                        {book.price.toFixed(3)}{' '}
                        <span style={{ fontSize: '0.75rem' }}>
                          {book.currency[language] || book.currency.ar}
                        </span>
                      </span>
                    </div>

                    <div
                      style={{
                        padding: '6px',
                        borderRadius: '8px',
                        background: 'var(--color-surface-secondary)',
                        color: 'var(--color-primary)',
                        display: 'flex'
                      }}
                    >
                      {language === 'ar' ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div
          style={{
            padding: '10px 20px',
            background: 'var(--color-surface-secondary)',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--color-text-secondary)'
          }}
        >
          <span>
            {filteredBooks.length}{' '}
            {language === 'ar'
              ? 'كتاب معروض'
              : language === 'fr'
              ? 'manuels trouvés'
              : 'books displayed'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CornerDownLeft size={13} />
            {language === 'ar'
              ? 'انقر على الكتاب لعرضه ثلاثي الأبعاد'
              : 'Click item to inspect in 3D'}
          </span>
        </div>
      </div>
    </div>
  );
};
