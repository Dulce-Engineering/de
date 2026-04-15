import Utils from "../../lib/Utils.js";

class DeInputList extends HTMLElement
{
  static tname = "de-input-list";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");

    this.item_template = null;
    //this.no_items_template = null;
    //console.log("DeInputList.constructor()");
  }

  connectedCallback()
  {
    //console.log("DeInputList.connectedCallback()");
    this.Render();
  }

  set value(objs)
  {
    //console.log("DeInputList.set value()");
    if (objs && objs.length > 0)
    {
      this.replaceChildren();
      for (const obj of objs)
      {
        this.Add(obj)
      }
    }
  }

  get value()
  {
    //console.log("DeInputList.get value()");
    const res = Array.from(this.children).map(e => e.item_obj);
    return res;
  }

  get length()
  {
    //console.log("DeInputList.length()");
    return this.children.length;
  }

  // public api ==================================================================

  Add(obj)
  {
    //console.log("DeInputList.Add()");
    const item_elem = this.Render_Item(obj);
    this.append(item_elem);
    item_elem.dispatchEvent(new Event("render", { bubbles: true }));
  }

  Remove(obj_id)
  {
    //console.log("DeInputList.Remove()");
    const item_elem = Array.from(this.children).find(e => e.item_obj.id == obj_id);
    if (item_elem)
    {
      item_elem.remove();
    }
  }

  Clear()
  {
    //console.log("DeInputList.Clear()");
    this.replaceChildren();
  }

  // helpers =====================================================================


  // rendering ===================================================================

  Render_Item(obj)
  {
    //console.log("DeInputList.Render_Item()");
    const fragment = this.item_template.content.cloneNode(true);
    const item_elem = fragment.firstElementChild;
    item_elem.item_obj = obj;
    Utils.Set_Id_Shortcuts(item_elem, item_elem, "cid");
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

  Render()
  {
    //console.log("DeInputList.Render()");

    // create a template element and move all child elements into it.
    // the template content holds the item markup used for rendering each item.
    this.item_template = document.createElement("template");
    const item_elem = this.querySelector("[slot='item']");
    this.item_template.content.append(item_elem);

    // clear  any remainig compoent content
    this.replaceChildren();
  }
}

Utils.Register_Element(DeInputList);
export default DeInputList;
