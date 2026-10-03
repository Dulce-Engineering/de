For a Victorian steampunk and *The Time Machine* aesthetic, your design system should balance the warm, mechanical patina of brass, copper, and mahogany with high-contrast, functional legibility suitable for an efficient calendar PWA.

---

### 1. The Colour Palette

A rich, dark-mode-first palette rooted in period materials: polished instrument metals, gaslit embers, oiled leather, and aged parchment.

```
┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│  #14110F    │  #2B2118    │  #C59B27    │  #D96B27    │  #E6D5B8    │
│  Deep Iron  │ Oiled Walnut│ Burnished   │ Gaslight    │ Aged        │
│  (Base BG)  │ (Cards/UI)  │ Brass       │ Ember       │ Parchment   │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘

```

| Token / Role | Hex Code | Purpose & Feel |
| --- | --- | --- |
| **Canvas Background** | `#14110F` | **Cast Iron / Soot Black:** A deep, warm off-black. Far softer and more authentic than modern `#000000`. |
| **Card / Surface** | `#2B2118` | **Oiled Walnut / Polished Leather:** Elevated background for cards, event tiles, and timeline tracks. |
| **Primary Accent** | `#C59B27` | **Burnished Brass:** Clock hands, dials, primary icons, and active timeline markers. |
| **Secondary Accent** | `#D96B27` | **Gaslight Amber / Copper:** Urgent alerts, countdowns, badges, and glowing states. |
| **Primary Text** | `#E6D5B8` | **Aged Parchment / Ivory:** Off-white text that avoids harsh modern contrast and reads comfortably against dark wood. |
| **Muted Text / Border** | `#8C7A6B` | **Tarnished Pewter / Dust:** Subtle borders, grid lines, and relative time labels ("in 3 hours"). |
| **Far-Future (Eloi/Morlock)** | `#2A4436` | **Patina Green / Deep Verdigris:** Optional accent for completed tasks or calm event categories. |

#### CSS Custom Properties

```css
:root {
  --bg-iron: #14110f;
  --surface-wood: #2b2118;
  --surface-hover: #3d2f23;
  --accent-brass: #c59b27;
  --accent-gaslight: #d96b27;
  --accent-patina: #2a4436;
  --text-parchment: #e6d5b8;
  --text-muted: #8c7a6b;
  --border-tarnish: #4a3b2c;
  --border-brass: rgba(197, 155, 39, 0.4);
}

```

---

### 2. Typography Pairings

Steampunk typography works best when it contrasts **ornate 19th-century mechanical title lettering** with **clean, high-density numerals and gauges**.

#### Option A: The "Instrument Dial & Chronicle" (Recommended)

* **Headings / App Title:** **`Cinzel Decorative`** or **`Playfair Display SC`**
* *Character:* Evokes engraved brass nameplates, classical Victorian patent drawings, and pocket-watch maker emblems.


* **Body / Events:** **`IM Fell English`** or **`EB Garamond`**
* *Character:* Typeset like a 19th-century letterpress novel. Clear, dignified, and distinctly literary.


* **Timers, Countdowns & Numbers:** **`Share Tech Mono`** or **`Space Mono`**
* *Character:* Gives countdowns and digital timers the feeling of a precision mechanical counter, telegraph readout, or brass odometer rather than a standard modern sans-serif.



#### Option B: The "Industrial Foundry & Patent" (More Utilitarian)

* **Headings:** **`Besley`** or **`Alfa Slab One`** (used sparingly)
* *Character:* Heavy Victorian Clarendon/Slab-serif aesthetic reminiscent of 1890s London newspaper broadsheets and industrial machinery plaques.


* **Body / Lists:** **`Literata`** or **`Source Serif 4`**
* *Character:* Exceptionally readable at small sizes on mobile screens while preserving historic warmth.


* **Numbers / Badges:** **`DM Mono`**
* *Character:* Monospaced clarity for event dates and remaining time.



#### Google Fonts Import

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Share+Tech+Mono&display=swap" rel="stylesheet">

```

```css
body {
  font-family: 'EB Garamond', Georgia, serif;
  background-color: var(--bg-iron);
  color: var(--text-parchment);
}

h1, h2, .app-title {
  font-family: 'Cinzel Decorative', serif;
  letter-spacing: 0.08em;
  color: var(--accent-brass);
}

.countdown, .timestamp, .gauge-value {
  font-family: 'Share Tech Mono', monospace;
  color: var(--accent-gaslight);
  letter-spacing: 0.05em;
}

```

---

### 3. UI Accents & Material Touches

* **Card Borders:** Instead of flat 1px solid gray lines, use a subtle 1px border with a soft brass drop-shadow:
```css
.event-card {
  background: var(--surface-wood);
  border: 1px solid var(--border-tarnish);
  box-shadow: inset 0 1px 0 rgba(197, 155, 39, 0.15), 0 4px 12px rgba(0, 0, 0, 0.4);
  border-radius: 4px; /* Victorian engineering favoured slight bevels over large modern pill radii */
}

```


* **Dividers & Embellishments:** Use subtle linear-gradient rules that taper off at the ends to feel like engraved instrument lines:
```css
hr.gauge-divider {
  border: none;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border-tarnish), var(--accent-brass), var(--border-tarnish), transparent);
}

```


* **"Time Remaining" Urgency:** Map urgent countdowns from **Burnished Brass** (`#C59B27`) $\to$ **Gaslight Amber** (`#D96B27`) $\to$ **Hot Copper/Vermilion** (`#BF360C`) as the deadline nears, mimicking heating metal or a rising pressure valve.