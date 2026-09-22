# Dulce Engineering — AI Coding & Architecture Standards

This repository is built around high-performance, frameworkless web applications and custom Web Components. Any AI assistant working on this project must adhere to the principles and standards below.

---

## 1. Core Architecture Principles

1. **Pure Web Standards**:
   - Use standard **Vanilla JavaScript (ES Modules)**, **HTML5**, and **Vanilla CSS**.
   - Do **NOT** introduce heavy frontend frameworks (React, Vue, Angular, Svelte) or CSS utility frameworks (Tailwind, Bootstrap) unless explicitly requested by the user.
2. **Component Model (Web Components)**:
   - UI widgets and controls must be built as standard Custom Elements extending `HTMLElement`.
   - Classes must be prefixed with `De` (e.g., `DeField`, `DeContactDetails`, `DeInputList`).
   - Custom element tag names must be hyphenated, lowercase, and prefixed with `de-` (e.g., `de-field`, `de-contact-details`).
   - Register custom elements using `Utils.Register_Element(DeClassName)` from `public/lib/Utils.js`.
3. **PWA Architecture (`public/app/*`)**:
   - Progressive Web Apps reside in `public/app/<app-name>/` (e.g., `public/app/jopr`, `public/app/crm`, `public/app/blottolog`).
   - Each app uses modular page layouts, standalone CSS, and local IndexedDB or LocalStorage persistence via a central context / state manager (e.g., `ctx.js` or `app.js`).
4. **Backend & Functions (`functions/`)**:
   - Firebase Cloud Functions and Genkit AI flows live in the `functions/` directory.

---

## 2. Coding & Naming Conventions

### JavaScript
- **Class Names**: `PascalCase` with `De` prefix for custom elements (e.g., `DeToolbarMenu`, `DeContactList`).
- **Method & Function Names**:
  - Event Handlers & Lifecycle Hooks: `PascalCase` with `On_` prefix (e.g., `On_Click_Save`, `On_Change_Select`, `On_Upgrade_Needed`, `On_Render_Item`, `On_Set_Attribute`).
  - Helper & Utility Methods: `PascalCase` (e.g., `Render`, `Hide`, `Show`, `Clear`, `Set_Id_Shortcuts`).
- **Variables & Properties**:
  - Properties & Variables: `snake_case` (e.g., `value_str`, `label_elem`, `profile_id`, `curr_profile`).
  - DOM Shortcuts / Element references: suffix with `_elem` or `_btn` (e.g., `save_btn`, `list_elem`, `dialog_elem`).
- **JSDoc**: Document all custom elements, attributes, properties, and methods with JSDoc annotations.

### HTML & Web Components
- **DOM ID Shortcuts**:
  - Use `cid="..."` attributes on internal template elements and invoke `Utils.Set_Id_Shortcuts(this, this, "cid")` inside `Render()` to bind them directly as instance properties (e.g., `<dd cid="value_elem"></dd>` -> `this.value_elem`).
- **Attributes**:
  - Use lowercase hyphenated attribute names (e.g., `field-label`, `field-type`, `hide-class`, `profile-id`).
  - Observe attributes via `static get observedAttributes()` and handle modifications in `attributeChangedCallback` or `On_Set_Attribute`.

### CSS & Styling
- Use component-scoped CSS files (e.g., `style.css` alongside `index.js`).
- Use CSS Custom Properties (variables) for consistent colors, spacing, and typography.
- Avoid inline styles for complex layouts; use CSS classes and toggle states using classes or `hidden`/`hide-class`.

---

## 3. Data & Storage Rules (IndexedDB)

1. **Schema Definitions**:
   - IndexedDB schema and object store structures are defined in `schema.json` within each PWA.
2. **Migrations & Upgrades**:
   - When modifying database tables, fields, or indexes, increment the database version in `schema.json`.
   - Implement backwards-compatible data migrations in `On_Upgrade_Needed(event)` or the respective migration hook, ensuring existing records receive appropriate default values (e.g. populating new foreign keys).

---

## 4. Testing Rules (Playwright)

- End-to-end tests live under `test/` (e.g., `test/jopr/`, `test/blottolog/`).
- Use Playwright with clear semantic assertions (`expect(locator).toBeVisible()`).
- Always clean up or isolate storage state (`localStorage`, `IndexedDB`) before each test to prevent cross-test contamination.
- Run tests via `npm test` or `npx playwright test` inside the `test/` directory.

---

## 5. Modular Rules Directory
For deeper guidelines by domain, refer to:
- [.agents/rules/coding-standards.md](file:///c:/projects/company/.agents/rules/coding-standards.md) — JavaScript style, JSDoc, CSS patterns.
- [.agents/rules/web-components.md](file:///c:/projects/company/.agents/rules/web-components.md) — Custom Elements lifecycle, templates, shortcuts.
- [.agents/rules/pwa-and-storage.md](file:///c:/projects/company/.agents/rules/pwa-and-storage.md) — PWA structure, IndexedDB migrations, `ctx.js`.
- [.agents/rules/testing.md](file:///c:/projects/company/.agents/rules/testing.md) — Playwright test specifications and patterns.
