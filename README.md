# PROJECT: IMMERSIVE 3D EDUCATIONAL LIBRARY — STANDALONE FRONTEND

## 1. Project objective

Create a completely new, standalone frontend application for an educational books e-commerce experience.

This is a NEW PROJECT in a NEW REPOSITORY.

Do not access, modify, reuse or depend on the source code of my existing e-commerce application.

Do not integrate an existing backend.

Do not create backend services.

The purpose of this project is to build and perfect the visual experience and 3D interactions independently.

The result must be a fully functional frontend prototype using realistic 3D objects, sample data and a simulated shopping basket.

The architecture should allow future API integration, but no backend integration is required now.

## 2. Main concept

Create an immersive virtual educational library.

When the website opens, users enter a full-screen 3D library.

The library contains realistic bookshelves organized by education year.

Users can select books, watch them move from the bookshelf to a central display area, rotate them 360 degrees, open them, preview their pages and add them to a simulated shopping basket.

The entire experience should feel like interacting with a real physical library.

The 3D environment is the primary website experience.

Avoid traditional e-commerce layouts and generic product grids.

## 3. Technology stack

Use:

- React
- TypeScript
- Vite
- Three.js
- React Three Fiber
- Drei
- GSAP
- Framer Motion
- Zustand
- CSS or a compatible styling system

Use compatible, stable dependency versions.

Keep the application modular and maintainable.

## 4. Full-screen 3D library

Create a complete 3D library environment.

Requirements:

- Full viewport width and height.
- Realistic bookshelves.
- Multiple rows.
- Realistic books with covers and spines.
- Premium materials and lighting.
- Shadows and depth.
- Camera movement.
- Natural ambient animation.
- Responsive camera positioning.

Each bookshelf row represents an education year.

Use sample data to define the education levels dynamically.

Do not hardcode the bookshelf rendering logic.

## 5. Education-year navigation

Create sample education levels, such as:

- First year primary school.
- Second year primary school.
- Third year primary school.
- Fourth year primary school.
- Fifth year primary school.
- Sixth year primary school.
- Secondary education levels.

Each row must display its corresponding education-year label.

When the user selects a row:

- Highlight the row.
- Move the camera toward it.
- Display its books.
- Allow book selection.

Keep the implementation data-driven so education levels can be replaced by API data later.

## 6. Book selection and movement

When the user selects a book:

1. Separate it visually from the bookshelf.
2. Animate it out of its position.
3. Move it naturally through the 3D environment.
4. Transition the camera toward the book.
5. Place the book in the central viewing area.

Use realistic 3D movement, rotation and easing.

The animation should not look like a flat 2D card transition.

## 7. Realistic 3D books

Create a reusable Book3D component.

Each book must have:

- Front cover.
- Back cover.
- Spine.
- Pages.
- Realistic thickness.
- Appropriate materials.
- Cover texture.
- Correct proportions.

Use local sample images and assets.

Allow the user to:

- Rotate the book horizontally.
- Rotate it vertically.
- Inspect the back cover.
- Inspect the spine.
- Zoom in and out.
- Reset its position.

Support mouse and touch interactions.

## 8. Opening a book

When the user clicks the book, animate the front cover opening around the spine.

Display an open book in the center.

Requirements:

- Left and right pages.
- Realistic paper appearance.
- Page numbers.
- Sample educational content.
- Page-turning animation.

Users must be able to:

- Flip forward.
- Flip backward.
- Drag pages.
- Swipe pages on mobile.
- Close the book.
- Return to the 3D cover view.

Use realistic paper-turning effects.

The preview content can be sample content, clearly identified as demonstration data.

## 9. Simulated shopping basket

Create a persistent basket icon in the header.

When the user adds a book:

1. Update the local basket state.
2. Create a miniature version of the selected 3D book.
3. Animate it flying toward the basket.
4. Animate the basket when the book arrives.
5. Update the basket quantity.
6. Display the basket contents when clicked.

The basket should support:

- Multiple books.
- Quantity updates.
- Removing items.
- Sample prices.
- Total calculation.

Use Zustand for shared state.

No backend or real payment processing is required.

The implementation should make it straightforward to replace the simulated basket with a real API later.

## 10. Header and navigation

Create a minimal floating header.

Include:

- Logo.
- Search.
- Language selector.
- User account placeholder.
- Shopping basket.

Provide easy navigation between:

- Complete library.
- Education years.
- Selected book.
- Basket.

Do not allow the header to obstruct the 3D environment.

## 11. Search

Implement frontend search using the sample book dataset.

When a user searches:

- Display matching books.
- Show their education year.
- Allow selection.
- Animate the selected book into the central display.

## 12. Multilingual support

Support:

- Arabic as the default language.
- French.
- English.

Implement:

- RTL Arabic layout.
- LTR French and English layout.
- Direction-aware navigation.
- Translated education-level labels.
- Translated interface messages.

Use realistic Arabic typography.

## 13. Responsive design

Support desktop, tablet and mobile.

Desktop:
- Full 3D library.
- Multiple visible bookshelf rows.
- Detailed book interactions.

Mobile:
- Optimized library scene.
- Touch-based rotation.
- Swipe-based page turning.
- Simplified camera navigation.
- Responsive basket animation.

Provide a fallback if WebGL is unavailable.

Respect reduced-motion preferences.

## 14. Project architecture

Use a modular structure similar to:

src/
  app/
  components/
    layout/
    navigation/
    library/
    bookshelf/
    book/
    basket/
    ui/
  scenes/
    LibraryScene/
    BookScene/
  features/
    education/
    books/
    search/
    basket/
  hooks/
  store/
  data/
  assets/
    models/
    textures/
    books/
    fonts/
  styles/
  types/
  utils/

Adapt this structure if a better architecture is justified.

Separate 3D rendering, interactions, sample data and UI state.

## 15. Performance

- Optimize geometry and textures.
- Reuse materials and geometries.
- Avoid unnecessary rendering.
- Lazy-load 3D assets.
- Use efficient lighting.
- Avoid excessive shadows.
- Optimize for mobile GPUs.
- Keep the initial load fast.
- Provide loading indicators and fallbacks.

## 16. Implementation tasks

### Task 1 — Project setup and 3D architecture

- Create the standalone React application.
- Configure TypeScript and Vite.
- Install compatible dependencies.
- Establish the folder structure.
- Create sample education and book datasets.
- Implement the basic 3D scene.
- Establish the design system.

### Task 2 — Full-screen virtual library

- Create the library environment.
- Create bookshelves and rows.
- Assign education years.
- Generate books dynamically from sample data.
- Implement lighting and camera controls.
- Validate responsiveness.

### Task 3 — Interactive 3D books

- Create Book3D.
- Implement book selection.
- Animate books from shelves to center.
- Implement 360-degree rotation.
- Implement opening and closing.
- Implement page turning.
- Add sample preview content.

### Task 4 — Shopping basket and navigation

- Create the floating header.
- Implement Zustand basket state.
- Create miniature book animation.
- Animate the book flying into the basket.
- Implement basket contents and quantity updates.
- Implement search and navigation.

### Task 5 — Polish, multilingual support and testing

- Implement Arabic RTL.
- Implement French and English.
- Optimize desktop and mobile.
- Add reduced-motion behavior.
- Add WebGL fallback.
- Test all interactions.
- Fix rendering and performance issues.
- Produce screenshots and a final implementation report.

## 17. Execution rules

- Work only in the new repository.
- Do not connect to any existing backend.
- Do not access the existing e-commerce repository.
- Do not create server-side functionality.
- Use local sample data.
- Complete tasks progressively.
- Test each major interaction.
- Commit changes in logical increments.
- Keep components reusable.
- Document how future API integration can be added.

## 18. Final expected experience

The user should be able to:

1. Open the website and enter a full-screen 3D library.
2. Explore bookshelves organized by education year.
3. Select a book.
4. Watch the book move into the center.
5. Rotate it 360 degrees.
6. Open it.
7. Preview its pages.
8. Turn pages forward and backward.
9. Add it to the basket.
10. Watch a miniature 3D book fly into the header basket.
11. Continue browsing and manage the basket.

The result must look like a premium interactive 3D digital library, not a conventional e-commerce website with a 3D background.

**Priority: deliver a genuinely interactive and visually impressive 3D experience, with reliable functionality and excellent performance.**