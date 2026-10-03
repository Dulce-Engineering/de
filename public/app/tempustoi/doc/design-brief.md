# UI / UX & Graphic Design Brief: TempusToi

> **Project Name:** TempusToi (Progressive Web Application)  
> **Document Purpose:** Creative & Technical UI/UX Design Specification  
> **Target Theme:** Late Victorian English Steampunk (*The Time Machine* — H.G. Wells, 1895)  
> **Location:** `public/app/tempustoi/`  

---

## 1. Executive Summary & Creative Vision

### 1.1 Product Overview
**TempusToi** is a high-performance, privacy-first, local-first Progressive Web App (PWA) designed for precise deadline and countdown tracking. It replaces conventional flat calendar grids with **live mechanical rotary complication dials** that visually represent passing time at a glance.

### 1.2 Creative Direction: The Richmond Laboratory (1895)
The overarching aesthetic is inspired directly by **H.G. Wells’ seminal 1895 science-fiction masterpiece, *The Time Machine***. 

The application should feel less like software and more like a physical, handcrafted Victorian chronometric instrument discovered in the Time Traveller’s workshop:
* **Period Ambience:** Late 19th-century British scientific romanticism—rich, dark workshop surfaces, polished brass bezels, knurled dials, ivory gauges, quartz escapements, and gaslit embers.
* **Mechanical Authenticity:** Controls and gauges should evoke tangible tactile physics—gears that engage, dials that tick with escapement rhythm, riveted nameplates, and astronomical diurnal complications.
* **Functional Modernity:** Despite the rich historic theme, the interface must remain intuitive, responsive, lightweight, and accessible on both mobile and desktop screens.

---

## 2. Colour Palette & Material System

> **Design Constraint:** The existing brand colour palette **is strongly preferred**. All new textures, gradients, borders, and lighting models must derive from these specific tokens.

```
┌──────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│   #0B3F30    │   #E39828    │   #EA572A    │   #EBD5B8    │   #EFBC9C    │
│ Deep Machine │  Burnished   │   Gaslight   │     Aged     │   Polished   │
│    Green     │  Brass Gold  │  Ember Red   │  Parchment   │  Rose Sand   │
│  (Base/Back) │ (Gears/Trim) │ (Alerts/CTA) │ (Typography) │ (Accents/UI) │
└──────────────┴──────────────┴──────────────┴──────────────┴──────────────┘
```

### 2.1 Material Role Mapping

| Token | Hex Code | Material & Steampunk Role | Application in UI |
| :--- | :--- | :--- | :--- |
| `--green` | `#0B3F30` | **Deep Machine Enamel / British Forest Green** | Application canvas background, dark card insets, dial face backplates, radial background vignettes. |
| `--orange` | `#E39828` | **Burnished Brass / Gilded Clockwork Amber** | Dial complication rings, gear teeth, clock hands, double-line borders, primary icons, highlighted buttons. |
| `--red` | `#EA572A` | **Gaslight Ember / Terracotta Heat** | Overdue timer rings, active alarm pulsations, title brandmark highlights, primary call-to-action hover states. |
| `--white` | `#EBD5B8` | **Aged Parchment / Antique Ivory** | Primary typographic readouts, clock dial numbers, tooltips, dialog text, contrast labels. |
| `--pink` | `#EFBC9C` | **Polished Copper / Warm Rose Sand** | Secondary badges, sub-labels, period input counters, table borders, subtle glow reflections. |
| `--overdue`| `#00FF0088` / `#0F08` | **Verdigris / Radium Glow** | Subtle luminescent green backlight indicator for active/overdue complications. |

---

## 3. Core UI Components & Design Deliverables

### 3.1 Mechanical Complication Dials (`<de-timer>`)
The visual centerpiece of each timer card is a 4-meter segmented rotary dial cluster (**Days**, **Hours**, **Minutes**, **Seconds**).

* **Dial Bezels:** Design concentric brass bezels (`#E39828`) with engraved tick marks, subtle metallic depth, and drop-shadows.
* **Dial Motion & Escapements:** Visual styling for smooth second rotations (`anim-seconds`), stepping minute transitions, and flip completions (`anim-border`).
* **Overdue State:** Dynamic visual shift when a timer expires—transitioning from golden brass glow to pulsating ember red (`#EA572A`) or patina green (`--overdue`).
* **Dial Interactions:** Clickable dial faces that provide tactile mechanical visual feedback (e.g. spring compression or rotation pulse) when tripped.

### 3.2 Celestial & Time Instruments (`<de-clock>`, `<de-sun-moon>`)
The top navigation bar acts as an integrated Victorian instrument dashboard:
* **Analog Chronometer (`<de-clock>`):** Analog live clock featuring Roman or vintage Arabic mechanical numerals, slender filigree hour/minute hands, and a rotating sweep-seconds wheel.
* **Diurnal Sun & Moon Complication (`<de-sun-moon>`):** An astronomical sub-dial with hand-drawn Victorian celestial iconography tracking sunrise, solar zenith, sunset, and lunar twilight phases.
* **Full Date Banner:** Formatted date string styled like an engraved patent dateplate or letterpress newspaper header.

### 3.3 Main Title & Branding (`<header>`)
* **Arched Nameplate:** Arched text banner (`TempusToi`) designed to evoke Victorian locomotive brass cast nameplates, chronometer serial plates, or engraved scientific apparatus logos.
* **SVG Vector Assets:** Scalable, resolution-independent SVG vector artwork compatible with dark-mode backdrops.

### 3.4 Timer Cards & Event Panels (`<de-event>`)
* **Card Surface:** Styled as an oiled walnut or dark green lacquered panel with double-line brass borders (`#E39828`).
* **Header & Metadata:** Formatted target date strings, human-readable recurrence badges (e.g., *“Every 2 Weeks on Monday, Friday”*), and editable title tags.
* **Action Controls:** Victorian mechanical buttons for **Pause/Resume** (`stop_btn`), **Edit** (`edit_btn`), **View Notes** (`view_btn`), and **Dismiss/Delete** (`del_btn`).

### 3.5 Dialogs & Input Modals (`<dialog>`, `DeInputPeriod`, `DeInputRepeat`)
* **Modal Framing:** Victorian brass-framed inspection hatches with double bevel borders and dark radial backdrop shading.
* **Form Controls:**
  * Number inputs styled as mechanical rotary counters or stepped thumbwheels.
  * Recurrence selector with brass checkbox toggles for weekdays (`M`, `T`, `W`, `T`, `F`, `S`, `S`).
  * Relative duration selector (`DeInputPeriod`) dividing Days, Hours, Minutes, and Seconds into distinct brass readout chambers.
* **Help Tooltips (`.info` / `.close`):** Popover bubbles styled as aged parchment technical notes with brass pin dismiss buttons.

### 3.6 Iconography System
Redesign standard flat SVG icons into cohesive, single-color Victorian linework/engraving assets:

| Icon Target | Current | Victorian Steampunk Concept |
| :--- | :--- | :--- |
| **Add Timer / Plus** | `/images/plus.svg` | Precision brass drafting crosshair / compass rose |
| **Menu** | `/images/menu.svg` | Triple brass lever array or ornate mechanical hatch |
| **Calendar / ICS** | `/images/event.svg` | Pocket astronomical calendar / engraved chronometer badge |
| **Export / Download**| `/images/download.svg`| Clockwork tape punch / mechanical stylus |
| **Import / Upload**  | `/images/upload.svg`  | Winding key / spring loader |
| **Delete / Trash**   | `/images/bin.svg`     | Furnace crucible / release valve |
| **Close / Dismiss**  | `/images/close.svg`   | Intersected brass caliper needles |

---

## 4. Typographic Hierarchy & Guidelines

Typography must pair **ornate 19th-century title engraving** with **high-legibility mechanical readouts and letterpress book serif**:

```
[ Headings & Titles ]       ->  Rye / Cinzel Decorative / Playfair Display SC
[ Body & Narrative Notes ]   ->  EB Garamond / Libre Baskerville / Roboto Slab
[ Timers & Monospace Readouts ] ->  Share Tech Mono / Space Mono / DM Mono
```

### Typographic Specifications:
1. **App Title & Hero Banners:** `Rye` or `Cinzel Decorative` in `#EA572A` / `#E39828` with subtle letter-spacing (`0.05em–0.08em`).
2. **Card Headers & Modal Titles:** `Roboto Slab` / `Playfair Display SC` in `#E39828` (700 weight).
3. **Countdown Numbers & Gauges:** `Share Tech Mono` in `#EA572A` or `#EBD5B8` with crisp tabular alignment.
4. **Explanatory Copy & Notes:** `EB Garamond` / `Libre Baskerville` in `#EBD5B8` with comfortable 1.55 line-height.

---

## 5. UI/UX Interaction Principles & Micro-Animations

1. **Mechanical Weight & Inertia:** UI transitions should feel physical. Modal dialogs drop and swing into place (`swing-in-anim`, `fall-anim`) like heavy iron hatches.
2. **Tick & Escapement Rhythms:** Rotary dials should rotate with crisp, quantized steps or smooth cinematic planetary motion.
3. **Pulsating Alert States:** Expiring or overdue alarms pulse with a hot ember glow (`pulsate-red`) around the active timer panel.
4. **Empty State & Ambient Background:** When no timers are active, the ambient background reveals faint rotating clockwork gears and complications (`#bk`) overlaid with the SEO landing guide.

---

## 6. Technical & Frontend Constraints

The designer must respect the repository’s pure web-standards architecture:

1. **No External Heavy Frameworks:** The frontend runs on native **Vanilla JavaScript (ES Modules)**, **HTML5 Custom Elements**, and **Vanilla CSS**. No React, Vue, Tailwind, or Bootstrap dependencies.
2. **Vector Assets (SVG Preferred):** All dials, icons, complications, and borders must be supplied as optimized, clean SVG files or pure CSS vectors for crisp rendering on high-DPI (Retina) screens.
3. **Responsive Breakpoints:** 
   - Mobile: `320px – 767px` (single-column dials, touch-friendly tap targets $\ge 48\text{px}$).
   - Tablet/Desktop: `768px – 1440px+` (multi-column dashboard, fixed navigation instruments).
4. **Dark Mode First:** The entire interface is built upon the dark Victorian palette (`#0B3F30`, `#14110F`) with no harsh `#FFFFFF` surfaces.
