# de-search-select

A custom Web Component providing an auto-complete searchable combobox dropdown. It allows users to filter options via text search, select an option from an overlay popover listbox, clear selection using a default "None" option, or trigger creation of a new item via an integrated add button.

## Usage

Include the component and its stylesheet in your HTML layout:

```html
<link rel="stylesheet" href="./component/de-search-select/style.css">
<script src="./component/de-search-select/index.js" type="module"></script>

<de-search-select id="agency_select" name="agency_id" placeholder="Search agencies..."></de-search-select>
```

In your page script, populate options, set or retrieve values, and listen for events:

```javascript
const agencySelect = document.getElementById("agency_select");

// 1. Populate selectable options (array of { title, value } objects)
agencySelect.items = [
  { title: "Hays Recruitment", value: "101" },
  { title: "Michael Page", value: "102" },
  { title: "Robert Half", value: "103" }
];

// 2. Select an item by value
agencySelect.value = "102";

// 3. Or select directly using an item object
agencySelect.selected_item = { title: "Michael Page", value: "102" };

// 4. Access the currently selected value or item
console.log("Selected value:", agencySelect.value); // "102"
console.log("Selected item:", agencySelect.selected_item); // { title: "Michael Page", value: "102" }

// 5. Listen for selection changes
agencySelect.addEventListener("change", () => {
  console.log("User changed selection to:", agencySelect.value);
});

// 6. Listen for add button click to trigger creation dialogs
agencySelect.addEventListener("add", () => {
  console.log("Add button clicked: Open create agency dialog");
});
```

## Slots

None. The component's internal markup is rendered dynamically with an input combobox, add button, and popover list.

## Attributes

* **`name`**: Form field identifier associated with this select component (e.g. `name="agency_id"`). Read by forms such as `DeForm` when gathering input values.
* **`placeholder`**: Custom placeholder text displayed inside the combobox search input (defaults to `"Type to search..."`).

## Fields

* **`value`**: *Getter / Setter*. Gets or sets the primitive value of the currently selected option. Setting a value searches `items` for a matching object; if not found, stores a `{ value }` placeholder. Setting to `null` clears the selection.
* **`items`**: *Getter / Setter*. Gets or sets the array of available options (`Array<{ title: string, value: any }>`). Setting `items` updates the internal items array and refreshes the popover option list.
* **`selected_item`**: *Getter / Setter*. Gets or sets the full selected item object (`{ title: string, value: any }|null`). Setting this updates the text displayed inside the search input.
* **`name`**: *Getter / Setter*. Gets or sets the component's `name` attribute.
* **`placeholder`**: *Getter / Setter*. Gets or sets the `placeholder` attribute and synchronizes the input element.
* **`input_elem`**: DOM reference to the text `<input>` element acting as the search combobox (`cid="input_elem"`).
* **`add_btn`**: DOM reference to the `<button>` element triggering new entry creation (`cid="add_btn"`).
* **`items_list`**: DOM reference to the `<ul>` element displaying the options popover (`cid="items_list"`).

## Events

* **`add`**: Dispatched when the user clicks the add button (`add_btn`). Allows parent views or forms to present creation modals or forms for new items.
  * Bubbles: `false`.
* **`change`**: Dispatched when the user selects an option from the popover list.
  * Bubbles: `true`.

## Methods

* **`Find_Item(value)`**: Searches `items` for an entry whose `value` matches the specified argument. Returns the matching item object `{ title, value }` or `null`.
* **`Render_Options(items)`**: Refreshes the options rendered inside `items_list`, including the default "None" option and each item in the passed array.
* **`Render_Option_HTML(item)`**: Generates an HTML string for an individual `<li>` option element. If `item` is omitted, returns the "None" option markup.
* **`Render()`**: Initializes the component markup, binds element shortcuts via `Utils.Set_Id_Shortcuts`, synchronizes existing values/items, and attaches input and button event listeners. Returns `Promise<void>`.
