/*import Utils from "../../lib/Utils.js";

class DeInputPdf extends HTMLElement
{
  static tname = "de-input-pdf";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  get file()
  {
    return this.input_elem.files[0];
  }

  On_Change(event)
  {
    const file = event.target.files[0];
    if (file && file.type !== 'application/pdf') {
      this.value = '';
    }
  }

  Render()
  {
    const html = `
      <input type="file" accept="application/pdf" cid="input_elem">
    `;
    const elems = Utils.To_Document(html, this);
    this.replaceChildren(elems);
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.input_elem.addEventListener("change", this.On_Change);
  }
}

Utils.Register_Element(DeInputPdf);
export default DeInputPdf;*/