import { Book } from '../types/book';

export interface BookUploadPayload {
  title: string;
  subtitle?: string;
  description: string;
  educationLevelId: string;
  subject: string;
  author: string;
  publisher?: string;
  language: 'ar' | 'fr' | 'en';
  posterFile: File | null;
  frontCoverFile: File | null;
  backCoverFile: File | null;
  pdfFile: File | null;
  metadata?: {
    publicationYear?: number;
    isbn?: string;
    tags?: string[];
  };
}

export interface UploadResult {
  success: boolean;
  book?: Book;
  error?: string;
  isMockStorage: boolean;
}

class BookUploadService {
  public validatePayload(payload: BookUploadPayload): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!payload.title || payload.title.trim().length === 0) {
      errors.push('Book title is required.');
    }
    if (!payload.educationLevelId) {
      errors.push('Education level must be selected.');
    }
    if (!payload.subject || payload.subject.trim().length === 0) {
      errors.push('Subject is required.');
    }
    if (!payload.author || payload.author.trim().length === 0) {
      errors.push('Author is required.');
    }

    if (!payload.pdfFile) {
      errors.push('A valid PDF content file is required.');
    } else if (
      !payload.pdfFile.name.toLowerCase().endsWith('.pdf') &&
      payload.pdfFile.type !== 'application/pdf'
    ) {
      errors.push('PDF content must be a valid .pdf file.');
    }

    if (payload.posterFile && !payload.posterFile.type.startsWith('image/')) {
      errors.push('Poster file must be a supported image format.');
    }
    if (payload.frontCoverFile && !payload.frontCoverFile.type.startsWith('image/')) {
      errors.push('Front cover must be a supported image format.');
    }
    if (payload.backCoverFile && !payload.backCoverFile.type.startsWith('image/')) {
      errors.push('Back cover must be a supported image format.');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  public async uploadBook(payload: BookUploadPayload): Promise<UploadResult> {
    const validation = this.validatePayload(payload);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.errors.join(' '),
        isMockStorage: true
      };
    }

    const pdfUrl = payload.pdfFile ? URL.createObjectURL(payload.pdfFile) : '/sample-books/general-curriculum.pdf';
    const posterUrl = payload.posterFile
      ? URL.createObjectURL(payload.posterFile)
      : '/covers/book-default-poster.svg';
    const frontCoverUrl = payload.frontCoverFile
      ? URL.createObjectURL(payload.frontCoverFile)
      : '/covers/book-default-front.svg';
    const backCoverUrl = payload.backCoverFile
      ? URL.createObjectURL(payload.backCoverFile)
      : '/covers/book-default-back.svg';

    const newBook: Book = {
      id: `uploaded-${Date.now()}`,
      title: {
        ar: payload.title,
        fr: payload.title,
        en: payload.title
      },
      subtitle: payload.subtitle
        ? { ar: payload.subtitle, fr: payload.subtitle, en: payload.subtitle }
        : undefined,
      description: {
        ar: payload.description,
        fr: payload.description,
        en: payload.description
      },
      synopsis: {
        ar: payload.description,
        fr: payload.description,
        en: payload.description
      },
      educationLevelId: payload.educationLevelId,
      subject: {
        ar: payload.subject,
        fr: payload.subject,
        en: payload.subject
      },
      author: {
        ar: payload.author,
        fr: payload.author,
        en: payload.author
      },
      publisher: payload.publisher
        ? { ar: payload.publisher, fr: payload.publisher, en: payload.publisher }
        : undefined,
      language: payload.language,
      assets: {
        poster: posterUrl,
        frontCover: frontCoverUrl,
        backCover: backCoverUrl
      },
      content: {
        type: 'pdf',
        pdfUrl: pdfUrl,
        pageCount: 4
      },
      metadata: {
        publicationYear: payload.metadata?.publicationYear || new Date().getFullYear(),
        isbn: payload.metadata?.isbn || `978-9954-${Math.floor(1000 + Math.random() * 9000)}-0`,
        tags: payload.metadata?.tags || ['uploaded', 'curriculum']
      },
      coverStyle: {
        primaryColor: '#c99a62',
        secondaryColor: '#a8794d',
        spineColor: '#806044',
        accentColor: '#ffe0a3',
        pattern: 'modern',
        textColor: '#ffffff'
      },
      dimensions: {
        width: 1.4,
        height: 1.9,
        depth: 0.32
      },
      isbn: payload.metadata?.isbn || '978-9954-0-0000-0',
      publishYear: payload.metadata?.publicationYear || 2024,
      price: 35.0,
      currency: { ar: 'د.م', fr: 'MAD', en: 'USD' },
      rating: 5.0,
      pagesCount: 120
    };

    return {
      success: true,
      book: newBook,
      isMockStorage: true
    };
  }
}

export const bookUploadService = new BookUploadService();
