# 1 - Store ui filters state

## Application
JOPR: public\app\jopr

## Task Type
Feature

## Status
Done

## Description
On the job tracker page, ensure all sorting and filter options set by the user are stored and restored whenever the user refreshes or visits the page.

## UI
- add an attribute to the de-fiter component at public\app\jopr\component\de-filter so that one can provide an indexeddb name and storename
- add a property through which an instance of class Db (public\app\jopr\lib\Db.js) can be passed
- when the component is created, if the attribute and Db is provided, load the default value state from indexeddb
- when a filter is added or deleted, if the attribute and Db is provided, save the value state to indexeddb
- for this iteration do not create an instance of Db. use the provided instance or do not process persistance code.
- ensure filters are persisted on the page public\app\jopr\index.html
- also ensure the page index.html does not prematurely clear stored filter values when it loads

## App Logic
- no changes to public\app\jopr\lib are anticipated but should not be excluded

## Db
- no changes to public\app\jopr\lib\Db.js are anticipated but should not be excluded

## Unit Tests
- create a relevant unit test file at test\jopr\component
- ensure unit tests are included for changed functions
- add jsdoc info to component de-filter
- update the readme.md document for component de-filter

## Log
26/10/2026: created.
26/10/2026: completed UI persistence, schema update, de-filter updates, tests, and documentation.
