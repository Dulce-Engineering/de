import Utils from "../../lib/Utils.js";

class DialogConfirm extends HTMLElement
{
  static tname = "dialog-confirm";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  Confirm(msg)
  {
    this.msg_elem.innerText = msg;
    this.dlg.showModal();

    const promise = new Promise((resolve, reject) =>
    {
      this.resolve = resolve;
      this.reject = reject;
    });

    return promise;
  }

  On_Click_Cancel_Btn()
  {
    this.dlg.close();
    this.resolve(false);
  }

  On_Click_OK_Btn()
  {
    this.dlg.close();
    this.resolve(true);
  }

  Render()
  {
    const html = `
      <dialog cid="dlg">
        <header>
          <slot name="header"></slot>
        </header>
        <main>
          <span cid="msg_elem"></span>
        </main>
        <footer>
          <button cid="ok_btn">OK</button>
          <button cid="cancel_btn">Cancel</button>
        </footer>
      </dialog>
    `;
    const elems = Utils.toDocument(html, this);
    this.replaceChildren(elems);
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.ok_btn.addEventListener("click", this.On_Click_OK_Btn);
    this.cancel_btn.addEventListener("click", this.On_Click_Cancel_Btn);
  }
}

Utils.Register_Element(DialogConfirm);
export default DialogConfirm;