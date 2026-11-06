import React, { useState } from 'react';
import { Text } from '@react-three/drei';
import { EducationLevel } from '../../types/education';
import { Book } from '../../types/book';
import { BookshelfBookItem } from './BookshelfBookItem';
import { useLibraryStore } from '../../store/useLibraryStore';
import {
  BOOKSHELF_CONFIG,
  getShelfY,
  calculateRowBooksLayout
} from './bookshelfConfig';

interface BookshelfRowProps {
  level: EducationLevel;
  books: Book[];
  shelfIndex: number;
  rowWidth?: number;
}

export const BookshelfRow: React.FC<BookshelfRowProps> = React.memo(({
  level,
  books,
  shelfIndex,
  rowWidth = BOOKSHELF_CONFIG.shelfWidth
}) => {
  const activeLevelId = useLibraryStore((s) => s.activeLevelId);
  const setActiveLevelId = useLibraryStore((s) => s.setActiveLevelId);
  const isCarouselOpen = useLibraryStore((s) => s.isCarouselOpen);
  const selectedBookId = useLibraryStore((s) => s.selectedBookId);
  const language = useLibraryStore((s) => s.language);
  const [rowHovered, setRowHovered] = useState(false);

  const isActive = activeLevelId === level.id && isCarouselOpen;
  const cfg = BOOKSHELF_CONFIG;
  const yPosition = getShelfY(shelfIndex);
  const plankThickness = cfg.shelfThickness;
  const plankDepth = cfg.shelfDepth;

  // Compute dynamic book placements with guaranteed vertical clearance and horizontal spacing
  const rowBookItems = React.useMemo(() => {
    return calculateRowBooksLayout(books, shelfIndex);
  }, [books, shelfIndex]);

  return (
    <group position={[0, yPosition, 0]}>
      {/* 1. HORIZONTAL WOODEN SHELF PLANK */}
      <mesh
        castShadow
        receiveShadow
        position={[0, 0, 0]}
        userData={{ testId: `shelf-plank-${level.id}` }}
        onClick={(e) => {
          e.stopPropagation();
          setActiveLevelId(level.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setRowHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setRowHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <boxGeometry args={[rowWidth, plankThickness, plankDepth]} />
        <meshStandardMaterial
          color={isActive ? '#55341c' : rowHovered ? '#422815' : '#2b190d'}
          roughness={0.6}
          metalness={0.12}
        />
      </mesh>

      {/* 2. REALISTIC FRONT SHELF BULLNOSE MOLDING STRIP */}
      {/* Upper beveled front lip */}
      <mesh position={[0, 0, plankDepth / 2 + 0.025]} receiveShadow castShadow>
        <boxGeometry args={[rowWidth + 0.05, plankThickness * 1.25, 0.05]} />
        <meshStandardMaterial
          color={isActive ? '#d99742' : rowHovered ? '#9e6727' : '#523118'}
          metalness={isActive ? 0.45 : 0.25}
          roughness={0.4}
        />
      </mesh>
      {/* Fine brass inlay line embedded along shelf front */}
      <mesh position={[0, plankThickness * 0.4, plankDepth / 2 + 0.052]} receiveShadow>
        <boxGeometry args={[rowWidth, 0.03, 0.01]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* 3. DECORATIVE BRASS SHELF NAMEPLATE FOR EDUCATION YEAR */}
      <group
        position={[0, 0, plankDepth / 2 + 0.06]}
        userData={{ testId: `shelf-nameplate-${level.id}` }}
        onClick={(e) => {
          e.stopPropagation();
          setActiveLevelId(level.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
      >
        {/* Brass Plate Outer Bezel */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[cfg.nameplateWidth, 0.32, 0.035]} />
          <meshStandardMaterial
            color={isActive ? '#f59e0b' : '#b8860b'}
            metalness={0.8}
            roughness={0.22}
          />
        </mesh>

        {/* Inner Colored Accent Plaque with level badge color */}
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[cfg.nameplateWidth - 0.25, 0.25]} />
          <meshBasicMaterial color={isActive ? level.badgeColor : '#16110d'} />
        </mesh>

        {/* Education Year Label Text */}
        <Text
          position={[0, 0, 0.03]}
          fontSize={0.11}
          color={isActive ? '#ffffff' : '#fef3c7'}
          fontWeight={isActive ? 700 : 600}
          anchorX="center"
          anchorY="middle"
          maxWidth={cfg.nameplateWidth - 0.4}
        >
          {level.name[language] || level.name.ar}
        </Text>

        {/* Left & Right Decorative Brass Screws / Rivets */}
        {[-cfg.nameplateWidth / 2 + 0.2, cfg.nameplateWidth / 2 - 0.2].map((x, i) => (
          <mesh key={i} position={[x, 0, 0.026]}>
            <circleGeometry args={[0.035, 12]} />
            <meshStandardMaterial color="#fef08a" metalness={0.85} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* 4. CLASSICAL CARVED BRASS BOOKENDS */}
      {[-rowWidth / 2 + 0.65, rowWidth / 2 - 0.65].map((x, i) => (
        <group key={`bookend-${i}`} position={[x, plankThickness / 2 + 0.42, 0.15]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.1, 0.84, 1.1]} />
            <meshStandardMaterial color="#c4823f" metalness={0.75} roughness={0.25} />
          </mesh>
          <mesh position={[i === 0 ? 0.18 : -0.18, -0.38, 0]} castShadow>
            <boxGeometry args={[0.35, 0.08, 1.1]} />
            <meshStandardMaterial color="#b45309" metalness={0.65} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* 5. ACTIVE ROW GOLDEN ILLUMINATION (when shelf is focused) */}
      {isActive && (
        <pointLight
          position={[0, 0.8, 1.8]}
          intensity={0.9}
          distance={4.8}
          color="#fbbf24"
        />
      )}

      {/* 6. DATA-DRIVEN BOOKS LINED UP ON THE SHELF */}
      {rowBookItems.map((item) => {
        // item.localPos is relative to the bookshelf origin; convert Y to shelf-local
        const localY = item.localPos[1] - yPosition;
        const localPos: [number, number, number] = [item.localPos[0], localY, item.localPos[2]];

        return (
          <BookshelfBookItem
            key={item.book.id}
            book={item.book}
            position={localPos}
            dimensions={item.dimensions}
            isSelected={selectedBookId === item.book.id}
          />
        );
      })}
    </group>
  );
});
