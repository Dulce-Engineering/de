# DeLineChart

`DeLineChart` is a custom HTML element that renders interactive SVG line charts.
It supports:
- multiple series of data
- axis labels
- highlight ranges
- optional point markers
- click interactions that emit nearest-point events

## Usage

```html
<de-line-chart title="Sales Data" x-label="Time" y-label="Revenue" data-points></de-line-chart>

<script>
  const chart = document.querySelector('de-line-chart');
  chart.items = {
    seriesA: [
      { x: 1000, y: 50 },
      { x: 2000, y: 75 },
      { x: 3000, y: 60 }
    ],
    seriesB: [
      { x: 1000, y: 40 },
      { x: 2000, y: 60 },
      { x: 3000, y: 90 }
    ]
  };
  chart.highlight_start = 10;
  chart.highlight_end = 40;

  chart.addEventListener('point-selected', event => {
    console.log('Point selected:', event.detail);
  });
</script>
```

## Slots

- `title` — optional custom title content; if provided, it overrides the `title` attribute text.

## Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `title` | string | `Title` | Chart title text |
| `x-label` | string | `X Axis` | Label text for the X axis |
| `y-label` | string | `Y Axis` | Label text for the Y axis |
| `data-points` | boolean | `false` | When present, renders circle markers for each data point |
| `chart-type` | string | `smooth` | Line rendering mode: `smooth` for interpolated curves or `line` for straight segments |

## Properties

| Name | Type | Description |
|------|------|-------------|
| `items` | `Array<{x:number,y:number}>` or `Object<string, Array<{x:number,y:number}>>` | Data series to render. Accepts a single array of points or an object with named series.|
| `highlight_start` | `number` | Start position of the highlight range as a percentage of chart width (0-100). |
| `highlight_end` | `number` | End position of the highlight range as a percentage of chart width (0-100). |

## Events

### `point-selected`

Fired when the user clicks on the chart.

Event detail contains nearest points for every series keyed by series name:

```js
{
  seriesA: { x: 2000, y: 75 },
  seriesB: { x: 2000, y: 60 }
}
```

## Public Methods

### `Set_Highlight(range)`

Sets the visible highlight overlay range.

- `range` — object with `x1` and `x2` values in SVG coordinates.

### `Get_Highlight()`

Returns the currently active highlight range as an object with `x1` and `x2`, or `null` if no highlight is active.

### `Map_Data_To_SVG_Point(data)`

Maps a data point from chart coordinates to SVG viewport coordinates.

### `Map_SVG_Point_To_Data(svg_pt)`

Converts an SVG point back to the underlying data coordinate space.

## Notes

- The component automatically recalculates bounds and re-renders when `items` is assigned.
- Axis labels are taken from `x-label` and `y-label` attributes.
- A highlight range is rendered as an overlay rectangle when `highlight_start` and `highlight_end` are set.
