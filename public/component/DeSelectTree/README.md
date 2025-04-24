# Honeywell Table Component

## hw-table

Used to render tables.

### Attributes 
- items: [object] - Array of items to render.
- cellRender: callback(Event) - Function called when rendering cells. The event details include the item object for the current row, the name of the column being rendered, and the cell element into which rendering must occur.

### Usage

#### JavaScript
```js
  const cars =
  [
    { brand: "Ford", model: "Mustang", year: 1969 },
    { brand: "Mazda", model: "Miata", year: 1983 },
    { brand: "Toyota", model: "Corolla", year: 1995}
  ];

  function renderCells(event)
  {
    const car = event.detail.obj;
    const cellElement = event.detail.cellElement;
    const colName = event.detail.colName;
    
    cellElement.innerText = car[colName];
  }

```

#### JSX
```jsx
  <hw-table items={cars} cellRender={renderCells}>
    <h1 slot="header">Cars Table</h1>
    <hw-col name="brand">Brand</hw-col>
    <hw-col name="model">Model</hw-col>
    <hw-col name="year">Year</hw-col>
  </hw-table>
```

## hw-col

Used to indicate column details.

### Attributes
- name: string - ID purely for reference when rendering cells of this column.
- cell-class: string - a CSS class applied to rendered cells for this column.

### Child Elements
Child elements are applied to the column header of this column.