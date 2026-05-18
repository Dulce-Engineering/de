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
    const show_view = this.hasAttribute("show-view");
    let html = 
      this.Render_Btn("view_btn", "./image/zoom.svg", "View", "singular", show_view);

    const show_download = this.hasAttribute("show-download");
    html +=
      this.Render_Btn("download_btn", "./image/download.svg", "Download", "singular", show_download);

    const show_upload = this.hasAttribute("show-upload");
    html +=
      this.Render_Btn("upload_btn", "./image/upload.svg", "Upload", "singular", show_upload);

    const show_ai = this.hasAttribute("show-ai");
    html +=
      this.Render_Btn("ai_add_btn", "./image/robot.svg", "AI Add", "singular", show_ai);

    const show_add = this.hasAttribute("show-add");
    html += 
      this.Render_Btn("add_btn", "./image/add.svg", "Add", "singular", show_add);

    const show_edit = this.hasAttribute("show-edit");
    html += 
      this.Render_Btn("edit_btn", "./image/edit.svg", "Edit", "singular", show_edit);

    const show_delete = this.hasAttribute("show-delete");
    html += 
      this.Render_Btn("del_btn", "./image/delete.svg", "Delete", "singular", show_delete);

    const show_filter = this.hasAttribute("show-filter");
    html += 
      this.Render_Btn("filter_btn", "./image/filter-1.svg", "Filter", "plural", show_filter);

    const show_sort = this.hasAttribute("show-sort");
    html +=
      this.Render_Btn("sort_btn", "./image/sort.svg", "Sort", "plural", show_sort);

    const show_attach = this.hasAttribute("show-attach");
    html +=
      this.Render_Btn("attach_btn", "./image/attach.svg", "Attach Files", null, show_attach);

    const html_elements = Utils.To_Document(html, this);
    //this.replaceChildren(html_elements);
    this.appendChild(html_elements);
    Utils.Set_Id_Shortcuts(this, this, "cid");

    if (show_view)
    {
      this.view_btn.addEventListener("click", () => this.On_Click_Btn("view"));
    }
    if (show_download)
    {
      this.download_btn.addEventListener("click", () => this.On_Click_Btn("download"));
    }
    if (show_upload)
    {
      this.upload_btn.addEventListener("click", () => this.On_Click_Btn("upload"));
    }
    if (show_ai)
    {
      this.ai_add_btn.addEventListener("click", () => this.On_Click_Btn("ai"));
    }
    if (show_add)
    {
      this.add_btn.addEventListener("click", () => this.On_Click_Btn("add"));
    }
    if (show_edit)
    {
      this.edit_btn.addEventListener("click", () => this.On_Click_Btn("edit"));
    }
    if (show_delete)
    {
      this.del_btn.addEventListener("click", () => this.On_Click_Btn("delete"));
    }
    if (show_filter)
    {
      this.filter_btn.addEventListener("click", () => this.On_Click_Btn("filter"));
    }
    if (show_sort)
    {
      this.sort_btn.addEventListener("click", () => this.On_Click_Btn("sort"));
    }
    if (show_attach)
    {
      this.attach_btn.addEventListener("click", () => this.On_Click_Btn("attach"));
    }
  }
}

Utils.Register_Element(DeToolbarMenu);
export default DeToolbarMenu;