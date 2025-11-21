import Utils from "../../lib/Utils.js";

class DeInputRefNo extends HTMLElement
{
  static tname = "de-input-refno";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  get value()
  {
    return this.input_elem.value;
  }

  set value(value)
  {
    this.input_elem.value = value;
  }

  // Prevent non-numeric characters on keypress
  On_Keypress(event) 
  {
      const char = String.fromCharCode(event.charCode);
      if (!/^\d$/.test(char) && event.charCode !== 0) 
      { // Allow digits and control keys (like backspace, arrows)
          event.preventDefault();
      }
  }

  // Clean up on input (for paste, drag-and-drop, autofill)
  On_Input(event) 
  {
      const oldValue = this.input_elem.value;
      const newValue = oldValue.replace(/\D/g, ''); // Remove any non-digit characters

      if (oldValue !== newValue) {
          this.input_elem.value = newValue;
          // Optionally restore cursor position if needed, but for simple cleanup it's often not critical
      }
  }

  // Prevent non-numeric pasting
  On_Paste(event) 
  {
      const clipboardData = event.clipboardData || window.clipboardData;
      const pastedText = clipboardData.getData('text');
      const numericText = pastedText.replace(/\D/g, ''); // Filter out non-digits

      if (numericText !== pastedText) { // If non-numeric characters were present
          event.preventDefault();
          // Manually insert the cleaned numeric text
          const start = this.input_elem.selectionStart;
          const end = this.input_elem.selectionEnd;
          const currentValue = this.input_elem.value;

          this.input_elem.value = currentValue.substring(0, start) + numericText + currentValue.substring(end);

          // Restore cursor position
          this.input_elem.selectionStart = this.input_elem.selectionEnd = start + numericText.length;

          // Manually dispatch an input event to notify any listeners that the value changed
          this.dispatchEvent(new Event('input', { bubbles: true }));
      }
  }

  Render()
  {
    const html = `
      <input type="text" cid="input_elem" inputmode="numeric" pattern="[0-9]*">
    `;
    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    const maxlength = this.getAttribute('maxlength');
    this.input_elem.setAttribute('maxlength', maxlength);
    const minlength = this.getAttribute('minlength');
    this.input_elem.setAttribute('minlength', minlength);

    this.input_elem.addEventListener("keypress", this.On_Keypress);
    this.input_elem.addEventListener("input", this.On_Input);
    this.input_elem.addEventListener("paste", this.On_Paste);
  }
}

Utils.Register_Element(DeInputRefNo);
export default DeInputRefNo;