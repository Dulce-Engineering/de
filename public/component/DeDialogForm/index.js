import Utils from "../../lib/Utils.js";

/**
 * A custom dialog form component that extends HTMLElement.
 * This component provides a modal dialog with form fields, allowing users to input data
 * and submit or cancel the form. It supports asynchronous operations and custom event handling.
 *
 * @class DeDialogForm
 * @extends HTMLElement
 *
 * @property {Object} value - Gets or sets the form data as an object. Setting this populates the form inputs,
 *                            and getting it collects the current input values into an object.
 *
 * @attribute {string} label-ok - Custom label for the OK button. Defaults to "OK".
 * @attribute {string} label-cancel - Custom label for the Cancel button. Defaults to "Cancel".
 * @attribute {string} label-clr - Custom label for the Clear button. Defaults to "Clear".
 * @attribute {boolean} hide-clr - If present, hides the Clear button.
 *
 * @fires ok - Emitted when the OK button is clicked and no promise resolver is set.
 *             Event detail: none (standard Event).
 *
 * @example
 * <de-dialog-form label-ok="Submit" label-cancel="Close">
 *   <div slot="header">Form Title</div>
 *   <div slot="fields">
 *     <input name="name" type="text" placeholder="Name">
 *     <input name="email" type="email" placeholder="Email">
 *   </div>
 * </de-dialog-form>
 */
class DeDialogForm extends HTMLElement
{
  static tname = "de-dialog-form";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  // properties ====================================================================

  set value(obj)
  {
    this.obj = obj;
    this.Set_Inputs();
  }

  get value()
  {
    const obj = this.Set_Obj(this.obj);
    return obj;
  }

  // internal methods ==============================================================

  Set_Obj(obj)
  {
    const input_elements = this.main_elem.querySelectorAll("[name]");
    for (const input_elem of input_elements)
    {
      const field_name = input_elem.getAttribute("name");
      if (!obj)
      {
        obj = {};
      }

      const input_type = input_elem.getAttribute("type");
      if (input_type == "radio")
      {
        if (input_elem.checked)
        {
          obj[field_name] = input_elem.value;
        }
      }
      else if (!Utils.isEmpty(input_elem.value))
      {
        if (input_type == "number")
        {
          obj[field_name] = input_elem.valueAsNumber;
        }
        else if (input_type == "date")
        {
          const date_only = Utils.toDateOnly(input_elem.value);
          obj[field_name] = date_only.getTime();
        }
        else if (input_type == "datetime-local")
        {
          const date = new Date(input_elem.value);
          obj[field_name] = date.getTime();
        }
        else
        {
          obj[field_name] = input_elem.value;
        }
      }
      else if (input_elem.tagName != "DETAILS")
      {
        obj[field_name] = null;
      }
    }

    return obj;
  }

  Set_Inputs()
  {
    const input_elements = this.querySelectorAll("[name]");
    for (const input_elem of input_elements)
    {
      const field_name = input_elem.getAttribute("name");
      const field_val = this.obj ? this.obj[field_name] : null;
      const input_type = input_elem.getAttribute("type");

      if (input_type == "radio")
      {
        input_elem.checked = input_elem.value == field_val;
      }
      else if (input_type == "date" && field_val)
      {
        const date = new Date(field_val);
        const date_str = Utils.toDateStr(date);
        input_elem.value = date_str;
      }
      else if (input_type == "datetime-local" && field_val)
      {
        const date_str = 
          Utils.Millis_To_ISO_String(field_val).substring(0, 16);
        input_elem.value = date_str;
      }
      else
      {
        input_elem.value = field_val;
      }
    }
  }

  // events ========================================================================

  On_KeyDown(event)
  {
    if (event.keyCode == 13)
    {
      event.preventDefault();
      this.ok_btn.click();
    }
  }

  On_Click_Cancel_Btn()
  {
    if (this.resolve)
    {
      this.resolve(null);
    }
  }

  On_Click_OK_Btn()
  {
    if (this.resolve)
    {
      this.resolve(this.value);
    }
    else
    {
      const event = new Event("ok");
      this.dispatchEvent(event);
    }
  }

  // public methods ================================================================

  /**
   * Closes the modal dialog and removes the 'hydrated' class.
   * @public
   */
  Close()
  {
    this.dlg.close();
    this.classList.remove("hydrated");
  }

  /**
   * Shows the modal dialog without any initial value or promise handling.
   * @public
   */
  Show_Modal()
  {
    this.classList.add("hydrated");
    this.resolve = null;
    this.reject = null;
    this.dlg.showModal();
  }

  /**
   * Shows the modal dialog asynchronously, setting an initial value and returning a promise
   * that resolves with the form data when OK is clicked or null when canceled.
   * @public
   * @param {Object} value - The initial form data object.
   * @returns {Promise<Object|null>} A promise that resolves to the form data or null.
   */
  Show_Async(value)
  {
    this.classList.add("hydrated");
    this.value = value;

    const promise = new Promise((resolve, reject) =>
    {
      this.resolve = resolve;
      this.reject = reject;
    });
    this.dlg.showModal();

    return promise;
  }

  // rendering =====================================================================

  HTML_Form()
  {
    const html = `
      <form method="dialog">
        <header>
          <slot name="header"></slot>
        </header>
        <main cid="main_elem">
          <slot name="fields"></slot>
        </main>
        <footer>
          <slot name="footer"></slot>
          <button cid="ok_btn" type="submit"><span class="text">OK</span></button>
          <button cid="clr_btn" type="reset"><span class="text">Clear</span></button>
          <button cid="cancel_btn" type="submit"><span class="text">Cancel</span></button>
        </footer>
      </form>
    `;
    return html;
  }

  Render()
  {
    const html = `
      <dialog cid="dlg">
        ${this.HTML_Form()}
      </dialog>
    `;
    //const elems = Utils.To_Document(html, this);
    const elems = Utils.toDocument(html, this);
    this.replaceChildren(elems);
    Utils.Set_Id_Shortcuts(this, this, "cid");

    if (this.hasAttribute("label-ok"))
    {
      this.ok_btn.textContent = this.getAttribute("label-ok");
    }
    if (this.hasAttribute("label-cancel"))
    {
      this.cancel_btn.textContent = this.getAttribute("label-cancel");
    }
    if (this.hasAttribute("label-clr"))
    {
      this.clr_btn.textContent = this.getAttribute("label-clr");
    }
    if (this.hasAttribute("hide-clr"))
    {
      this.clr_btn.hidden = true;
    }

    //this.addEventListener("keydown", this.On_KeyDown);
    this.ok_btn.addEventListener("click", this.On_Click_OK_Btn);
    this.cancel_btn.addEventListener("click", this.On_Click_Cancel_Btn);
  }
}

Utils.Register_Element(DeDialogForm);
export default DeDialogForm;