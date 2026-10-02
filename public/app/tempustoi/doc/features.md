# TempusToi — Feature & Capability Catalog

> **Product Summary:** TempusToi is a privacy-first, local-first Progressive Web App (PWA) designed for precise deadline and countdown tracking. Featuring a distinctive mechanical instrument aesthetic with interactive rotary dials, TempusToi delivers time awareness at a glance with zero account friction, zero tracking, and offline operation.

---

## 1. Core Countdown & Timing Engine

### 1.1 Dual Timing Modes
- **Fixed Target Date/Time Mode:** Schedule countdowns to an exact future calendar date, hour, minute, and second (e.g., project launches, exams, birthdays, anniversaries).
- **Relative Period Mode (`DeInputPeriod`):** Define a duration timer from the moment of creation (e.g., *count down for 45 minutes* or *3 hours 15 minutes*), overriding fixed calendar dates.

### 1.2 Multi-Unit Modular Rotary Dials (`de-timer`)
- **Four Simultaneous Complication Dials:** Live segmented countdown meters for **Days**, **Hours**, **Minutes**, and **Seconds**.
- **Interactive Completion:** Clickable dial faces allowing users to manually trip or complete individual dials.
- **Configurable Fluid Animations:** Smooth CSS dial rotations and keyframe animations that can be toggled via user preference.

### 1.3 Smart Chronological & Urgency Sorting
- **Priority Overdue Section:** Expired or alarming timers automatically surface to the top of the workspace.
- **Proximity-Based Sequencing:** Active countdowns are sorted chronologically so the closest upcoming deadline always commands immediate visual focus.
- **Overdue Indicator Badge:** Visual `(overdue)` pill dynamically flagged on expired events.

### 1.4 Comprehensive Recurrence Engine (`DeInputRepeat`)
- **Multi-Scale Recurrence Rules:**
  - **Daily:** Every $N$ days.
  - **Weekly:** Every $N$ weeks with individual weekday multi-selectors (e.g., *Monday, Wednesday, Friday*).
  - **Monthly:** Recur on the exact day of the month or on the matching day-and-week of the month.
  - **Yearly:** Annual recurring events.
- **Automated Rollover:** Expired recurring timers automatically calculate and advance to their next future valid cycle upon alarm acknowledgment.

---

## 2. Alarm, Audio & Alerting System

### 2.1 Visual & Acoustic Alerts
- **Audio Chime System:** Browser-based alarm audio playback when an event reaches zero.
- **Visual Alert Mode (`.alarm`):** Distinctive pulsating red highlight animation around the active timer panel.
- **Silence Control (`quiet_btn`):** One-click "Silence!" button on the triggering timer card to dismiss active alarms.
- **Automatic 30-Second Safety Timeout:** Alarms automatically cease after 30 seconds if unattended.

### 2.2 Startup Recovery & Offline Alarm Sync
- **Startup Alarm Sweep:** Detects any timers that expired while the application was closed or offline, immediately firing notification alerts upon app launch.

### 2.3 Audio Permissions Control
- **Sound Toggle (`sound_btn`):** User-facing toggle ensuring compliance with modern browser autoplay policies.
- **PWA Auto-Detection:** Automatically streamlines sound controls when running in standalone PWA mode.

---

## 3. Calendar Interoperability & Data Portability (RFC 5545)

### 3.1 One-Click Calendar Export (`ICS.js`)
- **Standard `.ics` (iCalendar) Generation:** Download all timers into a single RFC 5545 compliant `.ics` bundle compatible with Google Calendar, Apple Calendar, Microsoft Outlook, and Thunderbird.
- **Rich Event Metadata:** Exports event summaries, HTML descriptions, precise UTC timestamps (`DTSTART`, `DTEND`), and standard recurrence rules (`RRULE`).

### 3.2 Intelligent Deduplication & Revision Tracking
- **Deterministic Unique IDs (`calendar_id` / `UID`):** Preserves persistent UIDs across exports so importing into Google Calendar updates existing entries instead of creating duplicates.
- **Sequential Revision Numbers (`sequence` / `SEQUENCE`):** Automatically increments on timer edits, signaling external calendars to apply modifications in-place.
- **Modification Timestamps (`updated_at` / `LAST-MODIFIED` / `DTSTAMP`):** Tracks exact modification times for auditability and calendar sync engines.

### 3.3 Universal File Import & Native OS Integration
- **Drag-and-Drop / File Picker Import:** Import `.ics` calendar files as well as native `.tt` / `.json` backup files.
- **PWA File Handling (`window.launchQueue`):** Registered OS-level file handler for `.ics` files—double-clicking or opening an `.ics` file from the operating system launches TempusToi and imports events automatically.

### 3.4 Full State Backup & Migration
- **Portable JSON Backup (`tempustoi.tt`):** Complete one-click snapshot export and restore of all timers, recurrence configurations, and custom settings.

---

## 4. User Interface & Craftsmanship

### 4.1 Mechanical Instrument & Steampunk Visual Design
- **Tailored Earth & Amber Palette:** Warm sand (`#EFBC9C`), antique cream (`#EBD5B8`), deep terracotta (`#EA572A`), forest green (`#0B3F30`), and radiant gold (`#E39828`).
- **Typography:** Serif and decorative vintage typefaces (*Roboto Slab*, *Rye*, *Libre Baskerville*).

### 4.2 Live Celestial & Time Complications
- **Analog Live Clock (`<de-clock>`):** Embedded real-time clock header with auto-synchronization.
- **Diurnal Sun & Moon Complication (`<de-sun-moon>`):** Animated celestial SVG gauge tracking daylight and lunar phases.
- **Full Date Banner:** Dynamic full weekday, month, day, and year display.

### 4.3 Comprehensive Event Lifecycle Management
- **Modal Event Creation & Editing:** Dedicated form dialog (`timer_edit_dlg`) supporting titles, rich descriptions, dates, times, relative periods, and recurrence rules.
- **Inspection Modal (`timer_view_dlg`):** Formatted readable detail view presenting scheduled date strings, human-readable recurrence descriptions, and HTML notes.
- **Pause & Resume Controls (`stop_btn`):** Individual countdown toggle to pause and restart running timers.
- **Safe Deletion Guard:** Dedicated confirmation dialogs for single deletions and batch clearing ("Delete All").

### 4.4 Contextual Help Popovers
- **Field Help Tooltips:** Interactive information popovers across all form fields (`title_info`, `desc_info`, `date_info`, `time_info`, `period_info`, `repeaat_info`).
- **One-Touch Dismissal:** Dedicated close buttons (`.close`) on every help bubble for quick dismissal.

---

## 5. Privacy, Architecture & Platform Benefits

| Attribute | Benefit |
| :--- | :--- |
| **100% Local-First** | All data resides exclusively on the user's device (`localStorage` / IndexedDB). Zero cloud telemetry or tracking. |
| **Zero Account Friction** | No email, password, OAuth, or subscription required. Immediate utility out of the box. |
| **Offline-Ready PWA** | Integrated Service Worker (`tempustoi-service-worker.js`) allows full offline execution on desktop and mobile. |
| **Vanilla Standards** | Built with native Web Components (Custom Elements, HTML5 Popover API, ES Modules) for ultra-fast startup and zero framework bloat. |
| **Cross-Platform** | Installs seamlessly on Windows, macOS, Linux, iOS Safari, and Android Chrome. |

---

## 6. Target Audience & Marketing Angles

1. **Productivity & Timeboxers:** Visual countdowns create urgency and eliminate deadline blindness far better than static calendar grids.
2. **Privacy Conscious Users:** Complete guarantee that personal schedules, tasks, and notes never leave the local machine.
3. **Event Planners & Milestone Trackers:** Perfect dashboard for countdowns to weddings, product launches, vacations, and quarterly deliverables.
4. **Gamers & Enthusiasts:** Effortlessly track recurring server resets, raid timers, and time-sensitive daily cooldowns.
