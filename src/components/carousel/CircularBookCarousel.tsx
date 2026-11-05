import React, { useRef, useMemo, useEffect, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Book } from '../../types/book';
import { useLibraryStore } from '../../store/useLibraryStore';
import { BOOKS_DATA } from '../../data/books';
import { BookCarouselCard } from './BookCarouselCard';

/**
 * CircularBookCarousel
 * 3D Circular/Orbit carousel displaying all books of the active education level.
 * Positioned in the available center/right 67% area in front of the library reading hall.
 * Keeps the bookshelf visible on the left behind it.
 * Supports:
 * - Mouse drag & touch swipe rotation
 * - Smooth snapping to cards
 * - Next/Previous rotation steps
 * - Selecting a card without zooming the library camera
 * - Reusable across education levels with dynamic count adaptation
 */
export const CircularBookCarousel: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport, gl } = useThree();

  const isCarouselOpen = useLibraryStore((s) => s.isCarouselOpen);
  const activeLevelId = useLibraryStore((s) => s.activeLevelId);
  const selectedBookId = useLibraryStore((s) => s.selectedBookId);
  const selectBook = useLibraryStore((s) => s.selectBook);
  const carouselActiveIndex = useLibraryStore((s) => s.carouselActiveIndex);
  const setCarouselActiveIndex = useLibraryStore((s) => s.setCarouselActiveIndex);

  // Filter books: if 'all', pick representative books across all levels or all books
  const books = useMemo(() => {
    if (activeLevelId === 'all') {
      return BOOKS_DATA;
    }
    return BOOKS_DATA.filter((b) => b.educationLevelId === activeLevelId);
  }, [activeLevelId]);

  const bookCount = books.length;

  // Responsive device classification & positioning
  const isMobile = viewport.aspect < 0.75;
  const isTablet = viewport.aspect >= 0.75 && viewport.aspect < 1.35;

  // Carousel world origin:
  // Positioned safely in the reading hall area cleanly to the right of the bookshelf.
  // Bookshelf right edge reaches ~ -3.2 in world X.
  // Carousel center is at X ~ 3.0, Y ~ 0.15, Z ~ 9.0 so even leftmost radius point (3.0 - 2.5 = 0.5)
  // is well clear of the bookshelf by over 3.7 meters!
  const carouselPosition = useMemo<[number, number, number]>(() => {
    if (isMobile) return [0, 0.1, 14.0];
    if (isTablet) return [2.0, 0.1, 10.5];
    return [3.0, 0.15, 9.0];
  }, [isMobile, isTablet]);

  // Compact radii so the 3d list does not intersect with the bookshelf or room edges
  const radiusX = useMemo(() => {
    if (isMobile) return 2.1;
    if (isTablet) return 2.4;
    return Math.max(2.1, Math.min(2.7, 1.9 + Math.min(bookCount, 12) * 0.07));
  }, [isMobile, isTablet, bookCount]);

  const radiusZ = useMemo(() => {
    if (isMobile) return 1.3;
    if (isTablet) return 1.5;
    return 1.65;
  }, [isMobile, isTablet]);

  // Drag and auto-animation interaction state
  const rotationAngleRef = useRef(0);
  const targetRotationRef = useRef(0);
  const isDraggingRef = useRef(false);
  const startPointerXRef = useRef(0);
  const lastDeltaXRef = useRef(0);
  const isHoveredRef = useRef(false);

  // Calculate angle step per book
  const stepAngle = useMemo(() => {
    return bookCount > 0 ? (Math.PI * 2) / bookCount : 0;
  }, [bookCount]);

  // Keep target rotation in sync when carouselActiveIndex changes externally
  useEffect(() => {
    if (bookCount > 0 && !isDraggingRef.current) {
      targetRotationRef.current = -carouselActiveIndex * stepAngle;
    }
  }, [carouselActiveIndex, stepAngle, bookCount]);

  // Setup pointer drag listeners on canvas
  useEffect(() => {
    const canvas = gl.domElement;

    const handlePointerDown = (e: PointerEvent) => {
      // Don't drag if inspecting book or clicking UI
      if (selectedBookId || !isCarouselOpen) return;
      isDraggingRef.current = true;
      startPointerXRef.current = e.clientX;
      lastDeltaXRef.current = 0;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - startPointerXRef.current;
      lastDeltaXRef.current = deltaX;
      startPointerXRef.current = e.clientX;

      // Rotate carousel in response to drag
      // Drag left rotates clockwise, drag right rotates counter-clockwise
      const sensitivity = 0.0055;
      targetRotationRef.current += deltaX * sensitivity;
    };

    const handlePointerUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;

      // Natural snapping to nearest card
      if (stepAngle > 0) {
        const nearestIndexFloat = -targetRotationRef.current / stepAngle;
        const nearestIndex = Math.round(nearestIndexFloat);
        targetRotationRef.current = -nearestIndex * stepAngle;

        // Wrap index into [0, bookCount - 1]
        const normalizedIndex = ((nearestIndex % bookCount) + bookCount) % bookCount;
        setCarouselActiveIndex(normalizedIndex);
      }
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [gl, selectedBookId, isCarouselOpen, stepAngle, bookCount, setCarouselActiveIndex]);

  // Handle clicking a card
  const handleCardSelect = useCallback(
    (book: Book) => {
      const idx = books.findIndex((b) => b.id === book.id);
      if (idx !== -1) {
        // Center the selected card
        setCarouselActiveIndex(idx);
        targetRotationRef.current = -idx * stepAngle;
      }
      // Clicking a card selects that book for 360 inspection (without zooming camera)
      selectBook(book.id);
    },
    [books, setCarouselActiveIndex, stepAngle, selectBook]
  );

  // Animation frame loop for smooth rotation, continuous circular animation, and entrance/exit scaling
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Continuous circular movement animation:
    // By default, rotate smoothly around orbit when user is not actively dragging or hovering
    if (!isDraggingRef.current && !isHoveredRef.current && !selectedBookId && isCarouselOpen && bookCount > 0) {
      // Rotate slowly in circular movement (~0.18 rad/s)
      const autoSpeed = 0.16;
      targetRotationRef.current -= delta * autoSpeed;
      // Keep track of approximate front card index
      if (stepAngle > 0) {
        const approxIdx = Math.round(-targetRotationRef.current / stepAngle);
        const normIdx = ((approxIdx % bookCount) + bookCount) % bookCount;
        if (normIdx !== carouselActiveIndex) {
          setCarouselActiveIndex(normIdx);
        }
      }
    }

    // Smooth rotation lerp with damping
    rotationAngleRef.current = THREE.MathUtils.lerp(
      rotationAngleRef.current,
      targetRotationRef.current,
      0.10
    );

    // Visibility & Entrance/Exit scale animation
    const shouldBeVisible = isCarouselOpen && !selectedBookId && bookCount > 0;
    const targetScale = shouldBeVisible ? 1.0 : 0.001;

    groupRef.current.scale.x = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.14);
    groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, targetScale, 0.14);
    groupRef.current.scale.z = THREE.MathUtils.lerp(groupRef.current.scale.z, targetScale, 0.14);

    groupRef.current.visible = groupRef.current.scale.x > 0.02;
  });

  if (bookCount === 0) return null;

  return (
    <group
      ref={groupRef}
      position={carouselPosition}
      scale={[0, 0, 0]}
      visible={false}
      onPointerEnter={() => {
        isHoveredRef.current = true;
      }}
      onPointerLeave={() => {
        isHoveredRef.current = false;
      }}
    >
      {/* Subtle floor shadow / halo ring underneath the carousel */}
      <mesh position={[0, -1.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radiusX * 0.65, radiusX * 1.15, 36]} />
        <meshBasicMaterial color="#e5b364" transparent opacity={0.06} />
      </mesh>

      {/* Center atmospheric warm light */}
      <pointLight position={[0, 1.2, 0.5]} intensity={1.5} distance={6} color="#fbbf24" />

      {/* Render 3D Cards along the circular orbit */}
      {books.map((book, idx) => {
        const angle = idx * stepAngle;
        const isFront = idx === carouselActiveIndex;

        return (
          <BookCarouselCard
            key={book.id}
            book={book}
            angle={angle}
            radiusX={radiusX}
            radiusZ={radiusZ}
            carouselRotation={rotationAngleRef.current}
            isFrontCard={isFront}
            onSelect={handleCardSelect}
          />
        );
      })}
    </group>
  );
};
