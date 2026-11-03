import React from 'react';
import { EDUCATION_LEVELS } from '../../data/educationLevels';
import { BOOKS_DATA } from '../../data/books';
import { BookshelfRow } from './BookshelfRow';

export const Bookshelf: React.FC = () => {
  // Height spacing between shelves:
  // We have 7 levels (idx 0 to 6)
  // Let shelf 0 (1AP) sit at y = 5.2, and shelf 6 (Secondary) at y = -3.8
  // Total span = 9.0 units, spacing = 1.5 units
  // idx 0: y = 5.2
  // idx 1: y = 3.7
  // idx 2: y = 2.2
  // idx 3: y = 0.7
  // idx 4: y = -0.8
  // idx 5: y = -2.3
  // idx 6: y = -3.8
  // Floor is at y = -5.5
  // Base plinth sits from -5.5 to -4.0 (height 1.5, center at -4.75)
  // Top Crown sits at y = 6.4 (height 0.8)
  const shelfSpacing = 1.5;
  const startY = 5.2;
  const shelfWidth = 15.6;
  const shelfDepth = 2.4;

  return (
    <group name="bookshelf-assembly" position={[0, 0, -1]}>
      {/* 1. Heavy Carved Base Plinth directly resting on library floor */}
      <mesh position={[0, -4.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[shelfWidth + 1.2, 1.5, shelfDepth + 0.4]} />
        <meshStandardMaterial color="#22140b" roughness={0.7} metalness={0.15} />
      </mesh>
      {/* Base trim golden moulding */}
      <mesh position={[0, -3.98, (shelfDepth + 0.4) / 2 + 0.01]} receiveShadow>
        <boxGeometry args={[shelfWidth + 1.25, 0.08, 0.05]} />
        <meshStandardMaterial color="#c4823f" roughness={0.4} metalness={0.5} />
      </mesh>

      {/* 2. Side vertical upright support columns / pilasters */}
      {[-shelfWidth / 2 - 0.25, shelfWidth / 2 + 0.25].map((x, i) => (
        <group key={`side-upright-${i}`} position={[x, 0.7, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.5, 10.5, shelfDepth + 0.2]} />
            <meshStandardMaterial color="#2d1a0e" roughness={0.65} metalness={0.15} />
          </mesh>
          {/* Vertical carved fluting decorative inlay on the front face */}
          <mesh position={[0, 0, (shelfDepth + 0.2) / 2 + 0.02]} receiveShadow>
            <boxGeometry args={[0.22, 10.0, 0.03]} />
            <meshStandardMaterial color="#1a0f08" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* 3. Bookshelf Crown Header & Cornice */}
      <group position={[0, 6.35, 0]}>
        {/* Main cornice frieze */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[shelfWidth + 1.4, 0.8, shelfDepth + 0.4]} />
          <meshStandardMaterial color="#351f11" roughness={0.6} metalness={0.2} />
        </mesh>
        {/* Top protruding moulding */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[shelfWidth + 1.8, 0.2, shelfDepth + 0.6]} />
          <meshStandardMaterial color="#24140b" roughness={0.6} />
        </mesh>
        {/* Decorative Golden Archival Crest / Library Plate on Crown */}
        <mesh position={[0, 0, (shelfDepth + 0.4) / 2 + 0.03]}>
          <boxGeometry args={[5.2, 0.4, 0.04]} />
          <meshStandardMaterial color="#c4823f" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>

      {/* 4. Solid Wood Backing Board */}
      <mesh position={[0, 0.7, -shelfDepth / 2 + 0.05]} receiveShadow>
        <boxGeometry args={[shelfWidth, 10.5, 0.1]} />
        <meshStandardMaterial color="#1f130b" roughness={0.85} />
      </mesh>

      {/* 5. Education Year Shelf Rows */}
      {EDUCATION_LEVELS.map((level, idx) => {
        const yPos = startY - idx * shelfSpacing;
        const levelBooks = BOOKS_DATA.filter((b) => b.educationLevelId === level.id);

        return (
          <BookshelfRow
            key={level.id}
            level={level}
            books={levelBooks}
            yPosition={yPos}
            rowWidth={shelfWidth}
          />
        );
      })}
    </group>
  );
};
