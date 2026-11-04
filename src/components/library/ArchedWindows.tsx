import React, { useMemo } from 'react';
import * as THREE from 'three';

function createArchedShape(width: number, height: number, archRadius: number): THREE.Shape {
  const shape = new THREE.Shape();
  const halfW = width / 2;
  const straightH = height - archRadius;

  shape.moveTo(-halfW, 0);
  shape.lineTo(-halfW, straightH);
  shape.absarc(0, straightH, archRadius, Math.PI, 0, true);
  shape.lineTo(halfW, 0);
  shape.closePath();

  return shape;
}

interface SingleArchedWindowProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  height?: number;
}

export const SingleArchedWindow: React.FC<SingleArchedWindowProps> = ({
  position,
  rotation = [0, 0, 0],
  width = 3.6,
  height = 9.2
}) => {
  const archRadius = width / 2;
  const straightHeight = height - archRadius;

  const archShape = useMemo(() => createArchedShape(width, height, archRadius), [width, height, archRadius]);

  return (
    <group position={position} rotation={rotation}>
      {/* 1. Exterior daylight luminous backdrop plane behind window */}
      <mesh position={[0, height / 2, -0.4]}>
        <planeGeometry args={[width + 0.8, height + 1.2]} />
        <meshBasicMaterial color="#e0f2fe" toneMapped={false} />
      </mesh>

      {/* Exterior warm sunlight glow behind glass */}
      <mesh position={[0, straightHeight + archRadius * 0.5, -0.3]}>
        <circleGeometry args={[archRadius * 1.4, 24]} />
        <meshBasicMaterial color="#fffbeb" toneMapped={false} />
      </mesh>

      {/* 2. Window Glass with realistic specular shine and semi-transparency */}
      <mesh position={[0, 0, 0]}>
        <shapeGeometry args={[archShape]} />
        <meshPhysicalMaterial
          color="#dbeafe"
          roughness={0.08}
          transmission={0.88}
          thickness={0.2}
          transparent
          opacity={0.7}
          reflectivity={0.9}
        />
      </mesh>

      {/* 3. Deep Architectural Stone/Wood Casing Outer Frame */}
      <mesh position={[-width / 2 - 0.15, straightHeight / 2, 0.15]} receiveShadow castShadow>
        <boxGeometry args={[0.3, straightHeight, 0.45]} />
        <meshStandardMaterial color="#1f1610" roughness={0.7} metalness={0.1} />
      </mesh>
      <mesh position={[width / 2 + 0.15, straightHeight / 2, 0.15]} receiveShadow castShadow>
        <boxGeometry args={[0.3, straightHeight, 0.45]} />
        <meshStandardMaterial color="#1f1610" roughness={0.7} metalness={0.1} />
      </mesh>
      <mesh position={[0, -0.15, 0.25]} receiveShadow castShadow>
        <boxGeometry args={[width + 0.8, 0.35, 0.65]} />
        <meshStandardMaterial color="#2d2117" roughness={0.65} metalness={0.12} />
      </mesh>
      <mesh position={[0, straightHeight, 0.15]} rotation={[0, 0, 0]} castShadow>
        <torusGeometry args={[archRadius + 0.15, 0.18, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#1f1610" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* 4. Fine Window Mullions / Grids */}
      <mesh position={[0, straightHeight * 0.5, 0.05]} castShadow>
        <boxGeometry args={[0.08, straightHeight, 0.12]} />
        <meshStandardMaterial color="#18110b" roughness={0.6} />
      </mesh>
      <mesh position={[0, straightHeight + archRadius * 0.5, 0.05]} castShadow>
        <boxGeometry args={[0.08, archRadius, 0.12]} />
        <meshStandardMaterial color="#18110b" roughness={0.6} />
      </mesh>

      <mesh position={[0, straightHeight, 0.06]} castShadow>
        <boxGeometry args={[width, 0.12, 0.14]} />
        <meshStandardMaterial color="#1c130d" roughness={0.6} />
      </mesh>

      {[0.25, 0.5, 0.75].map((factor, i) => (
        <mesh key={`transom-${i}`} position={[0, straightHeight * factor, 0.04]} castShadow>
          <boxGeometry args={[width, 0.06, 0.08]} />
          <meshStandardMaterial color="#251a12" roughness={0.6} />
        </mesh>
      ))}

      {[-30, 0, 30].map((angleDeg, i) => {
        const rad = (angleDeg * Math.PI) / 180;
        return (
          <mesh
            key={`radial-${i}`}
            position={[0, straightHeight, 0.05]}
            rotation={[0, 0, rad]}
          >
            <cylinderGeometry args={[0.035, 0.035, archRadius, 8]} />
            <meshStandardMaterial color="#18110b" roughness={0.6} />
          </mesh>
        );
      })}

      {/* 5. Inward Natural Daylight Point/Directional Glow */}
      <pointLight
        position={[0, straightHeight + archRadius * 0.4, 1.2]}
        color="#dbeafe"
        intensity={1.8}
        distance={18}
        decay={2}
      />
    </group>
  );
};

export const ArchedWindows: React.FC = () => {
  return (
    <group name="arched-windows-gallery">
      {/* Positioned on the right wall slightly angled or visible in camera frustum */}
      <SingleArchedWindow
        position={[12.8, -5.75, -2.5]}
        rotation={[0, -Math.PI / 2.3, 0]}
        width={3.8}
        height={10.5}
      />
      <SingleArchedWindow
        position={[12.8, -5.75, 3.8]}
        rotation={[0, -Math.PI / 2.3, 0]}
        width={3.8}
        height={10.5}
      />
      <SingleArchedWindow
        position={[12.8, -5.75, 10]}
        rotation={[0, -Math.PI / 2.3, 0]}
        width={3.8}
        height={10.5}
      />

      <directionalLight
        position={[22, 14, 6]}
        target-position={[6, -2, 2]}
        intensity={1.7}
        color="#bae6fd"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0002}
      />
    </group>
  );
};
