import Utils from "../../../../lib/Utils.js";

class DeSearchSelect extends HTMLElement
{
  static tname = "de-search-select";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");

    this.items_array = null;
    this.active_item = null;
  }

  connectedCallback()
  {
    this.Render();
  }

  // properties ===============================================================

  set value(item_value)
  {
    const list_item = this.Find_Item(item_value);
    if (list_item)
    {
      this.selected_item = list_item;
    }
    else
    {
      this.selected_item = {value: item_value};
    }
  }

  get value()
  {
    return this.selected_item?.value;
  }
  
  set items(items_array)
  {
    this.items_array = items_array;
    this.Render_Options(this.items_array);
  }

  set selected_item(item)
  {
    this.active_item = item;
    this.input_elem.value = this.active_item?.title || "";
  }

  get selected_item()
  {
    return this.active_item;
  }

  Find_Item(value)
  {
    let res = null;

    if (this.items_array && value)
      res = this.items_array.find(i => i.value == value);

    return res;
  }

  // attributes ===============================================================

  /*static observedAttributes = 
  [
    "attribute-name"
  ];
  attributeChangedCallback(name, old_value, new_value)
  {
  }*/

  // methods ==================================================================

  // events ===================================================================

  On_Click_Input()
  {
    this.items_list.showPopover();
    this.Render_Options(this.items_array);
  }

  On_Click_Items(event)
  {
    const selected_value = event.target.getAttribute("item-value");
    this.value = selected_value;
    this.items_list.hidePopover();
  }

  On_Input(e)
  {
    const search_str = this.input_elem.value.trim().toLowerCase();
    const match_items = this.items_array.filter
      (i => i.title.toLowerCase().includes(search_str));
    this.Render_Options(match_items);
  }

  On_Click_Add_Btn()
  {
    this.dispatchEvent(new Event("add"));
  }

  // rendering ================================================================

  Render_Options(items)
  {
    this.items_list.querySelectorAll('.option').forEach(el => el.remove());
    if (items)
    {
      let items_html = this.Render_Option_HTML();
      this.items_list.insertAdjacentHTML("beforeend", items_html);
      for (const item of items)
      {
        items_html = this.Render_Option_HTML(item);
        this.items_list.insertAdjacentHTML("beforeend", items_html);
      }
    }
  }

  Render_Option_HTML(item)
  {
    let html = `
      <li role="option" aria-selected="false" class="option none" item-value="null">
        None
      </li>
    `;

    if (item)
    {
      html = `
        <li role="option" aria-selected="false" class="option" item-value="${item.value}">
          ${item.title}
        </li>
      `;
    }

    return html;
  }

  async Render()
  {
    const html = `
      <input
        cid="input_elem"
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded="false"
        aria-haspopup="listbox"
        aria-controls="combobox-listbox"
        aria-labelledby="combobox-label"
        placeholder="Type to search..."
        autocomplete="off"
      />

      <button cid="add_btn" type="button">
        <img src="image/add.svg">
      </button>

      <ul cid="items_list" role="listbox" popover></ul>
    `;
    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.input_elem.addEventListener('click', this.On_Click_Input);
    this.input_elem.addEventListener('input', this.On_Input);
    this.items_list.addEventListener('click', this.On_Click_Items);
    this.add_btn.addEventListener('click', this.On_Click_Add_Btn);
  }
}

Utils.Register_Element(DeSearchSelect);
export default DeSearchSelect;