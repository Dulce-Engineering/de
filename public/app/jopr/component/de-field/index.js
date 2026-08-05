
import Utils from "../../../../lib/Utils.js";

class DeField extends HTMLElement
{
  static tname = "de-field";

  constructor()
  {
    super();
    //Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  set value(obj)
  {
    if (Utils.isEmpty(obj))
    {
      this.value_elem.textContent = "";
      this.Hide();
    }
    else
    {
      const value_str = obj.toString();
      if (this.hasAttribute("field-type"))
      {
        const field_type = this.getAttribute("field-type");
        if (field_type == "link")
        {
          this.value_elem.innerHTML = 
            `<a href="${value_str}" target="_blank">${value_str}</a>`;
        }
      }
      else
      {
        this.value_elem.textContent = value_str;
      }

      this.Show();
    }
  }

  get value()
  {
    return this.value_elem.textContent;
  }
  
  Show()
  {
    if (this.hasAttribute("hide-class"))
    {
      const hide_class = this.getAttribute("hide-class");
      this.classList.remove(hide_class);
    }
    else
    {
      this.style.display = null;
    }
  }

  Hide()
  {
    if (this.hasAttribute("hide-class"))
    {
      const hide_class = this.getAttribute("hide-class");
      this.classList.add(hide_class);
    }
    else
    {
      this.style.display = "none";
    }
  }

  Render()
  {
    const html = `
      <dt cid="label_elem" style="display:none;"></dt>
      <dd cid="value_elem"></dd>
    `;
    //const html_elements = Utils.To_Document(html, this);
    //this.replaceChildren(html_elements);
    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    if (this.hasAttribute("field-label"))
    {
      this.label_elem.textContent = this.getAttribute("field-label") + ":";
      this.label_elem.style.display = null;
    }
  }
}

Utils.Register_Element(DeField);
export default DeField;
