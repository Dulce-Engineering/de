import Utils from "../../lib/Utils.js";

class DeInputList extends HTMLElement
{
  static tname = "p-budgets";

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

  set value(items)
  {
    this.replaceChildren();
    if (items)
    {
      for (const item of items)
      {
        this.Add(item, false);
      }
    }
  }

  get value()
  {
    const items = [];

    const item_elems = this.querySelectorAll("li");
    for (const item_elem of item_elems)
    {
      items.push(item_elem.budget);
    }

    return items;
  }

  get length()
  {
    return this.querySelectorAll("li").length;
  }

  Add(item, with_events = true)
  {
    const item_elem = this.Render_Item(item);

    const old_elem = this.Find(item.id);
    if (old_elem)
    {
      // fire update event
      old_elem.replaceWith(item_elem);
    }
    else
    {
      // fire add event
      this.appendChild(item_elem);
    }

    this.Update_Budget_Funds(item_elem);

    if (with_events)
    {
      this.dispatchEvent(new Event("change"));
    }
  }

  Remove(item)
  {
    const item_elem = this.Find(item.id);
    if (item_elem)
    {
      this.removeChild(item_elem);
      this.dispatchEvent(new Event("change"));
    }
  }

  Find(id)
  {
    let res = null;

    if (id)
    {
      const budget_elems = this.querySelectorAll("li");
      for (const budget_elem of budget_elems)
      {
        const budget = budget_elem.budget;
        if (budget.id == id)
        {
          res = budget_elem;
        }
      }
    }

    return res;
  }

  Render_Item(item)
  {
    const item_elem = this.template_elem.cloneNode(true);
    item_elem.item = item;
    Utils.Set_Id_Shortcuts(item_elem, item_elem, "cid");
    
    item_elem.dispatchEvent(new Event("render"));

    return item_elem;
  }

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
