import Utils from "../../../../lib/Utils.js";

class DeEditText extends HTMLElement
{
  static tname = "de-edit-text";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  set value(data)
  {
    this.original_value = data;
    this.text_elem.textContent = data.text;
    this.orig_elem.textContent = data.original_text
  }

  get value()
  {
    this.original_value.text = this.input_elem.value;
    return this.original_value;
  }

  On_Click_Edit_Btn()
  {
    this.input_elem.value = this.text_elem.textContent;
  }

  On_Click_Ok_Btn()
  {
    this.text_elem.textContent = this.input_elem.value;
    this.dispatchEvent(new Event("change"));
  }

  Render()
  {
    const dlg_id = "de_edit_text_dlg_" + crypto.randomUUID();
    const html = `
      <span cid="text_elem"></span>
      <button cid="edit_btn" type="button" popovertarget="${dlg_id}" class="img-btn">
        <img src="image/black/edit.svg">
      </button>
      <dialog id="${dlg_id}" popover>
        <header>Change Text</header>
        <main>
          <div>Original Text: <span cid="orig_elem"></span></div>
          <input type="text" cid="input_elem">
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