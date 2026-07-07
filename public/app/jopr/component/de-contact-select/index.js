import Utils from "../../../../lib/Utils.js";

class DeContactSelect extends HTMLElement
{
  static tname = "de-contact-select";

  all_contacts = null;

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

  set value(obj)
  {
  }

  get value()
  {
  }
  
  // attributes ===============================================================

  // methods ==================================================================

  // events ===================================================================

  async On_Click_Delete_Job_Contact(event)
  {
    const contact = event.detail;
    this.job_contacts.contacts_list.Remove(contact);
  }

  async On_Click_Add_Contact(event)
  {
    const contact = await contact_dialog.Show();
    if (contact)
    {
      this.job_contacts.contacts_list.Add(contact);
    }
  }

  async On_Click_Select_Contact(event)
  {
    const contacts = this.all_contacts;
    const dlg_data = await this.contact_list_dialog.Show_Async({contacts});
    if (!Utils.Is_Empty(dlg_data.contacts))
    {
      const contact = dlg_data.contacts[0];
      this.job_contacts.contacts_list.Add(contact);
    }
  }

  // rendering ================================================================

  Render()
  {
    const html = `
      <de-contact-list 
        cid="job_contacts" 
        slot="fields" 
        name="contacts"
        view-type="sublist"
      >
      </de-contact-list>
      <de-dialog-form id="contact_list_dialog">
        <de-contact-list 
          id="dlg_contact_list" 
          slot="fields" 
          name="contacts"
          view-type="select"
        >
        </de-contact-list>
      </de-dialog-form>
    `;
    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.job_contacts.addEventListener("add", this.On_Click_Add_Contact);
    this.job_contacts.addEventListener("select", this.On_Click_Select_Contact);
    this.job_contacts.addEventListener("delete", this.On_Click_Delete_Job_Contact);
  }
}

Utils.Register_Element(DeContactSelect);
export default DeContactSelect;