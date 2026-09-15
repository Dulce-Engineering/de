import Utils from "../../lib/Utils.js";

/**
 * DeInputList component manages and renders a list of items based on a provided 
 * template.
 * It maintains a state of objects and maps them to DOM elements.
 * 
 * @customElement de-input-list
 * 
 * @slot item - The template element used to render each item in the list.
 * 
 * @fires render - Dispatched on an item's element after it has been created and 
 * attached to the list.
 */
class DeInputList extends HTMLElement
{
  static tname = "de-input-list";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");

    this.item_template = null;
    //console.log("DeInputList.constructor()");
  }

  connectedCallback()
  {
    //console.log("DeInputList.connectedCallback()");
    this.Render();
  }

  /**
   * Sets the list of data objects and re-renders the component.
   * @param {Array<Object>} objs - Array of objects to be rendered.
   */
  set value(objs)
  {
    //console.log("DeInputList.set value()");
    this.Clear();
    if (objs && objs.length > 0)
    {
      for (const obj of objs)
      {
        this.Add(obj)
      }
    }
  }

  /**
   * Returns the current list of data objects associated with the rendered items.
   * @returns {Array<Object>}
   */
  get value()
  {
    //console.log("DeInputList.get value()");
    const res = Array.from(this.items_elem.children).map(e => e.item_obj);
    return res;
  }

  /**
   * Returns the number of items currently in the list.
   * @returns {number}
   */
  get length()
  {
    //console.log("DeInputList.length()");
    return this.items_elem.children.length;
  }

  // public api ==================================================================

  /**
   * Adds a new item to the list and renders it.
   * @param {Object} obj - The data object to associate with the new item.
   */
  Add(obj)
  {
    //console.log("DeInputList.Add()");
    let item_elem = this.Find(obj.id);
    if (!item_elem)
    {
      item_elem = this.Render_Item(obj);
      this.items_elem.append(item_elem);
      this.Update_No_Items();
    }

    const event = new CustomEvent("render", 
      { detail: { obj, item_elem }, bubbles: false });
    this.dispatchEvent(event);
  }

  /**
   * Removes an item from the list by matching its object ID.
   * @param {string|number} obj_id - The ID of the item to remove.
   */
  Remove(obj_id)
  {
    //console.log("DeInputList.Remove()");
    const item_elem = this.Find(obj_id);
    if (item_elem)
    {
      item_elem.remove();
      this.Update_No_Items();
    }
  }

  /**
   * Removes all items from the list.
   */
  Clear()
  {
    //console.log("DeInputList.Clear()");
    this.items_elem.replaceChildren();
    this.Update_No_Items();
  }

  Find(obj_id)
  {
    let item_elem = null;

    if (obj_id)
    {
      const children_array = Array.from(this.items_elem.children);
      const Has_Same_Id_Or_Obj = e => e.item_obj?.id == obj_id || e.item_obj == obj_id;
      item_elem = children_array.find(Has_Same_Id_Or_Obj);
    }

    return item_elem;
  }

  // helpers =====================================================================


  // rendering ===================================================================

  Update_No_Items()
  {
    const item_count = this.length;
    const no_items_count = this.no_items_elem.children.length;

    this.items_elem.style.display = item_count > 0 ? null : "none";
    this.no_items_elem.style.display = !(item_count > 0) && no_items_count > 0 ? null : "none";
  
    const hide_header = "hide-header";
    if (this.hasAttribute(hide_header))
    {
      const header_elems = this.querySelectorAll("[slot=header]");
      if (header_elems)
        header_elems.forEach(e => e.style.display = item_count > 0 ? null : "none");
    }
  }

  /**
   * Internal method to clone the template and bind data to the new element.
   * @private
   * @param {Object} obj - The data object.
   * @returns {HTMLElement} The rendered item element.
   */
  Render_Item(obj)
  {
    //console.log("DeInputList.Render_Item()");
    const fragment = this.item_template.content.cloneNode(true);
    const item_elem = fragment.firstElementChild;
    if (item_elem)
    {
      item_elem.item_obj = obj;
      Utils.Set_Id_Shortcuts(item_elem, item_elem, "cid");
    }
    return item_elem;
  }

  Render_No_Items()
  {
    /*console.log("DeInputList.Render_No_Items()");
    if (this.envelopes.length == 0 && !this.no_children)
    {
      // if there are no items, render the no_items template
      const no_fragment = this.no_items_template.content.cloneNode(true);
      this.no_children = Array.from(no_fragment.children);
      this.list_elem.append(no_fragment);
    }
    else if (this.envelopes.length != 0 && this.no_children)
    {
      // if there are items and no_children is rendered, 
      // remove the no_items template children
      this.no_children.forEach(e => e.remove());
      this.no_children = null;
    }*/
  }

  /**
   * Initializes the component by extracting the item template from the children
   * and clearing the light DOM.
   * @private
   */
  Render()
  {
    //console.log("DeInputList.Render()");

    this.item_template = document.createElement("template");
    const item_elem = this.querySelector("[slot='item']");
    this.item_template.content.append(item_elem);

    const html = `
      <slot name="header"></slot>
      <main cid="items_elem" style="display:none;"></main>
      <main cid="no_items_elem" style="display:none;">
        <slot name="no_items"></slot>
      </main>
      <slot name="footer"></slot>
    `;
    const elems = Utils.To_Document(html, this);
    this.replaceChildren(elems);
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.Update_No_Items();
  }
}

Utils.Register_Element(DeInputList);
export default DeInputList;
