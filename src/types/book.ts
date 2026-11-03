import { LocalizedString } from './education';

export interface BookPage {
  pageNumber: number;
  title?: LocalizedString;
  content: LocalizedString;
  imagePlaceholder?: string;
  diagramTitle?: LocalizedString;
  summaryPoints?: LocalizedString[];
}

export interface BookCoverStyle {
  primaryColor: string;
  secondaryColor: string;
  spineColor: string;
  accentColor: string;
  pattern: 'geometric' | 'academic' | 'classic' | 'modern' | 'science';
  textColor: string;
}

export interface Book {
  id: string;
  educationLevelId: string;
  title: LocalizedString;
  subtitle?: LocalizedString;
  author: LocalizedString;
  subject: LocalizedString;
  isbn: string;
  publishYear: number;
  price: number;
  currency: LocalizedString;
  rating: number;
  pagesCount: number;
  coverStyle: BookCoverStyle;
  dimensions: {
    width: number; // e.g. 1.5 units
    height: number; // e.g. 2.1 units
    depth: number; // e.g. 0.3 units (thickness)
  };
  synopsis: LocalizedString;
  samplePages: BookPage[];
}
