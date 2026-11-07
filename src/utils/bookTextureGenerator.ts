import * as THREE from 'three';
import { Book } from '../types/book';
import { Language } from '../types/education';

/**
 * Creates dynamic high-fidelity procedural canvas textures for Books:
 * - Front cover with embossed gold border, ministry emblem, Arabic & Latin titles
 * - Back cover with synopsis, educational barcode, price, Ministry certification
 * - Open 2-page educational spreads with bilingual content, diagrams, and callouts
 *
 * Optimized with texture caching and lightweight canvas resolution to ensure 60fps performance.
 */

const textureCache = new Map<string, THREE.CanvasTexture>();

export function createCoverTexture(book: Book, language: Language = 'ar'): THREE.CanvasTexture {
  const cacheKey = `cover_${book.id}_${language}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const canvas = document.createElement('canvas');
  // Scaled resolution: 512x720 is crisp for WebGL 3D displays while using 4x less memory than 1024x1440
  canvas.width = 512;
  canvas.height = 720;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    const fallbackTex = new THREE.CanvasTexture(canvas);
    textureCache.set(cacheKey, fallbackTex);
    return fallbackTex;
  }

  const { primaryColor, secondaryColor, accentColor, textColor } = book.coverStyle;

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 512, 720);
  bgGrad.addColorStop(0, primaryColor);
  bgGrad.addColorStop(0.65, secondaryColor);
  bgGrad.addColorStop(1, primaryColor);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 512, 720);

  // Geometric curved background watermark
  ctx.save();
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.18;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(256, 360, 130 + i * 42, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  // Ornate decorative gilded border
  ctx.save();
  ctx.strokeStyle = accentColor || '#e5b364';
  ctx.lineWidth = 7;
  ctx.strokeRect(20, 20, 472, 680);

  ctx.lineWidth = 2;
  ctx.strokeRect(31, 31, 450, 658);

  // Corner ornaments
  const corners = [
    [20, 20],
    [492, 20],
    [20, 700],
    [492, 700]
  ];
  ctx.fillStyle = accentColor || '#e5b364';
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 12, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();

  // Header Ministry Banner / Badge
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.roundRect(80, 45, 352, 38, 6);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 12px "Noto Sans Arabic", "Amiri", sans-serif';
  ctx.fillText('الجمهورية التونسية • وزارة التربية والتعليم', 256, 64);
  ctx.restore();

  // Subject Badge Pill
  ctx.save();
  ctx.fillStyle = accentColor || '#e5b364';
  ctx.beginPath();
  ctx.roundRect(160, 130, 192, 30, 15);
  ctx.fill();

  ctx.fillStyle = '#1e140d';
  ctx.font = 'bold 13px "Noto Sans Arabic", "Amiri", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const subjectName = book.subject[language] || book.subject.ar;
  ctx.fillText(subjectName, 256, 145);
  ctx.restore();

  // Main Book Title
  ctx.save();
  ctx.fillStyle = textColor || '#ffffff';
  ctx.font = 'bold 37px "Amiri", "Noto Sans Arabic", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.7)';
  ctx.shadowBlur = 9;
  ctx.shadowOffsetY = 3;
  const titleText = book.title[language] || book.title.ar;
  ctx.fillText(titleText, 256, 245);

  // Subtitle if present
  if (book.subtitle) {
    ctx.font = '600 16px "Amiri", "Noto Sans Arabic", sans-serif';
    ctx.fillStyle = accentColor || '#e5b364';
    const subText = book.subtitle[language] || book.subtitle.ar;
    ctx.fillText(subText, 256, 285);
  }
  ctx.restore();

  // Center Emblem / Educational Medallion
  ctx.save();
  ctx.translate(256, 415);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.beginPath();
  ctx.arc(0, 0, 80, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = accentColor || '#e5b364';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = accentColor || '#e5b364';
  ctx.font = '42px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('📖', 0, -5);

  ctx.font = 'bold 12px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(book.isbn.substring(book.isbn.length - 4), 0, 38);
  ctx.restore();

  // Author / Committee credits
  ctx.save();
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '15px "Noto Sans Arabic", sans-serif';
  ctx.textAlign = 'center';
  const authorName = book.author[language] || book.author.ar;
  ctx.fillText(authorName, 256, 580);

  // Footer: Academic Year & Ministry Stamp
  ctx.font = '11px sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(`السنة الدراسية ${book.publishYear} - ${book.publishYear + 1}`, 256, 610);

  // Certification badge
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.beginPath();
  ctx.roundRect(165, 630, 182, 23, 5);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 10px "Noto Sans Arabic", sans-serif';
  ctx.fillText('كتاب مدرسي مصادق عليه رسمياً', 256, 642);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.needsUpdate = true;

  textureCache.set(cacheKey, texture);
  return texture;
}

export function createBackCoverTexture(book: Book, language: Language = 'ar'): THREE.CanvasTexture {
  const cacheKey = `back_${book.id}_${language}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 720;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    const fallbackTex = new THREE.CanvasTexture(canvas);
    textureCache.set(cacheKey, fallbackTex);
    return fallbackTex;
  }

  const { primaryColor, secondaryColor, accentColor } = book.coverStyle;

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, 512, 720);
  bgGrad.addColorStop(0, secondaryColor);
  bgGrad.addColorStop(1, primaryColor);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 512, 720);

  // Outer border
  ctx.strokeStyle = accentColor || '#e5b364';
  ctx.lineWidth = 4;
  ctx.strokeRect(25, 25, 462, 670);

  // Back cover synopsis box
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.roundRect(50, 60, 412, 300, 8);
  ctx.fill();

  ctx.fillStyle = accentColor || '#e5b364';
  ctx.font = 'bold 18px "Noto Sans Arabic", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('تقديم الكتاب ومحتواه البيداغوجي', 440, 90);

  // Synopsis text
  ctx.fillStyle = '#f1f5f9';
  ctx.font = '13px "Noto Sans Arabic", sans-serif';
  const synopsis = book.synopsis[language] || book.synopsis.ar;
  wrapText(ctx, synopsis, 440, 120, 380, 22, 'right');

  // Key features box
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.beginPath();
  ctx.roundRect(50, 380, 412, 150, 8);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 14px "Noto Sans Arabic", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('مميزات هذه الطبعة الرسمية:', 440, 405);

  const features = [
    '• متطابق مع البرامج الرسمية لوزارة التربية الوطنية.',
    '• رسوم توضيحية وخرائط مفاهيمية ملونة لترسيخ الفهم.',
    '• تمارين تقييمية وتطبيقات عملية لكل محور ووحدة تعليمية.'
  ];
  features.forEach((feat, idx) => {
    ctx.font = '11px "Noto Sans Arabic", sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(feat, 440, 430 + idx * 23);
  });

  // Price & ISBN barcode container at the bottom
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(50, 550, 412, 115, 7);
  ctx.fill();

  // Price stamp
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 19px "Noto Sans Arabic", sans-serif';
  ctx.textAlign = 'left';
  const curr = book.currency[language] || book.currency.ar;
  ctx.fillText(`السعر المقنن: ${book.price.toFixed(3)} ${curr}`, 70, 580);

  ctx.font = '10px sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText(`ISBN: ${book.isbn}  |  ${book.pagesCount} صفحة`, 70, 602);

  // Barcode
  drawBarcode(ctx, 70, 612, 260, 40, book.isbn);

  // Stamp seal
  ctx.save();
  ctx.translate(410, 608);
  ctx.rotate(-0.1);
  ctx.strokeStyle = '#c4823f';
  ctx.lineWidth = 2;
  ctx.strokeRect(-35, -22, 70, 45);
  ctx.font = 'bold 9px "Noto Sans Arabic", sans-serif';
  ctx.fillStyle = '#c4823f';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('المركز الوطني', 0, -9);
  ctx.fillText('البيداغوجي', 0, 4);
  ctx.fillText('★ مصادق ★', 0, 15);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.needsUpdate = true;

  textureCache.set(cacheKey, texture);
  return texture;
}

export function createOpenSpreadTexture(
  book: Book,
  pageIndex: number,
  language: Language = 'ar'
): THREE.CanvasTexture {
  const cacheKey = `spread_${book.id}_${pageIndex}_${language}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1024; // 512 left page + 512 right page
  canvas.height = 720;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    const fallbackTex = new THREE.CanvasTexture(canvas);
    textureCache.set(cacheKey, fallbackTex);
    return fallbackTex;
  }

  // Paper cream background
  ctx.fillStyle = '#fdfbf7';
  ctx.fillRect(0, 0, 1024, 720);

  // Soft spine crease shadow
  const gutterGrad = ctx.createLinearGradient(480, 0, 544, 0);
  gutterGrad.addColorStop(0, 'rgba(0,0,0,0)');
  gutterGrad.addColorStop(0.5, 'rgba(0,0,0,0.18)');
  gutterGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gutterGrad;
  ctx.fillRect(480, 0, 64, 720);

  // Draw Page border margins
  ctx.strokeStyle = '#e2d9cc';
  ctx.lineWidth = 1;
  ctx.strokeRect(30, 30, 452, 660); // Left page
  ctx.strokeRect(542, 30, 452, 660); // Right page

  const samplePages = book.samplePages || [];
  const defaultPage = {
    pageNumber: 1,
    title: { ar: 'محتوى الكتاب المدرسي', fr: 'Contenu Pédagogique', en: 'Curriculum Content' },
    content: {
      ar: 'محتوى دراسي موثق صادر عن وزارة التربية والتعليم التونسية.',
      fr: 'Contenu officiel conforme aux normes du Ministère de l’Éducation.',
      en: 'Official curriculum content certified by the Ministry of Education.'
    }
  };
  const leftPageData = samplePages[pageIndex * 2] || defaultPage;
  const rightPageData = samplePages[pageIndex * 2 + 1] || samplePages[1] || defaultPage;

  renderSinglePage(ctx, leftPageData, 30, book, language, true);
  renderSinglePage(ctx, rightPageData, 542, book, language, false);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.needsUpdate = true;

  textureCache.set(cacheKey, texture);
  return texture;
}

function renderSinglePage(
  ctx: CanvasRenderingContext2D,
  pageData: any,
  offsetX: number,
  book: Book,
  language: Language,
  isLeft: boolean
) {
  const pageWidth = 452;

  // Running Header
  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 10px "Noto Sans Arabic", sans-serif';
  ctx.textAlign = isLeft ? 'left' : 'right';
  const headerX = isLeft ? offsetX + 20 : offsetX + pageWidth - 20;
  const bookTitle = book.title[language] || book.title.ar;
  ctx.fillText(bookTitle, headerX, 52);

  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(offsetX + 20, 62);
  ctx.lineTo(offsetX + pageWidth - 20, 62);
  ctx.stroke();

  // Page Title
  if (pageData?.title) {
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 18px "Noto Sans Arabic", sans-serif';
    ctx.textAlign = 'right';
    const titleText = pageData.title[language] || pageData.title.ar;
    ctx.fillText(titleText, offsetX + pageWidth - 20, 92);
  }

  // Content Text
  if (pageData?.content) {
    ctx.fillStyle = '#334155';
    ctx.font = '12px "Noto Sans Arabic", sans-serif';
    const bodyText = pageData.content[language] || pageData.content.ar;
    wrapText(ctx, bodyText, offsetX + pageWidth - 20, 122, pageWidth - 40, 20, 'right');
  }

  // Educational Diagram Box
  ctx.fillStyle = '#f8fafc';
  ctx.strokeStyle = book.coverStyle.accentColor || '#c4823f';
  ctx.lineWidth = 1;
  const diagX = offsetX + 25;
  const diagY = 280;
  const diagW = pageWidth - 50;
  const diagH = 170;
  ctx.beginPath();
  ctx.roundRect(diagX, diagY, diagW, diagH, 6);
  ctx.fill();
  ctx.stroke();

  // Diagram Title
  ctx.fillStyle = book.coverStyle.accentColor || '#c4823f';
  ctx.font = 'bold 11px "Noto Sans Arabic", sans-serif';
  ctx.textAlign = 'center';
  const diagTitle = pageData?.diagramTitle
    ? (pageData.diagramTitle[language] || pageData.diagramTitle.ar)
    : 'شكل توضيحي بيداغوجي • تمرين تطبيقي';
  ctx.fillText(diagTitle, diagX + diagW / 2, diagY + 20);

  // Diagram procedural graphics
  ctx.save();
  ctx.translate(diagX + diagW / 2, diagY + 90);
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(-60, 0, 28, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(60, 0, 28, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#f59e0b';
  ctx.beginPath();
  ctx.moveTo(-32, 0);
  ctx.lineTo(32, 0);
  ctx.stroke();

  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 10px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('A ➔ B', 0, -5);
  ctx.restore();

  // Summary Box
  if (pageData?.summaryPoints && pageData.summaryPoints.length > 0) {
    ctx.fillStyle = '#fffbeb';
    ctx.beginPath();
    ctx.roundRect(offsetX + 25, 470, pageWidth - 50, 160, 5);
    ctx.fill();
    ctx.strokeStyle = '#fcd34d';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#92400e';
    ctx.font = 'bold 12px "Noto Sans Arabic", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('خلاصة واستنتاج المحور:', offsetX + pageWidth - 40, 492);

    pageData.summaryPoints.forEach((pt: any, i: number) => {
      ctx.fillStyle = '#78350f';
      ctx.font = '10px "Noto Sans Arabic", sans-serif';
      const ptText = pt[language] || pt.ar;
      ctx.fillText(`• ${ptText}`, offsetX + pageWidth - 40, 515 + i * 20);
    });
  }

  // Running Footer & Page Number
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = isLeft ? 'left' : 'right';
  const pageNum = pageData?.pageNumber || (isLeft ? 1 : 2);
  const footerX = isLeft ? offsetX + 20 : offsetX + pageWidth - 20;
  ctx.fillText(`${pageNum}`, footerX, 670);
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  align: 'left' | 'right' | 'center' = 'right'
) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  ctx.textAlign = align;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
}

function drawBarcode(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  seedStr: string
) {
  ctx.fillStyle = '#0f172a';
  const numBars = 50;
  const barWidth = width / numBars;

  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0;
  }

  for (let i = 0; i < numBars; i++) {
    const bit = (Math.abs(hash * (i + 13)) % 100) > 35;
    if (bit) {
      ctx.fillRect(x + i * barWidth, y, barWidth * 0.75, height);
    }
  }
}
