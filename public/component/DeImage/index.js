import Utils from "../../lib/Utils.js";

class DeImage extends HTMLElement
{
  static tname = "de-image";

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
    return this.img_elem.src;
  }

  set value(src)
  {
    this.img_elem.src = src ? src : "" ;
  }

  // Attributes

  // Public Methods

  // Events

  // Rendering

  Render()
  {
    const html = `<img cid="img_elem">`;
    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    // event listeners here
  }
}

Utils.Register_Element(DeImage);
export default DeImage;