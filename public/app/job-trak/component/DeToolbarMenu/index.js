import Utils from "../../../../lib/Utils.js";

class DeToolbarMenu extends HTMLElement
{
  static tname = "de-toolbar-menu";

  singular_title = null;
  plural_title = null;

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  set value(obj)
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
  }

  On_Click_Btn(event_name)
  {
    this.dispatchEvent(new Event(event_name));
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

  Render_Btn(id, img_src, title, title_type, show)
  {
    let html = "";

    if (show)
    {
      html = `
        <button cid="${id}" class="img">
          <img src="${img_src}" title="${this.Render_Title(title, title_type)}">
        </button>
      `;
    }

    return html;
  }

  Render()
  {
    let show = this.hasAttribute("show-view");
    let html = 
      this.Render_Btn("view_btn", "./image/zoom.svg", "View", "singular", show);

    const show_download = this.hasAttribute("show-download");
    html +=
      this.Render_Btn("download_btn", "./image/download.svg", "Download", "singular", show_download);

    const show_ai = this.hasAttribute("show-ai");
    html +=
      this.Render_Btn("ai_add_btn", "./image/robot.svg", "AI Add", "singular", show_ai);

    show = this.hasAttribute("show-add");
    html += 
      this.Render_Btn("add_btn", "./image/add.svg", "Add", "singular", show);

    const show_edit = this.hasAttribute("show-edit");
    html += 
      this.Render_Btn("edit_btn", "./image/edit.svg", "Edit", "singular", show_edit);

    show = this.hasAttribute("show-delete");
    html += 
      this.Render_Btn("del_btn", "./image/delete.svg", "Delete", "singular", show);

    show = this.hasAttribute("show-filter");
    html += 
      this.Render_Btn("filter_btn", "./image/filter-1.svg", "Filter", "plural", show);

    show = this.hasAttribute("show-sort");
    html += 
      this.Render_Btn("sort_btn", "./image/sort.svg", "Sort", "plural", show);

    const html_elements = Utils.To_Document(html, this);
    this.replaceChildren(html_elements);
    Utils.Set_Id_Shortcuts(this, this, "cid");

    if (show_edit)
    {
      this.edit_btn.addEventListener("click", () => this.On_Click_Btn("edit"));
    }
    if (show_ai)
    {
      this.ai_add_btn.addEventListener("click", () => this.On_Click_Btn("ai"));
    }
    if (show_download)
    {
      this.download_btn.addEventListener("click", () => this.On_Click_Btn("download"));
    }
    //this.some_elem.addEventListener("click", this.On_Click_Btn);
  }
}

Utils.Register_Element(DeToolbarMenu);
export default DeToolbarMenu;