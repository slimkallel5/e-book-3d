import React from 'react';
import { Text } from '@react-three/drei';
import { EducationLevel } from '../../types/education';
import { Book } from '../../types/book';
import { BookshelfBookItem } from './BookshelfBookItem';
import { useLibraryStore } from '../../store/useLibraryStore';

interface BookshelfRowProps {
  level: EducationLevel;
  books: Book[];
  yPosition: number;
  rowWidth?: number;
}

export const BookshelfRow: React.FC<BookshelfRowProps> = ({
  level,
  books,
  yPosition,
  rowWidth = 14
}) => {
  const activeLevelId = useLibraryStore((s) => s.activeLevelId);
  const setActiveLevelId = useLibraryStore((s) => s.setActiveLevelId);
  const selectedBookId = useLibraryStore((s) => s.selectedBookId);
  const language = useLibraryStore((s) => s.language);

  const isActive = activeLevelId === level.id;
  const plankThickness = 0.22;
  const plankDepth = 2.2;

  return (
    <group position={[0, yPosition, 0]}>
      {/* Horizontal Wooden Shelf Plank */}
      <mesh
        castShadow
        receiveShadow
        position={[0, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          setActiveLevelId(level.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
        }}
      >
        <boxGeometry args={[rowWidth, plankThickness, plankDepth]} />
        <meshStandardMaterial
          color={isActive ? '#5c3d26' : '#3e2719'}
          roughness={0.65}
          metalness={0.1}
        />
      </mesh>

      {/* Golden Front Shelf Lip with Education Year Plate */}
      <mesh position={[0, 0, plankDepth / 2 + 0.02]} receiveShadow>
        <boxGeometry args={[rowWidth, plankThickness * 1.1, 0.05]} />
        <meshStandardMaterial
          color={isActive ? '#e5b364' : '#8d6e63'}
          metalness={0.4}
          roughness={0.4}
        />
      </mesh>

      {/* Decorative Year Label Badge on the front lip */}
      <group position={[0, -0.01, plankDepth / 2 + 0.06]}>
        <mesh>
          <planeGeometry args={[3.8, 0.28]} />
          <meshBasicMaterial color={level.badgeColor} />
        </mesh>
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.16}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {level.name[language] || level.name.ar}
        </Text>
      </group>

      {/* Shelf Backing strip */}
      <mesh position={[0, 1.2, -plankDepth / 2 + 0.05]} receiveShadow>
        <boxGeometry args={[rowWidth, 2.4, 0.1]} />
        <meshStandardMaterial color="#21150f" roughness={0.8} />
      </mesh>

      {/* Books lined up horizontally on this shelf */}
      {books.map((book, idx) => {
        // Space books naturally across the shelf
        const totalBooks = books.length;
        const spacing = 1.6;
        const startX = -((totalBooks - 1) * spacing) / 2;
        const bookX = startX + idx * spacing;
        const bookZ = 0.2;

        return (
          <BookshelfBookItem
            key={book.id}
            book={book}
            position={[bookX, plankThickness / 2, bookZ]}
            isSelected={selectedBookId === book.id}
          />
        );
      })}
    </group>
  );
};
