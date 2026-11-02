import React, { useRef, useState } from 'react';
import { Group } from 'three';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Book } from '../../types/book';
import { useLibraryStore } from '../../store/useLibraryStore';

interface BookshelfBookItemProps {
  book: Book;
  position: [number, number, number];
  isSelected: boolean;
}

export const BookshelfBookItem: React.FC<BookshelfBookItemProps> = ({
  book,
  position,
  isSelected
}) => {
  const meshRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const selectBook = useLibraryStore((s) => s.selectBook);
  const language = useLibraryStore((s) => s.language);

  // Subtle breathing hover animation
  useFrame(() => {
    if (meshRef.current) {
      if (isSelected) {
        // Handled centrally in scene when selected
        meshRef.current.visible = false;
      } else {
        meshRef.current.visible = true;
        const targetZ = hovered ? position[2] + 0.35 : position[2];
        const targetY = hovered ? position[1] + 0.1 : position[1];
        meshRef.current.position.z += (targetZ - meshRef.current.position.z) * 0.18;
        meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.18;
      }
    }
  });

  const width = book.dimensions.width;
  const height = book.dimensions.height;
  const depth = book.dimensions.depth;

  return (
    <group
      ref={meshRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        selectBook(book.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      {/* Main Book Body / Pages interior */}
      <mesh castShadow receiveShadow position={[0, height / 2, 0]}>
        <boxGeometry args={[depth * 0.9, height * 0.96, width * 0.95]} />
        <meshStandardMaterial color="#fdf8ed" roughness={0.9} />
      </mesh>

      {/* Book Cover Spine Facing the Viewer */}
      <mesh castShadow receiveShadow position={[0, height / 2, width / 2]}>
        <boxGeometry args={[depth, height, 0.04]} />
        <meshStandardMaterial
          color={hovered ? book.coverStyle.accentColor : book.coverStyle.spineColor}
          roughness={0.35}
          metalness={0.15}
        />
      </mesh>

      {/* Book Front & Back Covers */}
      <mesh position={[-depth / 2, height / 2, 0]}>
        <boxGeometry args={[0.03, height, width]} />
        <meshStandardMaterial color={book.coverStyle.primaryColor} roughness={0.4} />
      </mesh>
      <mesh position={[depth / 2, height / 2, 0]}>
        <boxGeometry args={[0.03, height, width]} />
        <meshStandardMaterial color={book.coverStyle.secondaryColor} roughness={0.4} />
      </mesh>

      {/* Spine Gold/Accent Line Trim */}
      <mesh position={[0, height * 0.82, width / 2 + 0.025]}>
        <boxGeometry args={[depth * 0.8, 0.05, 0.01]} />
        <meshStandardMaterial color={book.coverStyle.accentColor} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, height * 0.18, width / 2 + 0.025]}>
        <boxGeometry args={[depth * 0.8, 0.05, 0.01]} />
        <meshStandardMaterial color={book.coverStyle.accentColor} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Spine Vertical Title text */}
      <Text
        position={[0, height * 0.5, width / 2 + 0.026]}
        rotation={[0, 0, Math.PI / 2]}
        fontSize={0.15}
        maxWidth={height * 0.78}
        color={hovered ? '#ffffff' : '#f8fafc'}
        anchorX="center"
        anchorY="middle"
      >
        {book.title[language] || book.title.ar}
      </Text>
    </group>
  );
};
