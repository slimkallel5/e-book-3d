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
        meshRef.current.visible = false;
      } else {
        meshRef.current.visible = true;
        // Slide slightly forward towards viewer on hover
        const targetZ = hovered ? position[2] + 0.35 : position[2];
        const targetY = hovered ? position[1] + 0.08 : position[1];
        const targetRotX = hovered ? -0.04 : 0;
        meshRef.current.position.z += (targetZ - meshRef.current.position.z) * 0.18;
        meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.18;
        meshRef.current.rotation.x += (targetRotX - meshRef.current.rotation.x) * 0.15;
      }
    }
  });

  // Scale dimensions proportionally so the book fits naturally inside a 1.5-unit shelf row
  // Book height scaled to ~1.15
  const scale = 0.65;
  const width = book.dimensions.width * scale;
  const height = book.dimensions.height * scale;
  const depth = book.dimensions.depth * scale;

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
      {/* 1. Main Book Interior Pages (slightly recessed with warm paper tone) */}
      <mesh castShadow receiveShadow position={[0, height / 2, -0.02]}>
        <boxGeometry args={[depth * 0.88, height * 0.94, width * 0.95]} />
        <meshStandardMaterial
          color="#fbf7ec"
          roughness={0.92}
          metalness={0.02}
        />
      </mesh>

      {/* Realistic Paper Edges Strip (Top) */}
      <mesh position={[0, height * 0.97, -0.02]}>
        <boxGeometry args={[depth * 0.86, 0.02, width * 0.92]} />
        <meshStandardMaterial color="#f0e6d2" roughness={0.9} />
      </mesh>

      {/* 2. Book Spine Facing the Viewer */}
      <mesh castShadow receiveShadow position={[0, height / 2, width / 2]}>
        <boxGeometry args={[depth, height, 0.04]} />
        <meshStandardMaterial
          color={hovered ? book.coverStyle.accentColor : book.coverStyle.spineColor}
          roughness={0.4}
          metalness={0.15}
        />
      </mesh>

      {/* 3. Book Front & Back Hardcovers */}
      {/* Front cover */}
      <mesh castShadow position={[-depth / 2, height / 2, 0]}>
        <boxGeometry args={[0.025, height, width]} />
        <meshStandardMaterial
          color={book.coverStyle.primaryColor}
          roughness={0.35}
          metalness={0.1}
        />
      </mesh>
      {/* Back cover */}
      <mesh castShadow position={[depth / 2, height / 2, 0]}>
        <boxGeometry args={[0.025, height, width]} />
        <meshStandardMaterial
          color={book.coverStyle.secondaryColor}
          roughness={0.35}
          metalness={0.1}
        />
      </mesh>

      {/* 4. Spine Embossed Gold Foil Ribbons and Headbands */}
      {/* Upper Gold Ribs */}
      <mesh position={[0, height * 0.86, width / 2 + 0.025]}>
        <boxGeometry args={[depth * 0.85, 0.025, 0.01]} />
        <meshStandardMaterial color={book.coverStyle.accentColor} metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh position={[0, height * 0.82, width / 2 + 0.025]}>
        <boxGeometry args={[depth * 0.85, 0.015, 0.01]} />
        <meshStandardMaterial color={book.coverStyle.accentColor} metalness={0.7} roughness={0.25} />
      </mesh>

      {/* Lower Gold Ribs */}
      <mesh position={[0, height * 0.16, width / 2 + 0.025]}>
        <boxGeometry args={[depth * 0.85, 0.025, 0.01]} />
        <meshStandardMaterial color={book.coverStyle.accentColor} metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh position={[0, height * 0.12, width / 2 + 0.025]}>
        <boxGeometry args={[depth * 0.85, 0.015, 0.01]} />
        <meshStandardMaterial color={book.coverStyle.accentColor} metalness={0.7} roughness={0.25} />
      </mesh>

      {/* Center Spine Decorative Medallion / Badge */}
      <mesh position={[0, height * 0.74, width / 2 + 0.025]}>
        <circleGeometry args={[0.05, 16]} />
        <meshStandardMaterial color={book.coverStyle.accentColor} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* 5. Spine Vertical Title text */}
      <Text
        position={[0, height * 0.46, width / 2 + 0.026]}
        rotation={[0, 0, Math.PI / 2]}
        fontSize={0.10}
        maxWidth={height * 0.50}
        color={hovered ? '#ffffff' : '#f8fafc'}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.02}
      >
        {book.title[language] || book.title.ar}
      </Text>

      {/* 6. Subject Tag / Code at Bottom of Spine */}
      <Text
        position={[0, height * 0.06, width / 2 + 0.026]}
        fontSize={0.06}
        color={hovered ? '#fbbf24' : '#cbd5e1'}
        anchorX="center"
        anchorY="middle"
      >
        {book.subject[language] || book.subject.ar}
      </Text>

      {/* 7. Hover Selection Glow Ring around the base */}
      {hovered && (
        <mesh position={[0, 0.01, width / 2]}>
          <planeGeometry args={[depth * 1.3, 0.06]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.7} />
        </mesh>
      )}
    </group>
  );
};
