import React from 'react';
import { EDUCATION_LEVELS } from '../../data/educationLevels';
import { BOOKS_DATA } from '../../data/books';
import { BookshelfRow } from './BookshelfRow';
import { BOOKSHELF_CONFIG } from './bookshelfConfig';

interface BookshelfProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
}

export const Bookshelf: React.FC<BookshelfProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0]
}) => {
  const cfg = BOOKSHELF_CONFIG;
  const innerWidth = cfg.shelfWidth;
  const totalW = cfg.totalWidth;

  // Wood color palette for realistic premium furniture
  const woodDark = '#201209'; // Rich walnut dark tone
  const woodMedium = '#2e190d'; // Main furniture carcass
  const woodWarm = '#3d2212'; // Shelf faces & trims
  const brassGold = '#d49b4b'; // Brass inlay and accents
  const darkRecess = '#140c06'; // Shadow recesses and grooves

  return (
    <group name="bookshelf-assembly" position={position} rotation={rotation}>
      {/* =========================================================================
          1. HEAVY ARCHITECTURAL BASE PLINTH
          ========================================================================= */}
      <group position={[0, -5.0, 0]}>
        {/* Main Base Block */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[totalW + 0.9, cfg.basePlinthHeight, cfg.basePlinthDepth]} />
          <meshStandardMaterial color={woodDark} roughness={0.7} metalness={0.12} />
        </mesh>

        {/* Lower stepped footing plinth */}
        <mesh position={[0, -cfg.basePlinthHeight / 2 + 0.1, 0.05]} castShadow receiveShadow>
          <boxGeometry args={[totalW + 1.15, 0.22, cfg.basePlinthDepth + 0.1]} />
          <meshStandardMaterial color={darkRecess} roughness={0.8} />
        </mesh>

        {/* Upper decorative base molding transition */}
        <mesh position={[0, cfg.basePlinthHeight / 2 - 0.08, 0.06]} receiveShadow>
          <boxGeometry args={[totalW + 1.05, 0.16, cfg.basePlinthDepth + 0.08]} />
          <meshStandardMaterial color={woodWarm} roughness={0.55} />
        </mesh>

        {/* Front Brass Fillet Trim along Base */}
        <mesh position={[0, cfg.basePlinthHeight / 2 - 0.16, cfg.basePlinthDepth / 2 + 0.045]} receiveShadow>
          <boxGeometry args={[totalW + 0.95, 0.05, 0.03]} />
          <meshStandardMaterial color={brassGold} metalness={0.65} roughness={0.3} />
        </mesh>
      </group>

      {/* =========================================================================
          2. SOLID VERTICAL SIDE PANELS & CARVED FRONT PILASTERS
          ========================================================================= */}
      {[-innerWidth / 2 - cfg.sidePanelThickness / 2, innerWidth / 2 + cfg.sidePanelThickness / 2].map((x, i) => {
        const isLeft = i === 0;
        return (
          <group key={`side-panel-${i}`} position={[x, 0.75, 0]}>
            {/* Main Side Board (Full thickness & depth) */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[cfg.sidePanelThickness, cfg.sidePanelHeight, cfg.sidePanelDepth]} />
              <meshStandardMaterial color={woodMedium} roughness={0.6} metalness={0.1} />
            </mesh>

            {/* Outer Decorative Raised Panel Moulding */}
            <mesh
              position={[isLeft ? -cfg.sidePanelThickness / 2 - 0.02 : cfg.sidePanelThickness / 2 + 0.02, 0, 0]}
              receiveShadow
            >
              <boxGeometry args={[0.04, cfg.sidePanelHeight - 1.2, cfg.sidePanelDepth - 0.4]} />
              <meshStandardMaterial color={woodDark} roughness={0.65} />
            </mesh>
            <mesh
              position={[isLeft ? -cfg.sidePanelThickness / 2 - 0.035 : cfg.sidePanelThickness / 2 + 0.035, 0, 0]}
              receiveShadow
            >
              <boxGeometry args={[0.02, cfg.sidePanelHeight - 1.6, cfg.sidePanelDepth - 0.7]} />
              <meshStandardMaterial color={woodWarm} roughness={0.55} />
            </mesh>

            {/* Front Architectural Pilaster / Column Column Fluting facing front */}
            <group position={[0, 0, cfg.sidePanelDepth / 2 + 0.04]}>
              {/* Pilaster Facing Strip */}
              <mesh castShadow receiveShadow>
                <boxGeometry args={[cfg.sidePanelThickness + 0.08, cfg.sidePanelHeight, 0.08]} />
                <meshStandardMaterial color={woodWarm} roughness={0.55} metalness={0.15} />
              </mesh>

              {/* Vertical Fluting Grooves */}
              {[-0.1, 0, 0.1].map((grooveX, gIdx) => (
                <mesh key={`flute-${gIdx}`} position={[grooveX, 0, 0.045]}>
                  <boxGeometry args={[0.035, cfg.sidePanelHeight - 1.0, 0.015]} />
                  <meshStandardMaterial color={darkRecess} roughness={0.8} />
                </mesh>
              ))}

              {/* Top and Bottom Pilaster Brass Capital/Base Accents */}
              {[cfg.sidePanelHeight / 2 - 0.35, -cfg.sidePanelHeight / 2 + 0.35].map((yCap, cIdx) => (
                <mesh key={`cap-${cIdx}`} position={[0, yCap, 0.05]} castShadow>
                  <boxGeometry args={[cfg.sidePanelThickness + 0.12, 0.12, 0.04]} />
                  <meshStandardMaterial color={brassGold} metalness={0.7} roughness={0.25} />
                </mesh>
              ))}
            </group>
          </group>
        );
      })}

      {/* =========================================================================
          3. SOLID RECESSED WOODEN BACKBOARD WITH VERTICAL WAINSCOT SLATS
          ========================================================================= */}
      <group position={[0, 0.75, cfg.backPanelDepthOffset]}>
        {/* Main Solid Backing Board */}
        <mesh receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[innerWidth + 0.1, cfg.sidePanelHeight, cfg.backPanelThickness]} />
          <meshStandardMaterial color={woodDark} roughness={0.85} metalness={0.05} />
        </mesh>

        {/* Subtle Vertical Paneling Grooves for realistic craftsman look */}
        {Array.from({ length: 15 }).map((_, slatIdx) => {
          const slatX = -innerWidth / 2 + (innerWidth / 16) * (slatIdx + 1);
          return (
            <mesh key={`slat-${slatIdx}`} position={[slatX, 0, cfg.backPanelThickness / 2 + 0.005]}>
              <boxGeometry args={[0.02, cfg.sidePanelHeight - 0.2, 0.01]} />
              <meshStandardMaterial color={darkRecess} roughness={0.9} />
            </mesh>
          );
        })}
      </group>

      {/* =========================================================================
          4. PROTRUDING TOP FACADE & ARCHITECTURAL CROWN MOLDING
          ========================================================================= */}
      <group position={[0, 6.45, 0]}>
        {/* Bottom Crown Architrave / Frieze */}
        <mesh castShadow receiveShadow position={[0, -0.2, 0.02]}>
          <boxGeometry args={[totalW + 0.8, 0.5, cfg.crownDepth - 0.2]} />
          <meshStandardMaterial color={woodMedium} roughness={0.6} metalness={0.12} />
        </mesh>

        {/* Protruding Middle Cornice Band */}
        <mesh castShadow receiveShadow position={[0, 0.12, 0.06]}>
          <boxGeometry args={[totalW + 1.1, 0.24, cfg.crownDepth]} />
          <meshStandardMaterial color={woodWarm} roughness={0.55} metalness={0.15} />
        </mesh>

        {/* Top Overhanging Cornice Cap */}
        <mesh castShadow position={[0, 0.32, 0.1]}>
          <boxGeometry args={[totalW + 1.45, 0.18, cfg.crownDepth + 0.18]} />
          <meshStandardMaterial color={woodDark} roughness={0.6} />
        </mesh>

        {/* Decorative Brass Archival Crest Plaque on Crown Center */}
        <group position={[0, -0.16, cfg.crownDepth / 2 - 0.06]}>
          <mesh castShadow>
            <boxGeometry args={[5.2, 0.36, 0.05]} />
            <meshStandardMaterial color={brassGold} metalness={0.75} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0, 0.03]}>
            <boxGeometry args={[4.9, 0.26, 0.01]} />
            <meshStandardMaterial color="#1a120b" roughness={0.5} />
          </mesh>
        </group>
      </group>

      {/* =========================================================================
          5. EDUCATION YEAR SHELF ROWS (7 Levels, 1AP to Secondary)
          ========================================================================= */}
      {EDUCATION_LEVELS.map((level) => {
        const levelBooks = BOOKS_DATA.filter((b) => b.educationLevelId === level.id);

        return (
          <BookshelfRow
            key={level.id}
            level={level}
            books={levelBooks}
            shelfIndex={level.shelfIndex}
            rowWidth={innerWidth}
          />
        );
      })}
    </group>
  );
};
