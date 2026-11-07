import React, { useState, useRef } from 'react';
import { useLibraryStore } from '../../store/useLibraryStore';
import { EDUCATION_LEVELS } from '../../data/educationLevels';
import { bookUploadService, BookUploadPayload } from '../../services/bookUploadService';
import {
  Upload,
  X,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

interface BookUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookUploaded?: (book: any) => void;
}

export const BookUploadModal: React.FC<BookUploadModalProps> = ({
  isOpen,
  onClose,
  onBookUploaded
}) => {
  const language = useLibraryStore((s) => s.language);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [educationLevelId, setEducationLevelId] = useState(EDUCATION_LEVELS[0].id);
  const [subject, setSubject] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [bookLanguage, setBookLanguage] = useState<'ar' | 'fr' | 'en'>('ar');

  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);

  const [frontCoverFile, setFrontCoverFile] = useState<File | null>(null);
  const [frontCoverPreview, setFrontCoverPreview] = useState<string | null>(null);

  const [backCoverFile, setBackCoverFile] = useState<File | null>(null);
  const [backCoverPreview, setBackCoverPreview] = useState<string | null>(null);

  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pdfInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPosterFile(file);
      setPosterPreview(URL.createObjectURL(file));
    }
  };

  const handleFrontCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFrontCoverFile(file);
      setFrontCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleBackCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackCoverFile(file);
      setBackCoverPreview(URL.createObjectURL(file));
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
        setErrorMessages(['Selected file is not a valid PDF document.']);
        setPdfFile(null);
        return;
      }
      setPdfFile(file);
      setErrorMessages([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessages([]);
    setSuccessMessage(null);

    const payload: BookUploadPayload = {
      title,
      subtitle,
      description,
      educationLevelId,
      subject,
      author,
      publisher,
      language: bookLanguage,
      posterFile,
      frontCoverFile,
      backCoverFile,
      pdfFile
    };

    const validation = bookUploadService.validatePayload(payload);
    if (!validation.valid) {
      setErrorMessages(validation.errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await bookUploadService.uploadBook(payload);
      if (result.success && result.book) {
        setSuccessMessage(
          language === 'ar'
            ? 'تم حفظ الكتاب في جلسة العمل بنجاح (محاكاة التخزين المحلي).'
            : 'Book uploaded successfully to local session (simulated storage).'
        );
        if (onBookUploaded) {
          onBookUploaded(result.book);
        }
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setErrorMessages([result.error || 'Upload failed.']);
      }
    } catch (err: any) {
      setErrorMessages([err?.message || 'Unexpected upload error.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      data-testid="book-upload-modal"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: 'min(92vw, 760px)',
          maxHeight: '90vh',
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid rgba(201, 154, 98, 0.35)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          color: '#2a1b12'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderBottom: '1px solid rgba(168, 121, 77, 0.18)',
            background: 'rgba(243, 235, 221, 0.65)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Upload size={20} color="#a8794d" />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#382014' }}>
              {language === 'ar' ? 'إضافة كتاب مدرسي جديد' : language === 'fr' ? 'Ajouter un nouveau manuel' : 'Add New Educational Book'}
            </h2>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#806044',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              background: '#fef3c7',
              border: '1px solid #fde68a',
              borderRadius: '10px',
              fontSize: '0.82rem',
              color: '#92400e'
            }}
          >
            <Info size={16} style={{ flexShrink: 0 }} />
            <span>
              {language === 'ar'
                ? 'ملاحظة: هذا النموذج يجهز بنية الرفع للمستقبل. يتم تخزين الملفات المرفوعة مؤقتاً في جلسة العمل المحلية لعدم وجود خادم خلفي حالياً.'
                : 'Architecture Notice: This interface prepares future book uploads. Uploaded assets are temporarily held in local memory since no backend is connected yet.'}
            </span>
          </div>

          {errorMessages.length > 0 && (
            <div
              style={{
                padding: '10px 14px',
                background: '#fee2e2',
                border: '1px solid #fca5a5',
                borderRadius: '10px',
                fontSize: '0.82rem',
                color: '#991b1b'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, marginBottom: '4px' }}>
                <AlertTriangle size={15} />
                <span>Please fix the following:</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {errorMessages.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {successMessage && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                background: '#dcfce7',
                border: '1px solid #86efac',
                borderRadius: '10px',
                fontSize: '0.84rem',
                color: '#166534',
                fontWeight: 600
              }}
            >
              <CheckCircle size={16} />
              <span>{successMessage}</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: '#382014' }}>
                Book Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. فضاء الرياضيات"
                required
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #c99a62',
                  background: '#faf6ed',
                  fontSize: '0.86rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: '#382014' }}>
                Subtitle (Optional)
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. الأعداد والحساب"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #c99a62',
                  background: '#faf6ed',
                  fontSize: '0.86rem'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: '#382014' }}>
                Education Level *
              </label>
              <select
                value={educationLevelId}
                onChange={(e) => setEducationLevelId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #c99a62',
                  background: '#faf6ed',
                  fontSize: '0.86rem'
                }}
              >
                {EDUCATION_LEVELS.map((lvl) => (
                  <option key={lvl.id} value={lvl.id}>
                    {lvl.name[language] || lvl.name.ar}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: '#382014' }}>
                Subject *
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. الرياضيات"
                required
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #c99a62',
                  background: '#faf6ed',
                  fontSize: '0.86rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: '#382014' }}>
                Language
              </label>
              <select
                value={bookLanguage}
                onChange={(e) => setBookLanguage(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #c99a62',
                  background: '#faf6ed',
                  fontSize: '0.86rem'
                }}
              >
                <option value="ar">العربية (Arabic)</option>
                <option value="fr">Français (French)</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: '#382014' }}>
                Author / Pedagogical Committee *
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. نخبة من المفتشين التربويين"
                required
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #c99a62',
                  background: '#faf6ed',
                  fontSize: '0.86rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: '#382014' }}>
                Publisher (Optional)
              </label>
              <input
                type="text"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                placeholder="e.g. المركز الوطني البيداغوجي"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #c99a62',
                  background: '#faf6ed',
                  fontSize: '0.86rem'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px', color: '#382014' }}>
              Description / Synopsis
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Overview of the curriculum contents..."
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #c99a62',
                background: '#faf6ed',
                fontSize: '0.86rem',
                resize: 'vertical'
              }}
            />
          </div>

          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              background: '#f3ebd3',
              border: '1px dashed #c99a62'
            }}
          >
            <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 800, color: '#382014', marginBottom: '6px' }}>
              Authoritative PDF Content File *
            </label>
            <input
              type="file"
              ref={pdfInputRef}
              accept=".pdf,application/pdf"
              onChange={handlePdfChange}
              style={{ display: 'none' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => pdfInputRef.current?.click()}
                className="glass-panel-interactive"
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: '#faf6ed',
                  border: '1px solid #a8794d',
                  color: '#382014',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <FileText size={16} color="#a8794d" />
                <span>Select PDF File</span>
              </button>
              {pdfFile ? (
                <span style={{ fontSize: '0.82rem', color: '#166534', fontWeight: 600 }}>
                  ✓ {pdfFile.name} ({(pdfFile.size / 1024).toFixed(1)} KB)
                </span>
              ) : (
                <span style={{ fontSize: '0.78rem', color: '#806044' }}>
                  No PDF selected (PDF format only)
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div style={{ padding: '12px', borderRadius: '10px', background: '#faf6ed', border: '1px solid #e9dcc5' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                Poster Image
              </label>
              <input
                type="file"
                ref={posterInputRef}
                accept="image/*"
                onChange={handlePosterChange}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => posterInputRef.current?.click()}
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  background: '#f3ebd3',
                  border: '1px solid #c99a62',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                <ImageIcon size={14} />
                <span>Choose Poster</span>
              </button>
              {posterPreview && (
                <div style={{ marginTop: '8px', textAlign: 'center' }}>
                  <img
                    src={posterPreview}
                    alt="Poster Preview"
                    style={{ width: '60px', height: '85px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>
              )}
            </div>

            <div style={{ padding: '12px', borderRadius: '10px', background: '#faf6ed', border: '1px solid #e9dcc5' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                Front Cover Image
              </label>
              <input
                type="file"
                ref={frontInputRef}
                accept="image/*"
                onChange={handleFrontCoverChange}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => frontInputRef.current?.click()}
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  background: '#f3ebd3',
                  border: '1px solid #c99a62',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                <ImageIcon size={14} />
                <span>Choose Front</span>
              </button>
              {frontCoverPreview && (
                <div style={{ marginTop: '8px', textAlign: 'center' }}>
                  <img
                    src={frontCoverPreview}
                    alt="Front Cover Preview"
                    style={{ width: '60px', height: '85px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>
              )}
            </div>

            <div style={{ padding: '12px', borderRadius: '10px', background: '#faf6ed', border: '1px solid #e9dcc5' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                Back Cover Image
              </label>
              <input
                type="file"
                ref={backInputRef}
                accept="image/*"
                onChange={handleBackCoverChange}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={() => backInputRef.current?.click()}
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  background: '#f3ebd3',
                  border: '1px solid #c99a62',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                <ImageIcon size={14} />
                <span>Choose Back</span>
              </button>
              {backCoverPreview && (
                <div style={{ marginTop: '8px', textAlign: 'center' }}>
                  <img
                    src={backCoverPreview}
                    alt="Back Cover Preview"
                    style={{ width: '60px', height: '85px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 18px',
                borderRadius: '10px',
                border: '1px solid #ccc',
                background: '#faf6ed',
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="glass-panel-interactive"
              style={{
                padding: '8px 22px',
                borderRadius: '10px',
                border: '1px solid #c99a62',
                background: 'linear-gradient(135deg, #c99a62, #a8794d)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}
            >
              {isSubmitting ? 'Uploading...' : 'Save Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
