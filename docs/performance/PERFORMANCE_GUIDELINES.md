# Performance Guidelines — 3D Educational Library

To prevent future performance regressions when developing new features or extending 3D scenes, adhere to the following architectural guidelines:

---

## 1. Three.js & React Three Fiber (R3F) Rules

### 1.1 Shadow Casting Discipline
* **Never enable `castShadow={true}` on PointLight or SpotLight sources** unless strictly required for a dramatic focal hero asset. Point light shadows generate 6 shadow map passes per frame per light.
* Rely on a single key `directionalLight` for shadow mapping, with tightly fitted orthographic frustum planes (`shadow-camera-left/right/top/bottom`).
* Keep `shadow-mapSize` to `[1024, 1024]` or `[512, 512]`. Avoid 2048x2048+ shadow maps on mobile/web.

### 1.2 Eliminate Frame Callbacks for Static State
* Do not register `useFrame` in components simply to check state or visibility. Use declarative Three.js props: `<mesh visible={isVisible}>`.
* For continuous animations (dust, floating effects, particles), throttle updates using delta accumulation:
  ```tsx
  const deltaAccum = useRef(0);
  useFrame((_, delta) => {
    deltaAccum.current += delta;
    if (deltaAccum.current < 0.033) return; // Cap at ~30 FPS
    deltaAccum.current = 0;
    // update particles
  });
  ```
* Settle camera and transition loops once Euclidean distance to target is below a small threshold (`< 0.0001`).

### 1.3 Adaptive DPR
* Always clamp Canvas DPR:
  ```tsx
  dpr={[1, Math.min(window.devicePixelRatio, 1.25)]}
  ```
* High-DPI screens (such as 3x Retina) multiply pixel shading cost by 9x without perceptible visual improvement on 3D canvas elements.

---

## 2. React Rendering & State Separation

### 2.1 Memoize Static 3D Hierarchy
* Wrap structural scene containers (`Bookshelf`, `BookshelfRow`, `BookshelfBookItem`) in `React.memo`.
* Prevent passing unstable inline objects/arrays as props (e.g. `position={[0, 0, 0]}`). Define constant defaults outside the component.
* Wrap row book layouts and transformation matrices in `useMemo`.

### 2.2 Cover & Texture Generation
* Do not generate heavy 512x768 HTML5 canvas data URLs synchronously in bulk for every book on mount.
* Use lightweight vector SVG placeholders for initial render and lazily generate or stream raster canvas covers.
* Cache generated data URLs in a persistent `Map` keyed by `bookId_lang`.

---

## 3. Carousel & DOM Optimization

### 3.1 Off-Stage Element Culling
* In coverflow/carousel components, cull items that are outside the visible slot window:
  ```tsx
  const d = slot - index;
  if (d < -before - 1 || d > after + 1) return null;
  ```
* Set `loading="lazy"` and `decoding="async"` on images further than 2 slots from the active center item.
