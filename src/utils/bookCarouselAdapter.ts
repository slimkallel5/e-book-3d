import { Book } from '../types/book';
import { GlassyCarouselItem } from '../components/ui/glassy-coverflow-carousel';
import { Language } from '../types/education';

// Cache generated cover image data URLs so they are created once per book/language
const coverDataUrlCache = new Map<string, string>();

/**
 * Procedurally generates a realistic educational book cover image (data URL)
 * for the given book and language, complete with borders, badges, Arabic calligraphy styling,
 * curriculum emblem, subject labels, and publisher insignia.
 */
export function generateBookCoverDataUrl(book: Book, lang: Language = 'ar'): string {
  const cacheKey = `${book.id}_${lang}`;
  if (coverDataUrlCache.has(cacheKey)) {
    return coverDataUrlCache.get(cacheKey)!;
  }

  // Generate on an off-screen HTML5 Canvas (512x768 matches the 2:3 poster aspect ratio)
  if (typeof document === 'undefined') {
    return 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80';
  }

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=800&q=80';
  }

  const { primaryColor, secondaryColor, accentColor, textColor } = book.coverStyle;

  // 1. Rich Background Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 512, 768);
  bgGrad.addColorStop(0, primaryColor);
  bgGrad.addColorStop(0.5, secondaryColor);
  bgGrad.addColorStop(1, primaryColor);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 512, 768);

  // 2. Geometric patterned watermark
  ctx.save();
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.15;
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.arc(256, 384, 110 + i * 40, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  // 3. Ornate Decorative Gilded Borders
  ctx.save();
  ctx.strokeStyle = accentColor || '#e5b364';
  ctx.lineWidth = 8;
  ctx.strokeRect(18, 18, 476, 732);

  ctx.lineWidth = 2;
  ctx.strokeRect(30, 30, 452, 708);

  // Corner ornaments
  const corners = [
    [18, 18],
    [494, 18],
    [18, 750],
    [494, 750]
  ];
  ctx.fillStyle = accentColor || '#e5b364';
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();

  // 4. Header: Ministry of Education Banner
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.roundRect(70, 48, 372, 42, 8);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 13px "Noto Sans Arabic", "Amiri", sans-serif';
  ctx.fillText('الجمهورية التونسية • وزارة التربية والتعليم', 256, 69);
  ctx.restore();

  // 5. Subject Badge Pill
  ctx.save();
  ctx.fillStyle = accentColor || '#e5b364';
  ctx.beginPath();
  ctx.roundRect(146, 135, 220, 34, 17);
  ctx.fill();

  ctx.fillStyle = '#1e140d';
  ctx.font = 'bold 15px "Noto Sans Arabic", "Amiri", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const subjectName = book.subject[lang] || book.subject.ar;
  ctx.fillText(subjectName, 256, 152);
  ctx.restore();

  // 6. Main Book Title
  ctx.save();
  ctx.fillStyle = textColor || '#ffffff';
  ctx.font = 'bold 40px "Amiri", "Noto Sans Arabic", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;
  const titleText = book.title[lang] || book.title.ar;
  ctx.fillText(titleText, 256, 260);

  // Subtitle
  if (book.subtitle) {
    ctx.font = '600 17px "Amiri", "Noto Sans Arabic", sans-serif';
    ctx.fillStyle = accentColor || '#e5b364';
    const subText = book.subtitle[lang] || book.subtitle.ar;
    ctx.fillText(subText, 256, 305);
  }
  ctx.restore();

  // 7. Center Educational Emblem / Medallion
  ctx.save();
  ctx.translate(256, 435);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.beginPath();
  ctx.arc(0, 0, 85, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = accentColor || '#e5b364';
  ctx.lineWidth = 3.5;
  ctx.stroke();

  ctx.fillStyle = accentColor || '#e5b364';
  ctx.font = '46px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('📖', 0, -8);

  ctx.font = 'bold 13px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(book.isbn.substring(book.isbn.length - 4), 0, 36);
  ctx.restore();

  // 8. Author & Committee Credits
  ctx.save();
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '16px "Noto Sans Arabic", sans-serif';
  ctx.textAlign = 'center';
  const authorName = book.author[lang] || book.author.ar;
  ctx.fillText(authorName, 256, 615);

  // 9. Academic Year & Certification Stamp
  ctx.font = '12px sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(`السنة الدراسية ${book.publishYear} - ${book.publishYear + 1}`, 256, 648);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.beginPath();
  ctx.roundRect(156, 672, 200, 26, 6);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 11px "Noto Sans Arabic", sans-serif';
  ctx.fillText('كتاب مدرسي مصادق عليه رسمياً', 256, 685);
  ctx.restore();

  const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
  coverDataUrlCache.set(cacheKey, dataUrl);
  return dataUrl;
}

function generatePlaceholderCoverSvg(book: Book): string {
  const { primaryColor, secondaryColor, accentColor } = book.coverStyle;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="768" viewBox="0 0 512 768">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${primaryColor}"/>
        <stop offset="60%" stop-color="${secondaryColor}"/>
        <stop offset="100%" stop-color="${primaryColor}"/>
      </linearGradient>
    </defs>
    <rect width="512" height="768" fill="url(#bg)"/>
    <rect x="20" y="20" width="472" height="728" fill="none" stroke="${accentColor || '#e5b364'}" stroke-width="6"/>
    <rect x="30" y="30" width="452" height="708" fill="none" stroke="${accentColor || '#e5b364'}" stroke-width="2"/>
    <circle cx="256" cy="384" r="80" fill="rgba(255,255,255,0.08)" stroke="${accentColor || '#e5b364'}" stroke-width="2"/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function bookToCarouselItem(book: Book, lang: Language, lazyCover = false): GlassyCarouselItem {
  const title = book.title[lang] || book.title.ar;
  const subtitle = `${book.subject[lang] || book.subject.ar} · ${book.price.toFixed(3)} ${book.currency[lang] || book.currency.ar}`;
  const description = book.synopsis[lang] || book.synopsis.ar;
  const cacheKey = `${book.id}_${lang}`;
  let image: string;
  if (coverDataUrlCache.has(cacheKey)) {
    image = coverDataUrlCache.get(cacheKey)!;
  } else if (lazyCover) {
    image = generatePlaceholderCoverSvg(book);
  } else {
    image = generateBookCoverDataUrl(book, lang);
  }
  const accent = book.coverStyle.accentColor || book.coverStyle.primaryColor || '#e5b364';

  return {
    id: book.id,
    title,
    subtitle,
    image,
    accent,
    description,
    href: `#book-${book.id}`,
    linkLabel: lang === 'ar' ? 'فحص الكتاب بالأبعاد الثلاثية' : lang === 'fr' ? 'Examiner le livre en 3D' : 'Inspect Book in 3D'
  };
}
