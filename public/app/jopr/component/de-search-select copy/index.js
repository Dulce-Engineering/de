import Utils from "../../../../lib/Utils.js";

/**
 * DeSearchSelect is a custom Web Component combobox providing an auto-complete searchable dropdown.
 * Supports filtering list options via text input, selection via popover listbox, and custom item creation trigger.
 *
 * @customElement de-search-select
 * @tag de-search-select
 * @attribute {string} [name] - Form field name associated with this select component.
 * @attribute {string} [placeholder="Type to search..."] - Placeholder text displayed in the input field.
 * @property {HTMLInputElement} input_elem - The text input element acting as combobox search bar.
 * @property {HTMLButtonElement} add_btn - Button element to trigger adding a new entity/item.
 * @property {HTMLUListElement} items_list - Popover unordered list element holding the selectable options.
 * @property {Array<{title: string, value: any}>|null} items_array - Internal storage of available options.
 * @property {Object|null} active_item - Currently selected item object {title, value}.
 * @fires DeSearchSelect#add - Dispatched when the add button is clicked to create a new entry.
 * @fires DeSearchSelect#change - Dispatched when a new option is selected from the list.
 */
class DeSearchSelect extends HTMLElement
{
  static tname = "de-search-select";

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
    this.active_item = null;
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
   * Sets the component value by looking up the item in `items_array` or setting a placeholder object.
   *
   * @param {any} item_value - The value identifying the item to select.
   */
  set value(item_value)
  {
    if (item_value == null || item_value === "null")
    {
      this.selected_item = null;
      return;
    }

    const list_item = this.Find_Item(item_value);
    if (list_item)
    {
      this.selected_item = list_item;
    }
    else
    {
      this.selected_item = { value: item_value };
    }
  }

  /**
   * Gets the primitive value of the currently selected item.
   *
   * @returns {any} Value of the selected item, or undefined if no item is selected.
   */
  get value()
  {
    return this.selected_item?.value;
  }

  /**
   * Sets the array of available options and re-renders the options list if rendered.
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
   * Sets the currently selected item object and updates the input display text.
   *
   * @param {Object|null} item - Item object containing title and value properties.
   */
  set selected_item(item)
  {
    this.active_item = item;
    if (this.input_elem)
    {
      this.input_elem.value = this.active_item?.title || "";
    }
  }

  /**
   * Gets the currently selected item object.
   *
   * @returns {Object|null} Active item object, or null if none is selected.
   */
  get selected_item()
  {
    return this.active_item;
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
   * Handles click events on an option inside the popover list.
   *
   * @param {MouseEvent} event - Click event on the options list.
   */
  On_Click_Items(event)
  {
    const option_elem = event.target?.closest ? event.target.closest(".option") : event.target;
    if (!option_elem) return;

    const selected_value = option_elem.getAttribute("item-value");
    this.value = (selected_value === "null" || selected_value == null) ? null : selected_value;

    if (this.items_list?.hidePopover)
    {
      try
      {
        this.items_list.hidePopover();
      }
      catch {}
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
   * Renders the component HTML template, binds element shortcuts, and attaches event listeners.
   *
   * @returns {Promise<void>}
   */
  async Render()
  {
    const placeholder_text = this.getAttribute("placeholder") || "Type to search...";
    const html = `
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
    `;
    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    if (this.active_item && this.input_elem)
    {
      this.input_elem.value = this.active_item?.title || "";
    }

    if (this.items_array && this.items_list)
    {
      this.Render_Options(this.items_array);
    }

    this.input_elem.addEventListener("click", this.On_Click_Input);
    this.input_elem.addEventListener("input", this.On_Input);
    this.items_list.addEventListener("click", this.On_Click_Items);
    this.add_btn.addEventListener("click", this.On_Click_Add_Btn);
  }
}

Utils.Register_Element(DeSearchSelect);
export default DeSearchSelect;