import React from 'react';

// Hanging Ornate Brass Chandelier with warm amber lantern glow
export const BrassPendantChandelier: React.FC<{
  position: [number, number, number];
  chainLength?: number;
}> = ({ position, chainLength = 3.5 }) => {
  return (
    <group position={position}>
      {/* Ceiling mounting rosette cap */}
      <mesh position={[0, chainLength, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.38, 0.12, 20]} />
        <meshStandardMaterial color="#c28e46" metalness={0.8} roughness={0.25} />
      </mesh>

      {/* Hanging Brass Chain Link Rod */}
      <mesh position={[0, chainLength / 2, 0]}>
        <cylinderGeometry args={[0.03, 0.03, chainLength, 8]} />
        <meshStandardMaterial color="#d49b4d" metalness={0.85} roughness={0.22} />
      </mesh>

      {/* Chandelier Main Ring Hub */}
      <mesh position={[0, 0, 0]} castShadow>
        <torusGeometry args={[0.85, 0.08, 16, 32]} />
        <meshStandardMaterial color="#c28e46" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* Center finial spike */}
      <mesh position={[0, -0.4, 0]} castShadow>
        <coneGeometry args={[0.16, 0.6, 12]} />
        <meshStandardMaterial color="#c28e46" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* 4 Radiating curved brass arms with glowing warm candle/lantern shades */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => {
        const armX = Math.cos(angle) * 0.85;
        const armZ = Math.sin(angle) * 0.85;
        return (
          <group key={`lantern-${idx}`} position={[armX, 0.2, armZ]}>
            <mesh position={[0, -0.05, 0]}>
              <cylinderGeometry args={[0.15, 0.12, 0.04, 16]} />
              <meshStandardMaterial color="#c28e46" metalness={0.8} roughness={0.25} />
            </mesh>
            <mesh position={[0, 0.18, 0]}>
              <cylinderGeometry args={[0.14, 0.1, 0.38, 16]} />
              <meshPhysicalMaterial
                color="#fef08a"
                emissive="#f59e0b"
                emissiveIntensity={0.6}
                roughness={0.2}
                transmission={0.6}
                thickness={0.15}
                transparent
                opacity={0.85}
              />
            </mesh>
            <mesh position={[0, 0.16, 0]}>
              <sphereGeometry args={[0.07, 12, 12]} />
              <meshBasicMaterial color="#fffbeb" />
            </mesh>
          </group>
        );
      })}

      <pointLight
        position={[0, -0.2, 0]}
        color="#fbbf24"
        intensity={2.8}
        distance={18}
        decay={2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0003}
      />
    </group>
  );
};

// Deep coffered dark walnut wood ceiling with crossbeams and molded cornices
export const CeilingAndPendants: React.FC = () => {
  const ceilingY = 10.8;
  const beamDepth = 0.95;
  const beamWidth = 0.65;

  return (
    <group name="ceiling-and-chandeliers">
      {/* 1. Recessed Ceiling Background Surface */}
      <mesh position={[0, ceilingY + 0.5, 3]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[70, 40]} />
        <meshStandardMaterial color="#19110a" roughness={0.82} metalness={0.08} />
      </mesh>

      {/* 2. Deep Longitudinal Ceiling Beams (along X axis) */}
      {[-5, 0, 5, 10, 15].map((z, idx) => (
        <mesh
          key={`long-beam-${idx}`}
          position={[0, ceilingY, z]}
          receiveShadow
          castShadow
        >
          <boxGeometry args={[65, beamDepth, beamWidth]} />
          <meshStandardMaterial color="#20130b" roughness={0.65} metalness={0.12} />
        </mesh>
      ))}

      {/* 3. Deep Transverse Crossbeams (along Z axis) forming classical coffered squares */}
      {[-16, -10, -4, 2, 8, 14, 20].map((x, idx) => (
        <mesh
          key={`cross-beam-${idx}`}
          position={[x, ceilingY - 0.05, 5]}
          receiveShadow
          castShadow
        >
          <boxGeometry args={[beamWidth, beamDepth, 24]} />
          <meshStandardMaterial color="#1a0f08" roughness={0.65} metalness={0.12} />
        </mesh>
      ))}

      {/* Molded Cornice Trim along top of walls */}
      <mesh position={[0, ceilingY - 0.4, -4.3]} receiveShadow castShadow>
        <boxGeometry args={[65, 0.8, 0.4]} />
        <meshStandardMaterial color="#27180e" roughness={0.6} metalness={0.15} />
      </mesh>

      {/* 4. Hanging Brass Pendant Chandeliers illuminating the hall */}
      <BrassPendantChandelier position={[6.0, ceilingY - 3.2, 2.5]} chainLength={3.2} />
      <BrassPendantChandelier position={[12.5, ceilingY - 3.2, 2.5]} chainLength={3.2} />
      <BrassPendantChandelier position={[6.0, ceilingY - 3.2, 9.5]} chainLength={3.2} />
      <BrassPendantChandelier position={[-3.5, ceilingY - 3.2, 1.5]} chainLength={3.2} />
    </group>
  );
};
