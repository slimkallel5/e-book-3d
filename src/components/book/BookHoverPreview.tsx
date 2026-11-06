import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useLibraryStore } from '../../store/useLibraryStore';
import { createCoverTexture } from '../../utils/bookTextureGenerator';
import { EDUCATION_LEVELS } from '../../data/educationLevels';

/**
 * BookHoverPreview
 * Floating 3D preview card that appears near the hovered book in the bookshelf.
 * Shows the book front cover/poster, title, education level, and price.
 * Features smooth fade-in / fade-out animations without moving the book from its shelf
 * or zooming the camera.
 */
export const BookHoverPreview: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const hoveredInfo = useLibraryStore((s) => s.hoveredBookInfo);
  const selectedBookId = useLibraryStore((s) => s.selectedBookId);
  const language = useLibraryStore((s) => s.language);

  // Keep track of the active book data even during fade-out
  const activeBookRef = useRef(hoveredInfo?.book || null);
  if (hoveredInfo?.book) {
    activeBookRef.current = hoveredInfo.book;
  }
  const book = activeBookRef.current;

  // Generate cover poster texture for the preview card
  const posterTex = useMemo(() => {
    if (!book) return null;
    return createCoverTexture(book, language);
  }, [book, language]);

  // Target visibility and position
  // Do not show preview if book is selected / in inspection mode
  const isVisible = Boolean(hoveredInfo && !selectedBookId);

  const level = useMemo(() => {
    if (!book) return null;
    return EDUCATION_LEVELS.find((l) => l.id === book.educationLevelId);
  }, [book]);

  // Smooth lerping of position, scale and orientation
  useFrame(() => {
    if (!groupRef.current) return;

    if (isVisible && hoveredInfo) {
      const [wx, wy, wz] = hoveredInfo.worldPosition;
      // Position card slightly in front and slightly to the side/above the book
      // Offset along camera vector
      const targetPos = new THREE.Vector3(wx + 0.9, wy + 0.65, wz + 1.2);
      groupRef.current.position.lerp(targetPos, 0.16);

      // Face toward the camera position (~ [0.5, 0.6, 16.5])
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0.15, 0.14);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -0.04, 0.14);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.14);

      // Scale up smoothly
      const currentScale = groupRef.current.scale.x;
      const targetScale = 1.0;
      const nextScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.18);
      groupRef.current.scale.setScalar(nextScale);
      groupRef.current.visible = true;
    } else {
      // Scale down smoothly towards 0
      const currentScale = groupRef.current.scale.x;
      const nextScale = THREE.MathUtils.lerp(currentScale, 0, 0.22);
      groupRef.current.scale.setScalar(nextScale);

      if (nextScale < 0.01) {
        groupRef.current.visible = false;
      }
    }
  });

  if (!book) return null;

  const cardWidth = 1.35;
  const cardHeight = 1.95;
  const cardThickness = 0.04;

  const levelName = level ? (level.shortName[language] || level.shortName.ar) : '';
  const subjectName = book.subject[language] || book.subject.ar;
  const titleName = book.title[language] || book.title.ar;

  return (
    <group ref={groupRef} visible={false} scale={[0, 0, 0]}>
      {/* Soft warm point light focused on the preview card */}
      <pointLight position={[0, 0.5, 1.2]} intensity={1.8} distance={3.5} color="#fffbeb" />

      {/* Outer Card Shadow Backplate */}
      <mesh position={[0, 0, -cardThickness / 2 - 0.01]}>
        <boxGeometry args={[cardWidth + 0.08, cardHeight + 0.08, 0.02]} />
        <meshStandardMaterial color="#1a120b" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Elegant Brass/Golden Bevel Border Frame */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[cardWidth + 0.04, cardHeight + 0.04, cardThickness]} />
        <meshStandardMaterial
          color="#d99742"
          metalness={0.75}
          roughness={0.25}
        />
      </mesh>

      {/* Front Face with Full Book Poster Texture */}
      {posterTex && (
        <mesh position={[0, 0, cardThickness / 2 + 0.002]}>
          <planeGeometry args={[cardWidth, cardHeight]} />
          <meshStandardMaterial
            map={posterTex}
            roughness={0.3}
            metalness={0.08}
          />
        </mesh>
      )}

      {/* Floating Info Pill under the card: Title, Level badge, & "Click to Inspect" prompt */}
      <group position={[0, -cardHeight / 2 - 0.28, 0.05]}>
        {/* Info Pill Plaque */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[cardWidth + 0.35, 0.38, 0.03]} />
          <meshStandardMaterial
            color="#141c26"
            roughness={0.4}
            metalness={0.3}
          />
        </mesh>
        <mesh position={[0, 0, 0.018]}>
          <planeGeometry args={[cardWidth + 0.31, 0.34]} />
          <meshStandardMaterial color="#1f2937" roughness={0.6} />
        </mesh>

        {/* Level & Subject Badge */}
        <Text
          position={[0, 0.08, 0.025]}
          fontSize={0.075}
          color="#fbbf24"
          fontWeight={700}
          anchorX="center"
          anchorY="middle"
          maxWidth={cardWidth + 0.2}
        >
          {`${levelName} • ${subjectName}`}
        </Text>

        {/* Book Title */}
        <Text
          position={[0, -0.06, 0.025]}
          fontSize={0.085}
          color="#ffffff"
          fontWeight={600}
          anchorX="center"
          anchorY="middle"
          maxWidth={cardWidth + 0.25}
        >
          {titleName}
        </Text>
      </group>
    </group>
  );
};
