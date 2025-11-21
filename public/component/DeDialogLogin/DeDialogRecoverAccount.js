import Utils from "../../lib/Utils.js";
import DeForm from "../DeForm/index.js";

class DeDialogRecoverAccount extends DeForm
{
  static tname = "de-dialog-recover-account";

  On_Click_Login_Btn()
  {
    if (this.resolve)
    {
      this.resolve({ok: true, dlg: this});
    }  
  }

  On_Click_Cancel_Btn()
  {
    if (this.resolve)
    {
      this.resolve({ok: false, dlg: this});
    }  
  }

  Close()
  {
    this.Hide_Error();
    this.value = null;
    this.dlg.close();
  }

  Show_Loading(show)
  {
    if (show)
    {
      this.login_btn_text.hidden = true;
      this.login_btn_spinner.hidden = false;
      this.login_btn.disabled = true;
    }
    else
    {
      this.login_btn_text.hidden = false;
      this.login_btn_spinner.hidden = true;
      this.login_btn.disabled = false;
    }
  }

  Show_Error(message)
  {
    this.error_span.textContent = message;
    this.error_span.hidden = false;
  }

  Hide_Error()
  {
    this.error_span.hidden = true;
  }

  static Show()
  {
    let recover_acc_elem = document.querySelector("de-dialog-recover-account#recover_acc_elem");
    if (!recover_acc_elem)
    {
      recover_acc_elem = new DeDialogRecoverAccount();
      recover_acc_elem.id = "recover_acc_elem";
      document.body.appendChild(recover_acc_elem);
    }
    return recover_acc_elem.Show();
  }

  Show()
  {
    const promise = new Promise((resolve, reject) =>
    {
      this.resolve = resolve;
      this.reject = reject;
    });
    this.dlg.showModal();

    return promise;
  }

  HTML_Form()
  {
    const html = `
      <dialog cid="dlg">
        <form method="dialog">
          <header cid="header">Password Recovery</header>

          <main>
            <field>
              <label for="login_email">E-mail</label>
              <input cid="email" id="login_email" type="email" name="email" autocomplete="new-email">
            </field>
            <span cid="error_span" hidden></span>
          </main>

          <footer>
            <button cid="login_btn" type="button">
              <span cid="login_btn_text" class="text">Recover</span>
              <img cid="login_btn_spinner" src="image/progress.svg" hidden style="width: 16px; height: 16px; animation: spin 1s linear infinite;">
            </button>
            <button cid="cancel_btn" type="button">
              <span class="text">Cancel</span>
            </button>
          </footer>
        </form>

      </dialog>
    `;
    return html;
  }

  Render()
  {
    const html = this.HTML_Form();
    const elems = Utils.To_Document(html, this);
    this.replaceChildren(elems);
    Utils.Set_Id_Shortcuts(this, this, "cid");

    if (this.hasAttribute("label-ok"))
    {
      this.login_btn.textContent = this.getAttribute("label-ok");
    }
    if (this.hasAttribute("label-cancel"))
    {
      this.cancel_btn.textContent = this.getAttribute("label-cancel");
    }

    this.login_btn.addEventListener("click", this.On_Click_Login_Btn);
    this.cancel_btn.addEventListener("click", this.On_Click_Cancel_Btn);
  }
}

Utils.Register_Element(DeDialogRecoverAccount);
export default DeDialogRecoverAccount;