import Utils from "../../lib/Utils.js";

class DeText extends HTMLElement
{
  static tname = "de-text";

  constructor()
  {
    super();
    //Utils.Bind(this, "On_");
    this.txt = "";
  }

  /*connectedCallback()
  {
    this.Render();
  }*/

  // Properties

  get value()
  {
    return this.txt;
  }

  set value(txt)
  {
    this.txt = txt;
    this.innerText = this.txt;
  }

  // Attributes

  // Public Methods

  // Events

  // Rendering

  /*Render()
  {
    const html = ``;
    const elems = Utils.To_Document(html, this);
    this.replaceChildren(elems);
    Utils.Set_Id_Shortcuts(this, this, "cid");

    // event listeners here
  }*/
}

Utils.Register_Element(DeText);
export default DeText;