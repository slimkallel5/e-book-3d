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

  // Filter books belonging to the selected education level
  const books = useMemo(() => {
    return BOOKS_DATA.filter((b) => b.educationLevelId === activeLevelId);
  }, [activeLevelId]);

  const bookCount = books.length;

  // Responsive device classification & positioning
  const isMobile = viewport.aspect < 0.75;
  const isTablet = viewport.aspect >= 0.75 && viewport.aspect < 1.35;

  // Carousel world origin:
  // Positioned in the available 67% reading hall area to the right of the bookshelf
  // (Bookshelf is on left X ~ -6.8). Carousel center is at X ~ 2.2, Y ~ 0.2, Z ~ 8.0 to 9.5
  // keeping the bookshelf visible on the left side behind it!
  const carouselPosition = useMemo<[number, number, number]>(() => {
    if (isMobile) return [0, 0.1, 14.0];
    if (isTablet) return [1.4, 0.1, 10.5];
    return [2.2, 0.15, 9.2];
  }, [isMobile, isTablet]);

  // Ellipse radii tailored to book count and responsive space
  const radiusX = useMemo(() => {
    if (isMobile) return 2.6;
    if (isTablet) return 3.4;
    return Math.max(3.2, Math.min(4.4, 2.6 + bookCount * 0.22));
  }, [isMobile, isTablet, bookCount]);

  const radiusZ = useMemo(() => {
    if (isMobile) return 1.6;
    if (isTablet) return 2.1;
    return 2.4;
  }, [isMobile, isTablet]);

  // Drag interaction state
  const rotationAngleRef = useRef(0);
  const targetRotationRef = useRef(0);
  const isDraggingRef = useRef(false);
  const startPointerXRef = useRef(0);
  const lastDeltaXRef = useRef(0);

  // Calculate angle step per book
  const stepAngle = useMemo(() => {
    return bookCount > 0 ? (Math.PI * 2) / bookCount : 0;
  }, [bookCount]);

  // Sync target rotation whenever carouselActiveIndex changes externally
  useEffect(() => {
    if (bookCount > 0) {
      // In our coordinate system, card index 0 is at theta = 0 (Math.sin(0)=0, Math.cos(0)=1 = front)
      // To bring index i to front, carousel rotation should be -i * stepAngle
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

  // Animation frame loop for smooth rotation and entrance/exit scaling
  useFrame(() => {
    if (!groupRef.current) return;

    // Smooth rotation lerp with damping
    rotationAngleRef.current = THREE.MathUtils.lerp(
      rotationAngleRef.current,
      targetRotationRef.current,
      0.12
    );

    // Visibility & Entrance/Exit scale animation
    // When carousel is open and no book is currently selected for inspection, show carousel
    const shouldBeVisible = isCarouselOpen && !selectedBookId && bookCount > 0;
    const targetScale = shouldBeVisible ? 1.0 : 0.001;

    groupRef.current.scale.x = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.14);
    groupRef.current.scale.y = THREE.MathUtils.lerp(groupRef.current.scale.y, targetScale, 0.14);
    groupRef.current.scale.z = THREE.MathUtils.lerp(groupRef.current.scale.z, targetScale, 0.14);

    groupRef.current.visible = groupRef.current.scale.x > 0.02;
  });

  if (bookCount === 0) return null;

  return (
    <group ref={groupRef} position={carouselPosition} scale={[0, 0, 0]} visible={false}>
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
