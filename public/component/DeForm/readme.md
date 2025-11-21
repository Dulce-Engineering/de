# de-form

This component will automatically assign object fields to specified input elements based on the input "name" attribute.

fields can be set and read via the value property.

## Usage
```JavaScript
const field_data = 
{ 
  name: "Roger Ramjet", 
  birthday = new Date(1971, 10, 13), 
  height: 180 
};

// show resulting object after user changes and when user clicks OK
the_form.addEventListener("ok", On_Click_OK);
function On_Click_OK(event)
{
  console.log(the_form.value);
}

// set initial form input element values
the_form.value = field_data;
```

```HTML
<de-form id="the_form">

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

</de-form>
```

## Slots
### header
Child elements assigned to this slot will appear in the form header element.

### fields
Input elements should be assigned to this slot and contain a name attribute that maps to an object field of the same name.

### footer
Child elements assigned to this slot will appear in the form footer element.

## Attributes
### label-ok
Used to replace the label on the OK button.

### label-cancel
Used to replace the label on the Cancel button.

### label-clr
Used to replace the label on the Clear button.

### hide-clr
Used to hide the Clear button.

### hide-cancel
Used to hide the Cancel button.

## Properties
### value
An object used to read/write the form's input values. Object fields should match the name of a form input element to which it will read and write its value.

## Events
### ok
Fires when the OK button is selected.

### cancel
Fires when the Cancel button is selected.

## Methods
N/A