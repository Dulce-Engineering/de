import Utils from "../../lib/Utils.js";

class DeInputImage extends HTMLElement
{
  static tname = "de-input-image";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  get value()
  {
    return this.img_elem.src;
  }

  set value(value)
  {
    this.img_elem.src = value==null || value==undefined ? "" : value;
  }

  get file()
  {
    return this.img_input_elem.files[0];
  }

  On_Change(event)
  {
    const file = event.target.files[0];

    if (file && file.type.startsWith('image/'))
    {
      const reader = new FileReader();
      reader.onload = this.On_Load;
      reader.readAsDataURL(file);
    }
  }

  On_Load(e)
  {
    this.img_elem.src = e.target.result;
  }

  Render()
  {
    const html = `
      <input type="file" accept="image/*" cid="img_input_elem">
      <img cid="img_elem">
    `;
    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.img_input_elem.addEventListener("change", this.On_Change);
  }
}

Utils.Register_Element(DeInputImage);
export default DeInputImage;