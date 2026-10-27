# de-contact-list

A custom Web Component that renders a list of contacts with support for multiple visual layouts. It integrates with `de-input-list`, `de-toolbar-menu`, `de-contact-details`, and `de-field` to provide full contact management, compact summaries, sublists for parent forms, and single-choice selection lists.

## View Types

* **`list`** *(Default)*: Full detailed list with expandable `<details>` items displaying contact name, agency, email, phone, position, LinkedIn link, item action menu (`edit`, `delete`), and a header `add` button.
* **`select`**: Single-choice selection list rendering radio buttons with labels for picking a contact in dialogs. The `value` getter returns only the selected contact.
* **`sublist`**: Compact searchable multi-select list designed for embedding inside parent forms (e.g. job details form). Features an `<h2>Contacts</h2>` header, integrated search combobox, and item action menus (`edit`, `delete`) via `de-search-multi-select`.
* **`compact`**: Read-only inline contact summary list using `de-contact-details` with `hide-header`.

## Usage

### 1. Default Detailed List
```html
<de-contact-list id="contacts_list"></de-contact-list>
```

### 2. Compact Form Sublist
```html
<de-contact-list id="job_contacts" name="contacts" view-type="sublist"></de-contact-list>
```

### 3. Selection Modal List
```html
<de-contact-list id="dlg_contact_list" view-type="select"></de-contact-list>
```

### 4. Read-Only Summary
```html
<de-contact-list id="summary_contacts" view-type="compact"></de-contact-list>
```

### JavaScript Integration

```javascript
const contactList = document.getElementById("contacts_list");

// 1. Populate contact records
contactList.value = [
  {
    id: 1,
    name: "Jonathan Rhodes",
    email: "jonathan@example.com",
    phone: "0412 345 678",
    position: "Senior Recruiter",
    linkedin: "https://linkedin.com/in/jonathan-rhodes",
    agency: { name: "Hays Recruitment" }
  },
  {
    id: 2,
    name: "Debbie Teakle",
    email: "debbie@example.com",
    phone: "0423 456 789",
    position: "Talent Acquisition Lead",
    agency: { name: "Michael Page" }
  }
];

// 2. Add or Remove contacts dynamically
contactList.Add({ id: 3, name: "Jun Ling", email: "jun@example.com" });
contactList.Remove(1);

// 3. Listen for Header Actions
contactList.addEventListener("add", () => {
  console.log("Add contact button clicked: Open create contact dialog");
});

contactList.addEventListener("select", () => {
  console.log("Select contact button clicked: Open contact picker modal");
});

// 4. Listen for Item Menu Actions (bubbled from de-toolbar-menu)
contactList.addEventListener("edit", (event) => {
  const contact = event.detail;
  console.log("Edit requested for contact:", contact);
});

contactList.addEventListener("delete", (event) => {
  const contact = event.detail;
  console.log("Delete requested for contact:", contact);
});

// 5. In "select" view mode, retrieve only the checked contact(s)
const selectList = document.getElementById("dlg_contact_list");
selectList.value = contactList.value;
const selectedContacts = selectList.value; // Returns array containing checked contact
```

## Slots

None. The internal layout is generated dynamically based on the configured `view-type`.

## Attributes

* **`view-type`**: Presentation layout mode. Accepts `"list"` (default), `"select"`, `"sublist"`, or `"compact"`.

## Fields

* **`value`**: *Getter / Setter*. Gets or sets the array of contact objects (`Array<Object>`). In `"select"` view mode, the getter filters the list to return only the contact matching the currently checked radio button. In `"sublist"` view mode, delegates to the `selected` property of `de-search-multi-select`.
* **`items`**: *Getter / Setter*. Gets or sets the available contact options array (`Array<Object>`) for the internal `<de-search-multi-select>` in `"sublist"` view mode.
* **`view_type`**: *Getter / Setter*. Gets or sets the active view type layout attribute.
* **`contacts_list`**: DOM reference to the internal `<de-input-list>` component (`cid="contacts_list"`), or adapter in `"sublist"` mode.
* **`contacts_search_select`**: DOM reference to the internal `<de-search-multi-select>` component (`cid="contacts_search_select"`), present in `"sublist"` view mode.
* **`add_contact_btn`**: DOM reference to the header add button (`cid="add_contact_btn"`), present in `"list"` view mode.
* **`sel_contact_btn`**: DOM reference to the header select button (`cid="sel_contact_btn"`).

## Events

* **`add`**: Dispatched when the user clicks the add contact button (`add_contact_btn`).
  * Bubbles: `true`.
* **`select`**: Dispatched when the user clicks the select contact button (`sel_contact_btn`) in `"sublist"` mode.
  * Bubbles: `true`.
* **`edit`**: Bubbles up from an item's `de-toolbar-menu` when the edit action is clicked. `event.detail` contains the contact object.
  * Bubbles: `true`.
* **`delete`**: Bubbles up from an item's `de-toolbar-menu` when the delete action is clicked. `event.detail` contains the contact object.
  * Bubbles: `true`.

## Methods

* **`Add(obj)`**: Appends a new contact object to the list (delegates to `contacts_search_select` in `"sublist"` mode or `contacts_list.Add(obj)` in other modes).
* **`Remove(obj_id)`**: Removes a contact object from the list by ID (delegates to `contacts_search_select` in `"sublist"` mode or `contacts_list.Remove(obj_id)` in other modes).
* **`On_Render_Item(event)`**: Event handler called by `de-input-list` for each item, populating titles, form fields, and toolbar menus.
* **`Render()`**: Renders the default detailed list with expandable items and full fields.
* **`Render_Select()`**: Renders the radio-button contact selection list.
* **`Render_Sublist()`**: Renders the compact searchable sublist with an `<h2>Contacts</h2>` heading and `de-search-multi-select`.
* **`Render_Compact()`**: Renders the read-only summary list using `de-contact-details`.