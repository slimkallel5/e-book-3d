# Educational Book Data Model

## Concept & Distinction
The application clearly decouples book visual presentation assets from the authoritative educational reading content:
1. `poster`: Image asset used in bookshelf preview cards and the 3D coverflow discovery carousel.
2. `frontCover`: Image asset representing the physical book's front cover.
3. `backCover`: Image asset representing the physical book's back cover with ISBN barcode and publisher blurbs.
4. `content.pdfUrl`: The authoritative PDF file containing the multi-page curriculum text, exercises, and illustrations.

## TypeScript Interface Definition
```typescript
export interface BookAssets {
  poster: string;
  frontCover: string;
  backCover: string;
}

export interface BookContent {
  type: 'pdf';
  pdfUrl: string;
  pageCount?: number;
}

export interface BookMetadata {
  publicationYear?: number;
  isbn?: string;
  tags?: string[];
  price?: number;
  currency?: LocalizedString;
  rating?: number;
}

export interface Book {
  id: string;
  title: LocalizedString;
  subtitle?: LocalizedString;
  description?: LocalizedString;
  educationLevelId: string;
  subject: LocalizedString;
  author: LocalizedString;
  publisher?: LocalizedString;
  language?: 'ar' | 'fr' | 'en';
  assets: BookAssets;
  content: BookContent;
  metadata?: BookMetadata;
  coverStyle: BookCoverStyle;
  dimensions: BookDimensions;
}
```
