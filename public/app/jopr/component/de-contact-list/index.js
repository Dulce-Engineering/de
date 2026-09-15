import Utils from "../../../../lib/Utils.js";

class DeContactList extends HTMLElement
{
  static tname = "de-contact-list";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
    this.view_type = "list";
  }

  connectedCallback()
  {
    this.view_type = Utils.Get_Attr_Def(this, "view-type", "list");
    if (this.view_type == "select")
    {
      this.Render_Select();
    }
    else if (this.view_type == "sublist")
    {
      this.Render_Sublist();
    }
    else if (this.view_type == "compact")
    {
      this.Render_Compact();
    }
    else
    {
      this.Render();
    }
  }

  // properties ===============================================================
  
  set value(data)
  {
    this.contacts_list.value = data;
  }

  get value()
  {
    let contacts = null;

    const view_type = this.getAttribute("view-type");
    if (view_type == "select")
    {
      const selected_elements = 
        this.contacts_list.items_elem.querySelectorAll("[name=selected_contact_id]:checked");
      const selected_ids = Array.from(selected_elements).map(e => parseInt(e.value));
      contacts = this.contacts_list.value.filter(c => selected_ids.includes(c.id));
    }
    else
    {
      contacts = this.contacts_list.value;
    }

    return contacts;
  }

  // attributes ===============================================================

  // methods ==================================================================

  Add(obj)
  {
    this.contacts_list.Add(obj);
  }

  Remove(obj_id)
  {
    this.contacts_list.Remove(obj_id);
  }

  // events ===================================================================

  On_Render_Item(event)
  {
    const item_elem = event.detail.item_elem;
    const contact = event.detail.obj;

    if (item_elem.contact_title_elem)
    {
      const name = contact.name || contact.email || "N/A";
      const title = Utils.Append_Str(name, contact.agency?.name, " @ ");
      item_elem.contact_title_elem.textContent = title;
    }
    if (item_elem.sel_contact_radio)
    {
      const radio_id = "scr_" + crypto.randomUUID();
      item_elem.sel_contact_radio.id = radio_id;
      item_elem.contact_title_elem.htmlFor = radio_id;
    }
    if (item_elem.contact_email_elem)
      item_elem.contact_email_elem.value = contact.email;
    if (item_elem.contact_phone_elem)
      item_elem.contact_phone_elem.value = contact.phone;
    if (item_elem.contact_position_elem)
      item_elem.contact_position_elem.value = contact.position;
    if (item_elem.contact_linkedin_elem)
      item_elem.contact_linkedin_elem.value = contact.linkedin;
    if (item_elem.localName == "de-contact-details")
      item_elem.value = contact;

    if (item_elem.contact_menu)
      item_elem.contact_menu.event_data = contact;
    if (item_elem.sel_contact_radio)
      item_elem.sel_contact_radio.value = contact.id;
  }

  On_Click_Add(event)
  {
    event.stopPropagation();
    this.dispatchEvent(new CustomEvent("add"));
  }

  On_Click_Sel()
  {
    this.dispatchEvent(new CustomEvent("select"));
  }

  // rendering ================================================================

  // read-only compact list
  Render_Compact()
  {
    const html = `
      <de-input-list cid="contacts_list" hide-header>
        <h3 slot="header">Contacts</h3>
        <de-contact-details slot="item" view-type="compact" class="contact-item"></de-contact-details>
      </de-input-list>
    `;
    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.contacts_list.addEventListener("render", this.On_Render_Item);
  }

  // simple list for selecting a contact
  Render_Select()
  {
    const html = `
      <de-input-list cid="contacts_list">
        <div slot="item" class="contact-item">
          <input type="radio" name="selected_contact_id" cid="sel_contact_radio">
          <label cid="contact_title_elem" class="h2"></label>
        </div>
      </de-input-list>
    `;
    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.contacts_list.addEventListener("render", this.On_Render_Item);
  }

  // compact list with editing options
  Render_Sublist()
  {
    const html = `
      <de-input-list cid="contacts_list">
        <header slot="header">
          <h2>Contacts</h2>
          <button cid="sel_contact_btn" class="img" type="button">
            <img src="image/list.svg" alt="Select Contact">
          </button>
          <button cid="add_contact_btn" class="img" type="button">
            <img src="image/add.svg" alt="Add Contact">
          </button>
        </header>
        <div slot="item" class="contact-item">
          <h2 cid="contact_title_elem"></h2>
          <de-toolbar-menu 
            cid="contact_menu" 
            show-edit label-edit="Edit Contact"
            show-delete label-delete="Delete Contact"
          >
          </de-toolbar-menu>
        </div>
      </de-input-list>
    `;
    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.contacts_list.addEventListener("render", this.On_Render_Item);
    this.add_contact_btn.addEventListener("click", this.On_Click_Add);
    this.sel_contact_btn.addEventListener("click", this.On_Click_Sel);
  }

  // default large list with all editing options
  Render()
  {
    const html = `
      <de-input-list cid="contacts_list">
        <header slot="header">
          <h2>Contacts</h2>
          <button cid="add_contact_btn" class="img" type="button">
            <img src="image/add.svg" alt="Add Contact">
          </button>
        </header>
        <details slot="item" class="contact-item">
          <summary>
            <h2 cid="contact_title_elem"></h2>
            <de-toolbar-menu 
              cid="contact_menu" 
              show-edit label-edit="Edit Contact" 
              show-delete label-delete="Delete Contact"
            >
            </de-toolbar-menu>
          </summary>
          <de-field cid="contact_email_elem" field-label="Email"></de-field>
          <de-field cid="contact_phone_elem" field-label="Phone"></de-field>
          <de-field cid="contact_position_elem" field-label="Position"></de-field>
          <de-field cid="contact_linkedin_elem" field-label="LinkedIn" field-type="link"></de-field>
        </details>
      </de-input-list>
    `;
    //const html_elements = Utils.To_Document(html, this);
    //this.replaceChildren(html_elements);
    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.contacts_list.addEventListener("render", this.On_Render_Item);
    this.add_contact_btn.addEventListener("click", this.On_Click_Add);
  }
}

Utils.Register_Element(DeContactList);
export default DeContactList;