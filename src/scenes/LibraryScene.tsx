import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useLibraryStore } from '../store/useLibraryStore';
import { LibraryEnvironment } from '../components/library/LibraryEnvironment';
import { Bookshelf } from '../components/bookshelf/Bookshelf';
import { Book3D } from '../components/book/Book3D';
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
  const activeLevelId = useLibraryStore((s) => s.activeLevelId);
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

  // Smooth, stable, fixed camera transitions strictly based on application state
  // Absolutely NO mouse movement, no parallax, and no OrbitControls dragging
  useFrame(() => {
    if (!cameraRef.current) return;

    // In the dedicated 33% viewport container:
    // With bookshelf rotated around Y by ~0.38 rad, placing camera slightly to the right of bookshelf center
    // and looking at the bookshelf center captures the front facade turned toward the right (center of web page)
    // while looking directly into the shelves to read books, titles, and nameplates clearly!
    let targetPos = new THREE.Vector3(
      isMobile ? 0.3 : isTablet ? 0.6 : 0.85,
      -0.05,
      isMobile ? 22.0 : isTablet ? 19.5 : 18.2
    );
    let targetLook = new THREE.Vector3(
      isMobile ? 0 : isTablet ? 0.1 : 0.15,
      -0.15,
      0
    );

    if (viewMode === 'shelf') {
      const level = EDUCATION_LEVELS.find((l) => l.id === activeLevelId);
      const shelfIndex = level ? level.shelfIndex : 0;
      const shelfY = getShelfY(shelfIndex);

      const shelfCamZ = isMobile ? 12.0 : isTablet ? 10.5 : 9.8;
      targetPos = new THREE.Vector3(
        isMobile ? 0.2 : 0.6,
        shelfY + 0.2,
        shelfCamZ
      );
      targetLook = new THREE.Vector3(
        isMobile ? 0 : 0.15,
        shelfY + 0.1,
        shelfTransform.position[2]
      );
    } else if (viewMode === 'book-detail' || viewMode === 'book-open') {
      // Camera centers clearly onto the inspected book
      targetPos = new THREE.Vector3(0, -0.05, 4.2);
      targetLook = new THREE.Vector3(0, -0.05, 0.5);
    }

    // Smooth exponential damping interpolation to stable target
    cameraRef.current.position.lerp(targetPos, 0.08);
    cameraRef.current.lookAt(targetLook);
  });

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0.85, -0.05, 18.2]}
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
