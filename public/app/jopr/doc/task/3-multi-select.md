---
id: 3
title: new multi search select component
app: JOPR
app_folder: public\app\jopr
type: feature
status: in-progress
priority: medium
created: 2026-10-26
test_command: tba
---

## Description
Create a new component based on the existing de-search-select but change it to support multiple selections.

## UI Acceptance Criteria
- [ ] use existing copy of component de-search-select code at "public\app\jopr\component\de-search-select copy" to create new de-search-multi-select component by renaming the folder to de-search-multi-select
- [ ] name new component class as DeSearchMultiSelect and tag name de-search-multi-select
- [ ] change the "value" field to accept and return an array of values
- [ ] the items, name, and placeholder fields should work as is
- [ ] change handler On_Click_Items to add to the value array when an option is selected
- [ ] update jsdoc and other documentation to reflect new functionality

## UI Selected Items Acceptance Criteria
- [ ] the "selected_item" field should be renamed "selected" and get/set an array of items. when set, the array should be rendered as a list of items below the search input field
- [ ] the selected rendered items should resemble the image at public\app\jopr\doc\task\image\de-search-multi-select.png
- [ ] each selected item should include a title, an edit button, and a delete button
- [ ] buttons should be implemented via the use of the de-toolbar-menu component
- [ ] item titles should be rendered as h2 tags
- [ ] a whole item should be rendered within a single div tag
- [ ] when the edit button of an item is clicked, an "edit" event should be triggered in a similar fashion to On_Click_Add_Btn but add the selected value to the event
- [ ] when the delete button of an item is clicked, the item should be removed from the select field and the rendered item removed as well

## App Logic Acceptance Criteria
- no changes expected but should not be excluded

## Db Acceptance Criteria
- no changes expected but should not be excluded

## Unit Tests
- test new component functionality in file test\jopr\component\de-search-multi-select.js

## Scope & Target Files
- `public\app\jopr\component\de-search-select copy\*.*`
- `test\jopr\component\de-search-multi-select.js`

## Log
27/10/2026: created.
