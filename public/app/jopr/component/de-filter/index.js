import Utils from "../../../../lib/Utils.js";
const html_local_url = "./layout.html";
const html_url = new URL(html_local_url, import.meta.url).href;

function Has_Any_Data(obj) 
{
  if (obj == null) return false;
  return Object.values(obj).some((val) => val != null);
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
    this.filter_form.value = filters;
  }

  get value()
  {
    return this.filter_form.value;
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

    console.log("DeFilter.On_Click_Select_Filters_Btn(): form_values =", this.form_values);
  }

  // rendering ================================================================

  Update_Summary()
  {
    const form_values = this.filter_form.value;
    if (Has_Any_Data(form_values))
    {
      this.summ_elem.style.display = null;
    }
  }

  async Render()
  {
    const html = await Utils.Import_HTML(html_url);
    const html_elements = Utils.To_Document(html, this);
    this.replaceChildren(html_elements);
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.sel_filters_btn.addEventListener("click", this.On_Click_Select_Filters_Btn);
  }
}
export default DeFilter;

class DeFilterBool extends HTMLElement
{
  static tname = "de-filter-bool";

  get value()
  {
    return this.input_elem.checked;
  }

  set value(v)
  {
    this.input_elem.checked = v;
  }

  connectedCallback()
  {
    const input_id = "input-" + crypto.randomUUID();
    this.innerHTML = `
      <label cid="label_elem" for="${input_id}"></label>
      <input cid="input_elem" id="${input_id}" type="checkbox">
    `;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    const label_str = this.getAttribute("label");
    this.label_elem.textContent = label_str;
  }
}


Utils.Register_Element(DeFilterBool);
Utils.Register_Element(DeFilter);
