import Utils from "../../../../lib/Utils.js";

class DeToolbarMenu extends HTMLElement
{
  static tname = "de-toolbar-menu";

  singular_title = null;
  plural_title = null;
  event_data = null;

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  /*set value(obj)
  {
  }

  get value()
  {
  }
  
  static observedAttributes = 
  [
    "attribute-name"
  ];
  attributeChangedCallback(name, old_value, new_value)
  {
  }*/

  On_Click_Btn(event_name)
  {
    if (this.menu_elem)
      this.menu_elem.hidePopover();
    this.dispatchEvent(new CustomEvent(event_name, { detail: this.event_data, bubbles: true }));
  }

  Render_Title(title, title_type)
  {
    let res = title;

    if (title_type == "singular" && this.singular_title)
    {
      res += " " + this.singular_title;
    }
    else if(title_type == "plural" && this.plural_title)
    {
      res += " " + this.plural_title;
    }

    return res;
  }

  Render_Btn(id, img_src, dst_elem)
  {
    const show = this.hasAttribute("show-" + id);
    if (show)
    {
      const title = 
        this.hasAttribute("label-" + id) ? 
        `title="${this.getAttribute("label-" + id)}"` : "";

      const html = `
        <button cid="${id}_btn" class="img" type="button" ${title}>
          <img src="${img_src}">
          <span class="label">${this.getAttribute("label-" + id)}</span>
        </button>
      `;
      const btn_elem = Utils.To_Element(html);
      btn_elem.addEventListener("click", () => this.On_Click_Btn(id));

      dst_elem.append(btn_elem);
    }
  }

  Render()
  {
    let dst_elem = this;

    const render_compact = this.hasAttribute("compact");
    if (render_compact)
    {
      const menu_id = "menu_" + crypto.randomUUID();

      const dlg_html = `
        <button type="button" popovertarget="${menu_id}" title="Menu" class="img">
          <img src="./image/menu.svg">
        </button>
        <dialog popover cid="menu_elem" id="${menu_id}">
          <main id="${menu_id + "_main"}">
            <button type="button" popovertarget="${menu_id}" class="img" popoveraction="close" title="Close Menu">
              <img src="./image/close.svg">
            </button>
          </main>
        </dialog>
      `;
      const dlg_elems = Utils.To_Elements(dlg_html);
      dst_elem = dlg_elems[2].querySelector("#" + menu_id + "_main");
      this.append(...dlg_elems);
    }

    this.Render_Btn("list", "./image/list.svg", dst_elem);
    this.Render_Btn("status", "./image/note-add.svg", dst_elem);
    this.Render_Btn("download", "./image/download.svg", dst_elem);
    this.Render_Btn("upload", "./image/upload.svg", dst_elem);
    this.Render_Btn("ai", "./image/robot.svg", dst_elem);
    this.Render_Btn("attach", "./image/attach.svg", dst_elem);
    this.Render_Btn("gencv", "./image/guide.svg", dst_elem);
    this.Render_Btn("genletter", "./image/mail.svg", dst_elem);
    this.Render_Btn("filter", "./image/filter-1.svg", dst_elem);
    this.Render_Btn("sort", "./image/sort.svg", dst_elem);
    this.Render_Btn("view", "./image/zoom.svg", dst_elem);
    this.Render_Btn("edit", "./image/edit.svg", dst_elem);
    this.Render_Btn("add", "./image/add.svg", dst_elem);
    this.Render_Btn("delete", "./image/delete.svg", dst_elem);

    Utils.Set_Id_Shortcuts(this, this, "cid");
  }
}

Utils.Register_Element(DeToolbarMenu);
export default DeToolbarMenu;