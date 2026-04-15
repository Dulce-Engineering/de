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

    this.item_template = null;
    this.no_items_template = null;
    this.envelopes = [];
    this.no_children = null;
  }

  connectedCallback()
  {
    this.Render();
  }

  set value(item_objs)
  {
    if (item_objs && item_objs.length > 0)
    {
      this.replaceChildren();
      for (const item of item_objs)
      {
        this.Add(item, false);
      }
    }

    this.Render_No_Items();
  }

  get value()
  {
    const res = 
      this.envelopes.length > 0 
      ? this.envelopes.map(e => e.obj)
      : null;

    return res;
  }

  get length()
  {
    return this.envelopes.length;
  }

  Add(obj, with_events = true)
  {
    const envelope = this.Render_Item(obj);

    const old_envelope_index = this.envelopes.findIndex(e => e.id == obj.id);
    if (old_envelope_index !== -1)
    {
      const old_envelope = this.envelopes[old_envelope_index];
      this.envelopes[old_envelope_index] = envelope;
      this.Replace_Envelope(old_envelope, envelope);
    }
    else
    {
      this.envelopes.push(envelope);
      //this.list_elem.append(envelope.fragment);
      this.append(envelope.fragment);
    }
    this.Render_No_Items();

    const detail = 
    {
      obj,
      shortcuts: envelope.shortcuts
    };
    this.dispatchEvent(new CustomEvent("render", {bubbles:true, detail}));

    if (with_events)
    {
      this.dispatchEvent(new Event("change"));
    }
  }

  Remove(obj_id)
  {
    const old_envelope_index = this.envelopes.findIndex(e => e.id == obj_id);
    if (old_envelope_index !== -1)
    {
      const old_envelope = this.envelopes[old_envelope_index];
      this.envelopes.splice(old_envelope_index, 1);
      old_envelope.children.forEach(e => e.remove());
      this.Render_No_Items();

      this.dispatchEvent(new Event("change"));
    }
  }

  Replace_Envelope(old_envelope, new_envelope)
  {
    const old_elem = old_envelope.children[0];
    old_elem.before(new_envelope.fragment);
    old_envelope.children.forEach(e => e.remove());
  }

  // creates a copy of the template children with attached item object
  // and shortcut links
  Render_Item(obj)
  {
    const fragment = this.item_template.content.cloneNode(true);
    const children = Array.from(fragment.children);
    //fragment_children.forEach((e, i) => e.setAttribute("fid", i));
    //fragment_children.forEach(e => e.setAttribute("oid", obj.id));
    
    const shortcuts = {};
    Utils.Set_Id_Shortcuts(fragment, shortcuts, "cid");

    const envelope =
    {
      id: obj.id,
      obj,
      fragment,
      children,
      shortcuts
    };
    return envelope;
  }

  Render_No_Items()
  {
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
    }
  }

  // create a template element and move all child elements into it.
  // the template content holds the item markup used for rendering each item.
  Render()
  {
    const html = `
      <ul cid="list_elem">
        <slot name="list"></slot>
      </ul>
    `;
    
    // move all children with slot="item" into the item template
    this.item_template = document.createElement("template");
    const elements = this.querySelectorAll("[slot='item']");
    Array.from(elements).forEach(e => this.item_template.content.appendChild(e));

    // move all children with slot="no_items" into the no_items template
    this.no_items_template = document.createElement("template");
    const no_item_elems = this.querySelectorAll("[slot='no_items']");
    Array.from(no_item_elems).forEach(e => this.no_items_template.content.appendChild(e));

    const fragment = Utils.toDocument(html, this);
    this.replaceChildren(fragment);
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.Render_No_Items();
  }
}

Utils.Register_Element(DeInputList);
export default DeInputList;
