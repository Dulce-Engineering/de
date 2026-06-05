import Utils from "../../lib/Utils.js";

class DeDialogConfirm extends HTMLElement
{
  static tname = "de-dialog-confirm";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }
  
  Has_Text(inputString) 
  {
    if (typeof inputString !== 'string') {
      return false;
    }
  
    if (inputString.length === 0) {
      return false;
    }
  
    for (let i = 0; i < inputString.length; i++) {
      const charCode = inputString.charCodeAt(i);
  
      // Check for printable ASCII characters (32-126)
      if (charCode >= 32 && charCode <= 126) {
        return true;
      }
  
      // Check for common emoji ranges (this is not exhaustive but covers a lot)
      if (
        (charCode >= 0x1F300 && charCode <= 0x1F64F) || // Misc Symbols and Pictographs
        (charCode >= 0x1F680 && charCode <= 0x1F6FF) || // Transport and Map Symbols
        (charCode >= 0x1F900 && charCode <= 0x1F9FF) || // Supplemental Symbols and Pictographs
        (charCode >= 0x2600 && charCode <= 0x27BF) || // Dingbats
        (charCode >= 0x1F600 && charCode <= 0x1F64F) //Emoticons
      ) {
        return true;
      }
  
      // check for other unicode printable characters.
      if(charCode > 255){
        // This is a very rough approach, and will not cover all printable unicode.
        // it is intended to catch a large amount of non-ascii printable characters.
        // a more robust method would require a large lookup table.
        if (!isControlCharacter(charCode)){
            return true;
        }
      }
    }
  
    return false;
  }

  Confirm(msg)
  {
    if (msg)
    {
      this.main_elem.innerText = msg;
    }

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
        <main cid="main_elem">
          <slot name="body"></slot>
        </main>
        <footer>
          <slot name="footer"></slot>
          <button cid="ok_btn">
            <slot name="label-ok"></slot>
          </button>
          <button cid="cancel_btn">
            <slot name="label-cancel"></slot>
          </button>
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
    else
    {
      this.ok_btn.textContent = "OK";
    }

    if (this.hasAttribute("label-cancel"))
    {
      this.cancel_btn.textContent = this.getAttribute("label-cancel");
    }
    else
    {
      this.cancel_btn.textContent = "Cancel";
    }
  
    this.ok_btn.addEventListener("click", this.On_Click_OK_Btn);
    this.cancel_btn.addEventListener("click", this.On_Click_Cancel_Btn);
  }
}

Utils.Register_Element(DeDialogConfirm);
export default DeDialogConfirm;