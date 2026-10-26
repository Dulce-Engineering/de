# de-filter

A custom HTML element designed to manage, display, and persist user-selected filtering options. It renders a trigger button to open a filter dialog form, displays summary chips of active filter values with deletion buttons, and automatically saves and restores filter selections to and from IndexedDB using an instance of the `Db` class.

## Usage

Include the component in your HTML layout:

```html
<de-filter id="jobs_filter" store-name="filters" db-name="JobTrakDB">
</de-filter>
```

In your page script, pass an instance of `Db` (e.g. from `ctx.db`), load stored filters, and listen for the `search` event:

```javascript
import DeFilter from "./component/de-filter/index.js";

const jobsFilter = document.getElementById("jobs_filter");

// 1. Assign the Db instance to enable persistence
jobsFilter.db = ctx.db;

// 2. Load stored filter values on page initialization
await jobsFilter.Load_Filters();

// 3. Listen for search events when filters are modified or cleared
jobsFilter.addEventListener("search", () => {
  const currentFilters = jobsFilter.value;
  console.log("Active filters:", currentFilters);
  // Re-query or render list based on currentFilters
});
```

## Slots

None. The component's internal layout is loaded and rendered dynamically from `layout.html`.

## Attributes

* **`store-name`**: IndexedDB object store name used to persist and retrieve filter values (e.g. `store-name="filters"`).
* **`db-name`**: IndexedDB database name (e.g. `db-name="JobTrakDB"`).
* **`store`**: Shorthand attribute for specifying the store name, or a compound database and store path (e.g. `store="JobTrakDB/filters"`).
* **`db-store`**: Alternative compound attribute for specifying database and store (e.g. `db-store="JobTrakDB/filters"`).

## Fields

* **`value`**: *Getter / Setter*. Gets or sets the current filters dictionary object `{ [filter_name]: any }`.
* **`db`**: *Getter / Setter*. Gets or sets the `Db` instance used for IndexedDB persistence. If set while a store name attribute is present, automatically initiates loading persisted filters.
* **`store_name`**: *Getter / Setter*. Gets or sets the configured object store name attribute.
* **`db_name`**: *Getter / Setter*. Gets or sets the configured database name attribute.

## Events

* **`search`**: Dispatched whenever filters are applied via the modal dialog or removed via individual chip delete buttons.
  * Bubbles: `false`.

## Methods

* **`Load_Filters()`**: Asynchronously loads persisted filter options from IndexedDB. Sets `value` and updates the summary UI tags. Returns `Promise<Object|null>`.
* **`Save_Filters()`**: Asynchronously persists the current filter options to IndexedDB in the configured store. Returns `Promise<number|string|null>`.
* **`Update_Summary()`**: Refreshes the display of summary chips based on current `form_values`.
* **`Get_Db_And_Store_Names()`**: Helper that parses configured database and store names from attributes. Returns `{ db_name: string|null, store_name: string|null }`.
* **`Render()`**: Asynchronously loads HTML template from `layout.html`, binds shortcuts via `Utils.Set_Id_Shortcuts`, and wires event listeners.
