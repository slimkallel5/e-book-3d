import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Book } from '../../types/book';
import { useLibraryStore } from '../../store/useLibraryStore';
import {
  createCoverTexture,
  createBackCoverTexture,
  createOpenSpreadTexture
} from '../../utils/bookTextureGenerator';

interface Book3DProps {
  book: Book;
  shelfPosition: [number, number, number];
}

export const Book3D: React.FC<Book3DProps> = ({ book, shelfPosition }) => {
  const groupRef = useRef<THREE.Group>(null);
  const frontCoverHingeRef = useRef<THREE.Group>(null);
  const openPagesGroupRef = useRef<THREE.Group>(null);

  const isBookOpen = useLibraryStore((s) => s.isBookOpen);
  const currentBookPage = useLibraryStore((s) => s.currentBookPage);
  const language = useLibraryStore((s) => s.language);
  const viewMode = useLibraryStore((s) => s.viewMode);

  // Free 360-degree drag rotation state
  const [isDragging, setIsDragging] = useState(false);
  const rotationVelocity = useRef({ x: 0, y: 0 });
  const userRotation = useRef({ x: 0, y: 0 });
  const lastPointer = useRef({ x: 0, y: 0 });

  // Generate dynamic canvas textures for the book
  const frontCoverTex = useMemo(() => createCoverTexture(book, language), [book, language]);
  const backCoverTex = useMemo(() => createBackCoverTexture(book, language), [book, language]);
  const openSpreadTex = useMemo(
    () => createOpenSpreadTexture(book, currentBookPage, language),
    [book, currentBookPage, language]
  );

  // Proportions
  const bookWidth = 1.6;
  const bookHeight = 2.2;
  const bookDepth = 0.28;
  const coverThickness = 0.035;

  // Flight destination when inspected:
  // Aligns precisely within the transparent inspection window of the centered grouped card
  const centerTarget = useMemo(() => {
    // When viewport is wide, position slightly to the left (-2.4 in world units) to line up with the card's left viewport
    return new THREE.Vector3(-2.2, 0.4, 6.0);
  }, []);

  const shelfTarget = useMemo(() => {
    return new THREE.Vector3(...shelfPosition);
  }, [shelfPosition]);

  // Pointer drag event handlers for 360-degree rotation
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      // Only drag if clicking on canvas and not on overlay UI
      const target = e.target as HTMLElement;
      if (target.tagName !== 'CANVAS') return;

      setIsDragging(true);
      lastPointer.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - lastPointer.current.x;
      const deltaY = e.clientY - lastPointer.current.y;

      lastPointer.current = { x: e.clientX, y: e.clientY };

      const factor = 0.007;
      userRotation.current.y += deltaX * factor;
      userRotation.current.x += deltaY * factor;

      rotationVelocity.current = {
        x: deltaY * factor,
        y: deltaX * factor
      };
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging]);

  // Smooth shelf-to-center lerping & hinge opening physics
  useFrame(() => {
    if (!groupRef.current) return;

    // Apply inertia damping when not dragging
    if (!isDragging) {
      userRotation.current.x += rotationVelocity.current.x;
      userRotation.current.y += rotationVelocity.current.y;
      rotationVelocity.current.x *= 0.92;
      rotationVelocity.current.y *= 0.92;

      // Keep vertical pitch within readable bounds (-60 to +60 degrees)
      userRotation.current.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, userRotation.current.x));
    }

    const isInspecting = viewMode === 'book-detail' || viewMode === 'book-open';
    const targetPos = isInspecting ? centerTarget : shelfTarget;

    // Smooth movement flight from shelf to center
    groupRef.current.position.lerp(targetPos, 0.08);

    if (isInspecting) {
      if (isBookOpen) {
        // Lay flat facing the camera when opened
        const targetRotY = 0;
        const targetRotX = 0.12;
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.08);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.08);
        groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.08);
      } else {
        // Apply interactive user inspection rotation
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
          groupRef.current.rotation.x,
          userRotation.current.x,
          0.1
        );
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
          groupRef.current.rotation.y,
          userRotation.current.y,
          0.1
        );
        groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.1);
      }
    } else {
      // In shelf orientation
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.1);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.1);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.1);
      userRotation.current = { x: 0, y: 0 };
    }

    // Book cover hinge rotation around spine
    if (frontCoverHingeRef.current) {
      // Open angle: ~170 degrees (Math.PI * 0.95)
      const targetAngle = isBookOpen ? -Math.PI * 0.94 : 0;
      frontCoverHingeRef.current.rotation.y = THREE.MathUtils.lerp(
        frontCoverHingeRef.current.rotation.y,
        targetAngle,
        0.09
      );
    }

    // Open pages spread visibility
    if (openPagesGroupRef.current) {
      const openProgress = isBookOpen ? 1 : 0;
      openPagesGroupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(openPagesGroupRef.current.scale.x, openProgress, 0.12)
      );
    }
  });

  return (
    <group ref={groupRef} position={shelfPosition}>
      {/* CLOSED / INSPECTABLE BOOK BODY */}
      <group visible={!isBookOpen}>
        {/* Spine & Back Cover Frame */}
        {/* Spine */}
        <mesh position={[-bookWidth / 2, 0, 0]} castShadow>
          <boxGeometry args={[coverThickness, bookHeight, bookDepth]} />
          <meshStandardMaterial
            color={book.coverStyle.spineColor || book.coverStyle.primaryColor}
            roughness={0.4}
            metalness={0.15}
          />
        </mesh>

        {/* Back Cover */}
        <mesh position={[0, 0, -bookDepth / 2 + coverThickness / 2]} castShadow receiveShadow>
          <boxGeometry args={[bookWidth, bookHeight, coverThickness]} />
          <meshStandardMaterial
            map={backCoverTex}
            roughness={0.35}
            metalness={0.1}
          />
        </mesh>

        {/* Book Paper Core (Pages block with ribbed edge texture) */}
        <mesh position={[coverThickness / 2, 0, 0]} castShadow>
          <boxGeometry
            args={[
              bookWidth - coverThickness * 1.5,
              bookHeight - coverThickness * 2,
              bookDepth - coverThickness * 1.8
            ]}
          />
          <meshStandardMaterial
            color="#f4eee1"
            roughness={0.8}
            metalness={0.02}
          />
        </mesh>

        {/* Front Cover Assembly with Hinge along the left spine */}
        <group ref={frontCoverHingeRef} position={[-bookWidth / 2, 0, bookDepth / 2]}>
          <mesh position={[bookWidth / 2, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[bookWidth, bookHeight, coverThickness]} />
            <meshStandardMaterial
              map={frontCoverTex}
              roughness={0.35}
              metalness={0.1}
            />
          </mesh>
        </group>
      </group>

      {/* OPEN BOOK 3D GEOMETRY SPREAD (Appears when opened) */}
      <group ref={openPagesGroupRef} scale={[0, 0, 0]} visible={isBookOpen}>
        {/* Open Book Hard Spine Base */}
        <mesh position={[0, -0.05, 0]} castShadow>
          <boxGeometry args={[bookWidth * 2.05, bookHeight * 1.02, coverThickness * 1.8]} />
          <meshStandardMaterial
            color={book.coverStyle.primaryColor}
            roughness={0.4}
            metalness={0.2}
          />
        </mesh>

        {/* Central Spine Ridge */}
        <mesh position={[0, 0, 0.02]}>
          <boxGeometry args={[0.08, bookHeight, 0.04]} />
          <meshStandardMaterial color="#334155" roughness={0.5} />
        </mesh>

        {/* Left Page Block (Curved/Layered appearance) */}
        <mesh position={[-bookWidth / 2, 0, 0.04]} receiveShadow castShadow>
          <boxGeometry args={[bookWidth, bookHeight * 0.98, 0.06]} />
          <meshStandardMaterial color="#f8f4eb" roughness={0.8} />
        </mesh>

        {/* Right Page Block */}
        <mesh position={[bookWidth / 2, 0, 0.04]} receiveShadow castShadow>
          <boxGeometry args={[bookWidth, bookHeight * 0.98, 0.06]} />
          <meshStandardMaterial color="#f8f4eb" roughness={0.8} />
        </mesh>

        {/* Open 2-Page Content Spread Surface with High-Res Educational Texture */}
        <mesh position={[0, 0, 0.075]} receiveShadow>
          <planeGeometry args={[bookWidth * 2, bookHeight * 0.98]} />
          <meshStandardMaterial
            map={openSpreadTex}
            roughness={0.65}
            metalness={0.02}
          />
        </mesh>
      </group>
    </group>
  );
};
