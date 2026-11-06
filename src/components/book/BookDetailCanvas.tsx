import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Book } from '../../types/book';
import { useLibraryStore } from '../../store/useLibraryStore';
import {
  createCoverTexture,
  createBackCoverTexture,
  createOpenSpreadTexture
} from '../../utils/bookTextureGenerator';

interface BookDetailCanvasProps {
  book: Book;
}

const InteractiveBookMesh: React.FC<{ book: Book }> = ({ book }) => {
  const groupRef = useRef<THREE.Group>(null);
  const frontCoverHingeRef = useRef<THREE.Group>(null);
  const openPagesGroupRef = useRef<THREE.Group>(null);

  const isBookOpen = useLibraryStore((s) => s.isBookOpen);
  const currentBookPage = useLibraryStore((s) => s.currentBookPage);
  const language = useLibraryStore((s) => s.language);

  // Free 360-degree pointer drag rotation
  const [isDragging, setIsDragging] = useState(false);
  const rotationVelocity = useRef({ x: 0, y: 0.003 });
  const userRotation = useRef({ x: 0.1, y: -0.2 });
  const lastPointer = useRef({ x: 0, y: 0 });

  const frontCoverTex = useMemo(() => createCoverTexture(book, language), [book, language]);
  const backCoverTex = useMemo(() => createBackCoverTexture(book, language), [book, language]);
  const openSpreadTex = useMemo(
    () => createOpenSpreadTexture(book, currentBookPage, language),
    [book, currentBookPage, language]
  );

  const bookWidth = 1.6;
  const bookHeight = 2.2;
  const bookDepth = 0.28;
  const coverThickness = 0.035;

  const onPointerDown = (e: any) => {
    e.stopPropagation();
    setIsDragging(true);
    lastPointer.current = { x: e.clientX, y: e.clientY };
  };

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      lastPointer.current = { x: e.clientX, y: e.clientY };

      const factor = 0.009;
      userRotation.current.y += dx * factor;
      userRotation.current.x += dy * factor;
      rotationVelocity.current = { x: dy * factor, y: dx * factor };
    };

    const onPointerUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [isDragging]);

  useFrame(() => {
    if (!groupRef.current) return;

    const hasInertia = Math.abs(rotationVelocity.current.x) > 0.0001 || Math.abs(rotationVelocity.current.y) > 0.0001;
    if (!isDragging && hasInertia) {
      userRotation.current.x += rotationVelocity.current.x;
      userRotation.current.y += rotationVelocity.current.y;
      rotationVelocity.current.x *= 0.94;
      rotationVelocity.current.y *= 0.94;
      userRotation.current.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, userRotation.current.x));
    }

    if (isBookOpen) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0.1, 0.1);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.1);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.1);
    } else {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, userRotation.current.x, 0.12);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, userRotation.current.y, 0.12);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.12);
    }

    if (frontCoverHingeRef.current) {
      const targetAngle = isBookOpen ? -Math.PI * 0.94 : 0;
      frontCoverHingeRef.current.rotation.y = THREE.MathUtils.lerp(
        frontCoverHingeRef.current.rotation.y,
        targetAngle,
        0.1
      );
    }

    if (openPagesGroupRef.current) {
      const openProgress = isBookOpen ? 1 : 0;
      openPagesGroupRef.current.scale.setScalar(
        THREE.MathUtils.lerp(openPagesGroupRef.current.scale.x, openProgress, 0.14)
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} onPointerDown={onPointerDown}>
      {/* CLOSED / INSPECTABLE BOOK BODY */}
      <group visible={!isBookOpen}>
        {/* Spine */}
        <mesh position={[-bookWidth / 2, 0, 0]}>
          <boxGeometry args={[coverThickness, bookHeight, bookDepth]} />
          <meshStandardMaterial
            color={book.coverStyle.spineColor || book.coverStyle.primaryColor}
            roughness={0.4}
            metalness={0.15}
          />
        </mesh>

        {/* Back Cover */}
        <mesh position={[0, 0, -bookDepth / 2 + coverThickness / 2]}>
          <boxGeometry args={[bookWidth, bookHeight, coverThickness]} />
          <meshStandardMaterial map={backCoverTex} roughness={0.35} metalness={0.1} />
        </mesh>

        {/* Paper block core */}
        <mesh position={[coverThickness / 2, 0, 0]}>
          <boxGeometry
            args={[
              bookWidth - coverThickness * 1.5,
              bookHeight - coverThickness * 2,
              bookDepth - coverThickness * 1.8
            ]}
          />
          <meshStandardMaterial color="#f4eee1" roughness={0.8} metalness={0.02} />
        </mesh>

        {/* Front Cover Hinge */}
        <group ref={frontCoverHingeRef} position={[-bookWidth / 2, 0, bookDepth / 2]}>
          <mesh position={[bookWidth / 2, 0, 0]}>
            <boxGeometry args={[bookWidth, bookHeight, coverThickness]} />
            <meshStandardMaterial map={frontCoverTex} roughness={0.35} metalness={0.1} />
          </mesh>
        </group>
      </group>

      {/* OPEN BOOK SPREAD */}
      <group ref={openPagesGroupRef} scale={[0, 0, 0]} visible={isBookOpen}>
        <mesh position={[0, -0.05, 0]}>
          <boxGeometry args={[bookWidth * 2.05, bookHeight * 1.02, coverThickness * 1.8]} />
          <meshStandardMaterial color={book.coverStyle.primaryColor} roughness={0.4} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <boxGeometry args={[0.08, bookHeight, 0.04]} />
          <meshStandardMaterial color="#334155" roughness={0.5} />
        </mesh>
        <mesh position={[-bookWidth / 2, 0, 0.04]}>
          <boxGeometry args={[bookWidth, bookHeight * 0.98, 0.06]} />
          <meshStandardMaterial color="#f8f4eb" roughness={0.8} />
        </mesh>
        <mesh position={[bookWidth / 2, 0, 0.04]}>
          <boxGeometry args={[bookWidth, bookHeight * 0.98, 0.06]} />
          <meshStandardMaterial color="#f8f4eb" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.075]}>
          <planeGeometry args={[bookWidth * 2, bookHeight * 0.98]} />
          <meshStandardMaterial map={openSpreadTex} roughness={0.65} metalness={0.02} />
        </mesh>
      </group>
    </group>
  );
};

export const BookDetailCanvas: React.FC<BookDetailCanvasProps> = ({ book }) => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, cursor: 'grab' }}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 3.8], fov: 42 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[4, 5, 5]} intensity={1.8} />
        <directionalLight position={[-4, 2, 2]} intensity={0.8} />
        <pointLight position={[0, 2, 3]} intensity={1.0} color="#ffeedd" />
        <InteractiveBookMesh book={book} />
      </Canvas>
    </div>
  );
};
