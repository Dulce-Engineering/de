Exporting all events to Google Calendar from a client-side PWA is entirely feasible, but the implementation approach dictates whether it takes an afternoon or several weeks of dealing with third-party verification.

There are two primary architectural routes:

---

### Route 1: Direct `.ics` File Export (Zero Overhead — Recommended)

Because Google Calendar natively imports `.ics` (iCalendar/RFC 5545) files, generating and triggering a standard `.ics` download in the browser is the cleanest, most resilient method.

* **Feasibility:** **Extremely High** (1–2 days).
* **How it works:**
1. Iterate over your local event store.
2. Serialize the array into a standard `VCALENDAR` string containing `VEVENT` blocks (`UID`, `DTSTAMP`, `DTSTART`, `DTEND`, `SUMMARY`, `DESCRIPTION`, `RRULE`).
3. Instantiate a `Blob([icsString], { type: 'text/calendar;charset=utf-8' })`.
4. Create an object URL with `URL.createObjectURL(blob)` and trigger a download via an anchor tag `<a download="tempustoi-events.ics">`.
5. Provide a quick one-click link opening `[https://calendar.google.com/calendar/r/settings/export](https://calendar.google.com/calendar/r/settings/export)` so the user lands straight on Google Calendar’s file import screen.


* **Pros:**
* No backend required; works fully offline or local-first.
* No Google Cloud Console setup, API keys, or OAuth consent screens.
* No external SDK dependencies.


* **Cons:**
* Two-step manual user action: download file $\rightarrow$ upload to Google Calendar.



---

### Route 2: Google Calendar REST API + OAuth 2.0 (Automated 1-Click Sync)

This pushes events directly into the user’s Google account via `POST [https://www.googleapis.com/calendar/v3/calendars/primary/events](https://www.googleapis.com/calendar/v3/calendars/primary/events)` or the dedicated `/events/import` endpoint.

* **Feasibility:** **Moderate technical difficulty, high administrative friction**.
* **How it works:**
1. **Google Identity Services (GIS):** Load Google’s token client (`google.accounts.oauth2.initTokenClient`) in the PWA to obtain a client-side access token using the `[https://www.googleapis.com/auth/calendar.events](https://www.googleapis.com/auth/calendar.events)` scope.
2. **Batch Ingestion:** Instead of firing individual HTTP requests for hundreds of events (risking rate limits of 600 req/min/user), use Google's batch endpoint (`[https://www.googleapis.com/batch/calendar/v3](https://www.googleapis.com/batch/calendar/v3)`) sending multipart requests of up to 50–100 events per call, or use the `/events/import` endpoint to preserve existing UIDs.


* **The Major Caveats for a PWA:**
* **OAuth Verification:** Because the Calendar scope is classified as **Sensitive/Restricted**, unverified Google Cloud projects will show an intimidating *"Google hasn't verified this app"* warning screen to any user outside your Google Cloud test user list. Getting verified requires privacy policies, a verified domain, and potentially a security review.
* **Deduplication:** Repeatedly clicking "Export All" will create duplicates unless you store Google’s generated `id` back into your local database or explicitly populate `iCalUID` via the `import` endpoint.



---

### Why Not Web URL Templates (`render?action=TEMPLATE`)?

While Google supports creating events via simple query string links:

```text
https://calendar.google.com/calendar/render?action=TEMPLATE&text=Event&dates=...

```

This endpoint **only accepts one event at a time**. It cannot bulk-import an entire calendar.

---

### Verdict

* **Start with Route 1 (`.ics` generation):** It keeps the application lightweight, fully local-first, requires no external credentials or token management, and gives users a portable file compatible with Apple Calendar, Outlook, and Google Calendar.
* **Move to Route 2 only if:** Seamless two-way synchronization or background cloud backup is a core product requirement that justifies handling OAuth token lifecycles and Google Cloud app verification.

### 1. Can you export and import all events in a single file?

**Yes.** The iCalendar standard (RFC 5545) allows wrapping any number of events inside a single `VCALENDAR` container. When a user uploads that single `.ics` file into Google Calendar (via **Settings $\rightarrow$ Import & Export**), Google will parse and import all `VEVENT` blocks contained in it at once.

```text
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TempusToi//EN
BEGIN:VEVENT
UID:event-123@tempustoi.app
...
END:VEVENT
BEGIN:VEVENT
UID:event-456@tempustoi.app
...
END:VEVENT
END:VCALENDAR

```

---

### 2. Will importing again duplicate events?

**It depends entirely on how your app generates the `UID` property.**

Google Calendar uses the `UID` field inside each `VEVENT` to track event identity:

* **Scenario A: Persistent, Deterministic UIDs (No Duplication / In-Place Updates)**
If your app assigns a permanent unique ID when an event is created (e.g. `event-987654@tempustoi.app` or an internal UUID) and keeps that exact same `UID` across exports, **Google Calendar will recognize that the event was already imported**.
* If the event has not changed, Google will skip creating a duplicate.
* If the event details changed (and you include an incremented `SEQUENCE: 1` or an updated `LAST-MODIFIED` / `DTSTAMP`), Google Calendar updates the existing event rather than spawning a second one.


* **Scenario B: Ephemeral or Regenerated UIDs (Severe Duplication)**
If your export logic generates fresh IDs on the fly (such as `UID: ${crypto.randomUUID()}` or `Date.now()` calculated at the moment of export), Google will treat every single event in the file as brand new.
* Re-importing that file will result in **100% duplicate entries** for every event already present on that calendar.



---

### Crucial Caveats with Manual `.ics` Imports

1. **Deletions are not synced:** If a user deletes an event inside your app and exports a new `.ics`, re-importing that file into Google Calendar will not delete the event from Google. Manual file imports only add or update; they never prune missing entries.
2. **Dedicated Calendar Recommendation:** It is best practice to instruct users to create a separate, dedicated calendar (e.g., *"TempusToi"*) inside Google Calendar before importing. If they ever want a clean slate or need to wipe past exports, they can delete the entire sub-calendar with one click rather than manually fishing out dozens of individual entries from their primary personal calendar.