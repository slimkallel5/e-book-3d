import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { Book } from '../../types/book';
import { useLibraryStore } from '../../store/useLibraryStore';
import { createCoverTexture } from '../../utils/bookTextureGenerator';

interface BookCarouselCardProps {
  book: Book;
  angle: number;
  radiusX: number;
  radiusZ: number;
  carouselRotation: number;
  isFrontCard: boolean;
  onSelect: (book: Book) => void;
}

/**
 * BookCarouselCard
 * 3D Book card positioned on a circular/elliptical orbital path.
 * Renders high-fidelity cover poster, realistic proportions, golden trim,
 * and responsive hover & selection effects.
 */
export const BookCarouselCard: React.FC<BookCarouselCardProps> = ({
  book,
  angle,
  radiusX,
  radiusZ,
  carouselRotation,
  isFrontCard,
  onSelect
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const language = useLibraryStore((s) => s.language);

  // Generate poster texture
  const coverTex = useMemo(() => {
    return createCoverTexture(book, language);
  }, [book, language]);

  const cardWidth = 1.6;
  const cardHeight = 2.25;
  const cardThickness = 0.08;

  // Compute position on the orbital ellipse
  // Angle + carouselRotation determines where on the ring it sits
  const currentTheta = angle + carouselRotation;

  // Orbit coordinates:
  // Math.sin(currentTheta) gives X (-radiusX to +radiusX)
  // Math.cos(currentTheta) gives Z (+radiusZ is closest to camera, -radiusZ is deep back)
  const targetX = Math.sin(currentTheta) * radiusX;
  const targetZ = Math.cos(currentTheta) * radiusZ;
  // Arc height: slight subtle dip at the back for depth perspective
  const targetY = Math.sin(currentTheta * 2) * 0.08;

  // Tangent rotation to face towards front/center
  // Facing directly towards camera or angled smoothly with the ring curvature
  // In Animos 3D carousel / Cover Flow: front card faces front, side cards are angled inwards
  const normalAngle = Math.atan2(targetX, targetZ + 6.0); // subtle focal perspective
  const targetRotY = normalAngle;
  const targetRotX = isFrontCard ? (hovered ? -0.06 : 0) : 0.02;

  // Depth scale: cards in front are full scale, cards in the back scale down slightly for depth
  const depthFactor = (Math.cos(currentTheta) + 1.0) / 2.0; // 0 (back) to 1 (front)
  const baseScale = THREE.MathUtils.lerp(0.72, 1.06, depthFactor);
  const targetScale = hovered && isFrontCard ? baseScale * 1.05 : baseScale;

  useFrame(() => {
    if (!meshRef.current) return;

    // Smooth movement interpolation
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.15);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.15);
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.15);

    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, 0.15);
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.15);

    const s = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.15);
    meshRef.current.scale.set(s, s, s);
  });

  const title = book.title[language] || book.title.ar;
  const subject = book.subject[language] || book.subject.ar;
  const currency = book.currency[language] || book.currency.ar;

  return (
    <group
      ref={meshRef}
      position={[targetX, targetY, targetZ]}
      scale={[baseScale, baseScale, baseScale]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(book);
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
      {/* Dynamic Glow / Halo when card is at front */}
      {isFrontCard && (
        <pointLight
          position={[0, 0.2, 1.2]}
          intensity={hovered ? 2.4 : 1.6}
          distance={3.2}
          color="#fbbf24"
        />
      )}

      {/* Book Solid Carcass / Bevel Backplate */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[cardWidth + 0.04, cardHeight + 0.04, cardThickness]} />
        <meshStandardMaterial
          color={isFrontCard ? '#d99742' : '#3d2516'}
          roughness={0.4}
          metalness={isFrontCard ? 0.6 : 0.2}
        />
      </mesh>

      {/* Front Cover Poster Texture */}
      {coverTex && (
        <mesh position={[0, 0, cardThickness / 2 + 0.002]} receiveShadow>
          <planeGeometry args={[cardWidth, cardHeight]} />
          <meshStandardMaterial
            map={coverTex}
            roughness={0.25}
            metalness={0.05}
          />
        </mesh>
      )}

      {/* Book Interior Paper Page Rim (right and bottom edges) */}
      <mesh position={[cardWidth / 2 + 0.01, 0, 0]}>
        <boxGeometry args={[0.015, cardHeight * 0.96, cardThickness * 0.85]} />
        <meshStandardMaterial color="#f7f2e4" roughness={0.9} />
      </mesh>
      <mesh position={[0, -cardHeight / 2 - 0.01, 0]}>
        <boxGeometry args={[cardWidth * 0.96, 0.015, cardThickness * 0.85]} />
        <meshStandardMaterial color="#f7f2e4" roughness={0.9} />
      </mesh>

      {/* Prominent Info Plaque below Front Card */}
      {isFrontCard && (
        <group position={[0, -cardHeight / 2 - 0.32, 0.08]}>
          {/* Backplate */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[cardWidth + 0.45, 0.46, 0.03]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.018]}>
            <planeGeometry args={[cardWidth + 0.41, 0.42]} />
            <meshStandardMaterial color="#1e293b" roughness={0.6} />
          </mesh>

          {/* Subject Badge */}
          <Text
            position={[0, 0.12, 0.025]}
            fontSize={0.08}
            color="#fbbf24"
            fontWeight={700}
            anchorX="center"
            anchorY="middle"
            maxWidth={cardWidth + 0.3}
          >
            {subject}
          </Text>

          {/* Title */}
          <Text
            position={[0, -0.02, 0.025]}
            fontSize={0.095}
            color="#ffffff"
            fontWeight={700}
            anchorX="center"
            anchorY="middle"
            maxWidth={cardWidth + 0.35}
          >
            {title}
          </Text>

          {/* Price */}
          <Text
            position={[0, -0.14, 0.025]}
            fontSize={0.075}
            color="#94a3b8"
            fontWeight={600}
            anchorX="center"
            anchorY="middle"
          >
            {`${book.price.toFixed(3)} ${currency}`}
          </Text>
        </group>
      )}
    </group>
  );
};
