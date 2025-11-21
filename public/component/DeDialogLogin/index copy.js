import Utils from "../../lib/Utils.js";
import DeForm from "../DeForm/index.js";

class DeDialogLogin extends DeForm
{
  static tname = "de-dialog-login";

  On_Click_New_Btn(e)
  {
    this.header.innerText = "Create Account";

    this.new_btn.hidden = true;
    this.login_panel.hidden = true;
    this.create_panel.hidden = true;
    this.forgot_panel.hidden = true;

    // Ensure password field is visible
    this.pwd_field.hidden = false;
    this.pwd_field.style.display = "flex";
    
    this.pwd2_label.hidden = false;
    this.pwd2.hidden = false;
    this.save_panel.hidden = false;

    this.email.focus();
  }

  On_Click_Forgot_Btn(e)
  {
    this.header.innerText = "Password Recovery";

    this.new_btn.hidden = true;
    this.login_panel.hidden = true;
    this.create_panel.hidden = true;
    this.forgot_panel.hidden = true;

    // Force hide password field with both hidden attribute and style
    this.pwd_field.hidden = true;
    this.pwd_field.style.display = "none";
    
    this.pwd2_label.hidden = true;
    this.pwd2.hidden = true;
    this.save_panel.hidden = true;

    this.recover_panel.hidden = false;

    this.email.focus();
  }

  On_Click_Save_Btn()
  {
    this.Show_Loading("save", true);
    this.Hide_Error();
    this.Complete_Action("new");
  }

  On_Click_Recover_Btn()
  {
    this.Show_Loading("recover", true);
    this.Hide_Error();
    this.Complete_Action("recover");
  }

  On_Click_Login_Btn()
  {
    this.Show_Loading("login", true);
    this.Hide_Error();
    this.Complete_Action("login");
  }

  On_Click_Cancel_Btn()
  {
    this.Close("cancel");
  }

  Complete_Action(action)
  {
    // Don't close the dialog yet - just resolve with the action
    // The dialog will remain open with spinner until p4p.js handles the result
    if (this.resolve)
    {
      const currentResolve = this.resolve;
      this.resolve = null; // Clear to prevent multiple calls
      currentResolve(action);
    }
  }

  Reset_For_Retry()
  {
    // Called by p4p.js when an error occurs and we want to allow retry
    this.Reset_Loading();
    // Just hide the error - don't reset the dialog mode
    // Create a new promise for the next action
    const promise = new Promise((resolve, reject) =>
    {
      this.resolve = resolve;
      this.reject = reject;
    });
    return promise;
  }

  Force_Close()
  {
    // This method can be called by p4p.js to force close the dialog
    this.dlg.close();
    this.classList.remove("hydrated");
    this.Reset_Loading();
  }

  Reset_Loading()
  {
    this.Show_Loading("login", false);
    this.Show_Loading("save", false);
    this.Show_Loading("recover", false);
  }

  Close(action)
  {
    this.dlg.close();
    this.classList.remove("hydrated");
    this.Reset_Loading();
    if (this.resolve)
    {
      this.resolve(action);
    }  
  }

  Show_Loading(button_type, show)
  {
    if (button_type === "login")
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
    else if (button_type === "save")
    {
      if (show)
      {
        this.save_btn_text.hidden = true;
        this.save_btn_spinner.hidden = false;
        this.save_btn.disabled = true;
      }
      else
      {
        this.save_btn_text.hidden = false;
        this.save_btn_spinner.hidden = true;
        this.save_btn.disabled = false;
      }
    }
    else if (button_type === "recover")
    {
      if (show)
      {
        this.recover_btn_text.hidden = true;
        this.recover_btn_spinner.hidden = false;
        this.recover_btn.disabled = true;
      }
      else
      {
        this.recover_btn_text.hidden = false;
        this.recover_btn_spinner.hidden = true;
        this.recover_btn.disabled = false;
      }
    }
  }

  Show_Error(message)
  {
    this.error_span.textContent = message;
    this.error_span.style.display = "block";
    this.error_span.style.margin = "10px 0";
    this.error_span.hidden = false;
  }

  Hide_Error()
  {
    this.error_span.style.display = "none";
    this.error_span.style.margin = "0";
    this.error_span.hidden = true;
  }

  Show()
  {
    this.header.innerText = "Login";

    // Ensure password field is visible in login mode
    this.pwd_field.hidden = false;
    this.pwd_field.style.display = "flex";
    
    this.pwd2_label.hidden = true;
    this.pwd2.hidden = true;
    this.save_panel.hidden = true;
    this.recover_panel.hidden = true;

    this.new_btn.hidden = false;
    this.login_panel.hidden = false;
    this.create_panel.hidden = false;
    this.forgot_panel.hidden = false;

    this.Reset_Loading();
    this.Hide_Error();

    this.classList.add("hydrated");
    this.value = null;

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
          <header cid="header"></header>
          <main>

            <field>
              <label for="login_email">E-mail</label>
              <input cid="email" id="login_email" type="email" name="email">
            </field>

            <field cid="pwd_field">
              <label for="login_pwd">Password</label>
              <input cid="pwd" id="login_pwd" type="password" name="pwd">
            </field>

            <field>
              <span cid="pwd2_label" hidden><label for="login_pwd2">Re-enter password</label></span>
              <span cid="pwd2" hidden><input id="login_pwd2" type="password"></span>
            </field>

            <span cid="error_span" hidden style="color: var(--tangerine); font-size: 0.9rem; margin: 0; display: none; background: rgba(255, 104, 29, 0.1); border: 1px solid var(--tangerine); border-radius: 4px; padding: 10px; text-align: center;"></span>

          </main>
          <footer>
            
            <span cid="save_panel" hidden>
              <button cid="save_btn" type="button">
                <span cid="save_btn_text">Create</span>
                <img cid="save_btn_spinner" src="image/progress.svg" hidden style="width: 16px; height: 16px; animation: spin 1s linear infinite;">
              </button>
            </span>
            
            <span cid="recover_panel" hidden>
              <button cid="recover_btn" type="button">
                <span cid="recover_btn_text">Recover</span>
                <img cid="recover_btn_spinner" src="image/progress.svg" hidden style="width: 16px; height: 16px; animation: spin 1s linear infinite;">
              </button>
            </span>
            
            <div cid="login_panel">
              <button cid="login_btn" type="button">
                <span cid="login_btn_text" class="text">Login</span>
                <img cid="login_btn_spinner" src="image/progress.svg" hidden style="width: 16px; height: 16px; animation: spin 1s linear infinite;">
              </button>
            </div>
            
            <button cid="cancel_btn" type="button">
              <span class="text">Cancel</span>
            </button>

            <span cid="create_panel">
              Or<br>
              <a cid="new_btn">Create a New Account</a>
            </span>

            <span cid="forgot_panel">
              <a cid="forgot_btn">Forgot Password</a>
            </span>
            
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

    this.new_btn.addEventListener("click", this.On_Click_New_Btn);
    this.forgot_btn.addEventListener("click", this.On_Click_Forgot_Btn);
    this.save_btn.addEventListener("click", this.On_Click_Save_Btn);
    this.recover_btn.addEventListener("click", this.On_Click_Recover_Btn);
    this.login_btn.addEventListener("click", this.On_Click_Login_Btn);
    this.cancel_btn.addEventListener("click", this.On_Click_Cancel_Btn);
  }
}

Utils.Register_Element(DeDialogLogin);
export default DeDialogLogin;