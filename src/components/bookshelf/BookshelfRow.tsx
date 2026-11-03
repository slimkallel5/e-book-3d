import React, { useState } from 'react';
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
  rowWidth = 15.6
}) => {
  const activeLevelId = useLibraryStore((s) => s.activeLevelId);
  const setActiveLevelId = useLibraryStore((s) => s.setActiveLevelId);
  const selectedBookId = useLibraryStore((s) => s.selectedBookId);
  const language = useLibraryStore((s) => s.language);
  const [rowHovered, setRowHovered] = useState(false);

  const isActive = activeLevelId === level.id;
  const plankThickness = 0.22;
  const plankDepth = 2.4;

  return (
    <group position={[0, yPosition, 0]}>
      {/* 1. Horizontal Wooden Shelf Plank */}
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
          color={isActive ? '#5c3a21' : rowHovered ? '#472b17' : '#331e11'}
          roughness={0.65}
          metalness={0.12}
        />
      </mesh>

      {/* 2. Front Shelf Edge Molding Strip */}
      <mesh position={[0, 0, plankDepth / 2 + 0.02]} receiveShadow>
        <boxGeometry args={[rowWidth, plankThickness * 1.25, 0.06]} />
        <meshStandardMaterial
          color={isActive ? '#e5b364' : rowHovered ? '#b8860b' : '#6b4423'}
          metalness={isActive ? 0.6 : 0.3}
          roughness={0.35}
        />
      </mesh>

      {/* 3. Decorative Brass Shelf Nameplate for Education Year */}
      <group
        position={[0, -0.01, plankDepth / 2 + 0.07]}
        onClick={(e) => {
          e.stopPropagation();
          setActiveLevelId(level.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
      >
        {/* Brass Plate Backing */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4.6, 0.32, 0.03]} />
          <meshStandardMaterial
            color={isActive ? '#e5b364' : '#b48a47'}
            metalness={0.75}
            roughness={0.25}
          />
        </mesh>

        {/* Inner Colored Accent Plaque */}
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[4.4, 0.26]} />
          <meshBasicMaterial color={isActive ? level.badgeColor : '#1a1410'} />
        </mesh>

        {/* Education Year Label Text */}
        <Text
          position={[0, 0, 0.03]}
          fontSize={0.14}
          color={isActive ? '#ffffff' : '#f0ddb8'}
          fontWeight={isActive ? 700 : 500}
          anchorX="center"
          anchorY="middle"
        >
          {level.name[language] || level.name.ar}
        </Text>

        {/* Left & Right Decorative Brass Screws / Rivets */}
        {[-2.1, 2.1].map((x, i) => (
          <mesh key={i} position={[x, 0, 0.025]}>
            <circleGeometry args={[0.035, 12]} />
            <meshStandardMaterial color="#fef08a" metalness={0.8} roughness={0.2} />
          </mesh>
        ))}
      </group>

      {/* 4. Left and Right Brass Bookends */}
      {[-rowWidth / 2 + 0.6, rowWidth / 2 - 0.6].map((x, i) => (
        <group key={`bookend-${i}`} position={[x, 0.45, 0.2]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.1, 0.9, 1.2]} />
            <meshStandardMaterial color="#c4823f" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[i === 0 ? 0.2 : -0.2, -0.4, 0]} castShadow>
            <boxGeometry args={[0.4, 0.08, 1.2]} />
            <meshStandardMaterial color="#b45309" metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* 5. Active Row Golden Illumination Glow (when shelf is focused) */}
      {isActive && (
        <pointLight
          position={[0, 0.8, 1.5]}
          intensity={0.8}
          distance={4.5}
          color="#fbbf24"
        />
      )}

      {/* 6. Realistic Books Lined Up on the Shelf */}
      {books.map((book, idx) => {
        // Bookshelf width is 15.6. To avoid the brass nameplate (width 4.6, |x| <= 2.3),
        // we flank books nicely on either side with natural spacing or stagger them
        let bookX: number;
        if (books.length === 2) {
          bookX = idx === 0 ? -3.4 : 3.4;
        } else {
          const spacing = 1.6;
          const startX = -((books.length - 1) * spacing) / 2;
          bookX = startX + idx * spacing;
          // Push outward if overlapping with the nameplate
          if (Math.abs(bookX) < 2.6) {
            bookX = bookX < 0 ? bookX - 1.5 : bookX + 1.5;
          }
        }
        const bookZ = 0.25;

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
