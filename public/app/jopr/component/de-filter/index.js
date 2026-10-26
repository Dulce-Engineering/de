import Utils from "../../../../lib/Utils.js";
const html_local_url = "./layout.html";
const html_url = new URL(html_local_url, import.meta.url).href;

/**
 * Checks whether an object contains any non-null, non-empty values.
 *
 * @param {Object|null} obj - The object to inspect.
 * @returns {boolean} True if at least one value is non-null and non-empty.
 */
function Has_Any_Data(obj) 
{
  if (obj == null) return false;
  return Object.values(obj).some((val) => val != null && val !== "");
}

/**
 * Toggles visibility of a DOM element using display styling.
 *
 * @param {HTMLElement} elem - The target element.
 * @param {boolean} is_visible - Whether the element should be visible.
 */
function Show(elem, is_visible)
{
  if (!elem) return;
  elem.style.display = is_visible ? null : "none";
}

/**
 * Truncates a string to a specified maximum length, appending a suffix if truncated.
 *
 * @param {string} str - The string to truncate.
 * @param {number} maxLength - Maximum allowable length.
 * @param {string} [suffix="..."] - Suffix to append when truncated.
 * @returns {string} Truncated string.
 */
function Truncate(str, maxLength, suffix = "...") 
{
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Custom web component for managing, displaying, and persisting filter options.
 *
 * @customElement de-filter
 * @attribute {string} [store-name] - The IndexedDB object store name used to persist filters.
 * @attribute {string} [db-name] - The IndexedDB database name.
 * @attribute {string} [store] - Shorthand attribute for store name or "dbname/storename".
 * @attribute {string} [db-store] - Alternative attribute for store name or "dbname/storename".
 * @property {Object|null} value - Filter values dictionary.
 * @property {Db|null} db - Instance of the Db class for IndexedDB persistence.
 * @property {string|null} store_name - Current store name configured via attributes.
 * @property {string|null} db_name - Current database name configured via attributes.
 */
class DeFilter extends HTMLElement
{
  static tname = "de-filter";

  static observedAttributes = 
  [
    "store-name",
    "db-name",
    "store",
    "db-store"
  ];

  /**
   * Creates an instance of DeFilter.
   */
  constructor()
  {
    super();
    Utils.Bind(this, "On_");

    this.form_values = null;
    this.db_instance = null;
    this.load_promise = null;
  }

  /**
   * Invoked when the component is connected to the DOM.
   * Renders the template and triggers loading stored filter values if configured.
   */
  async connectedCallback()
  {
    await this.Render();
    const { store_name } = this.Get_Db_And_Store_Names();
    if (this.db_instance && store_name && !this.form_values)
    {
      await this.Load_Filters();
    }
  }

  /**
   * Observes attribute changes on the element.
   *
   * @param {string} name - Attribute name changed.
   * @param {string|null} old_value - Previous value.
   * @param {string|null} new_value - New value.
   */
  attributeChangedCallback(name, old_value, new_value)
  {
    if (old_value !== new_value)
    {
      const { store_name } = this.Get_Db_And_Store_Names();
      if (this.db_instance && store_name && !this.form_values)
      {
        this.Load_Filters();
      }
    }
  }

  // properties ===============================================================

  /**
   * Sets the current filter values and updates summary UI.
   *
   * @param {Object|null} filters - Key-value pair of filter parameters.
   */
  set value(filters)
  {
    this.form_values = filters;
    if (this.summ_elem)
    {
      this.Update_Summary();
    }
  }

  /**
   * Gets the current filter values.
   *
   * @returns {Object|null} Filter values dictionary.
   */
  get value()
  {
    return this.form_values;
  }

  /**
   * Sets the Db instance for persistence.
   * If a store name is already configured, initiates loading filters.
   *
   * @param {Object|null} db_instance - Instance of Db class.
   */
  set db(db_instance)
  {
    this.db_instance = db_instance;
    const { store_name } = this.Get_Db_And_Store_Names();
    if (this.db_instance && store_name && !this.form_values)
    {
      this.Load_Filters();
    }
  }

  /**
   * Gets the current Db instance.
   *
   * @returns {Object|null} Current Db instance.
   */
  get db()
  {
    return this.db_instance;
  }

  /**
   * Gets the configured store name.
   *
   * @returns {string|null} Object store name.
   */
  get store_name()
  {
    return this.Get_Db_And_Store_Names().store_name;
  }

  /**
   * Sets the store name attribute.
   *
   * @param {string|null} val - Object store name.
   */
  set store_name(val)
  {
    if (val == null)
    {
      this.removeAttribute("store-name");
    }
    else
    {
      this.setAttribute("store-name", val);
    }
  }

  /**
   * Gets the configured database name.
   *
   * @returns {string|null} Database name.
   */
  get db_name()
  {
    return this.Get_Db_And_Store_Names().db_name;
  }

  /**
   * Sets the database name attribute.
   *
   * @param {string|null} val - Database name.
   */
  set db_name(val)
  {
    if (val == null)
    {
      this.removeAttribute("db-name");
    }
    else
    {
      this.setAttribute("db-name", val);
    }
  }

  // methods ==================================================================

  /**
   * Resolves configured database and store names from attributes.
   * Supports 'store-name', 'db-name', 'store', and 'db-store' attributes.
   *
   * @returns {{ db_name: string|null, store_name: string|null }}
   */
  Get_Db_And_Store_Names()
  {
    let db_name = this.getAttribute("db-name") || null;
    let store_name = 
      this.getAttribute("store-name") || 
      this.getAttribute("store") || 
      this.getAttribute("db-store") || 
      null;

    if (store_name)
    {
      if (store_name.includes("/"))
      {
        const parts = store_name.split("/");
        db_name = db_name || parts[0];
        store_name = parts[1];
      }
      else if (store_name.includes(":"))
      {
        const parts = store_name.split(":");
        db_name = db_name || parts[0];
        store_name = parts[1];
      }
    }

    return { db_name, store_name };
  }

  /**
   * Loads persisted filter state from IndexedDB if db and store-name are provided.
   *
   * @returns {Promise<Object|null>} The loaded filter values or null.
   */
  async Load_Filters()
  {
    if (!this.db_instance) return null;
    const { store_name } = this.Get_Db_And_Store_Names();
    if (!store_name) return null;

    if (this.load_promise) return this.load_promise;

    this.load_promise = (async () =>
    {
      try
      {
        const stored_item = await this.db_instance.Select_First(store_name);
        if (stored_item)
        {
          const { id, ...filters } = stored_item;
          this.form_values = filters;
          if (this.summ_elem)
          {
            this.Update_Summary();
          }
          return this.form_values;
        }
      }
      catch (err)
      {
        console.warn("DeFilter.Load_Filters() error:", err);
      }
      finally
      {
        this.load_promise = null;
      }
      return null;
    })();

    return this.load_promise;
  }

  /**
   * Saves current filter state to IndexedDB if db and store-name are provided.
   *
   * @returns {Promise<number|string|null>} Record ID or null.
   */
  async Save_Filters()
  {
    if (!this.db_instance) return null;
    const { store_name } = this.Get_Db_And_Store_Names();
    if (!store_name) return null;

    try
    {
      const item = { id: 1, ...(this.form_values || {}) };
      return await this.db_instance.Save(store_name, item);
    }
    catch (err)
    {
      console.warn("DeFilter.Save_Filters() error:", err);
      return null;
    }
  }

  // events ===================================================================

  /**
   * Handles click event on the select filters button.
   * Displays the filter dialog, updates summary, persists state, and dispatches 'search'.
   */
  async On_Click_Select_Filters_Btn()
  {
    const new_values = await this.filter_form.Show_Async(this.form_values);
    if (new_values)
    {
      this.form_values = new_values;
      this.Update_Summary();
      await this.Save_Filters();
      this.dispatchEvent(new Event("search"));
    }
  }

  /**
   * Handles click event on individual filter delete buttons.
   * Clears the specific filter value, updates summary, persists state, and dispatches 'search'.
   *
   * @param {MouseEvent} event - Click event from delete button.
   */
  async On_Click_Delete_Btn(event)
  {
    const item_elem = event.currentTarget.parentElement;
    const filter_name = item_elem.getAttribute("name");
    if (!this.form_values)
    {
      this.form_values = {};
    }
    this.form_values[filter_name] = null;
    this.Update_Summary();
    await this.Save_Filters();
    this.dispatchEvent(new Event("search"));
  }

  // rendering ================================================================

  /**
   * Updates visibility and content of filter summary tags.
   */
  Update_Summary()
  {
    if (!this.summ_elem) return;

    Show(this.summ_elem, Has_Any_Data(this.form_values));

    const summ_elems = this.summ_elem.children || [];
    for (const summ_elem of summ_elems)
    {
      const filter_name = summ_elem.getAttribute("name");
      const filter_value = this.form_values ? this.form_values[filter_name] : null;
      Show(summ_elem, filter_value != null && filter_value !== "");

      const summ_field = summ_elem.querySelector("de-field");
      if (summ_field)
      {
        summ_field.value = filter_value;
      }

      const filter_elem = 
        this.filter_form?.main_elem?.querySelector?.("[name=" + filter_name + "]") ||
        this.filter_form?.querySelector?.("[name=" + filter_name + "]");
      if (filter_elem && filter_elem.Get_Value_Label != undefined && summ_field)
      {
        summ_field.value = filter_elem.Get_Value_Label(filter_value);
      }
    }
  }

  /**
   * Renders the component HTML layout and registers DOM shortcut references and event handlers.
   */
  async Render()
  {
    const html = await Utils.Import_HTML(html_url);
    const html_elements = Utils.To_Document(html, this);
    this.replaceChildren(html_elements);
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.sel_filters_btn.addEventListener("click", this.On_Click_Select_Filters_Btn);
    const del_btns = this.summ_elem.querySelectorAll("button");
    for (const del_btn of del_btns)
      del_btn.addEventListener("click", this.On_Click_Delete_Btn);

    if (this.form_values)
    {
      this.Update_Summary();
    }
  }
}
Utils.Register_Element(DeFilter);
export default DeFilter;

/**
 * Custom web component for selecting boolean filter values (Either, Yes, No).
 *
 * @customElement de-filter-bool
 * @attribute {string} [label] - Display label for the boolean filter.
 * @property {boolean|null} value - Selected boolean state or null for either.
 */
class DeFilterBool extends HTMLElement
{
  static tname = "de-filter-bool";

  /**
   * Creates an instance of DeFilterBool.
   */
  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  /**
   * Gets the boolean value selected.
   *
   * @returns {boolean|null} True if Yes, false if No, null if Either.
   */
  get value()
  {
    let res = null;
    const selected = this.querySelector('input[type="radio"]:checked');
    if (selected)
    {
      res = selected.value === 'null' ? null : selected.value === 'true';
    }

    return res;
  }

  /**
   * Sets the radio button state based on boolean or null value.
   *
   * @param {boolean|null} v - Desired value.
   */
  set value(v)
  {
    this.null_elem.checked = false;
    this.true_elem.checked = false;
    this.false_elem.checked = false;

    if (v === null) 
    {
      this.null_elem.checked = true;
    }
    else if (v === true) 
    {
      this.true_elem.checked = true;
    }
    else if (v === false) 
    {
      this.false_elem.checked = true;
    }
  }

  /**
   * Returns human-readable label for the given boolean value.
   *
   * @param {boolean|null} value - Boolean value.
   * @returns {string} "Yes", "No", or empty string.
   */
  Get_Value_Label(value)
  {
    let res = "";
    if (value === true)
    {
      res = "Yes";
    }
    else if (value === false)
    {
      res = "No";
    }
    return res;
  }

  /**
   * Clears radio selections.
   */
  Clear_Radios()
  {
  }

  /**
   * Radio change event handler to manage mutual exclusion.
   *
   * @param {Event} event - Change event.
   */
  On_Change_Radio(event)
  {
    const changed_elem = event.target;

    if (changed_elem != this.null_elem) this.null_elem.checked = false;
    if (changed_elem != this.true_elem) this.true_elem.checked = false;
    if (changed_elem != this.false_elem) this.false_elem.checked = false;
  }

  /**
   * Lifecycle callback invoked when the element is appended to DOM.
   */
  connectedCallback()
  {
    this.innerHTML = `
      <label cid="label_elem"></label>
      <span class="options">
        <label>
          <input cid="null_elem" type="radio" value="null" />
          Either
        </label>
        <label>
          <input cid="true_elem" type="radio" value="true" />
          Yes
        </label>
        <label>
          <input cid="false_elem" type="radio" value="false" />
          No
        </label>
      </span>
    `;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    const label_str = this.getAttribute("label");
    this.label_elem.textContent = label_str;

    this.null_elem.addEventListener("change", this.On_Change_Radio);
    this.true_elem.addEventListener("change", this.On_Change_Radio);
    this.false_elem.addEventListener("change", this.On_Change_Radio);
  }
}
Utils.Register_Element(DeFilterBool);

/**
 * Custom web component for filtering by text input string.
 *
 * @customElement de-filter-str
 * @attribute {string} [label] - Display label for string filter input.
 * @property {string} value - Current input string value.
 */
class DeFilterStr extends HTMLElement
{
  static tname = "de-filter-str";

  /**
   * Gets current text value.
   *
   * @returns {string} String value.
   */
  get value()
  {
    return this.input_elem.value;
  }

  /**
   * Sets text value.
   *
   * @param {string} v - String value to set.
   */
  set value(v)
  {
    this.input_elem.value = v;
  }

  /**
   * Returns truncated display label for the string filter value.
   *
   * @param {string|null} value - String value.
   * @returns {string} Truncated string label.
   */
  Get_Value_Label(value)
  {
    let res = "";

    if (value != null)
    {
      res = Truncate(value, 20);
    }

    return res;
  }

  /**
   * Lifecycle callback invoked when the element is appended to DOM.
   */
  connectedCallback()
  {
    const input_id = "input-" + crypto.randomUUID();
    this.innerHTML = `
      <label cid="label_elem" for="${input_id}"></label>
      <input cid="input_elem" id="${input_id}">
    `;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    const label_str = this.getAttribute("label");
    this.label_elem.textContent = label_str;
  }
}
Utils.Register_Element(DeFilterStr);
