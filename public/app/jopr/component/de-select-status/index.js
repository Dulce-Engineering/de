import Utils from "../../../../lib/Utils.js";
const html_local_url = "./layout.html";
const html_url = new URL(html_local_url, import.meta.url).href;

class DeSelectStatus extends HTMLElement
{
  static tname = "de-select-status";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");

    this.active_btn = null;
  }

  connectedCallback()
  {
    this.Render();
  }

  // properties ===============================================================

  set value(status_id)
  {
    // find relevant button by value=status_id
    // set text label = button label
    // set this value = button value
  }

  get value()
  {
    return this.active_btn?.value;
  }
  
  // attributes ===============================================================

  /*static observedAttributes = 
  [
    "attribute-name"
  ];
  attributeChangedCallback(name, old_value, new_value)
  {
  }*/

  // methods ==================================================================

  // events ===================================================================

  On_Click_Btn(event)
  {
    this.active_btn = event.target;
    this.Update_Label();
  }

  // rendering ================================================================

  Update_Label()
  {
    this.status_label.textContent = this.active_btn?.textContent;
  }

  async Render()
  {
    const html = await Utils.Import_HTML(html_url);
    const html_elements = Utils.To_Document(html, this);
    this.replaceChildren(html_elements);
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.addEventListener("click", this.On_Click_Btn);
  }
}

Utils.Register_Element(DeSelectStatus);
export default DeSelectStatus;