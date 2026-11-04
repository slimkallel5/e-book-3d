import React from 'react';
import * as THREE from 'three';

// Classic green glass shade Banker's Lamp with brass stand and pull chain
export const BankersLamp: React.FC<{ position: [number, number, number]; rotationY?: number }> = ({
  position,
  rotationY = 0
}) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Heavy brass stepped circular base */}
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.25, 0.08, 20]} />
        <meshStandardMaterial color="#c28e46" metalness={0.78} roughness={0.25} />
      </mesh>
      {/* Vertical curved brass stem */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.045, 0.75, 16]} />
        <meshStandardMaterial color="#d49b4d" metalness={0.8} roughness={0.22} />
      </mesh>
      {/* Brass swivel arm */}
      <mesh position={[0, 0.82, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 0.32, 12]} />
        <meshStandardMaterial color="#c28e46" metalness={0.8} roughness={0.25} />
      </mesh>
      {/* Emerald green curved glass hood / shade */}
      <mesh position={[0, 0.8, 0]} rotation={[0.2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.44, 20, 1, false, 0, Math.PI]} />
        <meshPhysicalMaterial
          color="#064e3b"
          roughness={0.12}
          transmission={0.4}
          thickness={0.15}
          reflectivity={0.8}
          clearcoat={0.9}
        />
      </mesh>
      {/* Warm internal bulb */}
      <mesh position={[0, 0.75, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshBasicMaterial color="#fef08a" />
      </mesh>
      {/* Pool of reading light on the table below */}
      <pointLight
        position={[0, 0.7, 0]}
        color="#fde047"
        intensity={1.4}
        distance={3.5}
        decay={2}
        castShadow
        shadow-bias={-0.0005}
      />
    </group>
  );
};

// Classical slatted wooden library armchair
export const LibraryChair: React.FC<{ position: [number, number, number]; rotationY?: number }> = ({
  position,
  rotationY = 0
}) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Chair Seat */}
      <mesh position={[0, 0.95, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.85, 0.08, 0.85]} />
        <meshStandardMaterial color="#2d1d14" roughness={0.65} metalness={0.12} />
      </mesh>
      {/* Leather seat cushion */}
      <mesh position={[0, 1.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.78, 0.06, 0.78]} />
        <meshStandardMaterial color="#1a110a" roughness={0.75} metalness={0.05} />
      </mesh>

      {/* 4 Turned Chair Legs */}
      {[
        [-0.34, -0.34],
        [0.34, -0.34],
        [-0.34, 0.34],
        [0.34, 0.34]
      ].map(([x, z], i) => (
        <mesh key={`chair-leg-${i}`} position={[x, 0.45, z]} castShadow receiveShadow>
          <cylinderGeometry args={[0.038, 0.032, 0.9, 12]} />
          <meshStandardMaterial color="#22150d" roughness={0.7} metalness={0.1} />
        </mesh>
      ))}

      {/* Leg stretchers / crossbars */}
      <mesh position={[0, 0.28, -0.34]} castShadow>
        <boxGeometry args={[0.68, 0.03, 0.03]} />
        <meshStandardMaterial color="#22150d" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.28, 0.34]} castShadow>
        <boxGeometry args={[0.68, 0.03, 0.03]} />
        <meshStandardMaterial color="#22150d" roughness={0.7} />
      </mesh>

      {/* Chair Back upright posts */}
      <mesh position={[-0.34, 1.6, -0.38]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 1.25, 12]} />
        <meshStandardMaterial color="#22150d" roughness={0.7} />
      </mesh>
      <mesh position={[0.34, 1.6, -0.38]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 1.25, 12]} />
        <meshStandardMaterial color="#22150d" roughness={0.7} />
      </mesh>
      {/* Top carved crest rail */}
      <mesh position={[0, 2.2, -0.38]} castShadow>
        <boxGeometry args={[0.85, 0.14, 0.06]} />
        <meshStandardMaterial color="#2d1d14" roughness={0.65} />
      </mesh>
      {/* Back vertical splats/spindles */}
      {[-0.18, -0.06, 0.06, 0.18].map((x, i) => (
        <mesh key={`spindle-${i}`} position={[x, 1.6, -0.38]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 1.05, 10]} />
          <meshStandardMaterial color="#2d1d14" roughness={0.65} />
        </mesh>
      ))}
    </group>
  );
};

// Antique Brass & Turned Mahogany Globe
export const TerrestrialGlobe: React.FC<{ position: [number, number, number]; rotationY?: number }> = ({
  position,
  rotationY = 0
}) => {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Ornate circular wood pedestal plinth */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.42, 0.48, 0.2, 24]} />
        <meshStandardMaterial color="#2a1b12" roughness={0.6} metalness={0.15} />
      </mesh>
      {/* Turned central wood pillar */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.16, 0.7, 16]} />
        <meshStandardMaterial color="#24170f" roughness={0.6} metalness={0.15} />
      </mesh>
      {/* Brass meridian gimbal ring support bracket */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.22, 14]} />
        <meshStandardMaterial color="#d49b4d" metalness={0.8} roughness={0.25} />
      </mesh>
      {/* Full 360-degree graduated brass meridian ring */}
      <mesh position={[0, 1.55, 0]} rotation={[0.41, 0.3, 0]} castShadow>
        <torusGeometry args={[0.62, 0.045, 16, 36]} />
        <meshStandardMaterial color="#c28e46" metalness={0.82} roughness={0.25} />
      </mesh>
      {/* Globe sphere tilted at ~23.5 degrees */}
      <group position={[0, 1.55, 0]} rotation={[0.41, 0.3, 0]}>
        {/* Globe axis rod */}
        <mesh>
          <cylinderGeometry args={[0.02, 0.02, 1.45, 12]} />
          <meshStandardMaterial color="#d49b4d" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Globe world sphere */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.54, 32, 32]} />
          <meshStandardMaterial
            color="#2a4858"
            roughness={0.55}
            metalness={0.1}
          />
        </mesh>
        {/* Gold continent accents on globe */}
        <mesh rotation={[0.2, 0.4, 0]}>
          <ringGeometry args={[0.42, 0.46, 24]} />
          <meshBasicMaterial color="#e5b364" side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
};

// Lush Potted Indoor Plant (Ficus / Palm) in Terracotta/Ceramic Planter
export const PottedPlant: React.FC<{ position: [number, number, number]; scale?: number }> = ({
  position,
  scale = 1.0
}) => {
  return (
    <group position={position} scale={scale}>
      {/* Ceramic glazed cylindrical planter urn */}
      <mesh position={[0, 0.65, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.38, 1.3, 20]} />
        <meshStandardMaterial color="#8a533a" roughness={0.4} metalness={0.1} />
      </mesh>
      {/* Pot rim molding */}
      <mesh position={[0, 1.32, 0]} castShadow>
        <torusGeometry args={[0.51, 0.06, 12, 24]} />
        <meshStandardMaterial color="#70412d" roughness={0.45} />
      </mesh>
      {/* Soil */}
      <mesh position={[0, 1.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.46, 16]} />
        <meshStandardMaterial color="#1a120c" roughness={0.9} />
      </mesh>

      {/* Main woody plant stems */}
      {[
        [-0.08, 1.8, -0.05, 0.1, 0.15],
        [0.06, 1.9, 0.04, -0.15, 0.1],
        [0.0, 2.05, 0.0, 0.05, -0.1]
      ].map(([x, y, z, rx, rz], idx) => (
        <mesh key={`stem-${idx}`} position={[x, y, z]} rotation={[rx, 0, rz]} castShadow>
          <cylinderGeometry args={[0.03, 0.05, 1.4, 8]} />
          <meshStandardMaterial color="#2d2218" roughness={0.8} />
        </mesh>
      ))}

      {/* Lush green foliage leaves branching outward */}
      {[
        [0.4, 2.3, 0.3, 0.4, 0.2, 0.5],
        [-0.45, 2.2, 0.25, -0.3, -0.4, 0.5],
        [0.2, 2.5, -0.4, 0.2, 0.5, -0.4],
        [-0.3, 2.45, -0.35, -0.4, -0.3, -0.3],
        [0.0, 2.7, 0.0, 0.1, 0.1, 0.1],
        [0.55, 2.1, -0.1, 0.5, 0.3, 0.2],
        [-0.55, 2.15, -0.1, -0.5, 0.2, -0.2]
      ].map(([x, y, z, rx, ry, rz], idx) => (
        <group key={`leaf-${idx}`} position={[x, y, z]} rotation={[rx, ry, rz]}>
          <mesh castShadow receiveShadow>
            <coneGeometry args={[0.32, 0.9, 5]} />
            <meshStandardMaterial
              color="#1b4328"
              roughness={0.35}
              metalness={0.05}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// Grand Long Polished Mahogany Reading Table with slatted chairs, open books, and banker's lamps
export const ReadingHall: React.FC = () => {
  return (
    <group name="reading-hall-furniture" position={[5.4, -5.75, 2.0]}>
      {/* 1. Large Polished Mahogany Tabletop */}
      <mesh position={[0, 2.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[9.5, 0.18, 3.4]} />
        <meshStandardMaterial
          color="#22130c"
          roughness={0.22}
          metalness={0.18}
        />
      </mesh>

      {/* Molded table apron frame */}
      <mesh position={[0, 1.95, 0]} castShadow receiveShadow>
        <boxGeometry args={[9.3, 0.16, 3.2]} />
        <meshStandardMaterial color="#1a0e08" roughness={0.5} />
      </mesh>

      {/* 6 Heavy Turned Wooden Table Legs */}
      {[
        [-4.3, -1.35],
        [0, -1.35],
        [4.3, -1.35],
        [-4.3, 1.35],
        [0, 1.35],
        [4.3, 1.35]
      ].map(([lx, lz], i) => (
        <group key={`table-leg-${i}`} position={[lx, 1.0, lz]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.16, 0.14, 1.9, 16]} />
            <meshStandardMaterial color="#1c0f0a" roughness={0.6} metalness={0.12} />
          </mesh>
          <mesh position={[0, 0.35, 0]} castShadow>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshStandardMaterial color="#23130d" roughness={0.5} metalness={0.12} />
          </mesh>
          <mesh position={[0, -0.9, 0]}>
            <cylinderGeometry args={[0.15, 0.16, 0.12, 16]} />
            <meshStandardMaterial color="#c28e46" metalness={0.75} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* 2. Classic Banker's Lamps on Table Centerline */}
      <BankersLamp position={[-2.8, 2.19, 0]} rotationY={0} />
      <BankersLamp position={[0, 2.19, 0]} rotationY={0} />
      <BankersLamp position={[2.8, 2.19, 0]} rotationY={0} />

      {/* 3. Open Study Books and Folios on Table */}
      <group position={[-1.5, 2.21, 0.7]} rotation={[0, 0.15, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.8, 0.04, 0.6]} />
          <meshStandardMaterial color="#fef9c3" roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.02, 0]}>
          <boxGeometry args={[0.84, 0.02, 0.64]} />
          <meshStandardMaterial color="#451a03" roughness={0.7} />
        </mesh>
      </group>

      <group position={[1.4, 2.21, -0.7]} rotation={[0, -0.22, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.85, 0.04, 0.62]} />
          <meshStandardMaterial color="#fffbeb" roughness={0.8} />
        </mesh>
        <mesh position={[0, -0.02, 0]}>
          <boxGeometry args={[0.89, 0.02, 0.66]} />
          <meshStandardMaterial color="#1e1b4b" roughness={0.7} />
        </mesh>
      </group>

      <group position={[-3.6, 2.22, -0.6]} rotation={[0, 0.3, 0]}>
        <mesh position={[0, 0.04, 0]} castShadow>
          <boxGeometry args={[0.7, 0.08, 0.5]} />
          <meshStandardMaterial color="#7f1d1d" roughness={0.6} />
        </mesh>
        <mesh position={[0.02, 0.11, -0.01]} rotation={[0, -0.15, 0]} castShadow>
          <boxGeometry args={[0.65, 0.06, 0.46]} />
          <meshStandardMaterial color="#14532d" roughness={0.6} />
        </mesh>
      </group>

      {/* 4. Library Chairs placed along both sides of table */}
      <LibraryChair position={[-2.8, 0, 2.3]} rotationY={Math.PI} />
      <LibraryChair position={[0, 0, 2.3]} rotationY={Math.PI} />
      <LibraryChair position={[2.8, 0, 2.3]} rotationY={Math.PI} />

      <LibraryChair position={[-2.8, 0, -2.3]} rotationY={0} />
      <LibraryChair position={[0, 0, -2.3]} rotationY={0} />
      <LibraryChair position={[2.8, 0, -2.3]} rotationY={0} />

      {/* 5. Antique Terrestrial Globe on turned stand beside the table */}
      <TerrestrialGlobe position={[5.6, 0, 0.2]} rotationY={-0.4} />

      {/* 6. Decorative Potted Plants framing the reading area */}
      <PottedPlant position={[-5.6, 0, 2.2]} scale={1.15} />
      <PottedPlant position={[5.6, 0, 2.4]} scale={1.25} />
    </group>
  );
};
