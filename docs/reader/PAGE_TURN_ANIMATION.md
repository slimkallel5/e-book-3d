# 3D Page Turn Animation & Mechanics

## Animation Reference & Visual Language
The page-turn animation adapts the physical visual language of the book cover closing animation to a single paper leaf turning across the central spine:
- **Edge Lift**: The page lifts gently along its outer vertical boundary.
- **Spine Rotation & Bending**: The turning page rotates 180 degrees around the spine axis (`transform-origin: left center` for forward turns, `transform-origin: right center` for backward turns) while applying an organic parabolic bending curl.
- **Double-Sided Page Visibility**:
  - The front face renders the active page content.
  - The reverse face renders the subsequent back page.
- **Dynamic Realistic Cast Shadows**:
  - Shading darkness and drop-shadow spread dynamically follow the curl apex.
  - Settles flat seamlessly onto the target page stack.

## Interaction & Race-Condition Prevention
- **Click Navigation**: Click anywhere on the right page to flip forward, click left page to flip backward (mirrored naturally for Arabic RTL mode).
- **Keyboard Arrows**: Arrow keys advance or retreat spreads.
- **Touch / Swipe**: Mobile horizontal swipe detection (> 40px) with direction inversion for RTL.
- **Rapid Navigation Lock**: Animation frames lock state (`isAnimating = true`) for 400ms to eliminate index corruption or overlapping canvas texture glitches.
- **Boundary Handling**: First spread (page 1) and terminal page accurately restrict out-of-bounds flips.
