# Porottoz — SEO, Discoverability & Growth Strategy

This document outlines practical, high-impact recommendations to improve search engine optimization (SEO), social media click-through rates (CTR), PWA discoverability, and organic user acquisition for **Porottoz**.

---

## 1. Metadata & Search Discoverability (`index.html`)

### 1.1 Keyword-Optimized Page Title
* **Current:** `<title>Porottoz</title>`
* **Recommended:**
  ```html
  <title>Porottoz — Free Daily Spending Allowance Calculator & Target Date Budget Planner</title>
  ```
* **Impact:** The `<title>` tag is the single most influential on-page SEO ranking factor. Incorporating high-intent search queries (*"daily spending allowance calculator"*, *"target date budget planner"*, *"free"*, *"how much can I spend today"*) dramatically improves organic ranking relevancy and search snippet CTR.

### 1.2 Canonical URL, Mobile OS Theming & Social Meta Tags
Add canonical tagging, enhanced mobile browser theming, and full Twitter / X Card metadata to the `<head>` of [`index.html`](file:///c:/projects/company/public/app/porottoz/index.html):

```html
<!-- Canonical URL (Consolidate Page Authority) -->
<link rel="canonical" href="https://dulceengineering.com.au/porottoz">

<!-- Open Graph (Facebook / LinkedIn / Discord / Slack) -->
<meta property="og:site_name" content="Porottoz">
<meta property="og:type" content="website">
<meta property="og:url" content="https://dulceengineering.com.au/porottoz">
<meta property="og:title" content="Porottoz — Free Daily Spending Allowance Calculator">
<meta property="og:description" content="Know exactly how much you can spend each day until your target date or next payday. Free, privacy-first, 100% offline budgeting with zero login required.">
<meta property="og:image" content="https://dulceengineering.com.au/app/porottoz/image/screenshot-landscape.png">
<meta property="og:image:alt" content="Porottoz Daily Spending Allowance Dashboard">

<!-- Twitter / X Card Metadata -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Porottoz — Daily Spending Allowance & Budget Planner">
<meta name="twitter:description" content="Calculate your daily spending allowance in real time. Set your target date, reserve funds, and track purchases with zero login and full offline privacy.">
<meta name="twitter:image" content="https://dulceengineering.com.au/app/porottoz/image/screenshot-landscape.png">
<meta name="twitter:image:alt" content="Porottoz Budget Dashboard Preview">

<!-- Mobile Browser & OS Theming -->
<meta name="theme-color" content="#90EE90">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Porottoz">
```

---

## 2. Structured Data (Schema.org JSON-LD)

### 2.1 WebApplication Schema
Upgrading from a basic `@type: "Website"` to a specialized `@type: "WebApplication"` enables Google to display **Rich App Snippets** (app badges, interactive feature lists, operating system support, and zero-cost pricing tags):

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Porottoz",
  "url": "https://dulceengineering.com.au/porottoz",
  "description": "A privacy-first, local-first budgeting PWA that calculates daily spending allowances based on available funds and target dates.",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "All (Web, iOS, Android, Windows, macOS, Linux)",
  "browserRequirements": "Requires JavaScript and modern Web Components support",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "Dynamic daily spending allowance calculation",
    "Target date and payday countdown timer",
    "Reserved funds protection for bills and emergencies",
    "Instant purchase and income transaction tracking",
    "Multiple independent budget management",
    "100% offline-ready Progressive Web App (PWA)",
    "Zero login, zero tracking, local-first device storage"
  ],
  "author": {
    "@type": "Organization",
    "name": "Dulce Engineering Pty. Ltd.",
    "url": "https://dulceengineering.com.au"
  }
}
</script>
```

### 2.2 FAQPage Schema (Rich Search Results)
Adding FAQ structured data targets high-volume informational search queries and occupies expansive visual real estate directly within Google Search results:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How does Porottoz calculate my daily spending allowance?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Porottoz subtracts your reserved funds from your total balance and divides the remaining amount by the number of days left until your target date or next payday. As time passes without spending, your daily allowance automatically increases!"
      }
    },
    {
      "@type": "Question",
      "name": "Is my financial data kept private?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, 100%. Porottoz requires no login, email address, or bank account credentials. All budget balances and transaction records are stored exclusively in your device's local browser storage."
      }
    },
    {
      "@type": "Question",
      "name": "Can I use Porottoz offline?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Porottoz is a full Progressive Web App (PWA) with offline caching. You can install it to your home screen and manage your budgets without an internet connection."
      }
    }
  ]
}
</script>
```

---

## 3. Semantic Heading Hierarchy & Accessibility

### 3.1 Crawler-Accessible `<h1>` Tag
The visual logo in the header currently embeds coin emojis (`🪙`) directly inside letterforms (`P🪙r🪙tt🪙z`). Search engine bots and screen readers may read this as disjointed text.

**Recommendation:** Add an accessible, visually hidden `<h1>` tag containing the full, keyword-rich app title while marking the visual logo with `aria-hidden="true"`:

```html
<header>
  <h1 class="visually-hidden">Porottoz — Free Daily Spending Allowance Calculator & Target Date Budget Planner</h1>
  <div class="logo-display" aria-hidden="true">
    <h1>
      <span class="text">
        P<span class="emoji e1">🪙</span>r<span class="emoji e2">🪙</span>tt<span class="emoji e3">🪙</span>z
      </span>
    </h1>
  </div>
  <nav>
    <button id="add_btn" title="Create Budget" aria-label="Create New Budget">
      <span class="text">➕</span>
    </button>
  </nav>
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

### 3.2 Keyword-Optimized Section Headings (`#docs`)
Update the documentation article headings inside `<main id="docs">` to match high-volume user search queries:
* **Current:** `<h2>To create a budget</h2>` $\rightarrow$ **Recommended:** `<h2>Create a Target Date Budget & Daily Allowance</h2>`
* **Current:** `<h2>When you make a purchase</h2>` $\rightarrow$ **Recommended:** `<h2>Record Purchases & Income Adjustments</h2>`
* **Current:** `<h2>To update a budget</h2>` $\rightarrow$ **Recommended:** `<h2>Edit Target Dates, Balances & Reserved Funds</h2>`
* **Current:** `<h2>To delete a budget</h2>` $\rightarrow$ **Recommended:** `<h2>Clear or Reset Completed Budgets</h2>`

---

## 4. PWA Manifest Enhancements (`manifest.json`)

Update [`manifest.json`](file:///c:/projects/company/public/app/porottoz/manifest.json) to declare app store categories, richer descriptions, and desktop/mobile context menu shortcuts:

```json
{
  "id": "porottoz",
  "name": "Porottoz — Daily Spending Budget",
  "short_name": "Porottoz",
  "description": "Calculate your daily spending allowance until your target date or next payday. 100% free, private, and offline-capable.",
  "version": "2",
  "start_url": "/app/porottoz/index.html",
  "scope": "/app/porottoz/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#90EE90",
  "categories": ["finance", "productivity", "utilities"],
  "shortcuts": [
    {
      "name": "Create New Budget",
      "short_name": "New Budget",
      "description": "Start a new target date budget with daily allowance calculation",
      "url": "/app/porottoz/index.html?action=add-budget",
      "icons": [{ "src": "/app/porottoz/image/icon-512x512.png", "sizes": "512x512" }]
    },
    {
      "name": "Record Purchase",
      "short_name": "Add Purchase",
      "description": "Deduct a purchase from your active budget",
      "url": "/app/porottoz/index.html?action=add-purchase",
      "icons": [{ "src": "/app/porottoz/image/icon-512x512.png", "sizes": "512x512" }]
    },
    {
      "name": "Add Income",
      "short_name": "Add Income",
      "description": "Add funds to your active budget",
      "url": "/app/porottoz/index.html?action=add-income",
      "icons": [{ "src": "/app/porottoz/image/icon-512x512.png", "sizes": "512x512" }]
    }
  ],
  "icons": [
    {
      "src": "/app/porottoz/image/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "screenshots": [
    {
      "src": "/app/porottoz/image/screenshot-portrait.png",
      "sizes": "1065x1745",
      "type": "image/png"
    },
    {
      "src": "/app/porottoz/image/screenshot-landscape.png",
      "sizes": "1760x1044",
      "type": "image/png",
      "form_factor": "wide"
    }
  ]
}
```

---

## 5. Product-Led Growth & Organic Acquisition

### 5.1 Zero-Empty-State Demo Budget (First-Run Onboarding)
* **Problem:** When a new visitor first arrives, `localStorage` is empty. The user sees a blank gauge or empty list, requiring cognitive effort to understand the core value proposition.
* **Solution:** On first load (when `localStorage.getItem("porottoz-budgets")` is empty or null), automatically seed a realistic sample budget (e.g., *"Next Payday Spending"*, target date 7 days away, balance $350.00, reserve $50.00 $\rightarrow$ daily allowance $42.85/day).
* **Impact:** Immediate visual payoff! The animated countdown dials, funds gauge, and daily allowance numbers are active in seconds, boosting conversion from visitor to engaged daily user.

### 5.2 Native Web Share API (`navigator.share`)
Add a **"Share Porottoz"** button (or navigation icon) to allow users to easily recommend the tool to friends, housemates, or family:

```javascript
function On_Click_Share_Porottoz() {
  if (navigator.share) {
    navigator.share({
      title: 'Porottoz — Free Daily Spending Allowance Calculator',
      text: 'Track how much you can spend each day until payday. Free, private, and runs 100% offline!',
      url: 'https://dulceengineering.com.au/porottoz'
    }).catch((err) => console.log('Share dismissed', err));
  } else {
    navigator.clipboard.writeText('https://dulceengineering.com.au/porottoz');
    alert('Porottoz link copied to clipboard!');
  }
}
```

### 5.3 Daily Allowance Snapshot & Social Proof Copying
Provide a quick "Copy Summary" or "Share Progress" action on active budgets:
> *"I have a daily spending limit of **$42.50 / day** for the next 7 days on Porottoz! 🪙 Track yours: https://dulceengineering.com.au/porottoz"*

This encourages viral, word-of-mouth social sharing among budgeting communities (e.g. Reddit `/r/personalfinance`, TikTok budgeting challenges, Twitter/X frugal living circles).

---

## 6. Implementation Checklist

- [ ] Update `<title>` tag with high-intent keywords in `index.html`.
- [ ] Add `<link rel="canonical">` and Open Graph / Twitter Card tags in `index.html`.
- [ ] Add `WebApplication` and `FAQPage` JSON-LD schema scripts in `index.html`.
- [ ] Implement visually hidden `<h1>` and optimize `<main id="docs">` section headings.
- [ ] Update `manifest.json` with categories (`finance`, `productivity`, `utilities`) and context menu shortcuts.
- [ ] Add first-run sample budget seeding for new visitors in `index.html`.
- [ ] Add Web Share API button to encourage organic referrals.
