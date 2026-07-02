import Utils from "../../../../lib/Utils.js";

class DeContactList extends HTMLElement
{
  static tname = "de-contact-list";

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
  
  set value(data)
  {
    this.contacts_list.value = data;
  }

  get value()
  {
    return this.contacts_list.value;
  }

  // attributes ===============================================================

  // methods ==================================================================

  // events ===================================================================

  On_Render_Item(event)
  {
    const item_elem = event.detail.item_elem;
    const contact = event.detail.obj;
    const contact_id = contact.id;

    const name = contact.name || contact.email || "N/A";
    const title = Utils.Append_Str(name, contact.agency?.name, " @ ");
    item_elem.contact_title_elem.textContent = title;

    item_elem.contact_email_elem.value = contact.email;
    item_elem.contact_phone_elem.value = contact.phone;
    item_elem.contact_position_elem.value = contact.position;
    item_elem.contact_linkedin_elem.value = contact.linkedin;
    item_elem.contact_menu.event_data = contact;
  }

  On_Click_Add()
  {
    this.dispatchEvent(new CustomEvent("add"));
  }

  // rendering ================================================================

  Render()
  {
    const html = `
      <de-input-list cid="contacts_list">
        <header slot="header">
          <h2>Contacts</h2>
          <button cid="add_contact_btn" class="img">
            <img src="image/add.svg" alt="Add Contact">
          </button>
        </header>
        <details slot="item" class="contact-item">
          <summary>
            <h2 cid="contact_title_elem"></h2>
            <de-toolbar-menu cid="contact_menu" 
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