# Direct 3D Book Reader Architecture

## Overview
The digital book reader provides an immediate, immersion-first reading experience. When a student or educator selects a book from the 3D educational bookshelf or the circular glassy coverflow carousel, the book opens directly into the realistic 3D reader spread without any intermediate modal cards or redundant "Open Spread" buttons.

## Visual & Structural Hierarchy

### 1. Dedicated Header HUD
Positioned above the opened spread, styled with warm walnut and frosted cream glassmorphism:
- **Navigation & Close Action**: Quick return to previous context (exact bookshelf row or carousel level).
- **Curriculum Level Badge**: Displays educational year (e.g. 1AP, 2AP, Baccalaureate).
- **Book Title & Pedagogical Authors**: Clean typographic hierarchy supporting Arabic RTL and Latin scripts.
- **Synchronized Page Counter**: Dynamic indicators (`Pages X-Y of N`).
- **Spread Flip Controls**: Forward and backward navigation buttons.
- **Zoom Toggle**: Proportional responsive zoom factor (1.0x to 1.25x).
- **Download Action**: Direct PDF download stream for offline access.

### 2. A3 Landscape Physical Book Spread
The opened book strictly observes authentic international paper proportions:
- **Full Spread**: A3 Landscape (420 mm × 297 mm, aspect ratio approximately 1.414).
- **Individual Pages**: Two adjacent A4 Portrait pages (210 mm × 297 mm each).
- **Spine & Depth**: Subtle embossed paper core, realistic central gutter gradient, and soft exterior book cover framing.

### 3. Context Restoration & State Continuity
When the user finishes reading and closes the book:
- Library camera framing is strictly maintained (no jarring zoom resets or library scene reconstruction).
- If opened from the carousel, the active educational grade and carousel index are fully preserved.
- If opened from the bookshelf, the shelf position remains stable.
