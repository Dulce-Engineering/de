import Utils from "../../lib/Utils.js?v=3";

class DeForm extends HTMLElement
{
  static tname = "de-form";

  // lifecycle ================================================================

  constructor()
  {
    super();
    Utils.Bind(this, "On_");

    this.submit_resolve = null;
    this.submit_reject = null;
  }

  connectedCallback()
  {
    this.Render();
  }

  // properties ===============================================================

  set value(obj)
  {
    this.obj = obj;
    this.Clear_Inputs();
    this.Set_Inputs();
  }

  get value()
  {
    const obj = this.Set_Obj(this.obj);
    return obj;
  }

  // attributes ===============================================================

  // label-ok
  // label-cancel
  // label-clr
  // hide-ok
  // hide-cancel
  // hide-clr
  // class-btn

  static observedAttributes = ["label-ok"];
  attributeChangedCallback(name, oldValue, newValue)
  {
    if (name == "label-ok" && this.ok_btn_label)
    {
      this.ok_btn_label.textContent = newValue;
    }
  }

  // utils ====================================================================

  Get_Elems_With_Names() 
  {
    const namedElements = [];

    function traverse(element) 
    {
      const hasName = element.hasAttribute('name');
      if (hasName) 
      {
        namedElements.push(element);
        return;
      }

      for (const child of element.childNodes) 
      {
        if (child.nodeType === 1) traverse(child);
      }
    }
    traverse(this);

    const rootHasName = this.hasAttribute('name');
    if (rootHasName) 
    {
      return [this];
    } 
    else 
    {
      return namedElements;
    }
  }

  Set_Obj(obj)
  {
    const input_elements = this.Get_Elems_With_Names();
    for (const input_elem of input_elements)
    {
      if (input_elem.tagName != "SLOT")
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
        else if (input_type == "checkbox")
        {
          obj[field_name] = input_elem.checked === true ? true : undefined;
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
        else
        {
          obj[field_name] = null;
        }
      }
    }

    return obj;
  }

  Clear_Inputs()
  {
    if (this.form_elem)
    {
      const input_elements = this.querySelectorAll("[name], input");
      for (const input_elem of input_elements)
      {
        if (input_elem.tagName == "INPUT" && input_elem.type == "radio") 
          input_elem.checked = false;
        else if (input_elem.tagName == "INPUT" && input_elem.type == "checkbox") 
          input_elem.checked = false;
        else if (input_elem.value != undefined) 
          input_elem.value = null;
      }
    }
  }

  Set_Inputs()
  {
    if (this.obj)
    {
      const input_elements = this.querySelectorAll("[name], input");
      for (const input_elem of input_elements)
      {
        const field_name = input_elem.getAttribute("name");
        const field_val = this.obj ? this.obj[field_name] : null;
        const input_type = input_elem.type;

        if (input_type == "radio")
        {
          input_elem.checked = input_elem.value == field_val;
        }
        else if (input_type == "checkbox")
        {
          input_elem.checked = field_val;
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
        else if (input_type == "file")
        {
          // nop;
        }
        else if (input_elem.value !== undefined)
        {
          input_elem.value = field_val || null;
        }
      }
    }
  }

  Submit(value)
  {
    //this.classList.add("hydrated");
    this.value = value;

    const promise = new Promise((resolve, reject) =>
    {
      this.submit_resolve = resolve;
      this.submit_reject = reject;
    });

    return promise;
  }

  Resolve(value, event_name)
  {
    if (this.submit_resolve)
    {
      this.submit_resolve(value);

      this.submit_resolve = null;
      this.submit_reject = null;
    }
    else
    {
      this.dispatchEvent(new Event(event_name));
    }
  }

  // events ===================================================================

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
    this.Resolve(null, "cancel");
  }

  On_Click_OK_Btn(event)
  {
    this.On_Before_Report_Validity();
    //event.preventDefault();
    if (this.form_elem.reportValidity())
    {
      this.Resolve(this.value, "ok");
    }
  }

  On_Before_Report_Validity()
  {

  }

  // rendering ================================================================

  HTML_Close()
  {
    return "";
  }

  HTML_Form()
  {
    const html = `
      <form cid="form_elem" method="dialog" novalidate>
        <header>
          <slot name="header"></slot>
          ${this.HTML_Close()}
        </header>
        <main>
          <slot name="fields"></slot>
        </main>
        <footer>
          <slot name="footer"></slot>

          <button cid="ok_btn" type="button">
            <span cid="ok_btn_label" class="text">OK</span>
            <!--img cid="prog_img" src="image/progress.svg" hidden-->
          </button>

          <button cid="clr_btn" type="reset">
            <span cid="clr_btn_label" class="text">Clear</span>
          </button>

          <button cid="cancel_btn" type="button">
            <span cid="cancel_btn_label" class="text">Cancel</span>
          </button>

        </footer>
      </form>
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
      this.ok_btn_label.textContent = this.getAttribute("label-ok");
    }
    if (this.hasAttribute("label-cancel"))
    {
      this.cancel_btn_label.textContent = this.getAttribute("label-cancel");
    }
    if (this.hasAttribute("label-clr"))
    {
      this.clr_btn_label.textContent = this.getAttribute("label-clr");
    }
    if (this.hasAttribute("hide-clr"))
    {
      this.clr_btn.style.display = "none";
    }
    if (this.hasAttribute("hide-cancel"))
    {
      this.cancel_btn.style.display = "none";
    }
    if (this.hasAttribute("hide-ok"))
    {
      this.ok_btn.style.display = "none";
    }
    if (this.hasAttribute("class-btn"))
    {
      this.ok_btn.classList.add(this.getAttribute("class-btn"));
      this.cancel_btn.classList.add(this.getAttribute("class-btn"));
      this.clr_btn.classList.add(this.getAttribute("class-btn"));
    }

    //this.addEventListener("keydown", this.On_KeyDown);
    this.ok_btn.addEventListener("click", this.On_Click_OK_Btn);
    this.cancel_btn.addEventListener("click", this.On_Click_Cancel_Btn);
  }
}

Utils.Register_Element(DeForm);
export default DeForm;
 