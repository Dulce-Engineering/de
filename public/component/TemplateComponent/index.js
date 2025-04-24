
import Utils from "../../lib/Utils.js";

class TemplateComponent extends HTMLElement
{
  static tname = "template-component";

  constructor()
  {
    super();
    //Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.render();
  }

  render()
  {
    const html = `
      <div cid="someId">html goes here</div>
    `;
    const html_elements = Utils.toDocument(html, this);
    this.replaceChildren(html_elements);
    Utils.Set_Id_Shortcuts(this, this, "cid");
  }
}

Utils.Register_Element(DeSelectTree);
export default TemplateComponent;
