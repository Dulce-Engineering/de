# TempusToi — SEO, Discoverability & Growth Strategy

This document outlines practical, high-impact recommendations to improve search engine optimization (SEO), social media click-through rates (CTR), PWA discoverability, and organic user acquisition for **TempusToi**.

---

## 1. Metadata & Search Discoverability (`index.html`)

### 1.1 Keyword-Optimized Page Title
* **Current:** `<title>TempusToi</title>`
* **Recommended:**
  ```html
  <title>TempusToi — Free Privacy-First Visual Countdown Timers & Deadline Tracker</title>
  ```
* **Impact:** The `<title>` tag is the highest-weighted on-page ranking factor. Incorporating high-intent search terms (*"countdown timers"*, *"deadline tracker"*, *"free"*, *"privacy-first"*) increases ranking relevancy and search result CTR.

### 1.2 Canonical URL & Social Meta Tags
Add canonical tagging and complete Twitter / X Card specifications inside the `<head>` of [`index.html`](file:///c:/projects/company/public/app/tempustoi/index.html):

```html
<!-- Canonical Link (Prevent duplicate indexing) -->
<link rel="canonical" href="https://dulceengineering.com.au/tempustoi">

<!-- Twitter / X Card Metadata -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="TempusToi — Visual Countdown Timers & Deadline Tracker">
<meta name="twitter:description" content="A privacy-first, local-first countdown timer app with animated mechanical dials. Zero accounts, zero tracking, runs 100% offline.">
<meta name="twitter:image" content="https://dulceengineering.com.au/app/tempustoi/screenshot-1.png">
<meta name="twitter:image:alt" content="TempusToi Mechanical Countdown Dials">

<!-- Mobile Browser & OS Theming -->
<meta name="theme-color" content="#0B3F30">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="TempusToi">
```

---

## 2. Structured Data (Schema.org JSON-LD)

Adding a `WebApplication` structured data block helps Google generate **rich search snippets** (e.g. app badges, pricing tags, rating cards, and feature lists):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "TempusToi",
  "url": "https://dulceengineering.com.au/tempustoi",
  "description": "A privacy-first, local-first countdown timer and task scheduling PWA with vintage mechanical dials and recurring alarms.",
  "applicationCategory": "ProductivityApplication",
  "operatingSystem": "All (Web, Windows, macOS, Linux, iOS, Android)",
  "browserRequirements": "Requires JavaScript and modern Web Components support",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "Rotary dial countdown timers (Days, Hours, Minutes, Seconds)",
    "Recurring alarms and interval scheduling",
    "RFC 5545 iCalendar (.ics) export and import",
    "100% offline-ready Progressive Web App (PWA)",
    "Zero account creation, local-first privacy"
  ],
  "author": {
    "@type": "Organization",
    "name": "Dulce Engineering Pty. Ltd.",
    "url": "https://dulceengineering.com.au"
  }
}
</script>
```

---

## 3. Semantic Heading Hierarchy for Search Crawlers

Search engine crawlers rely on a clear document outline with an `<h1>` heading to understand page relevance. Because the visual logo uses an SVG `<textPath>`, add an accessible hidden `<h1>`:

```html
<header>
  <h1 class="visually-hidden">TempusToi — Visual Countdown Timers & Deadline Management</h1>
  <svg viewBox="0 0 320 80" aria-hidden="true">
    <path id="arcPath" d="M 0 70 A 250 100 0 0 1 320 70" fill="none" stroke="none"/>
    <text>
      <textPath href="#arcPath" startOffset="50%" text-anchor="middle" font-size="50px">
        TempusToi
      </textPath>
    </text>
  </svg>
</header>
```

**Supporting CSS Utility:**
```css
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

---

## 4. PWA Manifest Enhancements (`manifest.json`)

Update [`manifest.json`](file:///c:/projects/company/public/app/tempustoi/manifest.json) to declare app store categories and desktop/mobile context menu shortcuts:

```json
{
  "id": "tempustoi",
  "name": "TempusToi — Countdown Timers",
  "short_name": "TempusToi",
  "description": "Visual countdown timers and deadline manager with mechanical dials. 100% offline & private.",
  "version": "4",
  "start_url": "/app/tempustoi/index.html",
  "scope": "/app/tempustoi/",
  "display": "standalone",
  "background_color": "#0B3F30",
  "theme_color": "#0B3F30",
  "categories": ["productivity", "utilities"],
  "shortcuts": [
    {
      "name": "Add New Timer",
      "short_name": "New Timer",
      "description": "Create a new countdown timer",
      "url": "/app/tempustoi/index.html?action=add",
      "icons": [{ "src": "/images/plus.svg", "sizes": "96x96" }]
    },
    {
      "name": "Export Calendar (.ics)",
      "short_name": "Export ICS",
      "description": "Download all timers as an iCalendar file",
      "url": "/app/tempustoi/index.html?action=export-ics",
      "icons": [{ "src": "/images/event.svg", "sizes": "96x96" }]
    }
  ]
}
```

---

## 5. Product-Led Growth & Marketing Enhancements

### 5.1 First-Run Demo Timers (Zero-Empty-State Onboarding)
* **Opportunity:** When a first-time visitor arrives, `localStorage` is empty and no dials are running, reducing the initial visual "wow" factor.
* **Solution:** On initial load (if `localStorage.getItem("tempustoi")` is null), pre-seed two sample timers:
  1. *“Product Launch”* (e.g., target time 3 days ahead).
  2. *“Focus Sprint”* (e.g., 25-minute relative duration).
* **Result:** First-time users immediately see animated mechanical dials in motion.

### 5.2 Native Web Share API Integration
Add a **"Share TempusToi"** button to the `#menu_panel` menu to enable viral word-of-mouth sharing on mobile and desktop:

```javascript
function On_Click_Share() {
  if (navigator.share) {
    navigator.share({
      title: 'TempusToi — Visual Countdown Timers',
      text: 'Track deadlines with beautiful mechanical countdown dials. Free and 100% private!',
      url: window.location.origin + '/app/tempustoi/'
    }).catch((err) => console.log('Share canceled', err));
  } else {
    navigator.clipboard.writeText(window.location.origin + '/app/tempustoi/');
    alert('Link copied to clipboard!');
  }
}
```

### 5.3 Post-Export Google Calendar Import Assistant
After a user clicks **"Export as ICS"**, provide a helpful notification dialog or toast with a direct link:
> *"Your `.ics` calendar file has downloaded! [Open Google Calendar Import Settings](https://calendar.google.com/calendar/r/settings/export) to upload it in one click."*

---

## 6. Checklist for Implementation

- [x] Update `<title>` tag in `index.html`.
- [ ] Add `<link rel="canonical">` and Twitter Card metadata in `index.html`.
- [ ] Add JSON-LD `WebApplication` schema block in `index.html`.
- [ ] Add visually hidden `<h1>` tag in `index.html`.
- [ ] Add `categories` and `shortcuts` to `manifest.json`.
- [ ] Implement first-run sample timer seeding in `lib/index.js`.
- [ ] Add Web Share option to `#menu_panel`.
