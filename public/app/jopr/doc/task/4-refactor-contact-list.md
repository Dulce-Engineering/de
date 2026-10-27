---
id: 4
title: Refactor de-contact-list to use de-search-multi-select
app: JOPR
app_folder: public\app\jopr
type: feature
status: done
priority: medium
created: 2026-10-27
test_command: "node --test test/jopr/component/de-contact-list.js test/jopr/component/de-search-multi-select.js test/jopr/component/de-search-select.js test/jopr/component/de-filter.js test/jopr/logic/Profile.js test/jopr/logic/ctx.js"
---

## Description
Refactor the component de-contact-list so that, when rendering the sublist view, use the new component de-search-multi-select instead of de-input-list.

## UI Acceptance Criteria
- [x] change method Render_Sublist to use component de-search-multi-select instead of de-input-list
- [x] method Render_Sublist should render the h2 element Contacts heading outside and before the de-search-multi-select component
- [x] a new field called "items" should be created so the contact items of the de-search-multi-select component can be set
- [x] on page public\app\jopr\page\index.js the On_Click_Select_Contact function should be removed and the searchable contact items (job_contacts.items) should be set when the job_dialog element is displayed in the function On_Click_Edit_Job

## App Logic Acceptance Criteria
- no changes expected but should not be excluded

## Db Acceptance Criteria
- no changes expected but should not be excluded

## Unit Tests
- [x] amend unit tests for Render_Sublist
- [x] add unit tests for "items" field
- [x] ensure all other tests are still passing

## Scope & Target Files
- `public\app\jopr\component\de-contact-list\index.js`
- `test\jopr\component\de-contact-list.js`

## Log
27/10/2026: created.
27/10/2026: completed.
