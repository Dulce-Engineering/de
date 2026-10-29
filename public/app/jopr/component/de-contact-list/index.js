import Utils from "../../../../lib/Utils.js?v=2";
import DeSearchMultiSelect from "../de-search-multi-select/index.js?v=2";

/**
 * DeContactList is a custom Web Component that renders a collection of contacts.
 * It supports four display modes via the `view-type` attribute:
 * - `list` (default): Full list with expandable details, action menus, and an add button.
 * - `select`: Single-choice list with radio buttons for picking a contact.
 * - `sublist`: Compact searchable multi-select list using de-search-multi-select.
 * - `compact`: Read-only summary list using jopr-contact-details.
 *
 * @customElement de-contact-list
 * @tag de-contact-list
 * @attribute {string} [view-type="list"] - Layout presentation ("list", "select", "sublist", "compact").
 * @property {HTMLElement} [contacts_list] - Internal de-input-list element.
 * @property {DeSearchMultiSelect} [contacts_search_select] - Internal de-search-multi-select element.
 * @property {HTMLButtonElement} [add_contact_btn] - Button element to trigger adding a new contact.
 * @property {HTMLButtonElement} [sel_contact_btn] - Button element to trigger selecting contacts.
 * @property {Array<Object>|null} [items] - Available searchable contact option items.
 * @property {Array<Object>} value - Array of contact objects. In "select" view, returns checked contacts.
 * @property {string} view_type - Active view presentation mode.
 * @fires DeContactList#add - Dispatched when the add contact button is clicked.
 * @fires DeContactList#select - Dispatched when the select contact button is clicked.
 * @fires DeContactList#edit - Dispatched when a contact item edit action is triggered.
 * @fires DeContactList#delete - Dispatched when a contact item delete action is triggered.
 */
class DeContactList extends HTMLElement
{
  static tname = "de-contact-list";

  /**
   * Observed attributes for automatic change handling.
   *
   * @returns {string[]} Array of observed attribute names.
   */
  static get observedAttributes()
  {
    return ["view-type"];
  }

  /**
   * Initializes instance state and binds event handlers.
   */
  constructor()
  {
    super();
    Utils.Bind(this, "On_");
    this._view_type = "list";
    this._items = null;
  }

  /**
   * Lifecycle callback invoked when the element is inserted into the DOM.
   */
  connectedCallback()
  {
    this.view_type = Utils.Get_Attr_Def(this, "view-type", "list");
    this.Init_View();
  }

  /**
   * Lifecycle callback invoked when an observed attribute changes.
   *
   * @param {string} name - Name of the attribute that changed.
   * @param {string|null} old_value - Previous attribute value.
   * @param {string|null} new_value - Updated attribute value.
   */
  attributeChangedCallback(name, old_value, new_value)
  {
    if (old_value === new_value) return;

    if (name === "view-type")
    {
      this._view_type = new_value || "list";
      if (this.contacts_list || this.contacts_search_select)
      {
        this.Init_View();
      }
    }
  }

  /**
   * Initializes and renders the appropriate layout view based on `view_type`.
   */
  Init_View()
  {
    const current_value = this.value;
    if (this.view_type == "select")
    {
      this.Render_Select();
    }
    else if (this.view_type == "sublist")
    {
      this.Render_Sublist();
    }
    else if (this.view_type == "compact")
    {
      this.Render_Compact();
    }
    else
    {
      this.Render();
    }

    if (current_value)
    {
      this.value = current_value;
    }
  }

  // properties ===============================================================

  /**
   * Gets the active view type layout.
   *
   * @returns {string} View type string ("list", "select", "sublist", "compact").
   */
  get view_type()
  {
    return this._view_type || this.getAttribute("view-type") || "list";
  }

  /**
   * Sets the active view type layout attribute.
   *
   * @param {string} val - Desired view type.
   */
  set view_type(val)
  {
    this._view_type = val || "list";
    if (val)
    {
      this.setAttribute("view-type", val);
    }
    else
    {
      this.removeAttribute("view-type");
    }
  }

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
      DeContactList.Extend_To_Items(contacts);
      this.contacts_search_select.items = contacts;
    }
  }

  /**
   * Gets the internal contacts list element or adapter.
   *
   * @returns {HTMLElement|Object|null} Internal list element or adapter in sublist mode.
   */
  get contacts_list()
  {
    if (this.view_type === "sublist" && this.contacts_search_select)
    {
      return {
        Add: (item) => this.Add(item),
        Remove: (item) => this.Remove(item),
        get value() { return this.selected; },
        set value(v) { this.selected = v; }
      };
    }
    return this._contacts_list;
  }

  /**
   * Sets the internal contacts list element reference.
   *
   * @param {HTMLElement|null} val - Elements container.
   */
  set contacts_list(val)
  {
    this._contacts_list = val;
  }

  /**
   * Sets the list of contact objects.
   *
   * @param {Array<Object>|null} data - Array of contact objects.
   */
  set value(data)
  {
    this._saved_value = data;
    if (this.view_type === "sublist" && this.contacts_search_select)
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
    else if (this.contacts_list)
    {
      this.contacts_list.value = data;
    }
  }

  /**
   * Gets the contact objects. In "select" view, returns only the checked contacts.
   *
   * @returns {Array<Object>|null} Array of contact objects.
   */
  get value()
  {
    let contacts = null;

    const view_type = this.getAttribute("view-type") || this.view_type;
    if (view_type === "sublist")
    {
      if (this.contacts_search_select)
      {
        contacts = (this.contacts_search_select.selected || []).map(item => {
          if (typeof item === "object" && item !== null)
          {
            return item.id != null ? item : { ...item, id: item.value };
          }
          return { id: item, value: item };
        });
      }
      else
      {
        contacts = this._saved_value || null;
      }
    }
    else if (view_type == "select")
    {
      const items_elem = this.contacts_list?.items_elem || this.contacts_list;
      const selected_elements = items_elem?.querySelectorAll
        ? items_elem.querySelectorAll("[name=selected_contact_id]:checked")
        : [];
      const selected_ids = Array.from(selected_elements).map(e => parseInt(e.value));
      const list_value = this.contacts_list?.value || this._saved_value || [];
      contacts = list_value.filter(c => selected_ids.includes(c.id));
    }
    else
    {
      contacts = this.contacts_list ? this.contacts_list.value : (this._saved_value || null);
    }

    return contacts;
  }

  // methods ==================================================================

  /**
   * Appends a new contact object to the list.
   *
   * @param {Object} obj - The contact object to add.
   */
  Add(obj)
  {
    if (this.view_type === "sublist" && this.contacts_search_select)
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
    else if (this.contacts_list?.Add)
    {
      this.contacts_list.Add(obj);
    }
  }

  /**
   * Removes a contact object from the list by its ID.
   *
   * @param {number|string|Object} obj_id - The ID or object of the contact to remove.
   */
  Remove(obj_id)
  {
    if (this.view_type === "sublist" && this.contacts_search_select)
    {
      const val = typeof obj_id === "object" && obj_id !== null ? (obj_id.value ?? obj_id.id) : obj_id;
      this.contacts_search_select.Remove_Item(val);
    }
    else if (this.contacts_list?.Remove)
    {
      this.contacts_list.Remove(obj_id);
    }
  }

  static Get_Contact_Name(contact)
  {
    return contact?.name || contact?.email || "Unknown Contact";
  }

  static Extend_To_Item(contact)
  {
    if (contact)
    {
      contact.value = contact.id;
      contact.title = DeContactList.Get_Contact_Name(contact);
    }
  }

  static Extend_To_Items(contacts)
  {
    if (!Utils.Is_Empty(contacts))
    {
      for (const contact of contacts)
      {
        DeContactList.Extend_To_Item(contact);
      }
    }
  }

  // events ===================================================================

  /**
   * Renders an individual contact item element from the de-input-list render event.
   *
   * @param {CustomEvent} event - Event dispatched by de-input-list containing item_elem and obj.
   */
  On_Render_Item(event)
  {
    const item_elem = event.detail?.item_elem || event.item_elem;
    const contact = event.detail?.obj || event.obj || event.detail;

    if (!item_elem || !contact) return;

    if (item_elem.contact_title_elem)
    {
      const name = contact.name || contact.email || "N/A";
      const title = Utils.Append_Str(name, contact.agency?.name, " @ ");
      item_elem.contact_title_elem.textContent = title;
    }
    if (item_elem.sel_contact_radio)
    {
      const radio_id = "scr_" + (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2));
      item_elem.sel_contact_radio.id = radio_id;
      if (item_elem.contact_title_elem)
      {
        item_elem.contact_title_elem.htmlFor = radio_id;
      }
    }
    if (item_elem.contact_email_elem)
      item_elem.contact_email_elem.value = contact.email;
    if (item_elem.contact_phone_elem)
      item_elem.contact_phone_elem.value = contact.phone;
    if (item_elem.contact_position_elem)
      item_elem.contact_position_elem.value = contact.position;
    if (item_elem.contact_linkedin_elem)
      item_elem.contact_linkedin_elem.value = contact.linkedin;
    if (item_elem.localName == "jopr-contact-details")
      item_elem.value = contact;

    if (item_elem.contact_menu)
      item_elem.contact_menu.event_data = contact;
    if (item_elem.sel_contact_radio)
      item_elem.sel_contact_radio.value = contact.id;
  }

  /**
   * Handles click events on the add contact button, dispatching a custom "add" event.
   *
   * @param {MouseEvent} event - Click event.
   */
  On_Click_Add(event)
  {
    if (event?.stopPropagation)
    {
      event.stopPropagation();
    }
    this.dispatchEvent(new CustomEvent("add", { bubbles: true }));
  }

  /**
   * Handles click events on the select contact button, dispatching a custom "select" event.
   *
   * @param {MouseEvent} [event] - Click event.
   */
  On_Click_Sel(event)
  {
    if (event?.stopPropagation)
    {
      event.stopPropagation();
    }
    this.dispatchEvent(new CustomEvent("select", { bubbles: true }));
  }

  // rendering ================================================================

  /**
   * Renders the read-only compact list layout.
   */
  Render_Compact()
  {
    const html = `
      <de-input-list cid="contacts_list" hide-header>
        <h3 slot="header">Contacts</h3>
        <jopr-contact-details slot="item" view-type="compact" class="contact-item"></jopr-contact-details>
      </de-input-list>
    `;
    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.contacts_list.addEventListener("render", this.On_Render_Item);
  }

  /**
   * Renders the simple contact selection list layout with radio buttons.
   */
  Render_Select()
  {
    const html = `
      <de-input-list cid="contacts_list">
        <div slot="item" class="contact-item">
          <input type="radio" name="selected_contact_id" cid="sel_contact_radio">
          <label cid="contact_title_elem" class="h2"></label>
        </div>
      </de-input-list>
    `;
    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.contacts_list.addEventListener("render", this.On_Render_Item);
  }

  /**
   * Renders the compact sublist layout with an h2 Contacts heading and de-search-multi-select component.
   */
  Render_Sublist()
  {
    const html = `
      <h2>Contacts</h2>
      <de-search-multi-select cid="contacts_search_select" placeholder="Type to search..."></de-search-multi-select>
    `;
    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    if (this._items && this.contacts_search_select)
    {
      this.contacts_search_select.items = this._items;
    }
    if (this._saved_value && this.contacts_search_select)
    {
      this.value = this._saved_value;
    }
    this.contacts_search_select?.addEventListener("add", this.On_Click_Add);
  }

  /**
   * Renders the default detailed list layout with expandable items and full details.
   */
  Render()
  {
    const html = `
      <de-input-list cid="contacts_list">
        <header slot="header">
          <h2>Contacts</h2>
          <button cid="add_contact_btn" class="img" type="button">
            <img src="image/add.svg" alt="Add Contact">
          </button>
        </header>
        <details slot="item" class="contact-item">
          <summary>
            <h2 cid="contact_title_elem"></h2>
            <de-toolbar-menu 
              cid="contact_menu" 
              show-edit label-edit="Edit Contact" 
              show-delete label-delete="Delete Contact"
            >
            </de-toolbar-menu>
          </summary>
          <de-field cid="contact_email_elem" field-label="Email"></de-field>
          <de-field cid="contact_phone_elem" field-label="Phone"></de-field>
          <de-field cid="contact_position_elem" field-label="Position"></de-field>
          <de-field cid="contact_linkedin_elem" field-label="LinkedIn" field-type="link"></de-field>
        </details>
      </de-input-list>
    `;
    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.contacts_list.addEventListener("render", this.On_Render_Item);
    this.add_contact_btn.addEventListener("click", this.On_Click_Add);
  }
}

Utils.Register_Element(DeContactList);
export default DeContactList;