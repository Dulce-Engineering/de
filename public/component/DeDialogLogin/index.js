import Utils from "../../lib/Utils.js";
import DeForm from "../DeForm/index.js";
import "../DeInputPassword/index.js";

class DeDialogLogin extends DeForm
{
  static tname = "de-dialog-login";

  On_Click_Login_Btn()
  {
    if (this.resolve)
    {
      this.resolve(true);
    }
    else
    {
      this.dispatchEvent(new Event("login"));
    }
  }

  On_Click_New_Btn()
  {
    if (this.resolve)
    {
      this.resolve(false);
    }  
    else
    {
      this.dispatchEvent(new Event("createaccount"));
    }
  }

  On_Click_Cancel_Btn()
  {
    if (this.resolve)
    {
      this.resolve(false);
    }  
    else
    {
      this.dispatchEvent(new Event("cancel"));
    }
  }

  On_Click_Forgot_Btn()
  {
    this.dispatchEvent(new Event("forgot"));
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
      this.login_btn_spinner.classList.remove("hidden");
      this.login_btn.disabled = true;
    }
    else
    {
      this.login_btn_text.hidden = false;
      this.login_btn_spinner.classList.add("hidden");
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

  HTML_Form()
  {
    const html = `
      <dialog id="${this.id}_login_dlg" cid="dlg">
        <form method="dialog">
          <header cid="header">Login to your account</header>

          <main>
            <field>
              <label for="login_email">Email</label>
              <input cid="email" id="login_email" type="email" name="email">
            </field>
            <field>
              <label for="login_pwd">Password</label>
              <de-input-password cid="pwd" id="login_pwd" name="pwd"></de-input-password>
              <span cid="forgot_password">Forgot Password</span>
            </field>
            <span cid="error_span" hidden></span>
          </main>

          <footer>

            <button cid="login_btn" type="button">
              <span cid="login_btn_text" class="text">Login</span>
              <svg cid="login_btn_spinner" class="waiting hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                <path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q17 0 28.5 11.5T520-840q0 17-11.5 28.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-17 11.5-28.5T840-520q17 0 28.5 11.5T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Z"/>
              </svg>
            </button>

            <button cid="new_btn" type="button" command="close" commandfor="${this.id}_login_dlg">
              <span class="text">Create Account</span>
            </button>

            <button cid="cancel_btn" type="button" command="close" commandfor="${this.id}_login_dlg">
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
    this.new_btn.addEventListener("click", this.On_Click_New_Btn);
    this.cancel_btn.addEventListener("click", this.On_Click_Cancel_Btn);
    this.forgot_password.addEventListener("click", this.On_Click_Forgot_Btn);
  }
}

Utils.Register_Element(DeDialogLogin);
export default DeDialogLogin;