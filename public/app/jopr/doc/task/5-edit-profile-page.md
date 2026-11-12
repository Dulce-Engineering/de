---
id: 5
title: New page to edit a profile
app: JOPR
app_folder: public\app\jopr
type: feature # [feature, bug]
status: done # [todo, in-progress, review, done]
priority: high # [low, medium, high]
created: 2026-11-11
test_command: "node --test test/jopr/logic/ctx.js"
---

## Description
create a new page that will allow a user to edit the details of a user profile along with the education, career, and project histories. when the page is given a profile id it should mimic the relevant functionality, layout, and code of the jopr/page/profiles.html page as this functionality will be removed from the profiles page at a later stage.

## UI Acceptance Criteria
- [x] page should be based on the existing page jopr/page/profile.html
- [x] page should be created as jopr/page/profile.html and jopr/page/profile.js
- [x] page should accept the query parameter "profile_id" and utilise the route id "profile"
- [x] page should reuse the html and code of the details element in the de-input-list component with id "profile_list" in the existing profiles.html page. as in the existing page this functionality should be placed first. exclude the toolbar functionality to copy or delete a profile.
- [x] page should mimic the use of the de-dialog-form component with id "profile_form" in the original profiles.html page along with the related code. this will allow users to edit their profile main details
- [x] page should mimic the use of the de-input-list component with id edu_list, in the original profiles.html page along with the related code. this will allow users to edit their education history. this functionality should be placed second after the profile section
- [x] page should use the de-input-list component with id career_list in the original profiles.html page along with the related code. this will allow users to edit their career history. this functionality should be placed third after the education history
- [x] page should use the de-input-list component with id project_list in the original profiles.html page along with the related code. this will allow users to edit their project history. this functionality should be placed fourth after the career history
- [x] do not modify page or code of existing jopr/page/profiles.html page as it will be refactored at a later stage. the new profile.html page will stand in isolation for now.

## App Logic Acceptance Criteria
no changes to business logic expected

## Db Acceptance Criteria
no changes to db or related logic expected

## Unit Tests
- [x] test new "profile" route

## Scope & Target Files
- `public/app/jopr/page/profile.html`
- `public/app/jopr/page/profile.js`
- `public/app/jopr/lib/ctx.js`
- `test/jopr/logic/ctx.js`

## Log
2026-11-11: created.
2026-11-12: completed.
