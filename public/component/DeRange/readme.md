# DeRange

This component will automatically assign object fields to specified input fields based on the input field "name" attribute.

## Usage
```JavaScript
const field_data = 
{ 
  name: "Roger Ramjet", 
  birthday = new Date(1971, 10, 13), 
  height: 180 
};
const result = await dlg.Show_Async(field_data);
if (data)
{
  console.log(data);
}
```

```HTML
<de-dialog-form id="dlg">

  <h1 slot="header">Person Details</h1>

  <label slot="fields">
    Fullname
    <input name="name" type="number">
  </label>

  <label slot="fields">
    Birthday
    <input name="birthday" type="date">
  </label>

  <label slot="fields">
    Height (m)
    <input name="height" type="number">
  </label>

</de-dialog-form>
```

## Slots
### header
### fields

## Attributes

## Fields
### value

## Events
### save

## Methods
### Show_Async()
### Show_Modal()
### Close()