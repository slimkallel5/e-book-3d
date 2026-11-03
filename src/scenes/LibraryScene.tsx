import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useLibraryStore } from '../store/useLibraryStore';
import { LibraryEnvironment } from '../components/library/LibraryEnvironment';
import { Bookshelf } from '../components/bookshelf/Bookshelf';
import { EDUCATION_LEVELS } from '../data/educationLevels';

export const LibraryScene: React.FC = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);

  const viewMode = useLibraryStore((s) => s.viewMode);
  const activeLevelId = useLibraryStore((s) => s.activeLevelId);

  // Dynamic Camera transitions between overview, shelf, and book
  useFrame(() => {
    if (!cameraRef.current || !controlsRef.current) return;

    let targetPos = new THREE.Vector3(0, 0.5, 14);
    let targetLook = new THREE.Vector3(0, 0, 0);

    if (viewMode === 'shelf') {
      const level = EDUCATION_LEVELS.find((l) => l.id === activeLevelId);
      const shelfIndex = level ? level.shelfIndex : 0;
      const shelfSpacing = 2.6;
      const shelfY = 3.6 - shelfIndex * shelfSpacing;

      targetPos = new THREE.Vector3(0, shelfY + 0.6, 6.2);
      targetLook = new THREE.Vector3(0, shelfY + 0.5, 0);
    } else if (viewMode === 'book-detail' || viewMode === 'book-open') {
      targetPos = new THREE.Vector3(0, 0, 4.5);
      targetLook = new THREE.Vector3(0, 0, 0);
    }

    cameraRef.current.position.lerp(targetPos, 0.05);
    controlsRef.current.target.lerp(targetLook, 0.05);
    controlsRef.current.update();
  });

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 1.5, 14]}
        fov={50}
        near={0.1}
        far={100}
      />

      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        maxPolarAngle={Math.PI / 2 + 0.05}
        minDistance={2.5}
        maxDistance={22}
      />

      <LibraryEnvironment />
      <Bookshelf />
    </>
  );
};
