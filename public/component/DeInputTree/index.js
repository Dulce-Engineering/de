
import Utils from "../../lib/Utils.js";

class DeInputTree extends HTMLElement
{
  static tname = "de-input-tree";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");

    this.selected_ids = null;
  }

  connectedCallback()
  {
    this.render();
  }

  /* objs: [{id, parent_id, title}] */
  set items(objs)
  {
    let html = this.Render_Item(objs, null);
    this.innerHTML = html;

    /*this.querySelectorAll(".item").forEach(item =>
    {
      const obj_id = item.getAttribute("item-id");
      const obj = objs.find(o => o.id == obj_id);
      item.obj = obj;
      item.addEventListener("click", this.On_Selected_Item_Click);
    });*/
  }

  get value()
  {
    const checked_items = this.querySelectorAll("input[type=checkbox]:checked");
    const checked_array = Array.from(checked_items);
    const checked_values = checked_array.map(item => item.value);

    return checked_values;
  }

  set value(id)
  {
    //this.selected_id = id;
    if (id)
    {
      //const item = this.items.find(o => o.id == id);
      //this.selected_item.innerText = item.title;
    }
    else
    {
      //this.selected_item.innerText = "None";
      const items = this.querySelectorAll("input[type=checkbox]");
      items.forEach(item => item.checked = false);
    }
  }

  Render_Item(objs, parent_id)
  {
    const name = this.getAttribute("name");
    let html = "";
    const child_objs = objs.filter(o => Has_Parent(o, parent_id));
    function Has_Parent(o, parent_id)
    {
      if (parent_id == null || parent_id == undefined)
      {
        return o.parent_id == null || o.parent_id == undefined;
      }
      else
      {
        return o.parent_id == parent_id;
      }
    }
    
    for (const child_obj of child_objs)
    {
      if (this.Has_Children(objs, child_obj.id))
      {
        html += `
          <details x-name="${name}">
            <summary>${child_obj.title}</summary>
            ${this.Render_Item(objs, child_obj.id)}
          </details>
        `;
      }
      else
      {
        const checkbox_id = "item_" + child_obj.id;
        html += 
        `
          <div class="item" item-id="${checkbox_id}">
            <input id="${checkbox_id}" type="checkbox" value="${child_obj.id}" />
            <label for="${checkbox_id}">${child_obj.title}</label>
          </div>
        `;
      }
    }

    return html;
  }

  Has_Children(objs, obj_id)
  {
    return objs.filter(o => o.parent_id == obj_id).length > 0;
  }

  /*On_Selected_Item_Click(event)
  {
    const item = event.target.obj;
    this.selected_id = item.id;
    this.selected_item.innerText = item.title;
    this.items_block.hidePopover();
  }*/

  render()
  {
    /*const items_block_id = this.id + "_items_block";
    const html = `
      <button cid="selected_item" popovertarget="${items_block_id}" type="button">None</button>
      <div id="${items_block_id}" cid="items_block" popover></div>
    `;
    const html_elements = Utils.toDocument(html, this);
    this.replaceChildren(html_elements);
    Utils.Set_Id_Shortcuts(this, this, "cid");*/
  }
}

Utils.Register_Element(DeInputTree);
export default DeInputTree;
