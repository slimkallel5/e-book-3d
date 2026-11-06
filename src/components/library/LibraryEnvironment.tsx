import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Floating dust motes / golden ambient light particles in reading hall
const LibraryDustParticles: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 75;

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const spd = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.3) * 28;
      pos[i * 3 + 1] = Math.random() * 12 - 4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 22;

      spd[i * 3 + 0] = (Math.random() - 0.5) * 0.18;
      spd[i * 3 + 1] = Math.random() * 0.25 + 0.12;
      spd[i * 3 + 2] = (Math.random() - 0.5) * 0.18;
    }

    return [pos, spd];
  }, []);

  const lastUpdate = useRef(0);
  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const dt = Math.min(delta, 0.1);
    lastUpdate.current += dt;
    if (lastUpdate.current < 0.03) return;
    const step = lastUpdate.current;
    lastUpdate.current = 0;

    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      arr[i * 3 + 0] += speeds[i * 3 + 0] * step;
      arr[i * 3 + 1] += speeds[i * 3 + 1] * step;
      arr[i * 3 + 2] += speeds[i * 3 + 2] * step;

      if (arr[i * 3 + 1] > 8.0) {
        arr[i * 3 + 1] = -4.0;
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
        size={0.07}
        color="#ffcf73"
        transparent
        opacity={0.55}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export const LibraryEnvironment: React.FC = React.memo(() => {
  const darkWalnut = '#382014';
  const midWalnut = '#693a1f';
  const warmWood = '#945629';
  const goldenAmber = '#e9a743';
  const warmGlow = '#ffc36a';
  const shadowRecess = '#21140f';
  const warmBeige = '#c9a77e';

  return (
    <group name="library-environment">
      {/* 1. Global Ambient & Golden Amber Lighting (Faithful to Reference Atmosphere) */}
      <ambientLight intensity={1.2} color="#fcebd2" />

      {/* Main warm illumination over the bookshelf & central room */}
      <pointLight position={[-1.5, 6.0, 4.0]} intensity={3.5} color={warmGlow} distance={18} decay={1.8} />

      {/* Daylight streaming through the large right arched window */}
      <directionalLight
        position={[14, 4.5, -1.0]}
        intensity={3.8}
        color="#fff1d6"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={35}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-bias={-0.0002}
      />

      {/* Warm ambient fill light throughout reading hall to prevent dark voids */}
      <spotLight
        position={[2.0, 5.0, 5.0]}
        target-position={[2.0, 1.0, -4.0]}
        intensity={3.6}
        color="#ffd38a"
        angle={0.75}
        penumbra={0.6}
      />
      <pointLight position={[0.0, 1.0, 0.0]} intensity={2.0} color="#ffbe6b" distance={15} />

      {/* Subtle floor bounce light */}
      <pointLight position={[3, -2.5, 3]} intensity={1.8} color="#d98943" distance={12} />

      {/* 2. Continuous Polished Reflective Wooden/Parquet Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2, -4.8, 0]} receiveShadow>
        <planeGeometry args={[50, 40]} />
        <meshStandardMaterial
          color="#a86536"
          roughness={0.16}
          metalness={0.22}
          envMapIntensity={1.3}
        />
      </mesh>

      {/* Floor Parquet Plank Inlays */}
      {[-8, -4, 0, 4, 8, 12].map((x, i) => (
        <mesh key={`floor-line-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, -4.79, 0]}>
          <planeGeometry args={[0.04, 38]} />
          <meshBasicMaterial color="#5c341b" transparent opacity={0.35} />
        </mesh>
      ))}

      {/* Decorative Area Rug under Reading Table (Matching Reference) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[6.5, -4.78, 1.8]} receiveShadow>
        <planeGeometry args={[7.2, 5.8]} />
        <meshStandardMaterial color="#8b5030" roughness={0.7} metalness={0.05} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[6.5, -4.77, 1.8]}>
        <ringGeometry args={[3.3, 3.45, 32]} />
        <meshStandardMaterial color={goldenAmber} roughness={0.5} metalness={0.4} />
      </mesh>

      {/* 3. Wooden Ceiling with Linear Coffered Decorative Details & Beams */}
      <group position={[2, 6.8, 0]}>
        {/* Main ceiling base plane */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <planeGeometry args={[60, 50]} />
          <meshStandardMaterial color={darkWalnut} roughness={0.65} metalness={0.15} />
        </mesh>

        {/* Linear longitudinal ceiling slats/recesses */}
        {[-14, -11, -8, -5, -2, 1, 4, 7, 10, 13, 16].map((x, idx) => (
          <mesh key={`ceil-slat-${idx}`} position={[x, -0.06, 0]}>
            <boxGeometry args={[0.22, 0.15, 34]} />
            <meshStandardMaterial color={shadowRecess} roughness={0.8} />
          </mesh>
        ))}

        {/* Major transverse coffered wooden beams */}
        {[-8, -3, 2, 7, 12].map((z, idx) => (
          <mesh key={`ceil-beam-${idx}`} position={[0, -0.16, z]}>
            <boxGeometry args={[44, 0.35, 0.65]} />
            <meshStandardMaterial color={midWalnut} roughness={0.55} metalness={0.2} />
          </mesh>
        ))}

        {/* Warm Golden Circular Recessed Ceiling Downlights */}
        {[-4, 1, 6, 11].map((x, ix) =>
          [-4, 1, 6].map((z, iz) => (
            <group key={`recess-light-${ix}-${iz}`} position={[x, -0.02, z]}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.08, 0.16, 16]} />
                <meshStandardMaterial color={goldenAmber} metalness={0.8} roughness={0.2} />
              </mesh>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.08, 16]} />
                <meshBasicMaterial color={warmGlow} />
              </mesh>
            </group>
          ))
        )}
      </group>

      {/* 4. Circular Illuminated Pendant Lights / Concentric Halo Chandeliers */}
      {[
        { x: 1.8, y: 4.8, z: 3.5, r1: 1.5, r2: 0.95 },
        { x: 7.2, y: 4.8, z: 3.5, r1: 1.5, r2: 0.95 }
      ].map((pos, cIdx) => (
        <group key={`chandelier-${cIdx}`} position={[pos.x, pos.y, pos.z]}>
          {/* Suspension wire */}
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 1.2, 8]} />
            <meshStandardMaterial color={goldenAmber} metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Outer ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[pos.r1, 0.045, 16, 48]} />
            <meshStandardMaterial color={goldenAmber} metalness={0.9} roughness={0.15} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[pos.r1 * 0.98, 0.02, 16, 48]} />
            <meshBasicMaterial color={warmGlow} />
          </mesh>
          {/* Inner ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[pos.r2, 0.038, 16, 36]} />
            <meshStandardMaterial color={goldenAmber} metalness={0.9} roughness={0.15} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[pos.r2 * 0.98, 0.018, 16, 36]} />
            <meshBasicMaterial color={warmGlow} />
          </mesh>
          {/* Central amber light emitter */}
          <pointLight color={warmGlow} intensity={2.8} distance={12} decay={2} position={[0, -0.2, 0]} />
        </group>
      ))}

      {/* 5. Central Section: Architectural Wooden Wall, Framed Artwork, Globe & Credenza */}
      <group position={[1.8, -0.8, -4.5]}>
        {/* Walnut Wall Paneling */}
        <mesh position={[0, 2.0, 0]} receiveShadow>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color={darkWalnut} roughness={0.7} metalness={0.1} />
        </mesh>
        {/* Molding Trim Panels */}
        {[-3.6, -1.2, 1.2, 3.6].map((px, pIdx) => (
          <mesh key={`wall-panel-${pIdx}`} position={[px, 2.0, 0.05]}>
            <boxGeometry args={[1.9, 7.8, 0.08]} />
            <meshStandardMaterial color={midWalnut} roughness={0.5} metalness={0.2} />
          </mesh>
        ))}

        {/* Framed Arabic Educational Artwork (Golden frame with decorative canvas) */}
        <group position={[0, 2.6, 0.15]}>
          {/* Outer Gold Frame */}
          <mesh>
            <boxGeometry args={[3.2, 2.4, 0.12]} />
            <meshStandardMaterial color={goldenAmber} metalness={0.8} roughness={0.25} />
          </mesh>
          {/* Inner Dark Velvet Inset */}
          <mesh position={[0, 0, 0.04]}>
            <boxGeometry args={[2.9, 2.1, 0.06]} />
            <meshStandardMaterial color="#2d1d14" roughness={0.6} />
          </mesh>
          {/* Canvas with Arabic Calligraphy / Knowledge Tree motif */}
          <mesh position={[0, 0, 0.07]}>
            <planeGeometry args={[2.7, 1.9]} />
            <meshStandardMaterial color="#d8ba8e" roughness={0.4} />
          </mesh>
          {/* Picture frame brass picture light over artwork */}
          <mesh position={[0, 1.35, 0.35]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.03, 0.03, 1.4, 16]} />
            <meshStandardMaterial color={goldenAmber} metalness={0.9} roughness={0.2} />
          </mesh>
          <pointLight position={[0, 1.25, 0.4]} color={warmGlow} intensity={1.4} distance={4} />
        </group>

        {/* Wooden Credenza / Console Table below Artwork */}
        <group position={[0, -2.8, 0.6]}>
          {/* Top Counter */}
          <mesh position={[0, 0.85, 0]} receiveShadow>
            <boxGeometry args={[4.2, 0.12, 1.1]} />
            <meshStandardMaterial color={warmWood} roughness={0.3} metalness={0.2} />
          </mesh>
          {/* Cabinet Body */}
          <mesh position={[0, 0, 0]} receiveShadow>
            <boxGeometry args={[4.0, 1.6, 1.0]} />
            <meshStandardMaterial color={midWalnut} roughness={0.55} metalness={0.15} />
          </mesh>
          {/* Brass Handles */}
          {[-0.6, 0.6].map((hx, hIdx) => (
            <mesh key={`handle-${hIdx}`} position={[hx, 0.1, 0.52]}>
              <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
              <meshStandardMaterial color={goldenAmber} metalness={0.9} roughness={0.2} />
            </mesh>
          ))}

          {/* Educational Globe on Brass Stand (Left of Credenza) */}
          <group position={[-1.2, 1.45, 0.1]}>
            {/* Round brass base */}
            <mesh position={[0, -0.45, 0]}>
              <cylinderGeometry args={[0.22, 0.26, 0.08, 24]} />
              <meshStandardMaterial color={goldenAmber} metalness={0.85} roughness={0.2} />
            </mesh>
            {/* Brass stem & semicircular meridian */}
            <mesh position={[0, -0.2, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.45, 12]} />
              <meshStandardMaterial color={goldenAmber} metalness={0.85} roughness={0.2} />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 4]}>
              <torusGeometry args={[0.38, 0.025, 12, 32, Math.PI * 1.1]} />
              <meshStandardMaterial color={goldenAmber} metalness={0.85} roughness={0.2} />
            </mesh>
            {/* Globe Sphere with antique cartography coloring */}
            <mesh position={[0, 0, 0]} rotation={[0.4, 0.5, 0.3]}>
              <sphereGeometry args={[0.32, 24, 24]} />
              <meshStandardMaterial color="#4a708b" roughness={0.55} metalness={0.1} />
            </mesh>
          </group>

          {/* Decorative Ceramic Vase with Foliage on Right of Credenza */}
          <group position={[1.2, 1.4, 0.1]}>
            <mesh>
              <cylinderGeometry args={[0.16, 0.22, 0.55, 16]} />
              <meshStandardMaterial color="#e2d6c3" roughness={0.3} metalness={0.1} />
            </mesh>
            {/* Green stems & leaves */}
            {[0, 1.2, 2.4, 3.8, 5.0].map((rot, fIdx) => (
              <mesh key={`foliage-${fIdx}`} position={[Math.sin(rot) * 0.15, 0.45 + (fIdx % 2) * 0.1, Math.cos(rot) * 0.15]}>
                <sphereGeometry args={[0.18, 8, 8]} />
                <meshStandardMaterial color="#2d5e32" roughness={0.6} />
              </mesh>
            ))}
          </group>
        </group>
      </group>

      {/* 6. Right Section: Grand Arched Window Streaming Daylight & Tall Secondary Bookshelves */}
      {/* Daylight outdoor landscape / sky backdrop behind the grand window */}
      <mesh position={[9.8, 1.5, -4.6]} rotation={[0, -0.22, 0]}>
        <planeGeometry args={[10, 14]} />
        <meshBasicMaterial color="#f0f7fc" />
      </mesh>
      {/* Distant courtyard trees / architectural silhouette outside window */}
      <mesh position={[10.5, -0.2, -4.5]} rotation={[0, -0.22, 0]}>
        <planeGeometry args={[8, 5]} />
        <meshBasicMaterial color="#a7c9a2" transparent opacity={0.65} />
      </mesh>

      {/* Warm room back wall covering central-right room behind bookshelves */}
      <mesh position={[5.2, 1.5, -5.2]} receiveShadow>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color={darkWalnut} roughness={0.7} />
      </mesh>
      {/* Right boundary wall */}
      <mesh position={[13.5, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[18, 16]} />
        <meshStandardMaterial color={darkWalnut} roughness={0.7} />
      </mesh>

      {/* Tall Secondary Walnut Bookshelves in the Background (at x=4.8) */}
      <group position={[4.8, 1.2, -4.6]}>
        {/* Bookshelf structure */}
        <mesh position={[0, 0.6, 0]} receiveShadow>
          <boxGeometry args={[4.4, 9.2, 0.8]} />
          <meshStandardMaterial color={darkWalnut} roughness={0.6} />
        </mesh>
        {/* Bookshelf Crown Cornice */}
        <mesh position={[0, 5.2, 0.1]} receiveShadow>
          <boxGeometry args={[4.7, 0.35, 1.0]} />
          <meshStandardMaterial color={midWalnut} roughness={0.4} />
        </mesh>
        {/* Bookshelf Shelves with Books */}
        {[-2.6, -1.3, 0.0, 1.3, 2.6].map((sy, sIdx) => (
          <group key={`bg-shelf-${sIdx}`} position={[0, sy, 0.25]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[4.0, 0.12, 0.6]} />
              <meshStandardMaterial color={midWalnut} roughness={0.4} />
            </mesh>
            {/* Undershelf warm light */}
            <mesh position={[0, -0.06, 0.25]}>
              <boxGeometry args={[3.8, 0.02, 0.06]} />
              <meshBasicMaterial color={warmGlow} />
            </mesh>
            {/* Colorful background book spines */}
            {[-1.6, -1.2, -0.8, -0.4, 0.0, 0.4, 0.8, 1.2, 1.6].map((bx, bIdx) => (
              <mesh key={`bg-book-${sIdx}-${bIdx}`} position={[bx, 0.45, 0]}>
                <boxGeometry args={[0.26, 0.8, 0.35]} />
                <meshStandardMaterial
                  color={['#a83232', '#2a5a8c', '#2f7543', '#c98a2c', '#6d3c8c', '#8c482a'][(sIdx + bIdx) % 6]}
                  roughness={0.5}
                />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* Grand Arched Window (Prominently visible on Right, Facing Viewer Diagonal, Streaming Daylight) */}
      <group position={[9.8, 1.5, -3.8]} rotation={[0, -0.22, 0]}>
        {/* Continuous Solid Backing Wall behind Window Section to prevent any void leaks */}
        <mesh position={[0, 0.5, -0.1]} receiveShadow>
          <planeGeometry args={[10, 14]} />
          <meshStandardMaterial color={darkWalnut} roughness={0.7} />
        </mesh>

        {/* Outer Dark Walnut Moulded Frame */}
        <mesh position={[-1.85, 0.0, 0.15]}>
          <boxGeometry args={[0.18, 6.0, 0.2]} />
          <meshStandardMaterial color={midWalnut} roughness={0.45} />
        </mesh>
        <mesh position={[1.85, 0.0, 0.15]}>
          <boxGeometry args={[0.18, 6.0, 0.2]} />
          <meshStandardMaterial color={midWalnut} roughness={0.45} />
        </mesh>
        <mesh position={[0, -3.0, 0.15]}>
          <boxGeometry args={[3.9, 0.25, 0.25]} />
          <meshStandardMaterial color={midWalnut} roughness={0.45} />
        </mesh>

        {/* Rectangular lower window glass */}
        <mesh position={[0, 0.0, 0.08]}>
          <planeGeometry args={[3.5, 5.8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.96} />
        </mesh>
        {/* Semi-circular arched upper window glass - precisely sized */}
        <mesh position={[0, 2.9, 0.08]}>
          <circleGeometry args={[1.75, 48, 0, Math.PI]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.96} />
        </mesh>

        {/* Semi-circular wooden arch border cleanly framing the top glass */}
        <mesh position={[0, 2.9, 0.15]}>
          <ringGeometry args={[1.72, 1.95, 48, 1, 0, Math.PI]} />
          <meshStandardMaterial color={midWalnut} roughness={0.45} />
        </mesh>

        {/* Vertical Center Window Bar spanning full height up into arch */}
        <mesh position={[0, 0.85, 0.14]}>
          <boxGeometry args={[0.12, 7.5, 0.12]} />
          <meshStandardMaterial color={midWalnut} roughness={0.45} />
        </mesh>
        {/* Horizontal Window Transoms */}
        {[-1.8, -0.4, 1.0, 2.4].map((wy, widx) => (
          <mesh key={`win-transom-${widx}`} position={[0, wy, 0.14]}>
            <boxGeometry args={[3.5, 0.1, 0.12]} />
            <meshStandardMaterial color={midWalnut} roughness={0.45} />
          </mesh>
        ))}
      </group>

      {/* 7. Right Foreground: Reading Table, Brass Domed Lamp, and Armchairs */}
      <group position={[6.5, -3.4, 2.0]}>
        {/* Polished Walnut Round Reading Table */}
        {/* Table Top */}
        <mesh position={[0, 0.5, 0]} receiveShadow>
          <cylinderGeometry args={[1.8, 1.8, 0.1, 32]} />
          <meshStandardMaterial color={midWalnut} roughness={0.25} metalness={0.15} />
        </mesh>
        {/* Pedestal Base */}
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.2, 0.28, 1.4, 16]} />
          <meshStandardMaterial color={darkWalnut} roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.95, 0]}>
          <cylinderGeometry args={[0.8, 0.9, 0.1, 24]} />
          <meshStandardMaterial color={darkWalnut} roughness={0.4} />
        </mesh>

        {/* Warm Domed Reading Lamp on Table (Golden Amber Light Source) */}
        <group position={[0, 0.6, 0]}>
          {/* Brass base & stem */}
          <mesh position={[0, 0.05, 0]}>
            <cylinderGeometry args={[0.22, 0.26, 0.08, 16]} />
            <meshStandardMaterial color={goldenAmber} metalness={0.85} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.38, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.6, 12]} />
            <meshStandardMaterial color={goldenAmber} metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Elegant Domed Lamp Shade */}
          <mesh position={[0, 0.7, 0]}>
            <sphereGeometry args={[0.38, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial color={goldenAmber} metalness={0.8} roughness={0.25} side={THREE.DoubleSide} />
          </mesh>
          {/* Inner Light Glow */}
          <pointLight position={[0, 0.62, 0]} color={warmGlow} intensity={2.6} distance={6} decay={1.8} />
        </group>

        {/* Stack of Educational Books on Table */}
        <group position={[0.65, 0.62, 0.35]} rotation={[0, 0.3, 0]}>
          <mesh position={[0, 0.03, 0]}>
            <boxGeometry args={[0.55, 0.06, 0.4]} />
            <meshStandardMaterial color="#8b2626" roughness={0.5} />
          </mesh>
          <mesh position={[0.02, 0.08, -0.01]} rotation={[0, 0.15, 0]}>
            <boxGeometry args={[0.5, 0.05, 0.38]} />
            <meshStandardMaterial color="#1f4469" roughness={0.5} />
          </mesh>
        </group>

        {/* Cream / Warm Beige Upholstered Armchairs flanking the table */}
        {[-2.2, 2.2].map((cx, cIdx) => (
          <group key={`chair-${cIdx}`} position={[cx, -0.2, cIdx === 0 ? 0.3 : -0.3]} rotation={[0, cIdx === 0 ? 0.6 : -0.7, 0]}>
            {/* Seat cushion */}
            <mesh position={[0, 0.15, 0]} receiveShadow>
              <boxGeometry args={[1.3, 0.32, 1.3]} />
              <meshStandardMaterial color={warmBeige} roughness={0.8} />
            </mesh>
            {/* Curved Backrest */}
            <mesh position={[0, 0.8, -0.55]}>
              <boxGeometry args={[1.3, 1.0, 0.28]} />
              <meshStandardMaterial color={warmBeige} roughness={0.8} />
            </mesh>
            {/* Armrests */}
            {[-0.6, 0.6].map((ax, aIdx) => (
              <mesh key={`arm-${aIdx}`} position={[ax, 0.5, -0.1]} castShadow>
                <boxGeometry args={[0.18, 0.45, 1.0]} />
                <meshStandardMaterial color={warmBeige} roughness={0.8} />
              </mesh>
            ))}
            {/* Dark walnut legs */}
            {[-0.5, 0.5].map((lx, lIdx) =>
              [-0.5, 0.5].map((lz, lzIdx) => (
                <mesh key={`leg-${lIdx}-${lzIdx}`} position={[lx, -0.4, lz]} castShadow>
                  <cylinderGeometry args={[0.04, 0.03, 0.8, 8]} />
                  <meshStandardMaterial color={darkWalnut} roughness={0.4} />
                </mesh>
              ))
            )}
          </group>
        ))}
      </group>

      {/* 8. Large Potted Indoor Fiddle-Leaf Fig Plants / Plant Pots */}
      {[
        { x: 2.8, y: -4.8, z: -2.5, s: 1.1 },
        { x: 10.2, y: -4.8, z: 2.2, s: 1.3 }
      ].map((plant, pIdx) => (
        <group key={`plant-${pIdx}`} position={[plant.x, plant.y, plant.z]} scale={plant.s}>
          {/* Terracotta / Ceramic Planter Pot */}
          <mesh position={[0, 0.6, 0]} receiveShadow>
            <cylinderGeometry args={[0.42, 0.3, 1.2, 20]} />
            <meshStandardMaterial color="#b26743" roughness={0.65} />
          </mesh>
          {/* Dark Soil */}
          <mesh position={[0, 1.15, 0]}>
            <cylinderGeometry args={[0.39, 0.39, 0.1, 16]} />
            <meshStandardMaterial color="#1a120b" roughness={0.9} />
          </mesh>
          {/* Realistic Multi-Cluster Lush Green Leaves */}
          {[
            { pos: [0, 1.6, 0], scale: [0.35, 0.45, 0.35], c: '#235327' },
            { pos: [-0.2, 2.0, 0.15], scale: [0.4, 0.5, 0.4], c: '#2c6831' },
            { pos: [0.25, 2.2, -0.1], scale: [0.42, 0.5, 0.42], c: '#1f4c23' },
            { pos: [-0.1, 2.6, -0.15], scale: [0.38, 0.45, 0.38], c: '#367b3d' },
            { pos: [0.15, 2.9, 0.1], scale: [0.34, 0.4, 0.34], c: '#29612e' },
            { pos: [0, 3.2, 0], scale: [0.28, 0.35, 0.28], c: '#3c8644' }
          ].map((leaf, lIdx) => (
            <mesh key={`leaf-${lIdx}`} position={leaf.pos as [number, number, number]}>
              <sphereGeometry args={[leaf.scale[0], 12, 12]} />
              <meshStandardMaterial color={leaf.c} roughness={0.45} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Ambient Dust Motes Effect */}
      <LibraryDustParticles />
    </group>
  );
});
