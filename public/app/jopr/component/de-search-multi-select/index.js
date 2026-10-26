import Utils from "../../../../lib/Utils.js";
import DeToolbarMenu from "../de-toolbar-menu/index.js";

/**
 * DeSearchMultiSelect is a custom Web Component combobox providing an auto-complete
 * searchable dropdown that supports multiple item selections.
 *
 * Selected items are displayed below the search bar as a list of entries with
 * item titles in <h2> tags, along with edit and delete actions rendered via de-toolbar-menu.
 *
 * @customElement de-search-multi-select
 * @tag de-search-multi-select
 * @attribute {string} [name] - Form field identifier.
 * @attribute {string} [placeholder="Type to search..."] - Placeholder text for search input.
 * @property {HTMLInputElement} input_elem - The text input element acting as combobox search bar.
 * @property {HTMLButtonElement} add_btn - Button element to trigger adding a new entity/item.
 * @property {HTMLUListElement} items_list - Popover unordered list element holding selectable options.
 * @property {HTMLElement} selected_items_elem - Container element rendering the list of selected items.
 * @property {Array<{title: string, value: any}>|null} items_array - Internal storage of available options.
 * @property {Array<{title?: string, value: any}>} selected_items - Array of currently selected item objects.
 * @fires DeSearchMultiSelect#add - Dispatched when the add button is clicked.
 * @fires DeSearchMultiSelect#change - Dispatched when an item is selected or removed.
 * @fires DeSearchMultiSelect#edit - Dispatched when an item's edit button is clicked, with event.value and detail set to item value.
 * @fires DeSearchMultiSelect#delete - Dispatched when an item's delete button is clicked, with event.value and detail set to item value.
 */
class DeSearchMultiSelect extends HTMLElement
{
  static tname = "de-search-multi-select";

  /**
   * Observed attributes for automatic change handling.
   *
   * @returns {string[]} Array of observed attribute names.
   */
  static get observedAttributes()
  {
    return ["name", "placeholder"];
  }

  /**
   * Initializes instance properties and binds event handlers.
   */
  constructor()
  {
    super();
    Utils.Bind(this, "On_");

    this.items_array = null;
    this.selected_items = [];
  }

  /**
   * Lifecycle callback invoked when the element is inserted into the DOM.
   */
  connectedCallback()
  {
    this.Render();
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

    if (name === "placeholder" && this.input_elem)
    {
      this.input_elem.placeholder = new_value || "Type to search...";
    }
  }

  // properties ===============================================================

  /**
   * Gets the array of primitive values for all currently selected items.
   *
   * @returns {any[]} Array of selected item values.
   */
  get value()
  {
    return (this.selected_items || []).map(item => item?.value != null ? item.value : item);
  }

  /**
   * Sets the selected items using an array of values or item objects.
   *
   * @param {any[]|any} values - Array of values or item objects to select.
   */
  set value(values)
  {
    if (values == null)
    {
      this.selected = [];
      return;
    }

    const val_array = Array.isArray(values) ? values : [values];
    const items = val_array.map(val => {
      if (typeof val === "object" && val !== null)
      {
        return val;
      }
      const found = this.Find_Item(val);
      return found || { value: val };
    });

    this.selected = items;
  }

  /**
   * Gets the array of available options.
   *
   * @returns {Array<{title: string, value: any}>|null} List of item objects.
   */
  get items()
  {
    return this.items_array;
  }

  /**
   * Sets the array of available options and refreshes the dropdown list.
   *
   * @param {Array<{title: string, value: any}>|null} items_array - List of item objects.
   */
  set items(items_array)
  {
    this.items_array = items_array;
    if (this.items_list)
    {
      this.Render_Options(this.items_array);
    }

    // Reconcile selected items if they were set before items were loaded
    if (this.selected_items?.length && this.items_array?.length)
    {
      this.selected_items = this.selected_items.map(sel => {
        const found = this.Find_Item(sel.value);
        return found ? { ...found, ...sel } : sel;
      });
      this.Render_Selected_Items();
    }
  }

  /**
   * Gets the array of currently selected item objects.
   *
   * @returns {Array<{title?: string, value: any}>} Array of selected item objects.
   */
  get selected()
  {
    return this.selected_items || [];
  }

  /**
   * Sets the currently selected items and renders the selected items list.
   *
   * @param {Array<Object|any>|null} items - Array of items to mark as selected.
   */
  set selected(items)
  {
    if (!items)
    {
      this.selected_items = [];
    }
    else
    {
      const arr = Array.isArray(items) ? items : [items];
      this.selected_items = arr.map(i => {
        if (typeof i === "object" && i !== null)
        {
          return i;
        }
        const found = this.Find_Item(i);
        return found || { value: i };
      });
    }

    this.Render_Selected_Items();
  }

  /**
   * Gets the form field name attribute.
   *
   * @returns {string|null} The name attribute value.
   */
  get name()
  {
    return this.getAttribute("name");
  }

  /**
   * Sets the form field name attribute.
   *
   * @param {string|null} val - The name attribute value.
   */
  set name(val)
  {
    if (val)
    {
      this.setAttribute("name", val);
    }
    else
    {
      this.removeAttribute("name");
    }
  }

  /**
   * Gets the placeholder text.
   *
   * @returns {string} Configured placeholder or default string.
   */
  get placeholder()
  {
    return this.getAttribute("placeholder") || "Type to search...";
  }

  /**
   * Sets the placeholder attribute.
   *
   * @param {string|null} val - Placeholder string.
   */
  set placeholder(val)
  {
    if (val)
    {
      this.setAttribute("placeholder", val);
    }
    else
    {
      this.removeAttribute("placeholder");
    }
  }

  // methods ==================================================================

  /**
   * Searches the available options for an item matching the provided value.
   *
   * @param {any} value - The item value to match.
   * @returns {Object|null} Matched item object, or null if not found.
   */
  Find_Item(value)
  {
    let res = null;

    if (this.items_array && value != null)
    {
      res = this.items_array.find(i => i.value == value) || null;
    }

    return res;
  }

  /**
   * Adds an item by value to the selected items list if not already present.
   *
   * @param {any} value - Value of the item to add.
   */
  Add_Item(value)
  {
    if (!this.selected_items)
    {
      this.selected_items = [];
    }

    const exists = this.selected_items.some(i => i.value == value);
    if (!exists)
    {
      const item = this.Find_Item(value) || { value };
      this.selected_items.push(item);
      this.Render_Selected_Items();
    }
  }

  /**
   * Removes an item by value from the selected items list.
   *
   * @param {any} value - Value of the item to remove.
   */
  Remove_Item(value)
  {
    if (!this.selected_items) return;

    this.selected_items = this.selected_items.filter(i => i.value != value);
    this.Render_Selected_Items();
  }

  // events ===================================================================

  /**
   * Handles click events on the text input element, opening the options popover list.
   */
  On_Click_Input()
  {
    if (this.items_list?.showPopover)
    {
      try
      {
        this.items_list.showPopover();
      }
      catch {}
    }
    if (this.items_list)
    {
      this.Render_Options(this.items_array);
    }
  }

  /**
   * Handles click events on an option in the popover list. Adds the selected option to value.
   *
   * @param {MouseEvent} event - Click event on the options list.
   */
  On_Click_Items(event)
  {
    const option_elem = event.target?.closest ? event.target.closest(".option") : event.target;
    if (!option_elem) return;

    const selected_value = option_elem.getAttribute("item-value");
    if (selected_value === "null" || selected_value == null)
    {
      this.selected = [];
    }
    else
    {
      this.Add_Item(selected_value);
    }

    if (this.items_list?.hidePopover)
    {
      try
      {
        this.items_list.hidePopover();
      }
      catch {}
    }

    if (this.input_elem)
    {
      this.input_elem.value = "";
    }

    this.dispatchEvent(new Event("change", { bubbles: true }));
  }

  /**
   * Handles input events on the text field, filtering available options based on matching title text.
   *
   * @param {InputEvent} e - Input event on the input element.
   */
  On_Input(e)
  {
    const search_str = (this.input_elem?.value || "").trim().toLowerCase();
    const match_items = this.items_array
      ? this.items_array.filter(i => (i?.title || "").toLowerCase().includes(search_str))
      : [];

    this.Render_Options(match_items);
  }

  /**
   * Handles click events on the add button, dispatching a custom "add" event.
   */
  On_Click_Add_Btn()
  {
    this.dispatchEvent(new Event("add"));
  }

  /**
   * Handles clicking the edit button for a selected item, triggering the "edit" event with item value.
   *
   * @param {Object} item - The selected item being edited.
   */
  On_Click_Edit_Item(item)
  {
    const val = item?.value != null ? item.value : item;
    const edit_event = new CustomEvent("edit", {
      detail: val,
      bubbles: true
    });
    edit_event.value = val;
    edit_event.item = item;
    this.dispatchEvent(edit_event);
  }

  /**
   * Handles clicking the delete button for a selected item, removing it and triggering the "delete" event.
   *
   * @param {Object} item - The selected item being deleted.
   */
  On_Click_Delete_Item(item)
  {
    const val = item?.value != null ? item.value : item;
    this.Remove_Item(val);

    const delete_event = new CustomEvent("delete", {
      detail: val,
      bubbles: true
    });
    delete_event.value = val;
    delete_event.item = item;
    this.dispatchEvent(delete_event);

    this.dispatchEvent(new Event("change", { bubbles: true }));
  }

  // rendering ================================================================

  /**
   * Renders the collection of option elements into the popover list container.
   *
   * @param {Array<{title: string, value: any}>|null} items - Array of items to render.
   */
  Render_Options(items)
  {
    if (!this.items_list) return;

    this.items_list.querySelectorAll(".option").forEach(el => el.remove());
    if (items)
    {
      let items_html = this.Render_Option_HTML();
      this.items_list.insertAdjacentHTML("beforeend", items_html);
      for (const item of items)
      {
        items_html = this.Render_Option_HTML(item);
        this.items_list.insertAdjacentHTML("beforeend", items_html);
      }
    }
  }

  /**
   * Generates the HTML string for an individual option element.
   *
   * @param {Object} [item] - Option item with title and value. If omitted, renders the "None" option.
   * @returns {string} HTML string representing the option `<li>`.
   */
  Render_Option_HTML(item)
  {
    let html = `
      <li role="option" aria-selected="false" class="option none" item-value="null">
        None
      </li>
    `;

    if (item)
    {
      html = `
        <li role="option" aria-selected="false" class="option" item-value="${item.value}">
          ${item.title}
        </li>
      `;
    }

    return html;
  }

  /**
   * Renders a single selected item element containing an h2 title and de-toolbar-menu with edit and delete buttons.
   *
   * @param {Object} item - Item object {title, value}.
   * @returns {HTMLElement} The created item container element.
   */
  Render_Selected_Item_Element(item)
  {
    const div = document.createElement("div");
    div.className = "selected-item";
    div.setAttribute("data-value", item.value);

    const h2 = document.createElement("h2");
    h2.textContent = item.title || String(item.value ?? "");
    div.append(h2);

    const menu = document.createElement("de-toolbar-menu");
    menu.setAttribute("show-edit", "");
    menu.setAttribute("show-delete", "");
    menu.event_data = item.value;

    menu.addEventListener("edit", (event) => {
      event.stopPropagation();
      this.On_Click_Edit_Item(item);
    });

    menu.addEventListener("delete", (event) => {
      event.stopPropagation();
      this.On_Click_Delete_Item(item);
    });

    div.append(menu);
    return div;
  }

  /**
   * Renders the list of currently selected items into the selected_items_elem container.
   */
  Render_Selected_Items()
  {
    if (!this.selected_items_elem) return;

    this.selected_items_elem.innerHTML = "";
    for (const item of (this.selected_items || []))
    {
      const item_elem = this.Render_Selected_Item_Element(item);
      this.selected_items_elem.append(item_elem);
    }
  }

  /**
   * Renders the component HTML template, binds element shortcuts, and attaches event listeners.
   *
   * @returns {Promise<void>}
   */
  async Render()
  {
    const placeholder_text = this.getAttribute("placeholder") || "Type to search...";
    const html = `
      <div class="search-box">
        <input
          cid="input_elem"
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded="false"
          aria-haspopup="listbox"
          aria-controls="combobox-listbox"
          aria-labelledby="combobox-label"
          placeholder="${placeholder_text}"
          autocomplete="off"
        />

        <button cid="add_btn" type="button">
          <img src="image/add.svg">
        </button>

        <ul cid="items_list" role="listbox" popover></ul>
      </div>

      <div cid="selected_items_elem" class="selected-items"></div>
    `;
    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    if (this.items_array && this.items_list)
    {
      this.Render_Options(this.items_array);
    }

    if (this.selected_items?.length && this.selected_items_elem)
    {
      this.Render_Selected_Items();
    }

    this.input_elem.addEventListener("click", this.On_Click_Input);
    this.input_elem.addEventListener("input", this.On_Input);
    this.items_list.addEventListener("click", this.On_Click_Items);
    this.add_btn.addEventListener("click", this.On_Click_Add_Btn);
  }
}

Utils.Register_Element(DeSearchMultiSelect);
export default DeSearchMultiSelect;