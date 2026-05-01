import Utils from "../../lib/Utils.js";

/**
 * A custom range slider element with built-in value display.
 *
 * @class DeRange
 * @extends HTMLElement
 *
 * @example
 * <de-range name="volume" min="0" max="100" step="5" value="50" show-percent="1"></de-range>
 *
 * @attr {string} min - Minimum slider value. Defaults to "10".
 * @attr {string} max - Maximum slider value. Defaults to "100".
 * @attr {string} step - Slider step increment. Defaults to "10".
 * @attr {string} value - Initial slider value. Defaults to "0".
 * @attr {string} name - Name attribute for the underlying input element.
 * @attr {string} show-percent - When truthy, appends a percent sign to the displayed value and labels.
 *
 * @property {number} value - Current numeric value of the slider.
 * @property {boolean} disabled - Disable state of the slider input.
 *
 * @method Render - Builds the internal markup and wires events.
 *
 * @emits None
 */
class DeRange extends HTMLElement
{
  static tname = "de-range";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  /**
   * Set the current slider value.
   * @param {string|number} text
   */
  set value(text)
  {
    this.input_elem.value = text;
    this.On_Input();
  }

  /**
   * Get the current numeric slider value.
   * @returns {number}
   */
  get value()
  {
    return parseFloat(this.input_elem.value);
  }

  /**
   * Enable or disable the slider.
   * @param {boolean} value
   */
  set disabled(value)
  {
    this.input_elem.disabled = value;
  }

  On_Input()
  {
    this.value_elem.innerText = this.input_elem.value + (this.Show_Percent() ? '%' : '');
  }

  Show_Percent()
  {
    return parseInt(Utils.Get_Attr_Def(this, "show-percent"));
  }

  Render()
  {
    let min_val = Utils.Get_Attr_Def(this, "min", "10") + (this.Show_Percent() ? '%' : '');
    let max_val = Utils.Get_Attr_Def(this, "max", "100") + (this.Show_Percent() ? '%' : '');
    const html = `
      <div class="value-display" cid="value_elem">50</div>
      <div class="range-row">
        <span class="range-label">${min_val}</span>
        <input type="range" min="0" max="100" value="50" cid="input_elem" />
        <span class="range-label">${max_val}</span>
      </div>
    `;
    const elements = Utils.To_Document(html, this);
    this.replaceChildren(elements);
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.input_elem.addEventListener("input", this.On_Input);
    this.input_elem.max = Utils.Get_Attr_Def(this, "max", "100");
    this.input_elem.min = Utils.Get_Attr_Def(this, "min", "10");
    this.input_elem.step = Utils.Get_Attr_Def(this, "step", "10");
    //this.input_elem.name = Utils.Get_Attr_Def(this, "name");
    this.value = Utils.Get_Attr_Def(this, "value", "0");
  }
}

Utils.Register_Element(DeRange);
export default DeRange;
