# de-search-multi-select

A custom Web Component providing an auto-complete searchable combobox with multi-selection support. Users can search and select multiple options from an overlay popover listbox, view selected items rendered as a list of entries with green `<h2>` titles below the search field, trigger creation of new items via an add button, and trigger edit or deletion actions per item via integrated `de-toolbar-menu` buttons.

## Usage

Include the component and its stylesheet in your HTML layout:

```html
<link rel="stylesheet" href="./component/de-search-multi-select/style.css">
<script src="./component/de-search-multi-select/index.js" type="module"></script>

<de-search-multi-select id="contacts_select" name="contact_ids" placeholder="Search contacts..."></de-search-multi-select>
```

In your page script, populate options, set or retrieve values/selected items, and listen for events:

```javascript
const contactsSelect = document.getElementById("contacts_select");

// 1. Populate selectable options (array of { title, value } objects)
contactsSelect.items = [
  { title: "Jonathan Rhodes", value: "c1" },
  { title: "Debbie Teakle", value: "c2" },
  { title: "Jun Ling", value: "c3" }
];

// 2. Select items by array of values
contactsSelect.value = ["c1", "c2"];

// 3. Or set selected items directly using an array of item objects
contactsSelect.selected = [
  { title: "Jonathan Rhodes", value: "c1" },
  { title: "Debbie Teakle", value: "c2" }
];

// 4. Access the currently selected values or item objects
console.log("Selected values:", contactsSelect.value); // ["c1", "c2"]
console.log("Selected items:", contactsSelect.selected); // [{ title: "Jonathan Rhodes", value: "c1" }, ...]

// 5. Listen for selection changes (triggered when items are added or removed)
contactsSelect.addEventListener("change", () => {
  console.log("Updated selection values:", contactsSelect.value);
});

// 6. Listen for add button click
contactsSelect.addEventListener("add", () => {
  console.log("Add button clicked: Open create dialog");
});

// 7. Listen for edit button click on a selected item
contactsSelect.addEventListener("edit", (event) => {
  console.log("Edit requested for item value:", event.value || event.detail);
});

// 8. Listen for delete button click on a selected item
contactsSelect.addEventListener("delete", (event) => {
  console.log("Item deleted with value:", event.value || event.detail);
});
```

## Slots

None. The component's internal markup is rendered dynamically with an input combobox, add button, popover options list, and selected items list.

## Attributes

* **`name`**: Form field identifier associated with this multi-select component (e.g. `name="contact_ids"`).
* **`placeholder`**: Custom placeholder text displayed inside the combobox search input (defaults to `"Type to search..."`).

## Fields

* **`value`**: *Getter / Setter*. Gets or sets an array of values (`any[]`). Setting values resolves each against `items` or creates placeholder objects `{ value }`. Setting to `null` clears all selections.
* **`selected`**: *Getter / Setter*. Gets or sets the array of currently selected item objects (`Array<{ title?: string, value: any }>`). When set, re-renders the selected items list below the search bar.
* **`items`**: *Getter / Setter*. Gets or sets the array of available options (`Array<{ title: string, value: any }>`). Setting `items` updates the internal options array, refreshes the popover option list, and reconciles any already selected items lacking titles.
* **`name`**: *Getter / Setter*. Gets or sets the component's `name` attribute.
* **`placeholder`**: *Getter / Setter*. Gets or sets the `placeholder` attribute and synchronizes the input element.
* **`input_elem`**: DOM reference to the text `<input>` element acting as the search combobox (`cid="input_elem"`).
* **`add_btn`**: DOM reference to the `<button>` element triggering new entry creation (`cid="add_btn"`).
* **`items_list`**: DOM reference to the `<ul>` element displaying the options popover (`cid="items_list"`).
* **`selected_items_elem`**: DOM reference to the `<div>` element containing rendered selected items (`cid="selected_items_elem"`).

## Events

* **`add`**: Dispatched when the user clicks the add button (`add_btn`).
  * Bubbles: `false`.
* **`change`**: Dispatched whenever selections are modified (an item is added from the dropdown, an item is deleted, or the selection is cleared).
  * Bubbles: `true`.
* **`edit`**: Dispatched when a selected item's edit button is clicked. The event includes the item's value on `event.value` and `event.detail`, and the item object on `event.item`.
  * Bubbles: `true`.
* **`delete`**: Dispatched when a selected item's delete button is clicked. The event includes the item's value on `event.value` and `event.detail`, and the item object on `event.item`.
  * Bubbles: `true`.

## Methods

* **`Find_Item(value)`**: Searches `items` for an entry whose `value` matches the specified argument. Returns the matching item object `{ title, value }` or `null`.
* **`Add_Item(value)`**: Adds an item matching `value` to `selected` if not already present, and updates the rendered list.
* **`Remove_Item(value)`**: Removes an item matching `value` from `selected` and updates the rendered list.
* **`Render_Options(items)`**: Refreshes the options rendered inside `items_list`, including the default "None" option and each item in the passed array.
* **`Render_Option_HTML(item)`**: Generates an HTML string for an individual `<li>` option element. If `item` is omitted, returns the "None" option markup.
* **`Render_Selected_Item_Element(item)`**: Creates and returns a single selected item `<div>` containing an `<h2>` title and `<de-toolbar-menu show-edit show-delete>` action buttons.
* **`Render_Selected_Items()`**: Clears and re-renders all selected item elements into `selected_items_elem`.
* **`Render()`**: Initializes the component markup, binds element shortcuts via `Utils.Set_Id_Shortcuts`, synchronizes existing values/items, and attaches event listeners. Returns `Promise<void>`.
