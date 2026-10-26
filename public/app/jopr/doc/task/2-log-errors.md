# 2 - Log Errors

## Application
JOPR: public\app\jopr

## Task Type
Feature

## Status
In Progress

## Description
Log application errors to Firebase Analytics

## UI
- no changes expected but should not be excluded

## App Logic
- create an instance of firebase analytics in the context object at public\app\jopr\lib\ctx.js
- on the context object create event handlers for errors and unhandled exceptions. these should log events to the analytics instance.

## Db
- no changes expected but should not be excluded

## Unit Tests
- create context unit test file at test\jopr\logic
- add unit tests for any new or changed functions
- add jsdoc for the context object

## Log
26/10/2026: created.

