import Utils from "../../lib/Utils.js";

class DeDialogAlert extends HTMLElement
{
  static tname = "de-dialog-alert";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  Alert(msg)
  {
    if (msg)
    {
      this.main_elem.innerText = msg;
    }
    this.dlg.showModal();
  }

  On_Click_OK_Btn()
  {
    this.dlg.close();
  }
  
  Render()
  {
    const html = `
      <dialog cid="dlg">
        <header>
          <slot name="header"></slot>
        </header>
        <main cid="main_elem">
          <slot name="body"></slot>
        </main>
        <footer>
          <button cid="ok_btn">OK</button>
        </footer>
      </dialog>
    `;
    const elems = Utils.toDocument(html, this);
    this.replaceChildren(elems);
    Utils.Set_Id_Shortcuts(this, this, "cid");

    if (this.hasAttribute("label-ok"))
    {
      this.ok_btn.textContent = this.getAttribute("label-ok");
    }
  
    this.ok_btn.addEventListener("click", this.On_Click_OK_Btn);
  }
}

Utils.Register_Element(DeDialogAlert);
export default DeDialogAlert;