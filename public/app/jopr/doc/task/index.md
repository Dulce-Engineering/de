# JOPR Tasks Index

Central dashboard and status tracker for JOPR application features, bug fixes, and technical tasks.

---

## Task Board

| ID | Title | Type | Status | Priority | Created | Test Command |
|---|---|---|---|---|---|---|
| [0](0-copy-profile.md) | Copy Profiles | Feature | Done | Medium | 2026-10-21 | `node --test test/jopr/logic/Profile.js` |
| [1](1-store-filters.md) | Store UI filters state | Feature | Done | Medium | 2026-10-26 | `node --test test/jopr/component/de-filter.js` |
| [2](2-log-errors.md) | Log errors to Firebase Analytics | Feature | Done | Medium | 2026-10-26 | `node --test test/jopr/logic/ctx.js` |

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

---

## Verification & Test Suite

To run tests across all completed tasks:
```bash
node --test test/jopr/component/de-search-select.js test/jopr/component/de-filter.js test/jopr/logic/Profile.js test/jopr/logic/ctx.js
```

---

## Creating a New Task
1. Duplicate [x-template.md](x-template.md) and name it `<id>-<short-slug>.md` (e.g., `3-meter-ai-usage.md`).
2. Fill out the YAML frontmatter (`id`, `title`, `type`, `priority`, `test_command`).
3. Define the checklist under **Acceptance Criteria**.
4. Add the task row to the **Task Board** table above.
