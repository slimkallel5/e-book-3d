import { create } from 'zustand';
import { Language } from '../types/education';
import { Book } from '../types/book';
import { EDUCATION_LEVELS } from '../data/educationLevels';
import { BOOKS_DATA } from '../data/books';

export interface BasketItem {
  book: Book;
  quantity: number;
}

export type ViewMode = 'overview' | 'shelf' | 'book-detail' | 'book-open';

interface LibraryState {
  // Localization
  language: Language;
  setLanguage: (lang: Language) => void;

  // View & Scene State
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Active Education Level / Shelf
  activeLevelId: string;
  setActiveLevelId: (id: string) => void;

  // Selected Book
  selectedBookId: string | null;
  selectBook: (bookId: string | null) => void;
  isBookOpen: boolean;
  setIsBookOpen: (open: boolean) => void;
  currentBookPage: number;
  setCurrentBookPage: (page: number) => void;

  // Search Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Simulated Basket
  basket: BasketItem[];
  addToBasket: (book: Book) => void;
  removeFromBasket: (bookId: string) => void;
  updateQuantity: (bookId: string, delta: number) => void;
  clearBasket: () => void;
  isBasketOpen: boolean;
  setIsBasketOpen: (open: boolean) => void;

  // Reset to initial library view
  resetView: () => void;
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  language: 'ar',
  setLanguage: (lang) => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    set({ language: lang });
  },

  viewMode: 'overview',
  setViewMode: (mode) => set({ viewMode: mode }),

  activeLevelId: EDUCATION_LEVELS[0].id,
  setActiveLevelId: (id) => {
    const state = get();
    // If selecting the currently active level, focus to shelf view; else update active level
    if (state.activeLevelId === id && state.viewMode === 'shelf') {
      set({ viewMode: 'overview' });
    } else {
      set({ activeLevelId: id, viewMode: 'shelf' });
    }
  },

  selectedBookId: null,
  selectBook: (bookId) => {
    if (!bookId) {
      set({
        selectedBookId: null,
        isBookOpen: false,
        currentBookPage: 0,
        viewMode: get().activeLevelId ? 'shelf' : 'overview'
      });
      return;
    }
    const book = BOOKS_DATA.find((b) => b.id === bookId);
    if (book) {
      set({
        selectedBookId: bookId,
        activeLevelId: book.educationLevelId,
        isBookOpen: false,
        currentBookPage: 0,
        viewMode: 'book-detail'
      });
    }
  },

  isBookOpen: false,
  setIsBookOpen: (open) => {
    set({
      isBookOpen: open,
      viewMode: open ? 'book-open' : 'book-detail'
    });
  },

  currentBookPage: 0,
  setCurrentBookPage: (page) => set({ currentBookPage: page }),

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  basket: [],
  addToBasket: (book) => {
    set((state) => {
      const existing = state.basket.find((item) => item.book.id === book.id);
      if (existing) {
        return {
          basket: state.basket.map((item) =>
            item.book.id === book.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        basket: [...state.basket, { book, quantity: 1 }]
      };
    });
  },

  removeFromBasket: (bookId) => {
    set((state) => ({
      basket: state.basket.filter((item) => item.book.id !== bookId)
    }));
  },

  updateQuantity: (bookId, delta) => {
    set((state) => {
      const updated = state.basket
        .map((item) => {
          if (item.book.id === bookId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as BasketItem[];
      return { basket: updated };
    });
  },

  clearBasket: () => set({ basket: [] }),

  isBasketOpen: false,
  setIsBasketOpen: (open) => set({ isBasketOpen: open }),

  resetView: () =>
    set({
      viewMode: 'overview',
      selectedBookId: null,
      isBookOpen: false,
      currentBookPage: 0,
      searchQuery: ''
    })
}));
