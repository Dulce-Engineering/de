# de-event

`de-event` is a Web Component (`DeEvent`) that encapsulates the display, countdown control, and user interactions for a single timer event in the Tempustoi PWA.

It renders a header section with the event title, scheduled date and time, overdue indicator badge, and action controls (Silence, View, Edit, Pause/Toggle, Delete), along with the child `<de-timer>` countdown dials.

---

## Usage

### HTML

```html
<link rel="stylesheet" href="./component/de-event/style.css">
<script type="module" src="./component/de-event/index.js"></script>

<!-- Timer Event Container -->
<de-event id="timer_event_1"></de-event>
```

### JavaScript

```javascript
import DeEvent from "./component/de-event/index.js";

const eventElem = document.querySelector("#timer_event_1");

// Assign a timer data object
eventElem.value = {
  id: 1,
  title: "Team Standup",
  description: "Daily engineering sync meeting",
  time: Date.now() + 3600000,
  recurrence: {
    rate: 1,
    scale: "SCALE_DAY"
  }
};

// Listen for custom component events
eventElem.addEventListener("view", (e) => {
  console.log("View timer:", e.detail.timer);
});

eventElem.addEventListener("edit", (e) => {
  console.log("Edit timer:", e.detail.timer);
});

eventElem.addEventListener("delete", (e) => {
  console.log("Delete timer:", e.detail.timer);
});

eventElem.addEventListener("stop", (e) => {
  console.log("Toggled timer pause/run state:", e.detail.timer);
});

eventElem.addEventListener("quiet", (e) => {
  console.log("Silenced timer alarm:", e.detail.timer);
});

eventElem.addEventListener("completed", (e) => {
  console.log("Timer completed:", e.detail.timer);
});
```

---

## Properties & DOM Shortcuts

| Property | Type | Description |
|---|---|---|
| `value` | `Timer` | Gets or sets the timer data object. Setting it synchronizes all header elements and the child `<de-timer>` instance. |
| `timer` | `Timer \| null` | Reference to the current timer data object. |
| `title_elem` | `HTMLElement` | Shortcut reference (`cid="title_elem"`) to the header title `<label>` container. |
| `time_elem` | `HTMLElement` | Shortcut reference (`cid="time_elem"`) to the element displaying formatted date and time. |
| `overdue_elem` | `HTMLElement` | Shortcut reference (`cid="overdue_elem"`) to the "(overdue)" badge. |
| `title_text_elem` | `HTMLElement` | Shortcut reference (`cid="title_text_elem"`) to the element displaying the title string. |
| `quiet_btn` | `HTMLButtonElement` | Shortcut reference (`cid="quiet_btn"`) to the "Silence!" alarm button. |
| `view_btn` | `HTMLButtonElement` | Shortcut reference (`cid="view_btn"`) to the zoom/view button. |
| `edit_btn` | `HTMLButtonElement` | Shortcut reference (`cid="edit_btn"`) to the edit pencil button. |
| `stop_btn` | `HTMLButtonElement` | Shortcut reference (`cid="stop_btn"`) to the pause/toggle countdown button. |
| `del_btn` | `HTMLButtonElement` | Shortcut reference (`cid="del_btn"`) to the delete bin button. |
| `timer_elem` | `HTMLElement` | Shortcut reference (`cid="timer_elem"`) to the child `<de-timer>` countdown component. |

### `Timer` Data Model

```typescript
interface Timer {
  id?: number | string;
  title?: string;
  description?: string | null;
  time?: number; // Target timestamp in milliseconds
  recurrence?: {
    rate?: number;
    scale?: "SCALE_DAY" | "SCALE_WEEK" | "SCALE_MONTH" | "SCALE_YEAR";
    weekdays?: string[];
    month?: "MONTH_DAY" | "MONTH_WEEK";
  };
  triggered?: boolean;
}
```

---

## Events

| Event | Type | Detail | Description |
|---|---|---|---|
| `view` | `CustomEvent` | `{ timer: Timer }` | Dispatched when the user clicks the view/zoom button. |
| `edit` | `CustomEvent` | `{ timer: Timer }` | Dispatched when the user clicks the edit button. |
| `delete` | `CustomEvent` | `{ timer: Timer }` | Dispatched when the user clicks the delete button. |
| `stop` | `CustomEvent` | `{ timer: Timer }` | Dispatched when the user clicks the pause/play toggle button. |
| `quiet` | `CustomEvent` | `{ timer: Timer }` | Dispatched when the user clicks the silence button to dismiss an active alarm. |
| `completed` | `CustomEvent` | `{ timer: Timer }` | Dispatched when the countdown timer reaches zero and triggers. |

---

## Methods

| Method | Parameters | Returns | Description |
|---|---|---|---|
| `Render()` | None | `Promise<void>` | Asynchronously loads the `layout.html` template, replaces children, establishes `cid` shortcuts, and attaches event listeners. Invoked automatically in `connectedCallback()`. |
| `Update()` | None | `void` | Updates all title/time displays and synchronizes the countdown state on `<de-timer>`. |
| `Render_Title()` | None | `void` | Formats and displays the timer timestamp, title text, and overdue indicator. |
| `Is_Overdue()` | None | `boolean` | Checks whether the timer's target timestamp is in the past. |
| `Set_Alarm(active)` | `active?: boolean` | `void` | Shows or hides the silence button and toggles the `.alarm` pulsing animation class. |
| `Set_Animations()` | None | `void` | Checks `localStorage` preferences and toggles CSS animations on countdown dials. |
| `Stop()` | None | `void` | Pauses the countdown timer. |
| `Toggle()` | None | `void` | Toggles the countdown timer between running and paused states. |
| `DeEvent.Format_Recurrence(recurrence)` | `recurrence: Object` | `string \| null` | Static helper that converts a recurrence configuration object into a readable description (e.g., "Every 2 weeks on Monday"). |

---

## Styling

Component styling is defined in [`style.css`](./style.css) and integrates with Tempustoi CSS custom properties:
- `var(--orange)`: Accent color for buttons and titles.
- `var(--green)`: Button text and background tones.
- `var(--overdue)`: Warning color for past-due badges.
- `.alarm .counter`: Pulsating alarm animation when triggered.
