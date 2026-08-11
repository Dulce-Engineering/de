import Utils from "../../../../lib/Utils.js";

/**
 * DeJobDetails is a custom element that displays job details (Company, Duration, Location, Remuneration, Role Title, Role Type, Source, Last Update Time, and Link).
 * It automatically updates its visibility, hiding itself if all fields of the provided job object are empty.
 *
 * @customElement de-job-details
 * 
 * @property {HTMLElement} job_title - The DOM element representing the job details section header (<h3>). Created dynamically by Render.
 * @property {DeField} role_title_elem - The field element representing the job's role title. Created dynamically by Render.
 * @property {DeField} company_elem - The field element representing the job's company. Created dynamically by Render.
 * @property {DeField} role_type_elem - The field element representing the job's role type. Created dynamically by Render.
 * @property {DeField} duration_elem - The field element representing the job's duration. Created dynamically by Render.
 * @property {DeField} location_elem - The field element representing the job's location. Created dynamically by Render.
 * @property {DeField} remuneration_elem - The field element representing the job's remuneration (includes amount and unit). Created dynamically by Render.
 * @property {DeField} source_elem - The field element representing the job's source. Created dynamically by Render.
 * @property {DeField} last_update_elem - The field element representing the job's last update time. Created dynamically by Render.
 * @property {DeField} link_elem - The field element representing the job's external link. Created dynamically by Render.
 */
class DeJobDetails extends HTMLElement
{
  static tname = "de-job-details";

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
   * Sets the job data to be displayed in the component.
   * Updates child fields and adjusts visibility based on whether any job data is present.
   * 
   * @param {Object} job - The job details object.
   * @param {string} [job.company] - The company name.
   * @param {string} [job.duration] - The job duration.
   * @param {string} [job.location] - The job location.
   * @param {number|string} [job.remuneration] - The remuneration amount.
   * @param {string} [job.remuneration_unit] - The remuneration unit (e.g. "per year", "per hour").
   * @param {string} [job.role_title] - The title of the role.
   * @param {string} [job.role_type] - The type of role.
   * @param {string} [job.source] - The source of the job posting.
   * @param {number|string} [job.last_update] - The timestamp or string of the last update.
   * @param {string} [job.link] - The URL/link to the job application/posting.
   */
  set value(job)
  {
    this.role_title_elem.value = job?.role_title;
    this.company_elem.value = job?.company;
    this.role_type_elem.value = job?.role_type;
    this.duration_elem.value = job?.duration;
    this.location_elem.value = job?.location;

    // Format remuneration with unit if available
    let rem_val = "";
    if (job?.remuneration != null && job?.remuneration !== "")
    {
      rem_val = job.remuneration;
      if (job.remuneration_unit)
      {
        rem_val += " " + job.remuneration_unit;
      }
    }
    this.remuneration_elem.value = rem_val;

    this.source_elem.value = job?.source;

    // Format last update time
    let update_time = "";
    if (job?.last_update)
    {
      update_time = typeof job.last_update === "number"
        ? new Date(job.last_update).toLocaleString()
        : job.last_update;
    }
    this.last_update_elem.value = update_time;

    this.link_elem.value = job?.link;

    this.Update_Visibility(job);
  }

  // rendering ================================================================

  /**
   * Updates the display property of the element based on the presence of any job data.
   * If all fields of the job are empty, the element is hidden (display: "none").
   * Otherwise, the element is shown (display: null).
   * 
   * @param {Object} job - The job details object.
   */
  Update_Visibility(job)
  {
    const has_data = job && (
      !Utils.Is_Empty(job.role_title) ||
      !Utils.Is_Empty(job.company) ||
      !Utils.Is_Empty(job.role_type) ||
      !Utils.Is_Empty(job.duration) ||
      !Utils.Is_Empty(job.location) ||
      (job.remuneration != null && job.remuneration !== "") ||
      !Utils.Is_Empty(job.source) ||
      job.last_update ||
      !Utils.Is_Empty(job.link)
    );
    this.style.display = has_data ? null : "none";
  }

  /**
   * Renders the basic DOM structure of the job details layout and sets up
   * shortcut references to dynamic fields.
   */
  Render()
  {
    const html = `
      <h3 cid="job_title">Job Details</h3>
      <de-field cid="role_title_elem" field-label="Role Title"></de-field>
      <de-field cid="company_elem" field-label="Company"></de-field>
      <de-field cid="role_type_elem" field-label="Role Type"></de-field>
      <de-field cid="duration_elem" field-label="Duration"></de-field>
      <de-field cid="location_elem" field-label="Location"></de-field>
      <de-field cid="remuneration_elem" field-label="Remuneration"></de-field>
      <de-field cid="source_elem" field-label="Source"></de-field>
      <de-field cid="last_update_elem" field-label="Last Update"></de-field>
      <de-field cid="link_elem" field-label="Link" field-type="link"></de-field>
    `;
    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");
  }
}

Utils.Register_Element(DeJobDetails);
export default DeJobDetails;
