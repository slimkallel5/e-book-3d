import * as THREE from 'three';
import { Book } from '../types/book';
import { Language } from '../types/education';

/**
 * Creates dynamic high-fidelity procedural canvas textures for Books:
 * - Front cover with embossed gold border, ministry emblem, Arabic & Latin titles
 * - Back cover with synopsis, educational barcode, price, Ministry certification
 * - Open 2-page educational spreads with bilingual content, diagrams, and callouts
 */

export function createCoverTexture(book: Book, language: Language = 'ar'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1440;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  const { primaryColor, secondaryColor, accentColor, textColor } = book.coverStyle;

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 1024, 1440);
  bgGrad.addColorStop(0, primaryColor);
  bgGrad.addColorStop(0.65, secondaryColor);
  bgGrad.addColorStop(1, primaryColor);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 1440);

  // Subtle geometric/curved background watermark
  ctx.save();
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 3;
  ctx.globalAlpha = 0.18;
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.arc(512, 720, 260 + i * 85, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  // Ornate decorative gilded border
  ctx.save();
  ctx.strokeStyle = accentColor || '#e5b364';
  ctx.lineWidth = 14;
  ctx.strokeRect(40, 40, 944, 1360);

  ctx.lineWidth = 4;
  ctx.strokeRect(62, 62, 900, 1316);

  // Corner ornaments
  const corners = [
    [40, 40],
    [984, 40],
    [40, 1400],
    [984, 1400]
  ];
  ctx.fillStyle = accentColor || '#e5b364';
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 24, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();

  // Header Ministry Banner / Badge
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.roundRect(160, 90, 704, 75, 12);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 24px "Noto Sans Arabic", "Amiri", sans-serif';
  ctx.fillText('الجمهورية التونسية • وزارة التربية والتعليم', 512, 128);
  ctx.restore();

  // Subject Badge Pill
  ctx.save();
  ctx.fillStyle = accentColor || '#e5b364';
  ctx.beginPath();
  ctx.roundRect(320, 260, 384, 60, 30);
  ctx.fill();

  ctx.fillStyle = '#1e140d';
  ctx.font = 'bold 26px "Noto Sans Arabic", "Amiri", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const subjectName = book.subject[language] || book.subject.ar;
  ctx.fillText(subjectName, 512, 290);
  ctx.restore();

  // Main Book Title (Large Arabic calligraphy styling)
  ctx.save();
  ctx.fillStyle = textColor || '#ffffff';
  ctx.font = 'bold 74px "Amiri", "Noto Sans Arabic", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.7)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 6;
  const titleText = book.title[language] || book.title.ar;
  ctx.fillText(titleText, 512, 490);

  // French / Latin Subtitle if present
  if (book.subtitle) {
    ctx.font = '600 32px "Amiri", "Noto Sans Arabic", sans-serif';
    ctx.fillStyle = accentColor || '#e5b364';
    const subText = book.subtitle[language] || book.subtitle.ar;
    ctx.fillText(subText, 512, 570);
  }
  ctx.restore();

  // Center Emblem / Educational Medallion
  ctx.save();
  ctx.translate(512, 830);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.beginPath();
  ctx.arc(0, 0, 160, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = accentColor || '#e5b364';
  ctx.lineWidth = 6;
  ctx.stroke();

  // Star / geometry inside medallion
  ctx.fillStyle = accentColor || '#e5b364';
  ctx.font = '84px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('📖', 0, -10);

  ctx.font = 'bold 24px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(book.isbn.substring(book.isbn.length - 4), 0, 75);
  ctx.restore();

  // Author / Committee credits
  ctx.save();
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '30px "Noto Sans Arabic", sans-serif';
  ctx.textAlign = 'center';
  const authorName = book.author[language] || book.author.ar;
  ctx.fillText(authorName, 512, 1160);

  // Footer: Academic Year & Ministry Stamp
  ctx.font = '22px sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(`السنة الدراسية ${book.publishYear} - ${book.publishYear + 1}`, 512, 1220);

  // Certification badge
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.beginPath();
  ctx.roundRect(330, 1260, 364, 46, 10);
  ctx.fill();
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 20px "Noto Sans Arabic", sans-serif';
  ctx.fillText('كتاب مدرسي مصادق عليه رسمياً', 512, 1284);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export function createBackCoverTexture(book: Book, language: Language = 'ar'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1440;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  const { primaryColor, secondaryColor, accentColor } = book.coverStyle;

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, 1024, 1440);
  bgGrad.addColorStop(0, secondaryColor);
  bgGrad.addColorStop(1, primaryColor);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 1440);

  // Simple clean outer border
  ctx.strokeStyle = accentColor || '#e5b364';
  ctx.lineWidth = 8;
  ctx.strokeRect(50, 50, 924, 1340);

  // Back cover synopsis box
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.roundRect(100, 120, 824, 600, 16);
  ctx.fill();

  ctx.fillStyle = accentColor || '#e5b364';
  ctx.font = 'bold 36px "Noto Sans Arabic", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('تقديم الكتاب ومحتواه البيداغوجي', 880, 180);

  // Synopsis content text with line breaks
  ctx.fillStyle = '#f1f5f9';
  ctx.font = '26px "Noto Sans Arabic", sans-serif';
  const synopsis = book.synopsis[language] || book.synopsis.ar;
  wrapText(ctx, synopsis, 880, 240, 760, 44, 'right');

  // Educational Objectives / Key features box
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.beginPath();
  ctx.roundRect(100, 760, 824, 300, 16);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px "Noto Sans Arabic", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('مميزات هذه الطبعة الرسمية:', 880, 810);

  const features = [
    '• متطابق مع البرامج الرسمية لوزارة التربية الوطنية.',
    '• رسوم توضيحية وخرائط مفاهيمية ملونة لترسيخ الفهم.',
    '• تمارين تقييمية وتطبيقات عملية لكل محور ووحدة تعليمية.'
  ];
  features.forEach((feat, idx) => {
    ctx.font = '22px "Noto Sans Arabic", sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(feat, 880, 860 + idx * 46);
  });

  // Price & ISBN barcode container at the bottom
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(100, 1100, 824, 230, 14);
  ctx.fill();

  // Price stamp
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 38px "Noto Sans Arabic", sans-serif';
  ctx.textAlign = 'left';
  const curr = book.currency[language] || book.currency.ar;
  ctx.fillText(`السعر المقنن: ${book.price.toFixed(3)} ${curr}`, 140, 1160);

  ctx.font = '20px sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.fillText(`ISBN: ${book.isbn}  |  ${book.pagesCount} صفحة`, 140, 1205);

  // Draw procedural realistic Barcode lines
  drawBarcode(ctx, 140, 1225, 520, 80, book.isbn);

  // Stamp seal
  ctx.save();
  ctx.translate(820, 1215);
  ctx.rotate(-0.1);
  ctx.strokeStyle = '#c4823f';
  ctx.lineWidth = 4;
  ctx.strokeRect(-70, -45, 140, 90);
  ctx.font = 'bold 18px "Noto Sans Arabic", sans-serif';
  ctx.fillStyle = '#c4823f';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('المركز الوطني', 0, -18);
  ctx.fillText('البيداغوجي', 0, 8);
  ctx.fillText('★ مصادق ★', 0, 30);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export function createOpenSpreadTexture(
  book: Book,
  pageIndex: number,
  language: Language = 'ar'
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048; // 1024 left page + 1024 right page
  canvas.height = 1440;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // Paper cream background with soft page gradient
  ctx.fillStyle = '#fdfbf7';
  ctx.fillRect(0, 0, 2048, 1440);

  // Soft spine crease shadow in the center
  const gutterGrad = ctx.createLinearGradient(960, 0, 1088, 0);
  gutterGrad.addColorStop(0, 'rgba(0,0,0,0)');
  gutterGrad.addColorStop(0.5, 'rgba(0,0,0,0.18)');
  gutterGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gutterGrad;
  ctx.fillRect(960, 0, 128, 1440);

  // Draw Page border margins
  ctx.strokeStyle = '#e2d9cc';
  ctx.lineWidth = 1;
  ctx.strokeRect(60, 60, 904, 1320); // Left page
  ctx.strokeRect(1084, 60, 904, 1320); // Right page

  const samplePages = book.samplePages;
  const leftPageData = samplePages[pageIndex * 2] || samplePages[0];
  const rightPageData = samplePages[pageIndex * 2 + 1] || samplePages[1] || samplePages[0];

  // Render Left Page (Canvas 0..1024)
  renderSinglePage(ctx, leftPageData, 60, book, language, true);

  // Render Right Page (Canvas 1024..2048)
  renderSinglePage(ctx, rightPageData, 1084, book, language, false);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
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
  const pageWidth = 904;

  // Running Header
  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 20px "Noto Sans Arabic", sans-serif';
  ctx.textAlign = isLeft ? 'left' : 'right';
  const headerX = isLeft ? offsetX + 40 : offsetX + pageWidth - 40;
  const bookTitle = book.title[language] || book.title.ar;
  ctx.fillText(bookTitle, headerX, 105);

  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(offsetX + 40, 125);
  ctx.lineTo(offsetX + pageWidth - 40, 125);
  ctx.stroke();

  // Page Title / Lesson Title
  if (pageData?.title) {
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 36px "Noto Sans Arabic", sans-serif';
    ctx.textAlign = 'right';
    const titleText = pageData.title[language] || pageData.title.ar;
    ctx.fillText(titleText, offsetX + pageWidth - 40, 185);
  }

  // Educational Content Text
  if (pageData?.content) {
    ctx.fillStyle = '#334155';
    ctx.font = '24px "Noto Sans Arabic", sans-serif';
    const bodyText = pageData.content[language] || pageData.content.ar;
    wrapText(ctx, bodyText, offsetX + pageWidth - 40, 245, pageWidth - 80, 40, 'right');
  }

  // Educational Diagram / Interactive Illustration Box
  ctx.fillStyle = '#f8fafc';
  ctx.strokeStyle = book.coverStyle.accentColor || '#c4823f';
  ctx.lineWidth = 2;
  const diagX = offsetX + 50;
  const diagY = 560;
  const diagW = pageWidth - 100;
  const diagH = 340;
  ctx.beginPath();
  ctx.roundRect(diagX, diagY, diagW, diagH, 12);
  ctx.fill();
  ctx.stroke();

  // Diagram Title
  ctx.fillStyle = book.coverStyle.accentColor || '#c4823f';
  ctx.font = 'bold 22px "Noto Sans Arabic", sans-serif';
  ctx.textAlign = 'center';
  const diagTitle = pageData?.diagramTitle
    ? (pageData.diagramTitle[language] || pageData.diagramTitle.ar)
    : 'شكل توضيحي بيداغوجي • تمرين تطبيقي';
  ctx.fillText(diagTitle, diagX + diagW / 2, diagY + 40);

  // Diagram procedural graphics (geometric shapes representing academic concepts)
  ctx.save();
  ctx.translate(diagX + diagW / 2, diagY + 180);
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(-120, 0, 55, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(120, 0, 55, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#f59e0b';
  ctx.beginPath();
  ctx.moveTo(-65, 0);
  ctx.lineTo(65, 0);
  ctx.stroke();

  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('A ➔ B', 0, -10);
  ctx.restore();

  // Summary / Key Takeaways Box
  if (pageData?.summaryPoints && pageData.summaryPoints.length > 0) {
    ctx.fillStyle = '#fffbeb';
    ctx.beginPath();
    ctx.roundRect(offsetX + 50, 940, pageWidth - 100, 320, 10);
    ctx.fill();
    ctx.strokeStyle = '#fcd34d';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#92400e';
    ctx.font = 'bold 24px "Noto Sans Arabic", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('خلاصة واستنتاج المحور:', offsetX + pageWidth - 80, 985);

    pageData.summaryPoints.forEach((pt: any, i: number) => {
      ctx.fillStyle = '#78350f';
      ctx.font = '20px "Noto Sans Arabic", sans-serif';
      const ptText = pt[language] || pt.ar;
      ctx.fillText(`• ${ptText}`, offsetX + pageWidth - 80, 1030 + i * 40);
    });
  }

  // Running Footer & Page Number
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = isLeft ? 'left' : 'right';
  const pageNum = pageData?.pageNumber || (isLeft ? 1 : 2);
  const footerX = isLeft ? offsetX + 40 : offsetX + pageWidth - 40;
  ctx.fillText(`${pageNum}`, footerX, 1340);
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
  const numBars = 75;
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
