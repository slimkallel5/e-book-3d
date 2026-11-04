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
      {/* 1. Balanced Global Ambient & Warm Library Lighting */}
      <ambientLight intensity={1.15} color="#fff7ed" />

      {/* Main warm chandelier positioned above the bookshelf */}
      <spotLight
        position={[0.5, 16, 12]}
        target-position={[0.2, 0, 0]}
        angle={0.75}
        penumbra={0.8}
        intensity={4.5}
        color="#ffecd1"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />

      {/* Direct front-fill light angled to brightly illuminate book covers, titles, and shelf details */}
      <directionalLight position={[2.5, 4.0, 16]} intensity={1.6} color="#fbf7ee" />

      {/* Left side rim light revealing outer side panel texture, pilasters, and craftsmanship */}
      <pointLight position={[-12, 6, 6]} intensity={1.8} color="#ffd494" />

      {/* Right side fill light giving clean depth to the inner shelf cavities */}
      <pointLight position={[10, 5, 8]} intensity={1.2} color="#fde68a" />

      {/* Subtle warm floor bounce light */}
      <pointLight position={[0, -4.5, 6]} intensity={0.8} color="#e5b364" />

      {/* 2. Library Floor - Polished warm walnut parquet wood extending throughout the room */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -6.0, 0]} receiveShadow>
        <planeGeometry args={[90, 90]} />
        <meshStandardMaterial
          color="#180f09"
          roughness={0.28}
          metalness={0.25}
        />
      </mesh>

      {/* Dark mahogany border inlay on floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5.99, 1.0]} receiveShadow>
        <planeGeometry args={[26, 18]} />
        <meshStandardMaterial color="#22140d" roughness={0.4} metalness={0.15} />
      </mesh>

      {/* Classical Oriental library carpet under the bookshelf */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.2, -5.98, 2.8]} receiveShadow>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial
          color="#331713"
          roughness={0.88}
          metalness={0.06}
        />
      </mesh>
      {/* Carpet gold/amber patterned border */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.2, -5.97, 2.8]}>
        <ringGeometry args={[9.5, 9.8, 4, 1, 0, Math.PI * 2]} />
        <meshStandardMaterial color="#c4823f" roughness={0.6} metalness={0.3} />
      </mesh>

      {/* 3. Deep Library Architectural Back Wall (Spanning fully behind bookshelf) */}
      <mesh position={[0, 4.5, -6.0]} receiveShadow>
        <planeGeometry args={[90, 30]} />
        <meshStandardMaterial
          color="#0f131a"
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>

      {/* Continuous classical dark oak baseboard along the back wall */}
      <mesh position={[0, -5.3, -5.85]} receiveShadow>
        <boxGeometry args={[90, 1.4, 0.3]} />
        <meshStandardMaterial color="#1a110a" roughness={0.65} metalness={0.15} />
      </mesh>

      {/* Architectural wood wainscot paneling across the back wall */}
      {[-28, -21, -14, -7, 0, 7, 14, 21, 28].map((x, i) => (
        <group key={`wainscot-group-${i}`} position={[x, 3.8, -5.8]}>
          {/* Main paneled field */}
          <mesh receiveShadow>
            <boxGeometry args={[5.8, 14.5, 0.12]} />
            <meshStandardMaterial color="#16100b" roughness={0.75} metalness={0.1} />
          </mesh>
          {/* Raised inner molding frame */}
          <mesh position={[0, 0, 0.07]} receiveShadow>
            <boxGeometry args={[4.8, 13.0, 0.04]} />
            <meshStandardMaterial color="#1f150e" roughness={0.6} metalness={0.12} />
          </mesh>
          {/* Subtle brass bead accent line */}
          <mesh position={[0, 6.4, 0.1]}>
            <boxGeometry args={[5.2, 0.06, 0.03]} />
            <meshStandardMaterial color="#b47833" roughness={0.4} metalness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Mid-wall decorative chair rail molding */}
      <mesh position={[0, -2.8, -5.7]} receiveShadow>
        <boxGeometry args={[90, 0.28, 0.35]} />
        <meshStandardMaterial color="#291b12" roughness={0.55} metalness={0.2} />
      </mesh>

      {/* 4. Left Architectural Side Wall providing depth to the room */}
      <group position={[-18.5, 4.5, 2.0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh receiveShadow>
          <planeGeometry args={[26, 30]} />
          <meshStandardMaterial color="#10151e" roughness={0.9} metalness={0.05} />
        </mesh>
        {/* Side wall baseboard */}
        <mesh position={[0, -9.8, 0.15]} receiveShadow>
          <boxGeometry args={[26, 1.4, 0.3]} />
          <meshStandardMaterial color="#1a110a" roughness={0.65} metalness={0.15} />
        </mesh>
        {/* Side wall wainscot paneling */}
        {[-8, 0, 8].map((px, pIdx) => (
          <mesh key={`side-panel-${pIdx}`} position={[px, -0.7, 0.1]} receiveShadow>
            <boxGeometry args={[6.5, 14.5, 0.12]} />
            <meshStandardMaterial color="#17110c" roughness={0.75} metalness={0.1} />
          </mesh>
        ))}
      </group>

      {/* 5. Classical Architectural Flanking Pillars Framing the Reading Hall */}
      {[-12.5, 13.5].map((xPos, idx) => (
        <group key={`hall-pillar-${idx}`} position={[xPos, 2.2, -3.2]}>
          {/* Main fluted column shaft */}
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.7, 0.7, 16.5, 24]} />
            <meshStandardMaterial color="#22160d" roughness={0.65} metalness={0.12} />
          </mesh>
          {/* Corinthian style brass capital */}
          <mesh position={[0, 8.2, 0]} castShadow>
            <boxGeometry args={[1.9, 0.65, 1.9]} />
            <meshStandardMaterial color="#c4823f" metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Column Pedestal Base */}
          <mesh position={[0, -7.6, 0]} receiveShadow>
            <boxGeometry args={[2.1, 1.2, 2.1]} />
            <meshStandardMaterial color="#180e08" roughness={0.65} metalness={0.18} />
          </mesh>

          {/* Warm decorative wall sconce lantern on each pillar */}
          <group position={[idx === 0 ? 0.85 : -0.85, 2.2, 0]}>
            <mesh>
              <sphereGeometry args={[0.18, 16, 16]} />
              <meshBasicMaterial color="#ffeed1" />
            </mesh>
            <pointLight
              color="#fbbf24"
              intensity={1.1}
              distance={7.5}
              decay={2}
            />
          </group>
        </group>
      ))}

      {/* 6. Grand Overhead Dark Oak Ceiling Beams */}
      {[-5, 0, 5, 10].map((z, idx) => (
        <mesh key={`ceiling-beam-${idx}`} position={[0, 11.2, z]} receiveShadow castShadow>
          <boxGeometry args={[60, 1.2, 0.9]} />
          <meshStandardMaterial color="#1e120a" roughness={0.7} metalness={0.15} />
        </mesh>
      ))}

      {/* 7. Background Auxiliary Bookshelves giving deep library room atmosphere */}
      {[-21, 22].map((xPos, idx) => (
        <group key={`ambient-shelf-${idx}`} position={[xPos, 2, -3.8]} rotation={[0, idx === 0 ? 0.35 : -0.35, 0]}>
          <mesh receiveShadow castShadow>
            <boxGeometry args={[7, 14.5, 1.6]} />
            <meshStandardMaterial color="#170f09" roughness={0.8} />
          </mesh>
          {[-4.2, -1.8, 0.8, 3.4].map((y, sIdx) => (
            <mesh key={sIdx} position={[0, y, 0.4]}>
              <boxGeometry args={[6.6, 0.16, 1.3]} />
              <meshStandardMaterial color="#26170e" roughness={0.7} />
            </mesh>
          ))}
        </group>
      ))}

      {/* 8. Floating subtle dust particles motes in the warm atmospheric light */}
      <LibraryDustParticles />
    </group>
  );
};
