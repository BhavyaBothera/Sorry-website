# For Kavya 💗

A heartfelt, personal, and interactive digital apology letter — handcrafted with vanilla HTML5, CSS3, JavaScript, and genuine accountability.

---

## Overview

This project is a thoughtfully art-directed interactive apology website created for Kavya. It combines an illustrated opening envelope, an authentic apology letter, self-reflection commitments, a playful non-quantified repair interaction, and a gentle concluding send-off.

The project strictly adheres to progressive enhancement: **the entire apology is completely accessible and readable even if JavaScript is disabled or fails to load.**

---

## How to Run

1. **Open `index.html`** directly in any modern web browser (Chrome, Firefox, Safari, Edge):
   - Double-click `index.html`, or
   - Right-click → **Open With** → Select your browser, or
   - Drag and drop `index.html` into an active browser window.
2. No local server, build tools, node packages, or internet connection (beyond optional Google Web Fonts) are required.

---

## File Structure & Architecture

| File | Purpose | Architecture Notes |
|------|---------|--------------------|
| [`index.html`](file:///index.html) | Semantic page structure | Progressive enhancement (`class="no-js"`), semantic landmarks (`<main>`, `<section>`, `<footer>`), native `<button>` controls, skip links, and ARIA live status regions. |
| [`style.css`](file:///style.css) | Design system & styles | CSS custom property tokens, illustrated layered envelope, paper stationery styling, fluid typography, responsive layout breakpoints, and full `prefers-reduced-motion` fallbacks. |
| [`script.js`](file:///script.js) | Interactions & motion | Defensive DOM bindings, bounded self-cleaning particle systems, keyboard focus management, non-quantified status handling, and progressive letter reveal. |
| [`README.md`](file:///README.md) | Documentation | Complete project documentation, technical overview, and testing log. |

---

## Features

1. **Layered Illustrated Envelope**:
   - Realistic envelope illustration with lined interior, 3D rotating top flap, emerging letter sheet ("For Kavya 💗"), and embossed heart wax seal.
   - Dual entry points: interactive envelope button and high-contrast "Open Your Little Surprise 💌" button.
   - Built-in "Skip straight to letter ↓" bypass for immediate reading without waiting for decorative transitions.

2. **Core Apology Letter (Centerpiece)**:
   - Sincere, accountable, non-pressuring message printed on tactile warm ivory stationery.
   - Metallic paperclip and subtle hand-drawn doodles.
   - High text contrast (`#49283F` plum on `#FFFDF9` paper: 11.5:1 ratio, exceeding WCAG AAA standards).
   - Progressive enhancement: fully readable without JavaScript.

3. **Honest Self-Reflection Cards**:
   - Three key areas of personal growth: *Pause before reacting*, *Listen instead of defending*, and *Show it through actions*.
   - Subtle hover elevation and soft border illumination.

4. **Friendship Repair Department (Mini-Game)**:
   - Three playful interactions: *Deploy virtual chocolates 🍫*, *Send a tiny army of hugs 🧸*, and *Activate puppy eyes 🥹*.
   - **Non-quantified status component**: emotional repair and trust are never presented as a measurable score or something earned by clicking buttons.
   - Contextual, humble responses communicating that accountability remains paramount.
   - Individual button cooldowns, memory-safe DOM cleanup, and zero particle accumulation.

5. **One Small Promise**:
   - Clear, grounded commitments to emotional maturity and giving Kavya the time and space she deserves.

6. **Finale & Gentle Heart Burst**:
   - Sincere closing message reiterating zero pressure.
   - Native-disabled burst button with radial heart and star particle emission.
   - Calming aftermath message: *"That's all from me for now. Take all the time and space you need, Kavya. 💗"*.

---

## Accessibility & Inclusive Design

- **Semantic Landmark Hierarchy**: Structured with `<h1>`, `<h2>`, and `<h3>` heading levels.
- **Keyboard Navigation**:
  - Global skip link (`<a href="#apology" class="skip-link">`) immediately visible upon pressing `Tab`.
  - When the intro is skipped or opened, keyboard focus is systematically transitioned to the main content (`#hero-heading` or `#apology-heading`), preventing focus trapping in invisible layers.
  - All interactive triggers use native `<button type="button">` or valid anchor elements.
  - High-visibility focus indicator: `outline: 3px solid #D82E78; outline-offset: 3px;`.
- **Screen Reader Announcements**:
  - Mini-game messages utilize `role="status"` and `aria-live="polite"`.
  - Purely decorative elements (particles, blobs, doodles, stickers) are flagged with `aria-hidden="true"`.
- **WCAG Contrast Ratios**:
  - Primary text on light paper: **11.5:1** (WCAG AAA).
  - Secondary text on cream: **7.1:1** (WCAG AAA).
  - High-contrast button backgrounds (`#D82E78` to `#B81B60`) with white text: **4.8:1** (WCAG AA).
- **Reduced Motion Support**:
  - `@media (prefers-reduced-motion: reduce)` disables all decorative particle generation, eliminates transition delays, and renders all text and cards immediately visible.

---

## Tested Viewports & Environments

The implementation was tested across the following viewport dimensions and scenarios:
- **320 × 568** (Narrow mobile / iPhone SE) — verified zero horizontal scroll, text wrapping intact.
- **375 × 667** & **390 × 844** (Standard mobile / iPhone 8 & 12/13/14) — verified touch targets >= 48px.
- **430 × 932** (Large mobile / iPhone Pro Max) — verified card spacing and padding.
- **740 × 360** (Landscape short mobile) — verified vertical scrolling within intro overlay; no overlapping elements.
- **768 × 1024** (Tablet Portrait) & **1024 × 768** (Tablet Landscape) — adaptive grid layout.
- **1440 × 900** (Desktop) — desktop hover effects, subtle card tilt, max reading line-length (65ch).
- **Browser Zoom 200%** — confirmed layout flexibility without overlapping text or clipped buttons.
- **No-JavaScript Mode** — verified by disabling script execution; entire letter and all cards display instantly.

---

## Known Limitations

- **Font Fallbacks**: Google Fonts (`Playfair Display`, `Inter`, `Caveat`) require internet access on first load; if offline, native system serif, sans-serif, and cursive fonts are gracefully substituted.
- **3D Card Perspective**: The subtle card tilt on mousemove is deliberately disabled on touch devices and for users with `prefers-reduced-motion` enabled to maintain performance and comfort.

---

*Handcrafted by Bhavya for Kavya. 💗*
