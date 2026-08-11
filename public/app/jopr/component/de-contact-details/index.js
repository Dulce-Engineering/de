import Utils from "../../../../lib/Utils.js";

/**
 * DeContactDetails is a custom element that displays contact details (Name, Phone, Email, Position, Agency, and LinkedIn profile).
 * It automatically updates its visibility, hiding itself if all fields of the provided contact object are empty.
 *
 * @customElement de-contact-details
 * 
 * @property {HTMLElement} contact_title - The DOM element representing the contact details section header (<h3>). Created dynamically by Render.
 * @property {DeField} contact_name_elem - The field element representing the contact's name. Created dynamically by Render.
 * @property {DeField} contact_phone_elem - The field element representing the contact's phone number. Created dynamically by Render.
 * @property {DeField} contact_email_elem - The field element representing the contact's email address. Created dynamically by Render.
 * @property {DeField} contact_position_elem - The field element representing the contact's job position. Created dynamically by Render.
 * @property {DeField} contact_agency_elem - The field element representing the contact's agency. Created dynamically by Render.
 * @property {DeField} contact_linkedin_elem - The field element representing the contact's LinkedIn profile. Created dynamically by Render.
 */
class DeContactDetails extends HTMLElement
{
  static tname = "de-contact-details";

  constructor()
  {
    super();
  }

  /**
   * Lifecycle callback invoked when the element is added to the document.
   * Triggers the initial rendering of the component.
   */
  connectedCallback()
  {
    this.Render();
  }

  // properties ===============================================================

  /**
   * Sets the contact data to be displayed in the component.
   * Updates child fields and adjusts visibility based on whether any contact data is present.
   * 
   * @param {Object} contact - The contact details object.
   * @param {string} [contact.name] - The name of the contact.
   * @param {string} [contact.phone] - The phone number of the contact.
   * @param {string} [contact.email] - The email address of the contact.
   * @param {string} [contact.position] - The job position of the contact.
   * @param {string} [contact.agency_name] - The name of the agency associated with the contact.
   * @param {string} [contact.linkedin] - The LinkedIn profile URL.
   */
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

  // rendering ================================================================

  /**
   * Updates the display property of the element based on the presence of any contact data.
   * If all fields of the contact are empty, the element is hidden (display: "none").
   * Otherwise, the element is shown (display: null).
   * 
   * @param {Object} contact - The contact details object.
   */
  Update_Visibility(contact)
  {
    const has_data = contact && (
      !Utils.Is_Empty(contact.name) ||
      !Utils.Is_Empty(contact.phone) ||
      !Utils.Is_Empty(contact.email) ||
      !Utils.Is_Empty(contact.position) ||
      !Utils.Is_Empty(contact.agency_name) ||
      !Utils.Is_Empty(contact.linkedin)
    );
    this.style.display = has_data ? null : "none";
  }

  /**
   * Renders the basic DOM structure of the contact details layout and sets up
   * shortcut references to dynamic fields.
   */
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