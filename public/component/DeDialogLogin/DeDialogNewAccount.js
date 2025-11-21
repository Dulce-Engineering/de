import Utils from "../../lib/Utils.js";
import DeForm from "../DeForm/index.js";

class DeDialogNewAccount extends DeForm
{
  static tname = "de-dialog-new-account";

  On_Click_Create_Btn()
  {
    if (this.form_elem.reportValidity())
    {
      const passwords_match = this.pwd.value === this.pwd2.value;
      if (passwords_match)
      {
        if (this.resolve)
        {
          this.resolve({ok: true, dlg: this});
        }  
        else
        {
          this.dispatchEvent(new Event("createaccount"));
        }
      }
      else
      {
        this.Show_Error("Passwords do not match");
      }
    }
  }

  On_Click_Cancel_Btn()
  {
    if (this.resolve)
    {
      this.resolve({ok: false, dlg: this});
    }  
    else
    {
      this.dispatchEvent(new Event("cancel"));
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
      this.create_btn.disabled = true;
    }
    else
    {
      this.login_btn_text.hidden = false;
      this.login_btn_spinner.hidden = true;
      this.create_btn.disabled = false;
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
    let new_acc_elem = document.querySelector("de-dialog-new-account#new_acc_elem");
    if (!new_acc_elem)
    {
      new_acc_elem = new DeDialogNewAccount();
      new_acc_elem.id = "new_acc_elem";
      document.body.appendChild(new_acc_elem);
    }
    return new_acc_elem.Show_Async();
  }

  Show_Async()
  {
    const promise = new Promise((resolve, reject) =>
    {
      this.resolve = resolve;
      this.reject = reject;
    });
    this.dlg.showModal();

    return promise;
  }

  Show()
  {
    this.dlg.showModal();
  }

  HTML_Form_Fields()
  {
    return "";
  }

  HTML_Form()
  {
    const html = `
      <dialog id="${this.id}_create_acc_dlg" cid="dlg">
        <form cid="form_elem" method="dialog" autocomplete="off">
          <header cid="header">User Details</header>

          <main>
            <field>
              <label for="${this.id}_name">Name</label>
              <input cid="name" id="${this.id}_name" name="name" autocomplete="new-name" required>
            </field>
            
            <field>
              <label for="${this.id}_create_login_email">E-mail</label>
              <input cid="email" id="${this.id}_create_login_email" type="email" name="email" autocomplete="new-email" required>
            </field>

            <field cid="pwd_field">
              <label for="${this.id}_login_pwd">Password</label>
              <de-input-password cid="pwd" id="${this.id}_login_pwd" name="pwd" autocomplete="new-password" required></de-input-password>
            </field>

            <field cid="pwd2_field">
              <label for="${this.id}_login_pwd2">Re-enter Password</label>
              <de-input-password cid="pwd2" id="${this.id}_login_pwd2" name="pwd2" autocomplete="new-password" required></de-input-password>
            </field>

            <field cid="tnc_field" class="tnc">
              <input type="checkbox" id="${this.id}_tnc" name="tnc" required>
              <label for="${this.id}_tnc">
                I agree with the Website
                <a href="https://party4purpose.com.au/policies" target="_blank">
                  T&Cs and Privacy Policy</a>
              </label>
            </field>

            ${this.HTML_Form_Fields()}

            <span cid="error_span" hidden></span>
          </main>

          <footer>
            <button cid="create_btn" type="button">
              <span cid="login_btn_text" class="text">Save</span>
              <img cid="login_btn_spinner" src="image/progress.svg" hidden style="width: 16px; height: 16px; animation: spin 1s linear infinite;">
            </button>
            <button cid="cancel_btn" type="button" command="close" commandfor="${this.id}_create_acc_dlg">
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
      this.create_btn.textContent = this.getAttribute("label-ok");
    }
    if (this.hasAttribute("label-cancel"))
    {
      this.cancel_btn.textContent = this.getAttribute("label-cancel");
    }

    this.create_btn.addEventListener("click", this.On_Click_Create_Btn);
    this.cancel_btn.addEventListener("click", this.On_Click_Cancel_Btn);
  }
}

Utils.Register_Element(DeDialogNewAccount);
export default DeDialogNewAccount;