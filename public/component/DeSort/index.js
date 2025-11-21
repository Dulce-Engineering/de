import Utils from "../../lib/Utils.js";

class DeSort extends HTMLElement 
{
  static tname = "de-sort";

  constructor() 
  {
    super();

    this.add_class = "add_sort";
    this.sort_event = new Event('sort');

    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  get value()
  {
    let sort_items = null;

    if (this?.sort_list?.children && this?.sort_list?.children.length > 0)
    {
      sort_items = [];
      for (const sort_item of this.sort_list.children)
      {
        sort_items.push(sort_item.sort);
      }
    }

    return sort_items;
  }

  /*
  [
    {
      code,
      dir: "asc", "desc"
    }
  ]
  */
  set value(sort_items)
  {
    if (sort_items && sort_items.length > 0)
    {
      this.sort_list.replaceChildren();
      for (const sort of sort_items)
      {
        this.Add_Sort(sort);
      }
      this.dispatchEvent(this.sort_event);
    }
  }

  get visible()
  {
    return this.style.display != "none"; 
  }

  set visible(value)
  {
    if (value)
    {
      Utils.Show(this.id);
    }
    else
    {
      Utils.Hide(this.id);
    }
  }

  Get_Storage_Dir(sort_code)
  {
    let res = null;

    if (this.id && sort_code)
    {
      const storage_str = localStorage.getItem(this.id);
      const storage_data = JSON.parse(storage_str);

      if (storage_data?.value)
      {
        const sort = storage_data.value.find(s => s.code == sort_code);
        if (sort)
        {
          res = sort.dir;
        }
      }
    }

    return res;
  }

  Get_Field_Item(sort_code)
  {
    return this.field_list.querySelector("[sort-code='" + sort_code + "']");
  }

  Get_Field_Item_Text(sort_code)
  {
    let res = null;
    const field_item = this.Get_Field_Item(sort_code);
    if (field_item)
    {
      res = field_item.childNodes[0].textContent;
    }

    return res;
  }

  Enable_Field_Item(sort_code, enabled)
  {
    const field_item = this.Get_Field_Item(sort_code);
    const btns = field_item.querySelectorAll("button");
    btns[0].disabled = !enabled;
    btns[1].disabled = !enabled;
  }

  Save()
  {
    if (this.id)
    {
      const storage_data =
      {
        value: this.value,
        visible: this.visible
      }

      const storage_str = JSON.stringify(storage_data);
      localStorage.setItem(this.id, storage_str);
    }
  }

  Load()
  {
    if (this.id)
    {
      const storage_str = localStorage.getItem(this.id);
      const storage_data = JSON.parse(storage_str);

      this.value = storage_data?.value ? storage_data.value : null;
      this.visible = storage_data?.visible ? storage_data.visible : false;
    }
  }

  Add_Sort(sort)
  {
    const sort_item = this.Render_Sort(sort);
    this.sort_list.append(sort_item);
    this.Enable_Field_Item(sort.code, false);
  }

  // events =======================================================================================

  On_Render_Title(title, code)
  {
    const dir = this.Get_Storage_Dir(code);

    const icon_up = document.createElement("i");
    icon_up.classList.add("icon_font-sort-up");
    icon_up.hidden = dir != "asc";

    const icon_down = document.createElement("i");
    icon_down.classList.add("icon_font-sort-down");
    icon_down.hidden = dir != "desc";

    const hdr_elem = document.createElement("div");
    hdr_elem.classList.add("title");
    hdr_elem.append(title, icon_up, icon_down);
    hdr_elem.addEventListener("click", () => this.On_Click_Title(code));

    return hdr_elem;
  }

  On_Click_Title(code)
  {
    const dir = this.Get_Storage_Dir(code) != "asc" ? "asc" : "desc";
    this.value = [{ code, dir }];
    this.Save();
  }

  On_Toggle_Display()
  {
    this.visible = !this.visible;
    this.Save();
  }
  
  On_Click_Add()
  {
    // show field menu
    this.field_list_dlg.showModal();
  }
  
  On_Click_Close()
  {
    // hide field menu
    this.field_list_dlg.close();
  }
  
  On_Click_Sort(e, sort)
  {
    // hide field menu
    //this.field_list_dlg.close();

    this.Add_Sort(sort);
    this.Save();
    this.dispatchEvent(this.sort_event);
  }
  
  On_Click_Remove(e, sort_item, sort)
  {
    sort_item.remove();

    this.Enable_Field_Item(sort.code, true);
    this.Save();

    this.dispatchEvent(this.sort_event);
  }

  // rendering ====================================================================================

  Render()
  {
    const field_items = this.children;
    for (const field_item of field_items)
      this.Render_Field_Item(field_item);

    const html = `
      <button cid="add_btn" class="btn add_btn">
        <svg width="24px" height="24px" fill="#fff" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
          <path d="M120-240v-80h240v80H120Zm0-200v-80h480v80H120Zm0-200v-80h720v80H120Z"/>
        </svg>
      </button>
      <ul cid="sort_list" class="sort_list"></ul>

      <dialog cid="field_list_dlg">
        <form method="dialog" novalidate>
          <header>
            <h2>Sort Options</h2>
            <svg cid="close_btn" class="close-btn" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960">
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"></path>
            </svg>
          </header>

          <main>
            <ul cid="field_list" class="field_list"></ul>
          </main>

          <footer>
            <button cid="max_search_btn" type="button">OK</button>
          </footer>
        </form>
      </dialog>
    `;
    const elems = Utils.To_Document(html, this);
    elems.querySelector("[cid=field_list]").append(...field_items);
    this.append(elems);

    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.add_btn.addEventListener("click", this.On_Click_Add);
    this.close_btn.addEventListener("click", this.On_Click_Close);
    this.max_search_btn.addEventListener("click", this.On_Click_Close);
  }

  Render_Field_Item(field_item)
  {
    const code = field_item.getAttribute("sort-code");

    const asc_btn = document.createElement("button");
    asc_btn.innerHTML = "<span>▲</span>";
    asc_btn.classList.add("btn");
    asc_btn.classList.add("sort_btn");
    asc_btn.addEventListener("click", e => this.On_Click_Sort(e, {code, dir: "asc"}));

    const desc_btn = document.createElement("button");
    desc_btn.innerHTML = "<span>▼</span>";
    desc_btn.classList.add("btn");
    desc_btn.classList.add("sort_btn");
    desc_btn.addEventListener("click", e => this.On_Click_Sort(e, {code, dir: "desc"}));

    const btns = document.createElement("span");
    btns.classList.add("field_btns");
    btns.append(asc_btn, desc_btn);

    field_item.classList.add("field_item");
    field_item.append(btns);
  }

  Render_Sort(sort)
  {
    const remove_btn = document.createElement("button");
    remove_btn.innerHTML = "<span>✕</span>";
    remove_btn.classList.add("btn");
    remove_btn.classList.add("remove_btn");
    remove_btn.addEventListener("click", e => this.On_Click_Remove(e, sort_item, sort));

    const dir = sort.dir == "asc" ? "▲": "▼";
    const sort_item = document.createElement("li");
    sort_item.innerText = this.Get_Field_Item_Text(sort.code) + " " + dir;
    sort_item.classList.add("sort_item");
    sort_item.sort = sort;
    sort_item.append(remove_btn);

    return sort_item;
  }
}

Utils.Register_Element(DeSort);

export default DeSort;