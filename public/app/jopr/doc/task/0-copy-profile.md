# 0 - Copy Profiles

## Application
- JOPR: public\app\jopr

## Task Type
Feature

## Status
Done

## Description
Allow users to create copies of profiles so they dont have to manually re-enter data.

## UI
- Changes should be applied to page public\app\jopr\page\profiles.html
- Add "copy" button to all profiles listed 
  - Changes should be applied to component de-toolbar-menu
  - add a "copy" button using the image public\app\jopr\image\copy.svg
  - this should then be displayed in element with cid=profile_item_menu
- Copied profiles should have a title of "Copy of " with the original title appended

## App Logic
- appropriate event handlers should be applied in file public\app\jopr\page\profiles.js

## Db
- changes should be applied to class public\app\jopr\lib\Profile.js
- copy data in tables profiles, career, and education

## Created
21/10/2026