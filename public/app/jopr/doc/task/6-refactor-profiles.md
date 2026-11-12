---
id: 6
title: Transfer functionality from Profiles page to Profile page
app: JOPR
app_folder: public\app\jopr
type: feature # [feature, bug]
status: todo # [todo, in-progress, review, done]
priority: medium # [low, medium, high]
created: 2026-11-12
test_command: tba
---

## Description
As we now have a dedicated page to edit profile details (profile.html), we need to remove the equivalent functionality from the profiles page (profiles.html), link the profiles page to the profile page, and add read-only summary lists of education, career, and projects to the displayed profile details.

## UI Acceptance Criteria
- [ ] when a profile's edit button (de-toolbar-menu cid="profile_item_menu", button cid="edit_btn") is clicked, it should now open the profile page in a new tab displaying the relevant profile details
- [ ] remove the education list (de-input-list id="edu_list") and related code as this is now displayed in the new profile page (profile.html)
- [ ] remove the career list (de-input-list id="career_list") and related code as this is now displayed in the new profile page (profile.html)
- [ ] remove the projects list (de-project-list id="project_list") and related code as this is now displayed in the new profile page (profile.html)
- [ ] in the profile details template (de-input-list id="profile_list", details), add a simple read-only education list (de-input-list) showing the title, institution, and year. do not apply any styling as it will be applied later.
- [ ] in the profile details template (de-input-list id="profile_list", details), add a simple read-only career list (de-input-list) showing the company name, role title, time details (start date, end date, time span). do not apply any styling as it will be applied later.
- [ ] in the profile details template (de-input-list id="profile_list", details), add a simple read-only projects list (de-input-list) showing the title, url. do not apply any styling as it will be applied later.

## App Logic Acceptance Criteria
no application business logic changes expected

## Db Acceptance Criteria
no backend or database related changes expected

## Unit Tests
no unit tests expected

## Scope & Target Files
- `public/app/jopr/page/profiles.html`
- `public/app/jopr/page/profiles.js`

## Log
2026-11-12: created
