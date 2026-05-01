# DeRange

A custom range slider component that renders a value display alongside a native `<input type="range">`.

## Usage
```html
<de-range name="volume" min="0" max="100" step="5" value="50" show-percent="1"></de-range>
```

## Slots
This component does not expose any custom slots. It renders its own internal markup.

## Attributes
- `min` — Minimum slider value. Defaults to `10`.
- `max` — Maximum slider value. Defaults to `100`.
- `step` — Slider step increment. Defaults to `10`.
- `value` — Initial slider value. Defaults to `0`.
- `name` — Name attribute for the internal `<input>` element.
- `show-percent` — When present and truthy, displays a `%` suffix on the value and labels.

## Fields
- `value` — Current numeric slider value.
- `disabled` — Whether the slider input is disabled.

## Events
- None. The component does not emit custom events.

## Methods
- `Render()` — Builds the internal component markup and attaches event handlers.

## Example
```html
<de-range id="volumeRange" min="0" max="100" step="1" value="25" show-percent="1"></de-range>
<script>
  const range = document.getElementById('volumeRange');
  console.log(range.value); // 25
</script>
```