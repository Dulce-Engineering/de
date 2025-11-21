import Utils from "../../lib/Utils.js";

class DeLink extends HTMLElement
{
  static tname = "de-link";

  constructor()
  {
    super();
    //Utils.Bind(this, "On_");
    this.txt = "";
  }

  connectedCallback()
  {
    this.Render();
  }

  // Properties

  get value()
  {
    return this.txt;
  }

  set value(txt)
  {
    this.txt = txt;
    this.Update_Link();
  }

  // Attributes

  // Public Methods

  // Events

  // Rendering

  Update_Link()
  {
    if (this.isConnected && this.txt)
    {
      this.link.href = this.txt;
      this.link.innerText = this.txt;
    }
  }

  Render()
  {
    const html = `<a cid="link" target="_blank"></a>`;
    //const elems = Utils.To_Document(html, this);
    //this.replaceChildren(elems);
    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.Update_Link();
  }
}

Utils.Register_Element(DeLink);
export default DeLink;