import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ArchedWindows } from './ArchedWindows';
import { ReadingHall } from './ReadingHall';
import { ArchitecturalShelves } from './ArchitecturalShelves';
import { CeilingAndPendants } from './CeilingAndPendants';

// Floating dust motes / ambient light particles to add subtle depth & atmosphere
const LibraryDustParticles: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 180;

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const spd = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 32 + 2; // X span across entire room
      pos[i * 3 + 1] = Math.random() * 15 - 5; // Y height from floor upward
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20 + 2; // Z depth

      spd[i * 3] = (Math.random() - 0.5) * 0.003;
      spd[i * 3 + 1] = Math.random() * 0.003 + 0.0015; // slow upward drift
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
      if (array[i * 3 + 1] > 10.5) {
        array[i * 3 + 1] = -5;
        array[i * 3] = (Math.random() - 0.5) * 32 + 2;
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
        size={0.24}
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
      {/* 1. Global Ambient & Warm Atmosphere Lighting */}
      <ambientLight intensity={1.2} color="#fff6eb" />

      {/* Main warm spotlight illuminating the left educational bookshelf */}
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

      {/* Direct front fill light to clearly display titles, spine texts, and wood grain */}
      <directionalLight position={[-2.0, 4.5, 14]} intensity={1.4} color="#fbf7ee" />

      {/* Left side rim light illuminating shelf edges and moldings */}
      <pointLight position={[-16, 7, 5]} intensity={1.6} color="#ffd494" />

      {/* 2. Library Floor - Rich warm polished parquet wood at continuous level Y = -5.75 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5.75, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          color="#160e08"
          roughness={0.28}
          metalness={0.25}
        />
      </mesh>

      {/* Floor Parquet Inlay Border Accent Lines */}
      {[-8, 0, 8, 16].map((x, i) => (
        <mesh key={`floor-strip-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, -5.748, 0]}>
          <planeGeometry args={[0.06, 50]} />
          <meshStandardMaterial color="#3a2215" roughness={0.4} metalness={0.2} />
        </mesh>
      ))}

      {/* Persian/Oriental runner rug in front of the main bookshelf */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3.5, -5.73, 3.8]} receiveShadow>
        <planeGeometry args={[18, 8]} />
        <meshStandardMaterial
          color="#381b17"
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>
      {/* Rug border accent */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3.5, -5.725, 3.8]}>
        <ringGeometry args={[8.8, 9, 4, 1, 0, Math.PI * 2]} />
        <meshStandardMaterial color="#c4823f" roughness={0.6} metalness={0.3} />
      </mesh>

      {/* Second runner rug under reading table hall */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[6.2, -5.73, 2.4]} receiveShadow>
        <planeGeometry args={[12, 6.5]} />
        <meshStandardMaterial
          color="#2e1a17"
          roughness={0.88}
          metalness={0.06}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[6.2, -5.725, 2.4]}>
        <ringGeometry args={[6.1, 6.25, 4, 1, 0, Math.PI * 2]} />
        <meshStandardMaterial color="#d49b4d" roughness={0.5} metalness={0.35} />
      </mesh>

      {/* 3. Grand Architectural Walls */}
      {/* Back Accent Wall with architectural wood wainscoting */}
      <mesh position={[0, 4, -4.5]} receiveShadow>
        <planeGeometry args={[80, 28]} />
        <meshStandardMaterial
          color="#0c1017"
          roughness={0.88}
          metalness={0.05}
        />
      </mesh>

      {/* Architectural decorative wood wainscot panels on back wall */}
      {[-24, -18, -12, -6, 0, 6, 12, 18, 24].map((x, i) => (
        <mesh key={`panel-${i}`} position={[x, 3.5, -4.4]} receiveShadow>
          <boxGeometry args={[4.5, 14, 0.1]} />
          <meshStandardMaterial color="#17110c" roughness={0.75} metalness={0.1} />
        </mesh>
      ))}

      {/* Right Architectural Wall with cutouts for arched windows */}
      <mesh position={[14.5, 3.5, 5]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[30, 24]} />
        <meshStandardMaterial
          color="#120e0b"
          roughness={0.85}
          metalness={0.08}
        />
      </mesh>

      {/* Left Outer Architectural Wall */}
      <mesh position={[-24, 3.5, 5]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[30, 24]} />
        <meshStandardMaterial
          color="#100b08"
          roughness={0.85}
          metalness={0.08}
        />
      </mesh>

      {/* 4. Arched Windows with Natural Inward Daylight on the Right Wall */}
      <ArchedWindows />

      {/* 5. Architectural Secondary Bookshelves on the Wall with Rolling Ladder */}
      <ArchitecturalShelves />

      {/* 6. Grand Reading Hall Furniture (Table, Banker's Lamps, Chairs, Globe, Plants) */}
      <ReadingHall />

      {/* 7. Coffered Ceiling with Hanging Brass Pendant Chandeliers */}
      <CeilingAndPendants />

      {/* 8. Classical Flanking Column Pillars */}
      {[-18, 15.5].map((xPos, idx) => (
        <group key={`pillar-${idx}`} position={[xPos, 2.5, -1.5]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.75, 0.75, 16, 24]} />
            <meshStandardMaterial color="#2a1d13" roughness={0.65} metalness={0.1} />
          </mesh>
          <mesh position={[0, 8, 0]} castShadow>
            <boxGeometry args={[2.0, 0.6, 2.0]} />
            <meshStandardMaterial color="#c4823f" metalness={0.5} roughness={0.3} />
          </mesh>
          <mesh position={[0, -7.5, 0]} receiveShadow>
            <boxGeometry args={[2.2, 1.0, 2.2]} />
            <meshStandardMaterial color="#1b110a" roughness={0.6} metalness={0.2} />
          </mesh>
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

      {/* 9. Ambient floating light motes / dust particles */}
      <LibraryDustParticles />
    </group>
  );
};
