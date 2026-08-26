import Utils from "../../../../lib/Utils.js";
const html_local_url = "./layout.html";
const html_url = new URL(html_local_url, import.meta.url).href;

class DeInputBool extends HTMLElement
{
  static tname = "de-input-bool";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  // properties ===============================================================

  set value(v)
  {
    if (v === null) this.null_elem.checked = true;
    else if (v === true) this.true_elem.checked = true;
    else if (v === false) this.false_elem.checked = true;
  }

  get value()
  {
    let res = null;
    const selected = this.querySelector('input[type="radio"]:checked');
    if (selected)
    {
      res = selected.value === '' ? null : selected.value === 'true';
    }

    return res;
  }

  // rendering ================================================================

  async Render()
  {
    const html = await Utils.Import_HTML(html_url);
    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    const group_name = `de_bool_${Math.random().toString(36).slice(2, 9)}`;
    this.null_elem.name = group_name;
    this.true_elem.name = group_name;
    this.false_elem.name = group_name;
  }
}

Utils.Register_Element(DeInputBool);
export default DeInputBool;