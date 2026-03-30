import Utils from "../../lib/Utils.js";

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

  Set_Obj(obj)
  {
    const input_elems = this.querySelectorAll("[name]");
    for (const input_elem of input_elems)
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
        obj[field_name] = input_elem.value;
      }
      else
      {
        obj[field_name] = null;
      }
    }

    return obj;
  }

  Set_Inputs()
  {
    const input_elems = this.querySelectorAll("[name]");
    for (const input_elem of input_elems)
    {
      const field_name = input_elem.getAttribute("name");
      const field_val = this.obj ? this.obj[field_name] : null;
      const input_type = input_elem.getAttribute("type");

      if (input_type == "radio")
      {
        input_elem.checked = input_elem.value == field_val;
      }
      else
      {
        input_elem.value = field_val;
      }
    }
  }

  On_KeyDown(event)
  {
    if (event.keyCode == 13)
    {
      event.preventDefault();
      this.save_btn.click();
    }
  }

  On_Click_Cancel_Btn()
  {
    if (this.resolve)
    {
      this.resolve(null);
    }
  }

  On_Click_Save_Btn()
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

  Close()
  {
    this.dlg.close();
    this.classList.remove("hydrated");
  }

  Show_Modal()
  {
    this.classList.add("hydrated");
    this.resolve = null;
    this.reject = null;
    this.dlg.showModal();
  }

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

  Render()
  {
    const html = `
      <dialog cid="dlg">
        <form method="dialog">
          <header>
            <slot name="header"></slot>
          </header>
          <main>
            <slot name="fields"></slot>
          </main>
          <footer>
            <button cid="save_btn" type="submit">OK</button>
            <button cid="clr_btn" type="reset">Clear</button>
            <button cid="cancel_btn" type="submit">Cancel</button>
          </footer>
        </form>
      </dialog>
    `;
    const elems = Utils.toDocument(html, this);
    this.replaceChildren(elems);
    Utils.Set_Id_Shortcuts(this, this, "cid");

    //this.addEventListener("keydown", this.On_KeyDown);
    this.save_btn.addEventListener("click", this.On_Click_Save_Btn);
    this.cancel_btn.addEventListener("click", this.On_Click_Cancel_Btn);
  }
}

Utils.Register_Element(DeDialogForm);
export default DeDialogForm;