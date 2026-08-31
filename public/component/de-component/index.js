import Utils from "../../../../lib/Utils.js";
const html_local_url = "./layout.html";
const html_url = new URL(html_local_url, import.meta.url).href;

class DeComponent extends HTMLElement
{
  static tname = "de-component";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");

    this.rendered = false;
  }

  connectedCallback()
  {
    this.Render();
  }

  // properties ===============================================================

  set value(v)
  {
    if (this.rendered)
    {

    }
    else
    {
      this.pending_value = v;
    }
  }

  get value()
  {
  }
  
  // attributes ===============================================================

  static observedAttributes = 
  [
    "attribute-name"
  ];
  attributeChangedCallback(name, old_value, new_value)
  {
  }

  // methods ==================================================================

  // events ===================================================================

  On_Click_Btn()
  {
  }

  // rendering ================================================================

  async Render()
  {
    const html = await Utils.Import_HTML(html_url);
    const html_elements = Utils.To_Document(html, this);
    this.replaceChildren(html_elements);
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.some_elem.addEventListener("click", this.On_Click_Btn);

    this.rendered = true;
    if (this.pending_value) 
    {
      this.value = this.pending_value;
    }
  }
}

Utils.Register_Element(DeComponent);
export default DeComponent;