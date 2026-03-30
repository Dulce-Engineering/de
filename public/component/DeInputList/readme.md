# DeInputList

This component is used to display a list of editable items and maintain state automatically.

## Usage
```JavaScript
const items = 
[
  { name: "Berenice Marlohe", birthday = new Date(1971, 10, 13), height: 180 },
  { name: "Rosalyn Sanchez", birthday = new Date(1971, 10, 13), height: 170 },
  { name: "Sung Hi Lee", birthday = new Date(1971, 10, 13), height: 160 }
];

list.addEventListener("render", On_Render_Item);
list.value = items;

function On_Render_Item(event)
{
  const item_elem = event.target;
  const item = item_elem.item_obj;

  item_elem.name_elem.innerHTML = item.name;
  item_elem.birthday_elem.innerHTML = item.birthday;
  item_elem.height_elem.innerHTML = item.height;
}
```

```HTML
<de-input-list id="list">

  <div cid="name_elem"></div>
  <div cid="birthday_elem"></div>
  <div cid="height_elem"></div>

</de-input-list>
```

## Slots
None

## Attributes
None

## Fields
### value
Read/Write array of objects representing items to be rendered.
Each item must have an "id" field.

## Events
### change
Fires when an item is added or removed.
### render
Fires when an item needs to be rendered.
Rendering will be based on the given template.

## Methods
### Add(item)
Method to use when adding an item to the list.
### Remove(item_id)
Method to remove items from the list