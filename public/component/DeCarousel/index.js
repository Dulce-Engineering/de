import Utils from "../Utils.js";

class DeCarousel extends HTMLElement
{
  static tname = "de-carousel";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  showModal()
  {
    this.dlg_elem.showModal();
  }

  On_Click_Next()
  {
    let vis_idx = 0;
    const elems = this.item_elems.children;
    for (let i = 0; i < elems.length; i++)
    {
      const elem = elems[i];
      if (!elem.hidden)
      {
        vis_idx = i;
      }
      elem.hidden = true;
    }

    vis_idx = (vis_idx + 1) % elems.length;

    elems[vis_idx].hidden = false;
  }

  On_Click_Close()
  {
    this.dlg_elem.close();
  }

  Render()
  {
    const html = `
      <dialog cid="dlg_elem">
        <div cid="item_elems">
          <slot name="items"></slot>
        </div>
        <footer>
          <button cid="next_btn">Next</button>
          <button cid="close_btn">Close</button>
        </footer>
      </dialog>
    `;
    const template = Utils.To_Template(html, this);
    this.replaceChildren(template.content);
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.next_btn.addEventListener("click", this.On_Click_Next);
    this.close_btn.addEventListener("click", this.On_Click_Close);
  }
}

Utils.Register_Element(DeCarousel);
export default DeCarousel;
