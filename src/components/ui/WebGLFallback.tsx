import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface WebGLFallbackProps {
  onRetry?: () => void;
}

export const WebGLFallback: React.FC<WebGLFallbackProps> = ({ onRetry }) => {
  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0d0f12',
      color: '#f8fafc',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div style={{
        background: 'rgba(22, 27, 38, 0.9)',
        border: '1px solid rgba(229, 179, 100, 0.4)',
        borderRadius: '16px',
        padding: '2.5rem',
        maxWidth: '520px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7)'
      }}>
        <div style={{ display: 'inline-flex', padding: '12px', background: 'rgba(239, 68, 68, 0.15)', borderRadius: '50%', marginBottom: '1.25rem', color: '#f87171' }}>
          <AlertTriangle size={36} />
        </div>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '0.75rem', fontFamily: 'var(--font-display)' }}>
          تعذر تشغيل البيئة ثلاثية الأبعاد (WebGL)
        </h2>
        <p style={{ color: '#cbd5e1', lineHeight: '1.6', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
          متصفحك أو بطاقة الرسوميات الحالية لا تدعم تشغيل WebGL بالشكل المطلوب. يُرجى تفعيل تسريع الرسوميات في إعدادات المتصفح أو التحديث إلى إصدار أحدث.
        </p>
        <button
          onClick={onRetry || (() => window.location.reload())}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#c4823f',
            color: '#ffffff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.2s ease'
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#e5b364')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#c4823f')}
        >
          <RefreshCw size={18} />
          إعادة المحاولة
        </button>
      </div>
    </div>
  );
};
