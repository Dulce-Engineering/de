
import Utils from "../../lib/Utils.js";

class DeSelectTree extends HTMLElement
{
  static tname = "de-select-tree";
  static formAssociated = true;

  constructor()
  {
    super();
    Utils.Bind(this, "On_");

    this.all_items = null;
  }

  connectedCallback()
  {
    this.Render();
  }

  formResetCallback() 
  {
    this.Render_Selected_Items();
    this.Set_Clear_Btn_Visibility();
  }

  // properties ===============================================================

  /* objs: [{id, parent_id, title}] */
  set items(value)
  {
    this.all_items = value;
    this.all_items_tree.items = value;
  }

  get value()
  {
    const selected_array = Array.from(this.Get_Item_Elems());
    const selected_ids = selected_array.map(elem => elem.item_obj.id);

    return selected_ids;
  }

  set value(item_ids)
  {
    if (!Utils.Is_Empty(item_ids))
    {
      const selected_items = this.all_items.filter(item => item_ids.includes(item.id));
      this.Render_Selected_Items(selected_items);
    }

    this.Set_Clear_Btn_Visibility();
  }

  // methods ==================================================================

  Get_Item_Elems()
  {
    return this.selected_items.querySelectorAll("li");
  }

  // events ==================================================================

  On_Click_Clear_Btn()
  {
    this.Render_Selected_Items();
  }

  On_Click_Item(event)
  {
    const item_id = event.detail;
    const is_not_selected = !this.value.includes(item_id);
    if (is_not_selected)
    {
      const item = this.all_items.find(item => item.id == item_id);
      const new_item = this.Render_Selected_Item(item);
      this.selected_items.append(new_item);
      this.all_items_tree.hidePopover();
    }

    this.Set_Clear_Btn_Visibility();
  }

  On_Click_Remove_Btn(event)
  {
    const selected_array = Array.from(this.Get_Item_Elems());
    const selected_elem = selected_array.find(elem => elem.remove_btn === event.currentTarget);
    selected_elem.remove();

    this.Set_Clear_Btn_Visibility();
  }

  // rendering ================================================================

  Set_Clear_Btn_Visibility()
  {
    const has_items = this.Get_Item_Elems().length > 0;
    this.clear_btn.hidden = !has_items;
  }

  Render_Selected_Items(items)
  {
    this.selected_items.replaceChildren();
    if (!Utils.Is_Empty(items))
    {
      for (const item of items)
      {
        const elem = this.Render_Selected_Item(item);
        this.selected_items.append(elem);
      }
    }
  }

  Render_Selected_Item(item)
  {
    const remove_char = "&times;";
    const html = `
      <li>
        ${item.title}
        <button cid="remove_btn">${remove_char}</button>
      </li>
    `;
    const elem = Utils.toElement(html);
    Utils.Set_Id_Shortcuts(elem, elem, "cid");
    elem.item_obj = item;
    elem.remove_btn.addEventListener("click", this.On_Click_Remove_Btn);

    return elem;
  }

  Render()
  {
    const add_char = "&plus;";
    const clear_char = "&#128465;";
    const this_id = this.id || "";
    const tree_id = this_id + "_all_items_tree";
    const html = `
      <button 
        cid="add_btn" 
        popovertarget="${tree_id}" 
        popovertargetaction="show" 
        type="button">${add_char}</button>
      <button cid="clear_btn" type="button" hidden>${clear_char}</button>
      <ul cid="selected_items"></ul>
      <de-tree id="${tree_id}" cid="all_items_tree" popover></de-tree>
    `;
    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.all_items_tree.addEventListener("itemclick", this.On_Click_Item);
    this.clear_btn.addEventListener("click", this.On_Click_Clear_Btn);
  }
}

Utils.Register_Element(DeSelectTree);
export default DeSelectTree;
