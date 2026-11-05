import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useLibraryStore } from '../store/useLibraryStore';
import { LibraryEnvironment } from '../components/library/LibraryEnvironment';
import { Bookshelf } from '../components/bookshelf/Bookshelf';
import { Book3D } from '../components/book/Book3D';
import { BookHoverPreview } from '../components/book/BookHoverPreview';
import { CircularBookCarousel } from '../components/carousel/CircularBookCarousel';
import { EDUCATION_LEVELS } from '../data/educationLevels';
import { BOOKS_DATA } from '../data/books';
import {
  BOOKSHELF_CONFIG,
  calculateRowBooksLayout,
  getBookWorldPosition,
  getShelfY
} from '../components/bookshelf/bookshelfConfig';

export const LibraryScene: React.FC = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const { viewport } = useThree();

  const viewMode = useLibraryStore((s) => s.viewMode);
  const selectedBookId = useLibraryStore((s) => s.selectedBookId);

  const selectedBook = BOOKS_DATA.find((b) => b.id === selectedBookId);

  // Responsive device classification
  // In Three.js Canvas with fov 48 and z ~ 16, viewport.width is ~14 on aspect 16/9, but on mobile portrait (390x844) viewport.aspect is ~0.46
  const isMobile = viewport.aspect < 0.75;
  const isTablet = viewport.aspect >= 0.75 && viewport.aspect < 1.35;

  // Transform configuration for bookshelf
  const shelfTransform = isMobile
    ? BOOKSHELF_CONFIG.transform.mobile
    : isTablet
    ? BOOKSHELF_CONFIG.transform.tablet
    : BOOKSHELF_CONFIG.transform.desktop;

  // Compute shelf origin world position for the selected book takeoff
  const shelfPosition = React.useMemo<[number, number, number]>(() => {
    if (!selectedBook) return [0, 0, 0];
    const level = EDUCATION_LEVELS.find((l) => l.id === selectedBook.educationLevelId);
    const shelfIndex = level ? level.shelfIndex : 0;
    const levelBooks = BOOKS_DATA.filter((b) => b.educationLevelId === selectedBook.educationLevelId);

    const layout = calculateRowBooksLayout(levelBooks, shelfIndex);
    const bookLayout = layout.find((item) => item.book.id === selectedBook.id);

    if (bookLayout) {
      return getBookWorldPosition(
        bookLayout.localPos,
        shelfTransform.position,
        shelfTransform.rotationY
      );
    }

    // Fallback if not found
    return [shelfTransform.position[0], getShelfY(shelfIndex), shelfTransform.position[2]];
  }, [selectedBook, shelfTransform]);

  // Camera is strictly and completely fixed at the normal overview framing.
  // Requirement: Selecting a shelf, selecting an education level, or selecting a book MUST NOT ZOOM.
  // The library camera maintains exactly the same position, perspective, scale and framing throughout.
  useFrame(() => {
    if (!cameraRef.current) return;

    // Fixed overview positioning:
    // Bookshelf is anchored within the left 33% of the viewport,
    // and the remaining 67% provides the library reading hall & 3D carousel presentation area.
    const targetPos = new THREE.Vector3(
      isMobile ? 0 : isTablet ? 0.6 : 0.5,
      0.6,
      isMobile ? 24.0 : isTablet ? 18.5 : 16.5
    );
    const targetLook = new THREE.Vector3(
      isMobile ? 0 : isTablet ? -1.0 : 0.8,
      0.2,
      0
    );

    // Keep camera fixed without zoom or dolly
    cameraRef.current.position.lerp(targetPos, 0.08);
    cameraRef.current.lookAt(targetLook);
  });

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0.5, 0.6, 16.5]}
        fov={46}
        near={0.1}
        far={120}
      />

      {/* Realistic Library Architectural Environment & Lighting */}
      <LibraryEnvironment />

      {/* Real 3D Wooden Bookshelf, Anchored to Left with 3D Perspective */}
      <Bookshelf
        position={shelfTransform.position}
        rotation={[0, shelfTransform.rotationY, 0]}
      />

      {/* Book Hover Preview Poster Card */}
      <BookHoverPreview />

      {/* 3D Circular Orbit Carousel in Center/Right 67% Area */}
      <CircularBookCarousel />

      {/* Selected 3D Book instance transitioning to center */}
      {selectedBook && (
        <>
          {/* Spotlight focused on inspected book in center */}
          <spotLight
            position={[0, 4, 4.5]}
            target-position={[0, 0.4, 2.3]}
            intensity={viewMode === 'book-detail' || viewMode === 'book-open' ? 2.5 : 0}
            angle={0.65}
            penumbra={0.7}
            castShadow
            color="#fffbeb"
          />
          <Book3D book={selectedBook} shelfPosition={shelfPosition} />
        </>
      )}
    </>
  );
};
