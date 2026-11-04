import React from 'react';
import { useLibraryStore } from '../../store/useLibraryStore';
import { EDUCATION_LEVELS } from '../../data/educationLevels';
import { BOOKS_DATA } from '../../data/books';
import { Book } from '../../types/book';
import {
  Compass,
  GraduationCap,
  Sparkles,
  BookMarked,
  ShoppingBag,
  ShieldCheck,
  Award,
  Search
} from 'lucide-react';

interface MainWebsiteContentProps {
  onOpenSearch: () => void;
  onAddBookWithAnimation: (book: Book, e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const MainWebsiteContent: React.FC<MainWebsiteContentProps> = ({
  onOpenSearch,
  onAddBookWithAnimation
}) => {
  const language = useLibraryStore((s) => s.language);
  const activeLevelId = useLibraryStore((s) => s.activeLevelId);
  const setActiveLevelId = useLibraryStore((s) => s.setActiveLevelId);
  const selectBook = useLibraryStore((s) => s.selectBook);
  const selectedBookId = useLibraryStore((s) => s.selectedBookId);

  const activeLevel = EDUCATION_LEVELS.find((l) => l.id === activeLevelId) || EDUCATION_LEVELS[0];
  const levelBooks = BOOKS_DATA.filter((b) => b.educationLevelId === activeLevel.id);

  return (
    <div style={{ padding: '28px 40px 60px', color: '#f8fafc' }}>
      {/* Hero Welcome Banner */}
      <section
        style={{
          borderRadius: '20px',
          padding: '32px 36px',
          background: 'linear-gradient(135deg, rgba(30, 24, 18, 0.85) 0%, rgba(18, 22, 30, 0.95) 100%)',
          border: '1px solid rgba(229, 179, 100, 0.25)',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.35)',
          marginBottom: '32px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '220px',
            height: '220px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(229, 179, 100, 0.12) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '20px', background: 'rgba(229, 179, 100, 0.15)', border: '1px solid rgba(229, 179, 100, 0.3)', color: '#fbbf24', fontSize: '0.8rem', fontWeight: 600, marginBottom: '14px' }}>
          <Sparkles size={14} />
          {language === 'ar' ? 'البوابة التفاعلية للكتب المدرسية' : language === 'fr' ? 'Portail Interactif des Manuels Scolaires' : 'Interactive School Book Portal'}
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.25, marginBottom: '12px', color: '#f8fafc' }}>
          {language === 'ar'
            ? 'المكتبة التونسية الرقمية ثلاثية الأبعاد'
            : language === 'fr'
            ? 'Bibliothèque Numérique 3D des Manuels'
            : 'Tunisian 3D Digital Educational Library'}
        </h1>

        <p style={{ fontSize: '0.96rem', lineHeight: 1.6, color: '#94a3b8', maxWidth: '680px', marginBottom: '22px' }}>
          {language === 'ar'
            ? 'تصفح الرفوف ثلاثية الأبعاد على اليسار بحرية، أو اختر السنة الدراسية أدناه لمعاينة الكتب المعتمدة، قراءة صفحات الفهرس، وإضافتها مباشرة إلى سلتك.'
            : language === 'fr'
            ? 'Explorez la bibliothèque 3D à gauche, parcourez les manuels officiels par année scolaire, feuilletez les pages intérieures et commandez vos ouvrages.'
            : 'Explore the 3D library on the left, browse official textbooks by grade level, flip through sample preview pages, and add books directly to your basket.'}
        </p>

        {/* Feature Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#cbd5e1' }}>
            <Award size={16} color="#fbbf24" />
            <span>{language === 'ar' ? 'البرنامج البيداغوجي الرسمي' : language === 'fr' ? 'Programme officiel certifié' : 'Official Curriculum'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#cbd5e1' }}>
            <Compass size={16} color="#fbbf24" />
            <span>{language === 'ar' ? 'تفاعل 3D مباشر مع الرفوف' : language === 'fr' ? 'Navigation 3D synchronisée' : 'Synchronized 3D Shelves'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#cbd5e1' }}>
            <ShieldCheck size={16} color="#fbbf24" />
            <span>{language === 'ar' ? 'أسعار موحدة ومعتمدة' : language === 'fr' ? 'Prix officiels homologués' : 'Standard Official Prices'}</span>
          </div>
          <button
            onClick={onOpenSearch}
            className="glass-panel-interactive"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '8px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#e2e8f0',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            <Search size={14} color="#fbbf24" />
            <span>{language === 'ar' ? 'بحث سريع' : 'Quick Search'}</span>
          </button>
        </div>
      </section>

      {/* Education Levels Filter Bar */}
      <section style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', color: '#f8fafc' }}>
            <GraduationCap size={20} color="#e5b364" />
            {language === 'ar' ? 'اختر المستوى الدراسي:' : language === 'fr' ? 'Niveaux Scolaires:' : 'Education Levels:'}
          </h2>
          <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            {EDUCATION_LEVELS.length} {language === 'ar' ? 'سنوات دراسية' : 'levels'}
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {EDUCATION_LEVELS.map((level) => {
            const isSelected = activeLevelId === level.id;
            return (
              <button
                key={level.id}
                onClick={() => setActiveLevelId(level.id)}
                className="glass-panel-interactive"
                style={{
                  padding: '9px 18px',
                  borderRadius: '12px',
                  background: isSelected ? 'rgba(229, 179, 100, 0.22)' : 'rgba(255, 255, 255, 0.04)',
                  border: isSelected ? '1.5px solid #e5b364' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: isSelected ? '#fbbf24' : '#cbd5e1',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 0 16px rgba(229, 179, 100, 0.25)' : 'none'
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: level.badgeColor
                  }}
                />
                <span>{level.name[language] || level.name.ar}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Active Level Books Showcase */}
      <section style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
              {activeLevel.name[language] || activeLevel.name.ar}
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
              {activeLevel.description[language] || activeLevel.description.ar}
            </p>
          </div>
          <span
            style={{
              fontSize: '0.8rem',
              padding: '4px 12px',
              borderRadius: '20px',
              background: 'rgba(229, 179, 100, 0.12)',
              color: '#fbbf24',
              fontWeight: 600
            }}
          >
            {levelBooks.length} {language === 'ar' ? 'كتب متوفرة' : language === 'fr' ? 'manuels' : 'books'}
          </span>
        </div>

        {/* Books Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '18px'
          }}
        >
          {levelBooks.map((book) => {
            const isInspecting = selectedBookId === book.id;
            return (
              <div
                key={book.id}
                className="glass-panel"
                style={{
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: isInspecting ? '1.5px solid #e5b364' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isInspecting ? 'rgba(30, 24, 18, 0.85)' : 'rgba(18, 22, 31, 0.7)',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                  boxShadow: isInspecting ? 'var(--shadow-glow)' : 'var(--shadow-md)'
                }}
              >
                <div>
                  {/* Book Subject Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: book.coverStyle.accentColor || '#e5b364',
                        color: '#1a110a',
                        fontWeight: 700
                      }}
                    >
                      {book.subject[language] || book.subject.ar}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                      {book.publishYear}
                    </span>
                  </div>

                  {/* Title & Author */}
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '6px', lineHeight: 1.3 }}>
                    {book.title[language] || book.title.ar}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '12px' }}>
                    {book.author[language] || book.author.ar} • {book.pagesCount} {language === 'ar' ? 'صفحة' : 'p.'}
                  </p>
                </div>

                {/* Price and Action Buttons */}
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {language === 'ar' ? 'السعر:' : 'Price:'}
                    </span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fbbf24' }}>
                      {book.price.toFixed(3)} <span style={{ fontSize: '0.75rem' }}>{book.currency[language] || book.currency.ar}</span>
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {/* View in 3D Button */}
                    <button
                      onClick={() => selectBook(book.id)}
                      className="glass-panel-interactive"
                      style={{
                        flex: 1,
                        padding: '8px 10px',
                        borderRadius: '10px',
                        background: isInspecting ? 'rgba(229, 179, 100, 0.3)' : 'rgba(255, 255, 255, 0.06)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#f8fafc',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                      title={language === 'ar' ? 'معاينة في المكتبة ثلاثية الأبعاد' : 'Inspect in 3D'}
                    >
                      <BookMarked size={14} color="#e5b364" />
                      <span>{language === 'ar' ? 'معاينة 3D' : 'Inspect 3D'}</span>
                    </button>

                    {/* Add to Basket Button */}
                    <button
                      onClick={(e) => onAddBookWithAnimation(book, e)}
                      className="glass-panel-interactive"
                      style={{
                        padding: '8px 12px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #c4823f, #e5b364)',
                        color: '#1a110a',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        border: 'none',
                        boxShadow: '0 2px 8px rgba(229, 179, 100, 0.3)'
                      }}
                      title={language === 'ar' ? 'إضافة للسلة' : 'Add to basket'}
                    >
                      <ShoppingBag size={14} />
                      <span>{language === 'ar' ? 'شراء' : 'Add'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Website Footer / Info Section */}
      <footer
        style={{
          marginTop: 'auto',
          paddingTop: '24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          color: '#64748b',
          fontSize: '0.8rem'
        }}
      >
        <div>
          © 2025 {language === 'ar' ? 'المكتبة التعليمية الرقمية ثلاثية الأبعاد' : '3D Educational Virtual Library'}.
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <span>{language === 'ar' ? 'تونس — المركز الوطني البيداغوجي' : 'CNP Tunisia'}</span>
          <span>{language === 'ar' ? 'معاينة تفاعلية' : 'Interactive Prototype'}</span>
        </div>
      </footer>
    </div>
  );
};
