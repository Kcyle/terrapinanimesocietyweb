# Project Memory — Terrapin Anime Society (TAS) Web

> **Purpose:** Fast-reference cheat sheet for AI agents and developers to preserve context across turns and avoid re-reading large files or running redundant codebase scans.

---

## 1. Project Overview & Architecture

- **Project:** Terrapin Anime Society (TAS) Official Website & KameCon Convention Portal
- **Framework:** [Astro 4.x](https://astro.build/) (Static Site Generation / SSG)
- **Styling:** Vanilla CSS (scoped `<style>` blocks in Astro components) + Tailwind CSS + Custom Design Tokens
- **Animations:** [GSAP](https://gsap.com/) (timeline animations, scroll triggers)
- **Hosting / Deploy:** GitHub Pages (`gh-pages` branch, `.nojekyll` present)
- **Repository Structure:**
  ```text
  tas-umd-web/                     <-- Workspace root
  └── terrapinanimesocietyweb/     <-- Project & Git root (.git, package.json)
      ├── public/images/           <-- Static assets & convention imagery
      │   └── Kamecon/             <-- KameCon images, sponsor logos, maps
      ├── src/
      │   ├── components/          <-- Modular UI (navigation, hero, carousels)
      │   ├── data/                <-- JSON data sources
      │   │   ├── kamecon.json     <-- Vendors, sponsors, additional support
      │   │   └── kamecon-schedule.json <-- Timeline events, locations, details
      │   ├── layouts/
      │   │   └── BaseLayout.astro <-- Global HTML wrapper, meta, navbar/footer
      │   ├── pages/               <-- Routes
      │   │   ├── index.astro      <-- TAS Homepage
      │   │   ├── about.astro      <-- Club details
      │   │   ├── contact.astro    <-- Contact form/links
      │   │   ├── meetings.astro   <-- Meeting schedules
      │   │   ├── terpcon.astro    <-- TerpCon portal
      │   │   ├── kamecon.astro    <-- KameCon 2026 main convention landing
      │   │   └── kamecon/
      │   │       └── schedule.astro <-- KameCon detailed schedule page
      │   └── styles/
      │       └── global.css       <-- Global resets and utility classes
  ```

---

## 2. Command Guidelines & Sandbox Caveats

- **Working Directory:** All npm commands must run in `./terrapinanimesocietyweb`:
  - `npm --prefix terrapinanimesocietyweb run dev`
  - `npm --prefix terrapinanimesocietyweb run build`
- **Windows / OneDrive Sandbox Caveat:** Running terminal commands inside OneDrive may trigger `EPERM` / access denial when accessing `node_modules` or `package.json`. Prefer direct file reading/editing tools (`read_file`, `edit_file`) for file inspection instead of shell grep/scans.

---

## 3. KameCon Conventions & Design System

### Visual Theme & Design Tokens
Cyberpunk / Neo-Tokyo aesthetic with futuristic chamfers and neon glow effects.
- `--kc-bg`: `#0b0d12` (dark canvas background)
- `--kc-surface`: `#131b29` (card & panel background)
- `--kc-blue`: `#2f8fe0`
- `--kc-neon`: `#1e9bff` (primary electric blue border/accent)
- `--kc-cyan`: `#6fd3ff` (cyan highlights & subheaders)
- `--kc-red`: `#e0314f` (primary red accent / ticket CTA)
- `--kc-hi`: `#ff8a9b` (hover highlight pink)
- **Typography:**
  - Headers / Titles: `'Oxanium'`, `'Orbitron'`, sans-serif
  - Monospace / Badges / Labels: `'Share Tech Mono'`, monospace
  - Body: `'Chakra Petch'`, sans-serif

---

## 4. Key KameCon Features & Implementation

### 1. Main Landing: `src/pages/kamecon.astro`
- **Tickets Button:**
  - Direct ticket purchase link: `https://umdtickets.universitytickets.com/w/event.aspx?id=1669`
  - "Coming Soon" popup was permanently removed.
- **Vendors Section:**
  - Sourced from `src/data/kamecon.json` (`VENDORS`).
  - Contains mini carousels for vendor logos.
  - **Vendor Alley Map (Demo A):**
    - Action button: `<button class="kc__vmap-btn" data-modal-open="vendor-map">Vendor Map</button>`
    - Lightbox Modal: `<dialog id="modal-vendor-map" class="kc__dialog kc__dialog--map">`
    - **Placeholder Commitment:** Line 41 must stay an empty string until user fills it:
      ```astro
      // TODO: INSERT VENDOR MAP IMAGE FILEPATH MANUALLY (e.g. '/images/Kamecon/vendor_map.png')
      const VENDOR_MAP_IMAGE = '';
      ```
    - Shows styled fallback UI when `VENDOR_MAP_IMAGE` is empty; displays responsive map image when set.
- **Sponsors & Partners Section:**
  - Sourced from `src/data/kamecon.json` (`sponsors` & `additionalSupport`).
  - Tiered cards; displays `name` placeholder if `logo` path is empty.
- **Popups & Dialogs:**
  - Parking & Harassment policies defined in `POPUPS` array.
  - Native `<dialog>` elements managed by `initModals()` (`data-modal-open` / `data-modal-close`).

### 2. Schedule Page: `src/pages/kamecon/schedule.astro`
- Route: `/kamecon/schedule`
- **Venue Map Modal (Demo A):**
  - Button: `.kc__map-btn` ("Venue Map")
  - Modal: `#venue-map-modal` displaying `VENUE_MAP_IMAGE = '/images/Kamecon/event_location.png'`
  - URL hash `#venue-map` automatically opens modal on page load.
- **Arcade Location:** Displays "Prince George's Room" location pill (configured in `src/data/kamecon-schedule.json`).

---

## 5. Critical Bug Fixes & Mobile Layout Rules (DO NOT BREAK)

### Mobile Dead-Scroll / Overscroll Bug
*Issue:* On mobile / narrow screens (<860px), excessive empty scroll space appeared beneath page content.
*Fixes Applied:*
1. **Hidden Dialog Elements:** Unopened native `<dialog>` tags created phantom render height in mobile WebKit/Blink.
   - Fixed via `dialog:not([open]) { display: none !important; }` in `global.css` and `kamecon.astro`.
2. **Container Overflow:**
   - `.kc__vendors` requires `overflow: hidden;` to constrain `.kc__vendors-scroll` (height 30rem).
3. **Clip-Path Bounding Box Calculation:**
   - On `@media (max-width: 860px)`, `clip-path` on `.kc__sponsors` caused incorrect document height calculations and was removed for mobile.
4. **Viewport Clamping:**
   - Root elements clamped with `html, body { overflow-x: hidden; overflow-x: clip; }`.

---

## 6. User Workflow & Interaction Guidelines

1. **Design Options Before Building:**
   - When requested to design/add major new sections or UI patterns, provide **2 demos** first (HTML artifacts / visual previews) and wait for user approval before coding.
2. **Path Placeholders:**
   - Leave image paths as empty strings (`''`) with clear comments whenever the user hasn't provided the finalized asset yet.
3. **Style Consistency:**
   - Strictly adhere to the established KameCon cyberpunk design language, neon glow borders, and chamfered button clip-paths.
