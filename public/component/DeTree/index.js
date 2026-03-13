
import Utils from "../../lib/Utils.js";

class DeInputTree extends HTMLElement
{
  static tname = "de-tree";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  // properties ===============================================================

  /* objs: [{id, parent_id, title}] */
  set items(objs)
  {
    const elems = this.Render_Item(objs, null);
    this.replaceChildren(...elems);
  }

  // methods ==================================================================

  Get_Children(objs, parent_id)
  {
    return objs.filter(obj => this.Has_Given_Parent(obj, parent_id));
  }

  Has_Children(objs, obj_id)
  {
    return this.Get_Children(objs, obj_id).length > 0;
  }

  Has_Given_Parent(obj, parent_id)
  {
    let res;

    if (parent_id == null || parent_id == undefined)
    {
      res = obj.parent_id == null || obj.parent_id == undefined;
    }
    else
    {
      res = obj.parent_id == parent_id;
    }

    return res;
  }

  Sort_By_Order(a, b)
  {
    if (a.order && b.order)
    {
      return a.order - b.order;
    }
    else if (a.order)
    {
      return -1;
    }
    else if (b.order)
    {
      return 1;
    }
    else
    {
      return 0;
    }
  }

  // events ==================================================================

  On_Click_Parent(event)
  {
    const element = event.currentTarget.parentElement;
    const siblings = Array.from(element.parentNode.children);

    if (!element.open)
    {
      const all_other_siblings = siblings.filter(sibling => sibling !== element);
      all_other_siblings.forEach(sibling => sibling.classList.add("hidden"));
    }
    else
    {
      siblings.forEach(sibling => sibling.classList.remove("hidden"));
    }
  }

  On_Click_Child(event)
  {
    const item_id = event.currentTarget.getAttribute("item-id");
    this.dispatchEvent(new CustomEvent("itemclick", {detail: item_id}));
  }

  // rendering ================================================================

  Render_Item(objs, parent_id)
  {
    let elems = [];
    let child_objs = this.Get_Children(objs, parent_id);
    child_objs.sort(this.Sort_By_Order);
    
    for (const child_obj of child_objs)
    {
      if (this.Has_Children(objs, child_obj.id))
      {
        elems.push(this.Render_Parent(child_obj, objs));
      }
      else
      {
        elems.push(this.Render_Child(child_obj));
      }
    }

    return elems;
  }

  Render_Parent(parent_obj, objs)
  {
    const html = `
      <details>
        <summary cid="title_elem">${parent_obj.title}</summary>
      </details>
    `;
    const elem = Utils.toElement(html);
    Utils.Set_Id_Shortcuts(elem, elem, "cid");

    elem.title_elem.addEventListener("click", this.On_Click_Parent);
    elem.append(...this.Render_Item(objs, parent_obj.id));

    return elem;
  }

  Render_Child(child_obj)
  {
    const html = `
      <details class="item" item-id="${child_obj.id}">
        <summary cid="title_elem">${child_obj.title}</summary>
      </details>
    `;
    /*const html = 
    `
      <div class="item" item-id="${child_obj.id}">
        ${child_obj.title}
      </div>
    `;*/
    const elem = Utils.toElement(html);
    elem.addEventListener("click", this.On_Click_Child);

    return elem;
  }

  Render()
  {
  }
}

Utils.Register_Element(DeInputTree);
export default DeInputTree;
