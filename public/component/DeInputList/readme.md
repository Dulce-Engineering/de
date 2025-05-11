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
//list.addEventListener("add", On_Add_Item);
//list.addEventListener("edit", On_Edit_Item);
//list.addEventListener("delete", On_Delete_Item);
list.addEventListener("update", On_update_Item);
list.value = items;

function On_Render_Item(event)
{
  const item_elem = event.currentTarget;
  const item = event.detail;

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

## Attributes

## Fields
### value

## Events
### save

## Methods
### Add()
### Remove()
