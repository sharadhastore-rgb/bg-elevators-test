# Elevator stacked gallery

Standalone React + Tailwind + GSAP recreation of the section supplied from https://norrivo.webflow.io/, using the elevator imagery and brand palette from the preceding work. Navbar, footer and other page sections are excluded.

## Run
Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

```sh
npm run build
```
Deploy `dist` to a static host.

## Integration
Copy `src/ElevatorStackedGallery.jsx`, `src/carousel.js`, `src/slides.js`, relevant styles/font declarations, and `public/assets` into your React/Tailwind project. Install `gsap` and `react-icons`.

```jsx
import ElevatorStackedGallery from './ElevatorStackedGallery';
<ElevatorStackedGallery
  highlight="Elevators"
  heading="for Every Space"
  buttonLabel="View elevator"
  onSelect={(elevator) => navigate(`/elevators/${elevator.id}`)}
/>
```

`navigate` is your application's router function. Omit `onSelect` for the working built-in details dialog. `assetBase` defaults to `/assets/elevators`. The `items` prop accepts exactly five objects with id, image, name, alt and description fields, following `src/slides.js`.

## Matched reference behavior
- Five overlapping cards, centered main card, two cards on either side.
- Desktop card: 606 × 379px; neighboring scales: 0.88 and 0.77.
- Reference spacing formulas, with narrower peeks below 992px.
- 0.4-second `power2.out` GSAP transitions and infinite wrapping.
- Left/right buttons, clickable side cards, and horizontal drag/swipe using a 25%-of-card-width threshold.
- Tablet/mobile: 326 × 194.2px. Below 381px, width adjusts to 280px.
- White edge fades, rounded image cards, centered pill CTA.
- Onest font bundled locally, blue highlighted heading and navy text.

Keyboard: Tab to the carousel and use Left/Right. Previous/next buttons also work by keyboard. The details dialog closes using Escape, its close button, or the backdrop. Reduced motion removes transitions. React StrictMode/unmount cleanup is included. There is no autoplay.

## Assets and verification
Local optimized WebP images were generated earlier for this elevator website. They are illustrative architectural concepts. No external image/font CDN, Webflow runtime, jQuery or analytics is required.

Verified with production build, server-render check, image/font existence checks and cyclic carousel geometry tests. Browser visual verification was unavailable in the managed preview workflow; pixel-perfect equivalence is not claimed.
