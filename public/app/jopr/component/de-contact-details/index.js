import Utils from "../../../../lib/Utils.js";

class DeContactDetails extends HTMLElement
{
  static tname = "de-contact-details";

  constructor()
  {
    super();
    //Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  // properties ===============================================================

  set value(contact)
  {
    this.contact_name_elem.value = contact?.name;
    this.contact_phone_elem.value = contact?.phone;
    this.contact_email_elem.value = contact?.email;
    this.contact_position_elem.value = contact?.position;
    this.contact_agency_elem.value = contact?.agency_name;
    this.contact_linkedin_elem.value = contact?.linkedin;
    this.Update_Visibility(contact);
  }

  get value()
  {
  }
  
  // attributes ===============================================================

  // methods ==================================================================

  // events ===================================================================

  // rendering ================================================================

  Update_Visibility(contact)
  {
    const has_data =
      !Utils.Is_Empty(contact.name) ||
      !Utils.Is_Empty(contact.phone) ||
      !Utils.Is_Empty(contact.email) ||
      !Utils.Is_Empty(contact.position) ||
      !Utils.Is_Empty(contact.agency_name) ||
      !Utils.Is_Empty(contact.linkedin);
    this.style.display = has_data ? null : "none";
  }

  Render()
  {
    const html = `
      <h3 cid="contact_title">Contact Details</h3>
      <de-field cid="contact_name_elem" field-label="Name"></de-field>
      <de-field cid="contact_phone_elem" field-label="Phone" field-type="phone"></de-field>
      <de-field cid="contact_email_elem" field-label="Email" field-type="email"></de-field>
      <de-field cid="contact_position_elem" field-label="Position"></de-field>
      <de-field cid="contact_agency_elem" field-label="Agency"></de-field>
      <de-field cid="contact_linkedin_elem" field-label="LinkedIn" field-type="link"></de-field>
    `;
    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");
  }
}

Utils.Register_Element(DeContactDetails);
export default DeContactDetails;