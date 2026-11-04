import React, { useMemo } from 'react';

// Procedural multi-volume book block for auxiliary architectural bookshelves
const ShelfBookBlock: React.FC<{
  position: [number, number, number];
  width: number;
  height: number;
  colorScheme: 'leather' | 'classical' | 'gilded';
}> = ({ position, width, height, colorScheme }) => {
  const books = useMemo(() => {
    const list: Array<{ x: number; w: number; h: number; d: number; color: string; tilt: number }> = [];
    let curX = -width / 2 + 0.15;

    const leatherColors = ['#451a03', '#7f1d1d', '#1e293b', '#14532d', '#713f12', '#312e81', '#3b0764'];
    const classicalColors = ['#292524', '#365314', '#1e3a8a', '#581c87', '#7c2d12', '#1c1917'];
    const gildedColors = ['#854d0e', '#78350f', '#064e3b', '#831843', '#1e1b4b'];

    const palette =
      colorScheme === 'leather'
        ? leatherColors
        : colorScheme === 'classical'
        ? classicalColors
        : gildedColors;

    let idx = 0;
    while (curX < width / 2 - 0.2) {
      const bWidth = 0.14 + (idx % 4) * 0.04;
      const bHeight = height * (0.75 + ((idx * 7) % 5) * 0.05);
      const bDepth = 0.55 + ((idx * 3) % 4) * 0.05;
      const color = palette[idx % palette.length];
      const tilt = idx % 9 === 0 ? 0.08 : 0; // occasional leaning book

      list.push({
        x: curX + bWidth / 2,
        w: bWidth,
        h: bHeight,
        d: bDepth,
        color,
        tilt
      });

      curX += bWidth + 0.02;
      idx++;
    }
    return list;
  }, [width, height, colorScheme]);

  return (
    <group position={position}>
      {books.map((b, i) => (
        <group key={i} position={[b.x, b.h / 2, 0]} rotation={[0, 0, b.tilt]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial color={b.color} roughness={0.65} metalness={0.12} />
          </mesh>
          <mesh position={[0, b.h * 0.25, b.d / 2 + 0.005]}>
            <boxGeometry args={[b.w * 0.9, 0.03, 0.01]} />
            <meshStandardMaterial color="#e5b364" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, -b.h * 0.25, b.d / 2 + 0.005]}>
            <boxGeometry args={[b.w * 0.9, 0.03, 0.01]} />
            <meshStandardMaterial color="#e5b364" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// Rolling Wooden Library Ladder on Brass Rail
export const RollingLibraryLadder: React.FC<{ position: [number, number, number]; rotationY?: number }> = ({
  position,
  rotationY = 0
}) => {
  const ladderHeight = 8.5;
  const rungCount = 18;

  return (
    <group position={position} rotation={[0, rotationY, -0.16]}>
      {/* Left Stringer Rail */}
      <mesh position={[-0.4, ladderHeight / 2, 0]} castShadow>
        <boxGeometry args={[0.07, ladderHeight, 0.16]} />
        <meshStandardMaterial color="#24170f" roughness={0.65} metalness={0.1} />
      </mesh>
      {/* Right Stringer Rail */}
      <mesh position={[0.4, ladderHeight / 2, 0]} castShadow>
        <boxGeometry args={[0.07, ladderHeight, 0.16]} />
        <meshStandardMaterial color="#24170f" roughness={0.65} metalness={0.1} />
      </mesh>

      {/* Ladder Rungs */}
      {Array.from({ length: rungCount }).map((_, i) => {
        const rungY = 0.5 + i * (ladderHeight / (rungCount + 0.5));
        return (
          <mesh key={`rung-${i}`} position={[0, rungY, 0]} castShadow>
            <cylinderGeometry args={[0.026, 0.026, 0.74, 12]} />
            <meshStandardMaterial color="#2f1e14" roughness={0.6} />
          </mesh>
        );
      })}

      {/* Top Brass Roller Hooks */}
      <mesh position={[-0.4, ladderHeight, 0.1]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.08, 16]} />
        <meshStandardMaterial color="#c28e46" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[0.4, ladderHeight, 0.1]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.08, 16]} />
        <meshStandardMaterial color="#c28e46" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* Bottom Brass Wheels */}
      <mesh position={[-0.4, 0.12, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.06, 16]} />
        <meshStandardMaterial color="#c28e46" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[0.4, 0.12, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.06, 16]} />
        <meshStandardMaterial color="#c28e46" metalness={0.85} roughness={0.25} />
      </mesh>
    </group>
  );
};

// Wall-integrated multi-tier architectural bookshelves filling the library backdrop
export const ArchitecturalShelves: React.FC = () => {
  const shelfHeights = [-3.8, -1.8, 0.2, 2.2, 4.2, 6.2, 8.2];
  const unitWidth = 4.2;

  return (
    <group name="architectural-secondary-shelves" position={[0, 0, -4.2]}>
      {/* Brass rolling ladder rail spanning horizontally across back bookcases */}
      <mesh position={[7.5, 3.2, 0.65]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.045, 0.045, 16, 16]} />
        <meshStandardMaterial color="#d49b4d" metalness={0.88} roughness={0.22} />
      </mesh>
      {[0.5, 4.5, 8.5, 12.5, 15.5].map((bx, i) => (
        <mesh key={`bracket-${i}`} position={[bx, 3.2, 0.35]}>
          <boxGeometry args={[0.08, 0.15, 0.6]} />
          <meshStandardMaterial color="#c28e46" metalness={0.85} roughness={0.25} />
        </mesh>
      ))}

      {/* Recessed Bookcase Units */}
      {[2.5, 7.5, 12.5].map((centerX, bayIdx) => (
        <group key={`shelf-bay-${bayIdx}`} position={[centerX, 0, 0]}>
          <mesh position={[0, 2.3, -0.4]} receiveShadow>
            <planeGeometry args={[unitWidth, 12.8]} />
            <meshStandardMaterial color="#140d08" roughness={0.85} />
          </mesh>

          <mesh position={[-unitWidth / 2, 2.3, 0]} receiveShadow castShadow>
            <boxGeometry args={[0.22, 12.8, 0.8]} />
            <meshStandardMaterial color="#21150d" roughness={0.65} metalness={0.1} />
          </mesh>
          <mesh position={[unitWidth / 2, 2.3, 0]} receiveShadow castShadow>
            <boxGeometry args={[0.22, 12.8, 0.8]} />
            <meshStandardMaterial color="#21150d" roughness={0.65} metalness={0.1} />
          </mesh>
          <mesh position={[0, 8.7, 0.1]} castShadow receiveShadow>
            <boxGeometry args={[unitWidth + 0.3, 0.45, 1.0]} />
            <meshStandardMaterial color="#2a1a11" roughness={0.6} metalness={0.12} />
          </mesh>

          {shelfHeights.map((sy, sIdx) => (
            <group key={`row-${sIdx}`}>
              <mesh position={[0, sy, 0]} receiveShadow castShadow>
                <boxGeometry args={[unitWidth - 0.05, 0.14, 0.75]} />
                <meshStandardMaterial color="#281a11" roughness={0.65} metalness={0.1} />
              </mesh>
              <mesh position={[0, sy, 0.38]}>
                <boxGeometry args={[unitWidth - 0.05, 0.04, 0.02]} />
                <meshStandardMaterial color="#c28e46" metalness={0.75} roughness={0.3} />
              </mesh>
              <ShelfBookBlock
                position={[0, sy + 0.07, 0]}
                width={unitWidth - 0.25}
                height={1.5}
                colorScheme={bayIdx === 0 ? 'leather' : bayIdx === 1 ? 'classical' : 'gilded'}
              />
            </group>
          ))}
        </group>
      ))}

      <RollingLibraryLadder position={[9.8, -5.75, 0.65]} rotationY={0.06} />
    </group>
  );
};
