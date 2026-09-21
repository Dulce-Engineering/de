import Utils from "../../../../lib/Utils.js";
const html_local_url = "./layout.html";
const html_url = new URL(html_local_url, import.meta.url).href;

/**
 * Custom HTML Element representing a list of projects.
 * Renders a list of projects, allows editing, adding, and deleting projects,
 * and manages associated dialog forms for these operations.
 * 
 * @extends HTMLElement
 * @element de-project-list
 */
class DeProjectList extends HTMLElement
{
  /**
   * Tag name of the custom element.
   * @type {string}
   */
  static tname = "de-project-list";

  /**
   * Creates an instance of DeProjectList.
   */
  constructor()
  {
    super();
    Utils.Bind(this, "On_");
    
    /**
     * The view mode of the project list.
     * @type {string}
     */
    this.view_type = "list";
    
    /**
     * Callback function to save or update a project.
     * @type {function(Object): Promise<number|string|null>|null}
     */
    this.save_fn = null;
    
    /**
     * Callback function to delete a project.
     * @type {function(number|string): Promise<boolean>|null}
     */
    this.delete_fn = null;
  }

  /**
   * Lifecycle callback invoked when the element is appended to the document.
   */
  connectedCallback()
  {
    /*if (this.hasAttribute("view-type"))
    {
      const view_type = this.getAttribute("view-type");
      if (view_type == "select")
      {
        this.view_type = "select";
        this.Render_Select();
      }
      else if (view_type == "sublist")
      {
        this.view_type = "sublist";
        this.Render_Sublist();
      }
    }
    else*/
    {
      this.view_type = "list";
      this.Render();
    }
  }

  // properties ===============================================================
  
  /**
   * Sets the project list value.
   * @param {Array<Object>} data - An array of project objects.
   */
  set value(data)
  {
    this.project_list.value = data;
  }

  /**
   * Gets the list of projects.
   * @returns {Array<Object>|null} The array of project objects, or null.
   */
  get value()
  {
    let projects = null;

    /*const view_type = this.getAttribute("view-type");
    if (view_type == "select")
    {
      const selected_elements = 
        this.contacts_list.items_elem.querySelectorAll("[name=selected_contact_id]:checked");
      const selected_ids = Array.from(selected_elements).map(e => parseInt(e.value));
      projects = this.contacts_list.value.filter(c => selected_ids.includes(c.id));
    }
    else*/
    {
      projects = this.project_list.value;
    }

    return projects;

  }

  // attributes ===============================================================

  // methods ==================================================================

  /**
   * Adds a project to the list.
   * @param {Object} obj - The project object to add.
   */
  Add(obj)
  {
    this.project_list.Add(obj);
  }

  /**
   * Removes a project from the list by its ID.
   * @param {number|string} obj_id - The ID of the project to remove.
   */
  Remove(obj_id)
  {
    this.project_list.Remove(obj_id);
  }

  /**
   * Asynchronously updates or saves a project and refreshes the list display.
   * @param {Object} project - The project object to save.
   * @returns {Promise<void>}
   */
  async Update_Project(project)
  {
    const project_id = await this.save_fn(project);
    if (project_id)
    {
      project.id = project_id;
      this.project_list.Add(project);
      this.Alert("Project saved successfully.");
    }
    else
    {
      this.Alert("Failed to save project.");
    }
  }

  /**
   * Dispatches a custom alert event.
   * @param {string} msg - The message payload.
   */
  Alert(msg)
  {
    this.dispatchEvent(new CustomEvent("alert", { detail: msg, bubbles: true }));
  }

  // events ===================================================================

  /**
   * Handles rendering of an individual project item within the input list.
   * @param {CustomEvent} event - The custom render event containing item_elem and obj.
   */
  On_Render_Item(event)
  {
    const item_elem = event.detail.item_elem;
    const project = event.detail.obj;

    item_elem.project_title_elem.textContent = project.title;
    /*if (this.view_type == "select")
    {
      const radio_id = "scr_" + crypto.randomUUID();
      item_elem.sel_contact_radio.id = radio_id;
      item_elem.project_title_elem.htmlFor = radio_id;
    }*/

    if (item_elem.project_url_elem)
      item_elem.project_url_elem.value = project.url;
    if (item_elem.project_description_elem)
      item_elem.project_description_elem.value = project.description;
    if (item_elem.project_tech_elem)
      item_elem.project_tech_elem.value = project.tech;

    if (item_elem.project_item_menu)
      item_elem.project_item_menu.event_data = project;
    if (item_elem.sel_project_radio)
      item_elem.sel_project_radio.value = project.id;
  }

  /**
   * Handles click/trigger events for editing a project.
   * Opens the edit dialog form and saves updates upon submission.
   * @param {CustomEvent} event - The event containing the project details.
   * @returns {Promise<void>}
   */
  async On_Click_Edit(event)
  {
    const project = event.detail;
    const form_data = await this.project_dialog.Show_Async(project);
    if (form_data)
    {
      const new_obj = {...project, ...form_data};
      await this.Update_Project(new_obj);
    }
  }

  /**
   * Handles click/trigger events for deleting a project.
   * Shows a confirmation warning, invokes the delete callback, and removes the project from list if confirmed.
   * @param {CustomEvent} event - The event containing project data.
   * @returns {Promise<void>}
   */
  async On_Click_Delete(event)
  {
    const project_id = event.detail.id;
    const msg = "Are you sure you want to delete this project?";
    const confirmed = await this.warning_dlg.Confirm(msg);
    if (confirmed)
    {
      const is_deleted = await this.delete_fn(project_id);
      if (is_deleted)
      {
        this.project_list.Remove(project_id);
        this.Alert("Contact deleted successfully.");
      }
      else
      {
        this.Alert("Failed to delete contact.");
      }
    }
  }

  // rendering ================================================================

  /**
   * Renders the custom element's inner HTML template and sets up its element shortcuts and event listeners.
   */
  async Render()
  {
    const html = await Utils.Import_HTML(html_url);
    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.project_list.addEventListener("render", this.On_Render_Item);
    this.project_list.addEventListener("add", this.On_Click_Edit);
    this.project_list.addEventListener("edit", this.On_Click_Edit);
    this.project_list.addEventListener("delete", this.On_Click_Delete);
  }
}

Utils.Register_Element(DeProjectList);
export default DeProjectList;