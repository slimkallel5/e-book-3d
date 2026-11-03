import React from 'react';
import { EDUCATION_LEVELS } from '../../data/educationLevels';
import { BOOKS_DATA } from '../../data/books';
import { BookshelfRow } from './BookshelfRow';

export const Bookshelf: React.FC = () => {
  // Height spacing between shelves
  const shelfSpacing = 2.6;
  const startY = 3.6;

  // Render shelves vertically
  return (
    <group name="bookshelf-assembly" position={[0, 0, -1]}>
      {/* Side vertical support panels */}
      {[-7.2, 7.2].map((x, i) => (
        <mesh key={i} position={[x, 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.3, 16, 2.4]} />
          <meshStandardMaterial color="#2d1c12" roughness={0.7} metalness={0.15} />
        </mesh>
      ))}

      {/* Bookshelf Crown Header with decorative trim */}
      <mesh position={[0, 9, 0]} castShadow receiveShadow>
        <boxGeometry args={[14.8, 0.8, 2.6]} />
        <meshStandardMaterial color="#3d2618" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Education Year Shelf Rows */}
      {EDUCATION_LEVELS.map((level, idx) => {
        const yPos = startY - idx * shelfSpacing;
        const levelBooks = BOOKS_DATA.filter((b) => b.educationLevelId === level.id);

        return (
          <BookshelfRow
            key={level.id}
            level={level}
            books={levelBooks}
            yPosition={yPos}
            rowWidth={14.2}
          />
        );
      })}
    </group>
  );
};
