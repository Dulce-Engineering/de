import Utils from "../../../../lib/Utils.js";

class DeContactForm extends HTMLElement
{
  static tname = "de-contact-form";

  constructor()
  {
    super();
    //Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }
  
  Show(contact)
  {
    return this.contact_dialog.Show_Async(contact);
  }

  Render()
  {
    const html = `
      <de-dialog-form cid="contact_dialog">
        <h2 slot="header">Add Contact</h2>

        <label slot="fields">Name</label>
        <input slot="fields" type="text" name="name">

        <label slot="fields">Phone</label>
        <input slot="fields" type="tel" name="phone">

        <label slot="fields">Position</label>
        <input slot="fields" type="text" name="position">

        <label slot="fields">Agency</label>
        <select cid="agency_select" slot="fields" name="agency_id"></select>

        <label cid="email_label" slot="fields">Email</label>
        <input slot="fields" type="email" name="email">

        <label cid="linkedin_label" slot="fields">LinkedIn</label>
        <input slot="fields" type="text" name="linkedin">
      </de-dialog-form>
    `;
    //const html_elements = Utils.To_Document(html, this);
    //this.replaceChildren(html_elements);
    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");
  }
}

Utils.Register_Element(DeContactForm);
export default DeContactForm;