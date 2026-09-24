# de-edit-text

`de-edit-text` is a Web Component that displays an inline text label alongside an edit button. Clicking the edit button opens a native modal popover dialog containing the original reference text (if provided) and an input field or textarea. When the user confirms their edits with the "OK" button, the component updates the displayed text and dispatches a `"change"` event.

---

## Usage

### HTML

```html
<link rel="stylesheet" href="./component/de-edit-text/style.css">
<script type="module" src="./component/de-edit-text/index.js"></script>

<!-- Single-line text input (default) -->
<de-edit-text id="job_title" class="h3"></de-edit-text>

<!-- Multi-line textarea input -->
<de-edit-text id="summary" input-type="textarea"></de-edit-text>
```

### JavaScript

```javascript
const titleElem = document.querySelector("#job_title");

// Assign value object with current and optional original text
titleElem.value = {
  text: "Senior Frontend Engineer",
  original_text: "Software Developer II",
  custom_id: 123 // Custom properties on the object are preserved
};

// Listen for updates when the user clicks 'OK' in the dialog
titleElem.addEventListener("change", (event) => {
  const updated = event.currentTarget.value;
  console.log("Updated text:", updated.text);
  console.log("Original text:", updated.original_text);
});
```

---

## Slots

This component does not use slots.

---

## Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `input-type` | `"text"` \| `"textarea"` | `"text"` | Specifies whether the editing control in the dialog is a single-line `<input type="text">` or a multi-line `<textarea>`. |

---

## Properties & Fields

| Property | Type | Description |
|---|---|---|
| `value` | `EditTextValue` | Gets or sets the data object. Setting it updates `text_elem` and `orig_elem` (and toggles `orig_field_elem` visibility). Getting it updates `text` from `input_elem.value` and returns the object. |
| `original_value` | `EditTextValue` \| `null` | Reference to the data object provided to the `value` setter. |
| `text_elem` | `HTMLSpanElement` | Shortcut reference (`cid="text_elem"`) to the span displaying the current text. |
| `edit_btn` | `HTMLButtonElement` | Shortcut reference (`cid="edit_btn"`) to the button with the edit icon that triggers the popover dialog. |
| `orig_field_elem` | `HTMLDivElement` | Shortcut reference (`cid="orig_field_elem"`) to the container holding the original reference text. |
| `orig_elem` | `HTMLSpanElement` | Shortcut reference (`cid="orig_elem"`) to the span displaying the original reference text. |
| `input_elem` | `HTMLInputElement` \| `HTMLTextAreaElement` | Shortcut reference (`cid="input_elem"`) to the input or textarea control inside the dialog. |
| `ok_btn` | `HTMLButtonElement` | Shortcut reference (`cid="ok_btn"`) to the dialog OK confirmation button. |
| `cancel_btn` | `HTMLButtonElement` | Shortcut reference (`cid="cancel_btn"`) to the dialog Cancel button. |

### `EditTextValue` Object Structure

```typescript
{
  text: string,               // Current or edited text content
  original_text?: string,     // Optional original reference text
  [key: string]: any          // Any additional arbitrary context fields attached to the object
}
```

---

## Events

| Event | Type | Description |
|---|---|---|
| `change` | `Event` | Dispatched when the user clicks the "OK" button in the dialog after modifying the text. Access `event.currentTarget.value` to retrieve the updated value object. |

---

## Methods

| Method | Parameters | Returns | Description |
|---|---|---|---|
| `Render()` | None | `void` | Renders the HTML template, configures the input type, sets up `cid` DOM shortcuts, and attaches button event listeners. Invoked automatically during `connectedCallback()`. |
| `On_Click_Edit_Btn()` | None | `void` | Event handler called when the edit button is clicked. Synchronizes `input_elem.value` with `text_elem.textContent` before the dialog opens. |
| `On_Click_Ok_Btn()` | None | `void` | Event handler called when the OK button is clicked. Updates `text_elem.textContent` with `input_elem.value` and dispatches the `"change"` event. |

---

## Styling & Print Behavior

- **Stylesheet**: Component styles are defined in [`style.css`](./style.css).
- **Popover Dialog**: The component uses native HTML `<dialog popover>` and CSS `::backdrop` styling.
- **Print Optimization**: In `@media print`, the edit button (`.img-btn`) is automatically hidden so only the clean text renders in print and PDF outputs.