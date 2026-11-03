import { Book } from '../../types/book';

/**
 * Reusable, data-driven bookshelf layout configuration.
 * All dimensions are in Three.js world units (meters).
 */
export const BOOKSHELF_CONFIG = {
  // Overall bookshelf furniture dimensions
  shelfWidth: 13.8, // Inner width available between side uprights
  totalWidth: 14.6, // Outer total width including side panels
  shelfDepth: 2.2, // Depth of horizontal shelf planks
  shelfThickness: 0.22, // Thickness of each shelf plank
  shelfSpacing: 1.48, // Center-to-center vertical distance between shelf planks
  startY: 4.15, // Y position of top-most shelf (shelfIndex = 0)
  totalShelves: 7, // 7 education levels (1AP to Secondary)

  // Architectural panels & moldings
  sidePanelThickness: 0.42,
  sidePanelDepth: 2.45,
  sidePanelHeight: 11.2,
  backPanelThickness: 0.12,
  backPanelDepthOffset: -1.05, // Z position of backboard front face
  basePlinthHeight: 1.35,
  basePlinthDepth: 2.65,
  crownHeight: 0.95,
  crownDepth: 2.75,

  // Book placement & dimensions
  bookScale: 0.62, // Proportional scale for bookshelf books
  defaultBookHeight: 1.85,
  defaultBookWidth: 1.35,
  defaultBookDepth: 0.30,
  shelfMarginX: 0.75, // Margin from side pillars
  nameplateWidth: 4.0, // Center brass plaque width on shelf front edge
  bookZOffset: 0.15, // Forward offset for books relative to shelf center, away from backboard

  // Bookshelf World Transform (Left anchor with subtle 3D perspective angle)
  transform: {
    // Left-anchored position in 3D world:
    // Placed at X = -3.6 so that with camera looking towards (0, 0, 0) or (-0.5, 0, 0),
    // the bookshelf is prominently framed on the left half of the viewport.
    desktop: {
      position: [-3.6, 0.1, -0.6] as [number, number, number],
      rotationY: 0.26, // ~15 degrees, reveals outer and inner side panels & depth
    },
    tablet: {
      position: [-2.0, 0.1, -0.4] as [number, number, number],
      rotationY: 0.18,
    },
    mobile: {
      position: [0, -0.1, 0] as [number, number, number],
      rotationY: 0.08,
    }
  }
};

/**
 * Calculate the Y position for a given shelf index.
 */
export function getShelfY(shelfIndex: number): number {
  return BOOKSHELF_CONFIG.startY - shelfIndex * BOOKSHELF_CONFIG.shelfSpacing;
}

/**
 * Calculate book layout on a specific shelf row.
 * Returns positions relative to the bookshelf origin.
 */
export function calculateRowBooksLayout(books: Book[], shelfIndex: number) {
  const shelfY = getShelfY(shelfIndex);
  const plankTopY = shelfY + BOOKSHELF_CONFIG.shelfThickness / 2;
  const count = books.length;

  if (count === 0) return [];

  // Usable width on each side of the central brass plaque
  const halfNameplate = BOOKSHELF_CONFIG.nameplateWidth / 2 + 0.35; // safe buffer around nameplate
  const maxAvailableX = (BOOKSHELF_CONFIG.shelfWidth / 2) - BOOKSHELF_CONFIG.shelfMarginX;

  return books.map((book, idx) => {
    const scale = BOOKSHELF_CONFIG.bookScale;
    const bHeight = (book.dimensions?.height || BOOKSHELF_CONFIG.defaultBookHeight) * scale;
    const bDepth = (book.dimensions?.depth || BOOKSHELF_CONFIG.defaultBookDepth) * scale;
    const bWidth = (book.dimensions?.width || BOOKSHELF_CONFIG.defaultBookWidth) * scale;

    let bookX = 0;
    if (count === 1) {
      bookX = halfNameplate + 1.2;
    } else if (count === 2) {
      bookX = idx === 0 ? -(halfNameplate + 1.5) : (halfNameplate + 1.5);
    } else if (count === 3) {
      if (idx === 0) {
        bookX = -(halfNameplate + 1.5);
      } else if (idx === 1) {
        bookX = halfNameplate + 0.9;
      } else {
        bookX = halfNameplate + 2.35;
      }
    } else {
      const leftCount = Math.ceil(count / 2);
      const isLeft = idx < leftCount;
      const sideIndex = isLeft ? idx : idx - leftCount;
      const sideTotal = isLeft ? leftCount : (count - leftCount);

      const sideSpan = maxAvailableX - halfNameplate;
      const step = sideTotal > 1 ? sideSpan / (sideTotal + 0.2) : sideSpan * 0.5;
      const offset = halfNameplate + 0.6 + sideIndex * step;
      bookX = isLeft ? -offset : offset;
    }

    // Books rest directly on top of the shelf plank
    const bookY = plankTopY;
    // Position books with their back safely away from the back panel and spines facing forward
    const bookZ = BOOKSHELF_CONFIG.bookZOffset;

    return {
      book,
      localPos: [bookX, bookY, bookZ] as [number, number, number],
      dimensions: {
        height: bHeight,
        depth: bDepth,
        width: bWidth,
        scale
      }
    };
  });
}

/**
 * Convert local bookshelf book position to world position taking the bookshelf's
 * position and Y-rotation into account.
 */
export function getBookWorldPosition(
  localPos: [number, number, number],
  bookshelfPos: [number, number, number] = BOOKSHELF_CONFIG.transform.desktop.position,
  rotationY: number = BOOKSHELF_CONFIG.transform.desktop.rotationY
): [number, number, number] {
  const [lx, ly, lz] = localPos;
  const [bx, by, bz] = bookshelfPos;

  // Rotate local vector [lx, 0, lz] around Y
  const cos = Math.cos(rotationY);
  const sin = Math.sin(rotationY);

  const worldX = bx + (lx * cos + lz * sin);
  const worldY = by + ly;
  const worldZ = bz + (-lx * sin + lz * cos);

  return [worldX, worldY, worldZ];
}
