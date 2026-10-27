import Utils from "../../../../lib/Utils.js";
import DeSearchMultiSelect from "../de-search-multi-select/index.js";

/**
 * JOPRContactsSelect is a custom Web Component providing a searchable multi-select contact sublist.
 * It integrates with `de-search-multi-select` to display an `<h2>Contacts</h2>` heading, an auto-complete
 * searchable dropdown combobox, and rendered entries for selected contacts with edit and delete actions.
 *
 * @customElement jopr-contacts-select
 * @tag jopr-contacts-select
 * @property {DeSearchMultiSelect} [contacts_search_select] - Internal de-search-multi-select element.
 * @property {Array<Object>|null} [items] - Available searchable contact option items.
 * @property {Array<Object>} value - Array of currently selected contact objects.
 * @fires JOPRContactsSelect#add - Dispatched when the add contact button in the combobox is clicked.
 * @fires JOPRContactsSelect#edit - Dispatched when a selected contact's edit action is triggered.
 * @fires JOPRContactsSelect#delete - Dispatched when a selected contact's delete action is triggered.
 */
class JOPRContactsSelect extends HTMLElement
{
  static tname = "jopr-contacts-select";

  /**
   * Initializes instance state and binds event handlers.
   */
  constructor()
  {
    super();
    Utils.Bind(this, "On_");
    this._items = null;
    this._saved_value = null;
  }

  /**
   * Lifecycle callback invoked when the element is inserted into the DOM.
   */
  connectedCallback()
  {
    this.Render();
  }

  // properties ===============================================================

  /**
   * Gets the available contact options for the searchable multi-select component.
   *
   * @returns {Array<Object>|null} List of selectable contact items.
   */
  get items()
  {
    return this.contacts_search_select?.items ?? this._items ?? null;
  }

  /**
   * Sets the available contact options for the searchable multi-select component.
   *
   * @param {Array<Object>|null} contacts - List of selectable contact items.
   */
  set items(contacts)
  {
    this._items = contacts;
    if (this.contacts_search_select)
    {
      JOPRContactsSelect.Extend_To_Items(contacts);
      this.contacts_search_select.items = contacts;
    }
  }

  /**
   * Gets an adapter for compatibility with list consumers.
   *
   * @returns {Object} List adapter exposing Add, Remove, and value.
   */
  get contacts_list()
  {
    return {
      Add: (item) => this.Add(item),
      Remove: (item) => this.Remove(item),
      get value() { return this.value; },
      set value(v) { this.value = v; }
    };
  }

  /**
   * Sets the list of selected contact objects.
   *
   * @param {Array<Object>|null} data - Array of contact objects.
   */
  set value(data)
  {
    this._saved_value = data;
    if (this.contacts_search_select)
    {
      const items = Array.isArray(data) ? data.map(c => {
        if (typeof c === "object" && c !== null)
        {
          const val = c.value != null ? c.value : c.id;
          const title = c.title || c.name || c.email || String(val);
          return { ...c, value: val, title };
        }
        return c;
      }) : data;
      this.contacts_search_select.selected = items;
    }
  }

  /**
   * Gets the selected contact objects.
   *
   * @returns {Array<Object>|null} Array of contact objects.
   */
  get value()
  {
    if (this.contacts_search_select)
    {
      return (this.contacts_search_select.selected || []).map(item => {
        if (typeof item === "object" && item !== null)
        {
          return item.id != null ? item : { ...item, id: item.value };
        }
        return { id: item, value: item };
      });
    }
    return this._saved_value || null;
  }

  // methods ==================================================================

  /**
   * Appends a new contact object to the selected list.
   *
   * @param {Object} obj - The contact object to add.
   */
  Add(obj)
  {
    if (this.contacts_search_select)
    {
      const val = obj?.value ?? obj?.id ?? (obj?.email || obj?.name || Math.random());
      const title = obj?.title || obj?.name || obj?.email || String(val);
      const item_obj = typeof obj === "object" && obj !== null ? { ...obj, value: val, title } : { value: val, title };

      if (!this.contacts_search_select.items_array)
      {
        this.contacts_search_select.items_array = [];
      }
      if (!this.contacts_search_select.Find_Item(val))
      {
        this.contacts_search_select.items_array.push(item_obj);
      }
      this.contacts_search_select.Add_Item(val);
    }
  }

  /**
   * Removes a contact object from the selected list by its ID or value.
   *
   * @param {number|string|Object} obj_id - The ID or object of the contact to remove.
   */
  Remove(obj_id)
  {
    if (this.contacts_search_select)
    {
      const val = typeof obj_id === "object" && obj_id !== null ? (obj_id.value ?? obj_id.id) : obj_id;
      this.contacts_search_select.Remove_Item(val);
    }
  }

  /**
   * Extracts a displayable name string from a contact object.
   *
   * @param {Object} contact - Contact record.
   * @returns {string} Contact name or fallback email / default.
   */
  static Get_Contact_Name(contact)
  {
    return contact?.name || contact?.email || "Unknown Contact";
  }

  /**
   * Normalizes a contact record by ensuring it has value and title properties.
   *
   * @param {Object} contact - Contact record to extend.
   */
  static Extend_To_Item(contact)
  {
    if (contact)
    {
      contact.value = contact.id;
      contact.title = JOPRContactsSelect.Get_Contact_Name(contact);
    }
  }

  /**
   * Normalizes an array of contact records by ensuring each has value and title properties.
   *
   * @param {Array<Object>} contacts - Contact records to extend.
   */
  static Extend_To_Items(contacts)
  {
    if (!Utils.Is_Empty(contacts))
    {
      for (const contact of contacts)
      {
        JOPRContactsSelect.Extend_To_Item(contact);
      }
    }
  }

  // events ===================================================================

  /**
   * Handles click events on the add contact button in the combobox, dispatching a custom "add" event.
   *
   * @param {Event} event - Click event.
   */
  On_Click_Add(event)
  {
    if (event?.stopPropagation)
    {
      event.stopPropagation();
    }
    this.dispatchEvent(new CustomEvent("add", { bubbles: true }));
  }

  // rendering ================================================================

  /**
   * Renders the sublist layout with an h2 Contacts heading and de-search-multi-select component.
   */
  Render()
  {
    const html = `
      <h2>Contacts</h2>
      <de-search-multi-select cid="contacts_search_select" placeholder="Type to search..."></de-search-multi-select>
    `;
    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    if (this._items && this.contacts_search_select)
    {
      JOPRContactsSelect.Extend_To_Items(this._items);
      this.contacts_search_select.items = this._items;
    }
    if (this._saved_value && this.contacts_search_select)
    {
      this.value = this._saved_value;
    }
    this.contacts_search_select?.addEventListener("add", this.On_Click_Add);
  }
}

Utils.Register_Element(JOPRContactsSelect);
export default JOPRContactsSelect;