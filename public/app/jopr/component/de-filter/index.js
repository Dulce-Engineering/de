import Utils from "../../../../lib/Utils.js";
const html_local_url = "./layout.html";
const html_url = new URL(html_local_url, import.meta.url).href;

function Has_Any_Data(obj) 
{
  if (obj == null) return false;
  return Object.values(obj).some((val) => val != null);
}

function Show(elem, is_visible)
{
  elem.style.display = is_visible ? null : "none";
}

function Truncate(str, maxLength, suffix = "...") 
{
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

class DeFilter extends HTMLElement
{
  static tname = "de-filter";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");

    this.form_values = null;
  }

  connectedCallback()
  {
    this.Render();
  }

  // properties ===============================================================

  set value(filters)
  {
    this.form_values = filters;
  }

  get value()
  {
    return this.form_values;
  }
  
  // attributes ===============================================================

  // methods ==================================================================

  // events ===================================================================

  async On_Click_Select_Filters_Btn()
  {
    this.form_values = await this.filter_form.Show_Async(this.form_values);
    if (this.form_values)
    {
      this.Update_Summary();
      this.dispatchEvent(new Event("search"));
    }

    //console.log("DeFilter.On_Click_Select_Filters_Btn(): form_values =", this.form_values);
  }

  On_Click_Delete_Btn(event)
  {
    const item_elem = event.currentTarget.parentElement;
    const filter_name = item_elem.getAttribute("name");
    this.form_values[filter_name] = null;
    this.Update_Summary();
    this.dispatchEvent(new Event("search"));
  }

  // rendering ================================================================

  Update_Summary()
  {
    Show(this.summ_elem, Has_Any_Data(this.form_values));

    const summ_elems = this.summ_elem.children;
    for (const summ_elem of summ_elems)
    {
      const filter_name = summ_elem.getAttribute("name");
      const filter_value = this.form_values[filter_name];
      Show(summ_elem, filter_value != null);

      const summ_field = summ_elem.querySelector("de-field");
      summ_field.value = filter_value;
      const filter_elem = this.filter_form.main_elem.querySelector("[name=" + filter_name + "]");
      if (filter_elem.Get_Value_Label != undefined)
      {
        summ_field.value = filter_elem.Get_Value_Label(filter_value);
      }
    }
  }

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
  }
}
Utils.Register_Element(DeFilter);
export default DeFilter;

class DeFilterBool extends HTMLElement
{
  static tname = "de-filter-bool";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  get value()
  {
    //console.log("DeFilterBool.get value()");
    let res = null;
    const selected = this.querySelector('input[type="radio"]:checked');
    if (selected)
    {
      res = selected.value === 'null' ? null : selected.value === 'true';
    }

    return res;
  }

  set value(v)
  {
    //console.log("DeFilterBool.set value():", v);

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

  Clear_Radios()
  {

  }

  On_Change_Radio(event)
  {
    //console.log("DeFilterBool.On_Change_Radio()");
    const changed_elem = event.target;

    if (changed_elem != this.null_elem) this.null_elem.checked = false;
    if (changed_elem != this.true_elem) this.true_elem.checked = false;
    if (changed_elem != this.false_elem) this.false_elem.checked = false;
  }

  connectedCallback()
  {
    //console.log("DeFilterBool.connectedCallback()");
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

class DeFilterStr extends HTMLElement
{
  static tname = "de-filter-str";

  get value()
  {
    return this.input_elem.value;
  }

  set value(v)
  {
    this.input_elem.value = v;
  }

  Get_Value_Label(value)
  {
    let res = "";

    if (value != null)
    {
      res = Truncate(value, 20);
    }

    return res;
  }

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
