import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useLibraryStore } from '../store/useLibraryStore';
import { LibraryEnvironment } from '../components/library/LibraryEnvironment';
import { Bookshelf } from '../components/bookshelf/Bookshelf';
import { EDUCATION_LEVELS } from '../data/educationLevels';

export const LibraryScene: React.FC = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const controlsRef = useRef<any>(null);
  const { viewport } = useThree();

  const viewMode = useLibraryStore((s) => s.viewMode);
  const activeLevelId = useLibraryStore((s) => s.activeLevelId);

  // Dynamic Camera transitions between overview, shelf, and book
  useFrame(() => {
    if (!cameraRef.current || !controlsRef.current) return;

    const isMobile = viewport.width < 7 || viewport.aspect < 1;
    const isTablet = viewport.width < 10 && !isMobile;

    let targetPos = new THREE.Vector3(0, 0.5, isMobile ? 20.0 : isTablet ? 17.5 : 15.6);
    let targetLook = new THREE.Vector3(0, 0.4, 0);

    if (viewMode === 'shelf') {
      const level = EDUCATION_LEVELS.find((l) => l.id === activeLevelId);
      const shelfIndex = level ? level.shelfIndex : 0;
      // Shelf heights start at 5.2 with 1.5 spacing:
      const shelfSpacing = 1.5;
      const shelfY = 5.2 - shelfIndex * shelfSpacing;

      const shelfCamZ = isMobile ? 7.6 : isTablet ? 6.6 : 5.6;
      targetPos = new THREE.Vector3(0, shelfY + 0.35, shelfCamZ);
      targetLook = new THREE.Vector3(0, shelfY + 0.35, 0);
    } else if (viewMode === 'book-detail' || viewMode === 'book-open') {
      targetPos = new THREE.Vector3(0, 0.2, 4.2);
      targetLook = new THREE.Vector3(0, 0, 0);
    }

    // Smooth exponential damping interpolation
    cameraRef.current.position.lerp(targetPos, 0.05);
    controlsRef.current.target.lerp(targetLook, 0.05);
    controlsRef.current.update();
  });

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 1.2, 14.5]}
        fov={48}
        near={0.1}
        far={120}
      />

      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.06}
        maxPolarAngle={Math.PI / 2 + 0.02}
        minPolarAngle={Math.PI / 6}
        minDistance={2.2}
        maxDistance={25}
        maxAzimuthAngle={Math.PI / 3}
        minAzimuthAngle={-Math.PI / 3}
      />

      <LibraryEnvironment />
      <Bookshelf />
    </>
  );
};
