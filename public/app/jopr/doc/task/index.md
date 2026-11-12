# JOPR Tasks Index

Central dashboard and status tracker for JOPR application features, bug fixes, and technical tasks.

---

## Task Board

| ID | Title | Type | Status | Priority | Created | Test Command |
|---|---|---|---|---|---|---|
| [0](0-copy-profile.md) | Copy Profiles | Feature | Done | Medium | 2026-10-21 | `node --test test/jopr/logic/Profile.js` |
| [1](1-store-filters.md) | Store UI filters state | Feature | Done | Medium | 2026-10-26 | `node --test test/jopr/component/de-filter.js` |
| [2](2-log-errors.md) | Log errors to Firebase Analytics | Feature | Done | Medium | 2026-10-26 | `node --test test/jopr/logic/ctx.js` |
| [3](3-multi-select.md) | New multi search select component | Feature | Done | Medium | 2026-10-26 | `node --test test/jopr/component/de-search-multi-select.js` |
| [4](4-refactor-contact-list.md) | Refactor de-contact-list to use de-search-multi-select | Feature | Done | Medium | 2026-10-27 | `node --test test/jopr/component/de-contact-list.js` |
| [5](5-edit-profile-page.md) | New page to edit a profile | Feature | Done | High | 2026-11-11 | `node --test test/jopr/logic/ctx.js` |
| [6](6-refactor-profiles.md) | Transfer functionality from Profiles page to Profile page | Feature | Done | Medium | 2026-11-12 | `tba` |

---

## Active & Upcoming

### In Progress
*No active tasks in progress.*

### To Do / Backlog
<!-- Add new tasks here as they are drafted -->
*No open tasks. Create a new task by copying `x-template.md`.*

---

## Completed

- [x] **[#0: Copy Profiles](0-copy-profile.md)** (2026-10-21) — Allow cloning career profiles without manual data re-entry.
- [x] **[#1: Store UI filters state](1-store-filters.md)** (2026-10-26) — Persist and restore job tracker filters in IndexedDB via `de-filter`.
- [x] **[#2: Log errors to Firebase Analytics](2-log-errors.md)** (2026-10-26) — Report uncaught errors and promise rejections to GA4.
- [x] **[#3: New multi search select component](3-multi-select.md)** (2026-10-26) — Multi-select combobox with rendered items list, edit, and delete via `de-toolbar-menu`.
- [x] **[#4: Refactor de-contact-list to use de-search-multi-select](4-refactor-contact-list.md)** (2026-10-27) — Replaced de-input-list with de-search-multi-select in sublist view, added items property, and integrated with job dialog.
- [x] **[#5: New page to edit a profile](5-edit-profile-page.md)** (2026-11-11) — Created standalone `profile.html` and `profile.js` page for editing a profile and its education, career, and project histories by `profile_id`, along with the `profile` route in `ctx.js`.
- [x] **[#6: Transfer functionality from Profiles page to Profile page](6-refactor-profiles.md)** (2026-11-12) — Linked profile edit button to `profile.html` in a new tab, removed standalone education, career, and project lists from `profiles.html`/`profiles.js`, and added read-only summary lists inside each profile's details template.

---

## Verification & Test Suite

To run tests across all completed tasks:
```bash
node --test test/jopr/component/de-contact-list.js test/jopr/component/de-search-multi-select.js test/jopr/component/de-search-select.js test/jopr/component/de-filter.js test/jopr/logic/Profile.js test/jopr/logic/ctx.js
```

---

## Creating a New Task
1. Duplicate [x-template.md](x-template.md) and name it `<id>-<short-slug>.md` (e.g., `4-new-feature.md`).
2. Fill out the YAML frontmatter (`id`, `title`, `type`, `priority`, `test_command`).
3. Define the checklist under **Acceptance Criteria**.
4. Add the task row to the **Task Board** table above.
