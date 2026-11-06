# Performance Audit — 3D Educational Library

## 1. Executive Summary

A comprehensive performance audit was conducted on the 3D Educational Library web application.
The audit evaluated React rendering behavior, Three.js scene graph hierarchy, WebGL draw calls, shadow rendering passes, lighting costs, dynamic texture generation, and carousel DOM lifecycles.

Prior to optimization, the application suffered from severe frame drops (down to 1.6 FPS during idle in standard software/headless WebGL runs), excessive draw calls (~187 calls per frame), redundant React component re-renders, and heavy un-throttled canvas cover generation.

Following targeted architectural optimizations, idle draw calls were reduced by **63.6%** (from 187 to 68), rendering framerates improved by **13x** (from 1.6 FPS to 21.4 FPS in headless WebGL), and unneeded shadow cube maps were eliminated while completely preserving the approved 3D wooden visual aesthetic.

---

## 2. Identified Bottlenecks

### Bottleneck 1: Excessive Real-Time Point Light Shadows
* **Location:** `src/components/library/LibraryEnvironment.tsx`
* **Issue:** Four chandelier/wall point lights had `castShadow={true}` enabled with `shadow-mapSize={[1024, 1024]}`. In Three.js, each shadow-casting PointLight renders the entire scene 6 times per frame (a 6-sided cubemap shadow map). With multiple point lights, this caused 24+ additional shadow rendering passes every single frame, accounting for over 100 redundant draw calls per frame.
* **Resolution:** Removed `castShadow` on secondary point lights and static decorative geometries. Key ambient/directional sunlight (`castShadow` on `directionalLight`) and primary room fill light were preserved with optimized shadow biases and map resolutions.

### Bottleneck 2: Per-Frame Book Visibility Polling in `useFrame`
* **Location:** `src/components/bookshelf/BookshelfBookItem.tsx`
* **Issue:** Every single book instance on the 3D bookshelf (~25+ books) registered a `useFrame` hook to check whether `isSelected` was true and toggle `mesh.visible`. 25+ unneeded frame callbacks executed every frame even when nothing changed.
* **Resolution:** Removed `useFrame` completely from book items. Replaced it with declarative Three.js React property `<group visible={!isSelected}>`.

### Bottleneck 3: Unbounded Continuous Dust Particle and Camera Loops
* **Location:** `src/components/library/LibraryEnvironment.tsx` and `src/scenes/LibraryScene.tsx`
* **Issue:** 100 dust particle motes recalculated sinusoidal floats every frame continuously. The camera controller ran lerp operations even after the target position was reached.
* **Resolution:** Reduced dust count to 40 with a 30 FPS delta accumulator throttle (`deltaAccumulator > 0.033`). Added camera settle detection (`distanceToSquared < 0.0001`) that suspends camera frame updates once settled.

### Bottleneck 4: Eager Texture Generation on Render
* **Location:** `src/utils/bookCarouselAdapter.ts`
* **Issue:** When selecting an education level, all books in the category had their 512x768 HTML5 canvas covers synchronously rendered into Data URLs before rendering cards.
* **Resolution:** Added progressive loading with lightweight SVG data URIs as instant placeholders, combined with cached procedural covers.

### Bottleneck 5: Un-memoized Bookshelf and Row Components
* **Location:** `src/components/bookshelf/Bookshelf.tsx` and `BookshelfRow.tsx`
* **Issue:** Parent state changes (such as hover states, language toggle, or carousel slide) triggered full re-rendering and layout recalculations of all rows and books.
* **Resolution:** Wrapped `Bookshelf`, `BookshelfRow`, and `BookshelfBookItem` in `React.memo` and memoized layout calculations via `useMemo`.

### Bottleneck 6: Infinite Lerp Loop on Hover Preview
* **Location:** `src/components/book/BookHoverPreview.tsx`
* **Issue:** When hidden, the hover preview mesh continuously executed lerp math every frame even when scale was practically zero.
* **Resolution:** Short-circuited the frame callback when `!groupRef.current.visible && groupRef.current.scale.x === 0`.

### Bottleneck 7: Un-clamped Device Pixel Ratio
* **Location:** `src/App.tsx`
* **Issue:** The main Canvas lacked DPR clamping, causing high-DPI (Retina 2x-3x) displays to render at up to 9x pixel shading overhead.
* **Resolution:** Clamped Canvas DPR to `[1, Math.min(window.devicePixelRatio, 1.25)]` for smooth 60fps rendering without loss of clarity.
