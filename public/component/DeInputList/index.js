import Utils from "../../lib/Utils.js";

class DeInputList extends HTMLElement
{
  static tname = "de-input-list";

  //static observedAttributes = [ "attribute-name" ];
  //attributeChangedCallback(name, old_value, new_value) { }

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  set value(item_objs)
  {
    this.replaceChildren();
    if (item_objs)
    {
      for (const item of item_objs)
      {
        this.Add(item, false);
      }
    }
  }

  get value()
  {
    const item_objs = [];

    const item_elems = this.querySelectorAll("li");
    for (const item_elem of item_elems)
    {
      item_objs.push(item_elem.item_obj);
    }

    return item_objs;
  }

  get length()
  {
    return this.querySelectorAll("li").length;
  }

  Add(item_obj, with_events = true)
  {
    const item_elem = this.Render_Item(item_obj);
    const old_elem = this.Find_Item_Elem(item_obj.id);
    if (old_elem)
    {
      old_elem.replaceWith(item_elem);
    }
    else
    {
      this.appendChild(item_elem);
    }
    item_elem.dispatchEvent(new Event("render", {bubbles:true}));

    if (with_events)
    {
      this.dispatchEvent(new Event("change"));
    }
  }

  Remove(obj_id)
  {
    const item_elem = this.Find_Item_Elem(obj_id);
    if (item_elem)
    {
      this.removeChild(item_elem);
      this.dispatchEvent(new Event("change"));
    }
  }

  Find_Item_Elem(obj_id)
  {
    let res = null;

    if (obj_id)
    {
      const item_elems = this.querySelectorAll("li");
      for (const item_elem of item_elems)
      {
        const obj = item_elem.item_obj;
        if (obj.id == obj_id)
        {
          res = item_elem;
        }
      }
    }

    return res;
  }

  // creates a copy of the line-item template with attached item object
  // and shortcut links
  Render_Item(item_obj)
  {
    const item_elem = this.template_elem.cloneNode(true);
    item_elem.item_obj = item_obj;
    Utils.Set_Id_Shortcuts(item_elem, item_elem, "cid");

    return item_elem;
  }

  // create a line-item and move all child elements to it.
  // this line-item will act as a template for rendering each item.
  Render()
  {
    this.template_elem = document.createElement("li");
    while (this.firstChild) 
    {
      this.template_elem.appendChild(this.firstChild);
    }
  }
}

Utils.Register_Element(DeInputList);
export default DeInputList;
