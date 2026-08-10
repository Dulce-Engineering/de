
import Utils from "../../../../lib/Utils.js";

/**
 * DeField is a custom element that displays a field containing a label and a value.
 * It automatically manages its visibility: hiding itself when the value is empty,
 * and showing itself when a value is provided.
 *
 * @customElement de-field
 * 
 * @attribute {string} [field-label] - The text label for the field. If provided, a colon (":") is automatically appended and the label is shown.
 * @attribute {string} [field-type] - The type of field. If set to "link", the value will be rendered inside an external link (`<a target="_blank">`).
 * @attribute {string} [hide-class] - CSS class used to hide the element (by adding/removing it) instead of toggling the inline `display` style.
 * 
 * @property {HTMLElement} label_elem - The DOM element representing the field's label (<dt>). Created dynamically by Render.
 * @property {HTMLElement} value_elem - The DOM element representing the field's value (<dd>). Created dynamically by Render.
 */
class DeField extends HTMLElement
{
  static tname = "de-field";

  constructor()
  {
    super();
    //Utils.Bind(this, "On_");
  }

  /**
   * Lifecycle callback invoked when the element is added to the document.
   * Triggers the initial rendering of the component.
   */
  connectedCallback()
  {
    this.Render();
  }

  /**
   * Sets the value of the field.
   * If the provided value is empty (null, undefined, or empty string), clears the value element and hides the field.
   * Otherwise, updates the value element (rendering it as a link if `field-type` is "link") and shows the field.
   * 
   * @param {*} obj - The value to set. Will be converted to string.
   */
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
        else if (field_type == "html")
        {
          this.value_elem.innerHTML = value_str;
        }
        else if (field_type == "phone")
        {
          this.value_elem.innerHTML = 
            `<a href="tel:${value_str}">${value_str}</a>`;
        }
        else if (field_type == "email")
        {
          this.value_elem.innerHTML = 
            `<a href="mailto:${value_str}">${value_str}</a>`;
        }
      }
      else
      {
        this.value_elem.textContent = value_str;
      }

      this.Show();
    }
  }

  /**
   * Gets the text content of the value element.
   * 
   * @returns {string} The text content of the value.
   */
  get value()
  {
    return this.value_elem.textContent;
  }
  
  /**
   * Shows the component.
   * If the `hide-class` attribute is set, removes that class from the component.
   * Otherwise, resets the inline `display` style to default.
   */
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

  /**
   * Hides the component.
   * If the `hide-class` attribute is set, adds that class to the component.
   * Otherwise, sets the inline `display` style to "none".
   */
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

  /**
   * Renders the basic DOM structure of the field, sets up shortcut references
   * to elements (like `label_elem` and `value_elem`), and configures the label
   * if `field-label` is present.
   */
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
