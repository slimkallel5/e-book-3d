import { LocalizedString } from './education';

export interface BookCoverStyle {
  primaryColor: string;
  secondaryColor: string;
  spineColor: string;
  accentColor: string;
  pattern: 'geometric' | 'academic' | 'classic' | 'modern' | 'science';
  textColor: string;
}

export interface BookAssets {
  /** Image asset used in library bookshelf and book discovery carousel / cards */
  poster: string;
  /** High-fidelity image asset representing the physical front cover */
  frontCover: string;
  /** Image asset representing the physical back cover */
  backCover: string;
}

export interface BookContent {
  type: 'pdf';
  /** Path or URL to the authoritative PDF file containing all book pages */
  pdfUrl: string;
  /** Number of pages contained in the PDF if known ahead of time */
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

export interface BookDimensions {
  width: number; // e.g. 1.4 - 1.5 Three.js units
  height: number; // e.g. 1.9 - 2.1 Three.js units
  depth: number; // e.g. 0.28 - 0.50 Three.js units (thickness)
}

/**
 * Standard extensible educational Book data model.
 * The PDF is the single authoritative source of truth for the book's content,
 * while poster, frontCover and backCover are independent image assets.
 */
export interface Book {
  id: string;

  /** Localized book title */
  title: LocalizedString;
  /** Localized subtitle or tagline */
  subtitle?: LocalizedString;
  /** Localized synopsis or pedagogical overview */
  description?: LocalizedString;
  /** Backwards compatibility alias for description */
  synopsis: LocalizedString;

  educationLevelId: string;
  subject: LocalizedString;

  author: LocalizedString;
  publisher?: LocalizedString;
  language?: 'ar' | 'fr' | 'en';

  /** Independent image assets */
  assets: BookAssets;

  /** Authoritative PDF content */
  content: BookContent;

  /** Additional book metadata */
  metadata?: BookMetadata;

  /** 3D physical styling & dimensions for Three.js rendering */
  coverStyle: BookCoverStyle;
  dimensions: BookDimensions;

  // Backwards compatibility convenience properties
  isbn: string;
  publishYear: number;
  price: number;
  currency: LocalizedString;
  rating: number;
  pagesCount: number;
  samplePages?: any[];
}
