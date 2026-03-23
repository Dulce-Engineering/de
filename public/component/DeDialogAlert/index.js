import Utils from "../../lib/Utils.js";

/**
 * DeDialogAlert is a custom HTML element that displays an alert dialog box.
 * It provides a simple modal dialog with a message and an OK button.
 * 
 * @class DeDialogAlert
 * @extends HTMLElement
 * @slot {HTMLElement} header - The dialog header content (optional)
 * @slot {HTMLElement} body - The dialog body/message content (optional)
 * @attr {string} label-ok - Custom label for the OK button (default: "OK")
 * @example
 * <de-dialog-alert label-ok="Accept">
 *   <h2 slot="header">Alert Title</h2>
 *   <p slot="body">Alert message content</p>
 * </de-dialog-alert>
 */
class DeDialogAlert extends HTMLElement
{
  static tname = "de-dialog-alert";

  /**
   * Creates a new DeDialogAlert instance.
   * Initializes the component and binds event handlers.
   */
  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  // methods ======================================================================

  /**
   * Shows the alert dialog.
   * This is an alias for the Alert() method.
   */
  Show()
  {
    this.Alert();
  }

  /**
   * Displays an alert dialog with the specified message.
   * If no message is provided, displays the content from the slot.
   * 
   * @param {string} [msg] - Optional message to display in the alert
   */
  Alert(msg)
  {
    if (msg)
    {
      this.main_elem.innerText = msg;
    }
    this.dlg.showModal();
  }

  // events =======================================================================

  /**
   * Handles the click event for the OK button.
   * Closes the dialog when the OK button is clicked.
   * @private
   */
  On_Click_OK_Btn()
  {
    this.dlg.close();
  }

  // rendering ====================================================================

  /**
   * Renders the dialog component's HTML structure.
   * Creates the dialog element with slots for header and body content,
   * sets up the OK button, and attaches event listeners.
   * @private
   */
  Render()
  {
    const html = `
      <dialog cid="dlg">
        <header>
          <slot name="header"></slot>
        </header>
        <main cid="main_elem">
          <slot name="body"></slot>
        </main>
        <footer>
          <button cid="ok_btn">OK</button>
        </footer>
      </dialog>
    `;
    const elems = Utils.toDocument(html, this);
    this.replaceChildren(elems);
    Utils.Set_Id_Shortcuts(this, this, "cid");

    if (this.hasAttribute("label-ok"))
    {
      this.ok_btn.textContent = this.getAttribute("label-ok");
    }
  
    this.ok_btn.addEventListener("click", this.On_Click_OK_Btn);
  }
}

Utils.Register_Element(DeDialogAlert);
export default DeDialogAlert;