import Utils from "../../../../lib/Utils.js";

class DeComponent extends HTMLElement
{
  static tname = "de-component";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  set value(obj)
  {
  }

  get value()
  {
  }
  
  static observedAttributes = 
  [
    "attribute-name"
  ];
  attributeChangedCallback(name, old_value, new_value)
  {
  }

  On_Click_Btn()
  {
  }

  Render()
  {
    const html = `
      <div cid="some_elem">some html goes here</div>
    `;
    const html_elements = Utils.To_Document(html, this);
    this.replaceChildren(html_elements);
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.some_elem.addEventListener("click", this.On_Click_Btn);
  }
}

Utils.Register_Element(DeComponent);
export default DeComponent;