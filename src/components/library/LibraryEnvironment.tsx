import React from 'react';

export const LibraryEnvironment: React.FC = () => {
  return (
    <group name="library-environment">
      {/* Ambient warm light */}
      <ambientLight intensity={1.1} color="#fff8f0" />

      {/* Main warm key spot light for the shelves */}
      <spotLight
        position={[0, 14, 16]}
        angle={0.7}
        penumbra={0.6}
        intensity={3.6}
        color="#ffeacc"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />

      {/* Direct front fill light to brightly illuminate book spines */}
      <directionalLight position={[0, 2, 12]} intensity={1.5} color="#ffffff" />

      {/* Subtle cool fill light from side */}
      <pointLight position={[-12, 10, 8]} intensity={1.0} color="#93c5fd" />

      {/* Warm back rim light to highlight shelf silhouettes and book spines */}
      <pointLight position={[12, 8, -6]} intensity={1.4} color="#f59e0b" />

      {/* Central display pedestal spotlight */}
      <spotLight
        position={[0, 6, 4]}
        target-position={[0, 0, 0]}
        angle={0.4}
        penumbra={0.6}
        intensity={1.5}
        color="#fbbf24"
      />

      {/* Polished Parquet / Library Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.5, 0]} receiveShadow>
        <planeGeometry args={[70, 70]} />
        <meshStandardMaterial
          color="#1e140d"
          roughness={0.45}
          metalness={0.15}
        />
      </mesh>

      {/* Library Back Accent Wall with subtle architectural paneling */}
      <mesh position={[0, 4, -4.2]} receiveShadow>
        <planeGeometry args={[45, 24]} />
        <meshStandardMaterial
          color="#131722"
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      {/* Warm architectural pillars flanking the library */}
      {[-16, 16].map((xPos, idx) => (
        <group key={idx} position={[xPos, 4, -2]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.7, 0.7, 18, 16]} />
            <meshStandardMaterial color="#2d2218" roughness={0.7} />
          </mesh>
          {/* Pillar capital / trim */}
          <mesh position={[0, 8, 0]}>
            <boxGeometry args={[1.8, 0.5, 1.8]} />
            <meshStandardMaterial color="#c4823f" metalness={0.4} roughness={0.3} />
          </mesh>
          <mesh position={[0, -8, 0]}>
            <boxGeometry args={[1.8, 0.5, 1.8]} />
            <meshStandardMaterial color="#c4823f" metalness={0.4} roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
