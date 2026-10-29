import Utils from "../../../../lib/Utils.js";
import DeToolbarMenu from "../de-toolbar-menu/index.js";

class DeSearchMultiSelect extends HTMLElement
{
  static tname = "de-search-multi-select";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");

    this.items_array = null;
  }

  /**
   * Lifecycle callback invoked when the element is inserted into the DOM.
   */
  connectedCallback()
  {
    this.Render();
  }

  // properties ===============================================================

  get value()
  {
    let res = null;

    if (!Utils.Is_Empty(this.selected_list))
    {
      const children = Array.from(this.selected_list.children);
      res = children.map(c => c.item_data);
    }

    return res;
  }

  set value(items)
  {
    this.Render_Selected(items);
  }

  get items()
  {
    return this.items_array;
  }

  set items(items_array)
  {
    this.items_array = items_array;
    this.Render_Options(items_array);
  }

  // methods ==================================================================

  Find(item)
  {
    let elem = null;

    if (item)
    {
      const children = Array.from(this.selected_list.children);
      elem = children.find(elem => elem.item_data === item);
    }

    return elem;
  }

  Add(item)
  {
    const existing_elem = this.Find(item)
    if (existing_elem)
    {
      this.Update_Selected_Element(item, existing_elem);
    }
    else
    {
      this.Render_Selected_Element(item);
    }
  }

  Remove(item)
  {
    if (item)
    {
      const elem = this.Find(item);
      elem?.remove();
    }
  }

  // events ===================================================================

  On_Click_Input()
  {
    this.options_list.showPopover();
  }

  On_Click_Option(item)
  {
    this.Render_Selected_Element(item);
    this.options_list.hidePopover();
    this.input_elem.value = "";
  }

  On_Input()
  {
    const search_str = (this.input_elem?.value || "").trim().toLowerCase();
    const match_items = this.items_array
      ? this.items_array.filter(i => (i?.title || "").toLowerCase().includes(search_str))
      : [];

    this.Render_Options(match_items);
  }

  On_Click_Add_Btn()
  {
    this.dispatchEvent(new Event("add"));
  }

  On_Click_Edit_Item(item)
  {
    const edit_event = new CustomEvent("edit", {detail: item, bubbles: true});
    this.dispatchEvent(edit_event);
  }

  // rendering ================================================================

  Render_Options(items)
  {
    if (this.options_list)
    {
      this.options_list.innerHTML = "";
      if (!Utils.Is_Empty(items))
      {
        for (const item of items)
        {
          this.Render_Option_Element(item);
        }
      }
    }
  }

  Render_Option_Element(item)
  {
    const item_elem = document.createElement("li");
    item_elem.setAttribute("role", "option");
    item_elem.setAttribute("aria-selected", "false");
    item_elem.className = "option none";
    item_elem.item_data = item;
    item_elem.textContent = item.title;
    item_elem.addEventListener("click", () => this.On_Click_Option(item));

    this.options_list.append(item_elem);
  }

  Render_Selected_Element(item)
  {
    const title_elem = document.createElement("span");

    const menu_elem = document.createElement("de-toolbar-menu");
    menu_elem.setAttribute("show-edit", "");
    menu_elem.setAttribute("show-remove", "");

    const item_elem = document.createElement("li");
    item_elem.className = "selected-item";
    item_elem.append(title_elem);
    item_elem.append(menu_elem);
    item_elem.title_elem = title_elem;
    item_elem.menu_elem = menu_elem;
    this.Update_Selected_Element(item, item_elem);

    this.selected_list.append(item_elem);
  }

  Update_Selected_Element(item, item_elem)
  {
    item_elem.title_elem.textContent = item.title;
    item_elem.menu_elem.event_data = item;
    item_elem.menu_elem.addEventListener("remove", () => this.Remove(item));
    item_elem.item_data = item;
  }

  Render_Selected(items)
  {
    if (this.selected_list)
    {
      this.selected_list.innerHTML = "";
      if (!Utils.Is_Empty(items))
      {
        for (const item of items)
        {
          this.Render_Selected_Element(item);
        }
      }
    }
  }

  async Render()
  {
    const placeholder_text = this.getAttribute("placeholder") || "Type to search...";
    const html = `
      <div class="search-box">
        <input
          cid="input_elem"
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded="false"
          aria-haspopup="listbox"
          aria-controls="combobox-listbox"
          aria-labelledby="combobox-label"
          placeholder="${placeholder_text}"
          autocomplete="off"
        />

        <button cid="add_btn" type="button">
          <img src="image/add.svg">
        </button>

        <ul cid="options_list" role="listbox" popover></ul>
      </div>

      <ul cid="selected_list" class="selected-items"></ul>
    `;
    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.input_elem.addEventListener("click", this.On_Click_Input);
    this.input_elem.addEventListener("input", this.On_Input);
    this.add_btn.addEventListener("click", this.On_Click_Add_Btn);
  }
}

Utils.Register_Element(DeSearchMultiSelect);
export default DeSearchMultiSelect;