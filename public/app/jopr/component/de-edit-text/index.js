import Utils from "../../../../lib/Utils.js";

/**
 * Data structure representing the editable value object.
 * @typedef {Object} EditTextValue
 * @property {string} text - The current or edited text content.
 * @property {string} [original_text] - Optional original reference text to display in the edit dialog.
 */

/**
 * DeEditText is an inline editable text Web Component.
 * It renders a text span accompanied by an edit icon button. Clicking the button
 * opens a popover dialog containing an input field (or textarea) and optional original
 * reference text. When confirmed, it updates the display and dispatches a 'change' event.
 *
 * @customElement de-edit-text
 * 
 * @attribute {'text'|'textarea'} [input-type="text"] - Specifies the input control type inside the dialog ('text' or 'textarea').
 * 
 * @property {HTMLSpanElement} text_elem - The DOM element displaying the current text.
 * @property {HTMLButtonElement} edit_btn - The button element that opens the edit dialog.
 * @property {HTMLDivElement} orig_field_elem - Container element for displaying the original reference text.
 * @property {HTMLSpanElement} orig_elem - The DOM element holding the original reference text.
 * @property {HTMLInputElement|HTMLTextAreaElement} input_elem - The text input or textarea element inside the dialog.
 * @property {HTMLButtonElement} ok_btn - The dialog confirmation button.
 * @property {HTMLButtonElement} cancel_btn - The dialog cancellation button.
 * @property {EditTextValue|null} original_value - Stored reference to the value object.
 * 
 * @fires Event#change - Dispatched when the text edit is confirmed via the OK button.
 */
class DeEditText extends HTMLElement
{
  static tname = "de-edit-text";

  /**
   * Initializes the DeEditText instance and binds event handler methods prefixed with 'On_'.
   */
  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  /**
   * Lifecycle callback invoked when the element is added to the document.
   * Triggers the initial rendering of the component template and event bindings.
   */
  connectedCallback()
  {
    this.Render();
  }

  /**
   * Sets the text and optional original reference text from an object.
   * If `original_text` is empty, hides the original text preview field.
   * 
   * @param {EditTextValue} data - Object containing `text` and optional `original_text`.
   */
  set value(data)
  {
    this.original_value = data;

    this.text_elem.textContent = data?.text;

    if (Utils.Is_Empty(data?.original_text))
    {
      this.orig_field_elem.style.display = "none";
    }
    else
    {
      this.orig_field_elem.style.display = null;
    }
    this.orig_elem.textContent = data.original_text;
  }

  /**
   * Gets the updated value object with the latest text from the input element.
   * 
   * @returns {EditTextValue} The value object with updated `text`.
   */
  get value()
  {
    this.original_value.text = this.input_elem.value;
    return this.original_value;
  }

  /**
   * Event handler called when the edit button is clicked.
   * Pre-fills the input element's value with the current displayed text before the dialog opens.
   */
  On_Click_Edit_Btn()
  {
    this.input_elem.value = this.text_elem.textContent;
  }

  /**
   * Event handler called when the OK button is clicked in the dialog.
   * Updates the displayed text content with the input value and dispatches a 'change' event.
   */
  On_Click_Ok_Btn()
  {
    this.text_elem.textContent = this.input_elem.value;
    this.dispatchEvent(new Event("change"));
  }

  /**
   * Renders the component HTML structure, configures input type based on `input-type` attribute,
   * sets up DOM element shortcuts using `cid`, and attaches event listeners.
   */
  Render()
  {
    let input_html = "<input type=\"text\" cid=\"input_elem\">";
    if (this.hasAttribute("input-type"))
    {
      const input_type = this.getAttribute("input-type");
      if (input_type == "textarea")
      {
        input_html = "<textarea cid=\"input_elem\"></textarea>";
      }
    }

    const dlg_id = "de_edit_text_dlg_" + crypto.randomUUID();
    const html = `
      <span cid="text_elem"></span>
      <button cid="edit_btn" type="button" popovertarget="${dlg_id}" class="img-btn">
        <img src="/app/jopr/image/black/edit.svg">
      </button>
      <dialog id="${dlg_id}" popover>
        <header>Change Text</header>
        <main>
          <div cid="orig_field_elem">
            Original Text: <span cid="orig_elem"></span>
          </div>
          ${input_html}
        </main>
        <footer>
          <button cid="ok_btn" popovertarget="${dlg_id}" popovertargetaction="hide">OK</button>
          <button cid="cancel_btn" popovertarget="${dlg_id}" popovertargetaction="hide">Cancel</button>
        </footer>
      </dialog>
    `;
    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.edit_btn.addEventListener("click", this.On_Click_Edit_Btn);
    this.ok_btn.addEventListener("click", this.On_Click_Ok_Btn);
  }
}

Utils.Register_Element(DeEditText);
export default DeEditText;