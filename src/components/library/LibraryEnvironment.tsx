import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Floating dust motes / ambient light particles to add subtle depth & atmosphere
const LibraryDustParticles: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 120;

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const spd = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 26 - 2; // X span across left bookshelf area
      pos[i * 3 + 1] = Math.random() * 14 - 4; // Y height from floor upward
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16 + 2; // Z depth

      spd[i * 3] = (Math.random() - 0.5) * 0.003;
      spd[i * 3 + 1] = Math.random() * 0.004 + 0.002; // slow upward drift
      spd[i * 3 + 2] = (Math.random() - 0.5) * 0.003;
    }
    return [pos, spd];
  }, []);

  // Soft circular glow texture for particles
  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
      gradient.addColorStop(0, 'rgba(255, 235, 180, 1.0)');
      gradient.addColorStop(0.4, 'rgba(255, 215, 140, 0.6)');
      gradient.addColorStop(1, 'rgba(255, 190, 80, 0.0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame(() => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position;
    const array = posAttr.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      array[i * 3] += speeds[i * 3];
      array[i * 3 + 1] += speeds[i * 3 + 1];
      array[i * 3 + 2] += speeds[i * 3 + 2];

      // Wrap around when rising above ceiling
      if (array[i * 3 + 1] > 10) {
        array[i * 3 + 1] = -4;
        array[i * 3] = (Math.random() - 0.5) * 26 - 2;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.22}
        map={particleTexture}
        color="#ffe8b3"
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export const LibraryEnvironment: React.FC = () => {
  return (
    <group name="library-environment">
      {/* 1. Balanced Global Ambient & Warm Directional Lighting */}
      <ambientLight intensity={1.1} color="#fff6eb" />

      {/* Main warm chandelier/spotlight positioned over the left-anchored bookshelf assembly */}
      <spotLight
        position={[-3.5, 16, 10]}
        target-position={[-3.5, 0.5, 0]}
        angle={0.72}
        penumbra={0.75}
        intensity={4.2}
        color="#ffecd1"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />

      {/* Direct front fill light to brightly illuminate titles, spine texts, and shelf details */}
      <directionalLight position={[-2.0, 4.5, 14]} intensity={1.5} color="#fbf7ee" />

      {/* Left side rim light revealing outer side panel texture and moldings */}
      <pointLight position={[-16, 7, 5]} intensity={1.6} color="#ffd494" />

      {/* Right side rim light illuminating inner side panel and 3D depth */}
      <pointLight position={[8, 6, 6]} intensity={1.2} color="#93c5fd" />

      {/* Subtle warm floor bounce light */}
      <pointLight position={[-3.5, -3.5, 5]} intensity={0.7} color="#e5b364" />

      {/* 2. Library Floor - Rich warm polished parquet wood */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5.75, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial
          color="#160e08"
          roughness={0.32}
          metalness={0.22}
        />
      </mesh>

      {/* Persian/Oriental runner rug in front of the bookshelf */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3.5, -5.73, 3.8]} receiveShadow>
        <planeGeometry args={[18, 8]} />
        <meshStandardMaterial
          color="#381b17"
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>
      {/* Rug border accent */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3.5, -5.72, 3.8]}>
        <ringGeometry args={[8.8, 9, 4, 1, 0, Math.PI * 2]} />
        <meshStandardMaterial color="#c4823f" roughness={0.6} metalness={0.3} />
      </mesh>

      {/* 3. Library Back Accent Wall with architectural wood wainscoting panels */}
      <mesh position={[0, 4, -4.5]} receiveShadow>
        <planeGeometry args={[70, 26]} />
        <meshStandardMaterial
          color="#0c1017"
          roughness={0.88}
          metalness={0.05}
        />
      </mesh>

      {/* Architectural decorative wood wainscot panel lines on back wall */}
      {[-24, -18, -12, -6, 0, 6, 12, 18, 24].map((x, i) => (
        <mesh key={`panel-${i}`} position={[x, 3.5, -4.4]} receiveShadow>
          <boxGeometry args={[4.5, 14, 0.1]} />
          <meshStandardMaterial color="#17110c" roughness={0.75} metalness={0.1} />
        </mesh>
      ))}

      {/* 4. Grand Vaulted Ceiling Beams overhead */}
      {[-8, -2, 4, 10].map((z, idx) => (
        <mesh key={`beam-${idx}`} position={[0, 11, z]} receiveShadow castShadow>
          <boxGeometry args={[56, 1.2, 0.9]} />
          <meshStandardMaterial color="#22150d" roughness={0.7} metalness={0.15} />
        </mesh>
      ))}

      {/* 5. Classical Flanking Pillars with Carved Molded Bases and Caps */}
      {[-18, 16].map((xPos, idx) => (
        <group key={`pillar-${idx}`} position={[xPos, 2.5, -1.5]}>
          {/* Main fluted column shaft */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.75, 0.75, 16, 24]} />
            <meshStandardMaterial color="#2a1d13" roughness={0.65} metalness={0.1} />
          </mesh>
          {/* Golden/Brass ornate capital */}
          <mesh position={[0, 8, 0]} castShadow>
            <boxGeometry args={[2.0, 0.6, 2.0]} />
            <meshStandardMaterial color="#c4823f" metalness={0.5} roughness={0.3} />
          </mesh>
          {/* Column Pedestal Base */}
          <mesh position={[0, -7.5, 0]} receiveShadow>
            <boxGeometry args={[2.2, 1.0, 2.2]} />
            <meshStandardMaterial color="#1b110a" roughness={0.6} metalness={0.2} />
          </mesh>

          {/* Warm decorative wall sconce light on each pillar */}
          <group position={[idx === 0 ? 0.9 : -0.9, 2.5, 0]}>
            <mesh>
              <sphereGeometry args={[0.2, 16, 16]} />
              <meshBasicMaterial color="#ffeed1" />
            </mesh>
            <pointLight
              color="#fbbf24"
              intensity={1.2}
              distance={8}
              decay={2}
            />
          </group>
        </group>
      ))}

      {/* 6. Background Auxiliary Bookshelves flanking the room for added depth */}
      {[-25, 23].map((xPos, idx) => (
        <group key={`side-shelf-${idx}`} position={[xPos, 2, -2]} rotation={[0, idx === 0 ? 0.25 : -0.25, 0]}>
          <mesh receiveShadow castShadow>
            <boxGeometry args={[7, 14, 1.5]} />
            <meshStandardMaterial color="#170f09" roughness={0.78} />
          </mesh>
          {/* Horizontal shelves on side bookcases */}
          {[-4, -1.5, 1, 3.5].map((y, sIdx) => (
            <mesh key={sIdx} position={[0, y, 0.4]}>
              <boxGeometry args={[6.6, 0.15, 1.2]} />
              <meshStandardMaterial color="#27180e" roughness={0.7} />
            </mesh>
          ))}
        </group>
      ))}

      {/* 7. Floating dust particles motes in the warm light */}
      <LibraryDustParticles />
    </group>
  );
};
