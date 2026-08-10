# de-field

`de-field` is a custom element that displays a field containing a label and a value. It automatically manages its own visibility: it hides itself when the value is empty, and shows itself when a value is provided.

## Usage

```html
<de-field field-label="Profile Link" field-type="link" hide-class="hidden"></de-field>

<script type="module">
  const fieldElement = document.querySelector('de-field');
  fieldElement.value = "https://example.com";
</script>
```

## Slots

This component does not use slots.

## Attributes

| Attribute | Type | Description |
|---|---|---|
| `field-label` | `string` | The text label for the field. If provided, a colon (`:`) is automatically appended and the label is shown. |
| `field-type` | `string` | The type of field. If set to `"link"`, the value is rendered inside an external link (`<a target="_blank">`). |
| `hide-class` | `string` | CSS class used to hide the element (by adding/removing it) instead of toggling the inline `display` style. |

## Fields / Properties

| Property | Type | Description |
|---|---|---|
| `value` | `string` | Gets or sets the field's value. Setting it to an empty value (null, undefined, or empty string) clears the content and hides the field. |
| `label_elem` | `HTMLElement` | The DOM element representing the field's label (`<dt>`). Created dynamically by `Render()`. |
| `value_elem` | `HTMLElement` | The DOM element representing the field's value (`<dd>`). Created dynamically by `Render()`. |

## Events

This component does not fire or listen to any custom events.

## Methods

| Method | Parameters | Returns | Description |
|---|---|---|---|
| `Show()` | None | `void` | Shows the component. If `hide-class` attribute is set, removes that class. Otherwise, resets the inline `display` style to default. |
| `Hide()` | None | `void` | Hides the component. If `hide-class` attribute is set, adds that class. Otherwise, sets the inline `display` style to `"none"`. |
| `Render()` | None | `void` | Renders the basic DOM structure of the field, sets up shortcut references, and configures the label. Called automatically during connection. |
