import Utils from "../../../../lib/Utils.js";

const html_local_url = "./layout.html";
const html_url = new URL(html_local_url, import.meta.url).href;

/**
 * Recurrence configuration structure for timers.
 * @typedef {Object} TimerRecurrence
 * @property {number} [rate] - Repeat interval rate.
 * @property {'SCALE_DAY'|'SCALE_WEEK'|'SCALE_MONTH'|'SCALE_YEAR'} [scale] - Repeat time scale.
 * @property {Array<string>} [weekdays] - Selected days of the week when recurring weekly.
 * @property {'MONTH_DAY'|'MONTH_WEEK'} [month] - Month recurrence rule mode.
 */

/**
 * Data structure representing a Timer entity.
 * @typedef {Object} Timer
 * @property {number|string} [id] - Unique identifier of the timer.
 * @property {string} [title] - Title/label of the timer event.
 * @property {string|null} [description] - Detailed description of the timer.
 * @property {number} [time] - Target completion timestamp in milliseconds.
 * @property {TimerRecurrence} [recurrence] - Optional recurrence rule for recurring timers.
 * @property {boolean} [triggered] - Whether the timer alarm has fired.
 */

/**
 * DeEvent is a Web Component that encapsulates the display and interaction logic
 * of an individual countdown timer event in the Tempustoi PWA.
 * 
 * It manages the header display (title, formatted scheduled time, overdue indicator,
 * and action controls: silence, view, edit, toggle/pause, delete) and hosts a `<de-timer>`
 * element to display animated countdown dials.
 *
 * @customElement de-event
 * 
 * @property {HTMLElement} title_elem - Header label container for the timer title and timestamp.
 * @property {HTMLElement} time_elem - Element displaying the formatted event time.
 * @property {HTMLElement} overdue_elem - Badge element displayed when the timer timestamp is past due.
 * @property {HTMLElement} title_text_elem - Element displaying the timer title text.
 * @property {HTMLButtonElement} quiet_btn - Button to silence/dismiss an active alarm.
 * @property {HTMLButtonElement} view_btn - Button to view detailed timer information.
 * @property {HTMLButtonElement} edit_btn - Button to trigger timer editing dialog.
 * @property {HTMLButtonElement} stop_btn - Button to pause or resume countdown.
 * @property {HTMLButtonElement} del_btn - Button to trigger timer deletion confirmation.
 * @property {HTMLElement} timer_elem - The child `<de-timer>` countdown component instance.
 * @property {Timer|null} timer - The current timer data object.
 * 
 * @fires CustomEvent#view - Dispatched when the user clicks the view button.
 * @fires CustomEvent#edit - Dispatched when the user clicks the edit button.
 * @fires CustomEvent#delete - Dispatched when the user clicks the delete button.
 * @fires CustomEvent#stop - Dispatched when the user clicks the pause/stop toggle button.
 * @fires CustomEvent#quiet - Dispatched when the user clicks the silence button.
 * @fires CustomEvent#completed - Dispatched when the countdown finishes and triggers.
 */
class DeEvent extends HTMLElement
{
  static tname = "de-event";

  /**
   * Initializes the DeEvent component instance and binds event handler methods.
   */
  constructor()
  {
    super();
    Utils.Bind(this, "On_");

    this.rendered = false;
    this.pending_value = null;
    this.timer = null;
  }

  /**
   * Lifecycle callback invoked when the element is inserted into the DOM.
   * Triggers template rendering and event registration.
   */
  connectedCallback()
  {
    this.Render();
  }

  // properties ===============================================================

  /**
   * Sets the timer data model object and refreshes the component display.
   * 
   * @param {Timer} v - Timer data object.
   */
  set value(v)
  {
    this.timer = v;
    if (this.rendered)
    {
      this.Update();
    }
    else
    {
      this.pending_value = v;
    }
  }

  /**
   * Gets the current timer data model object.
   * 
   * @returns {Timer|null} The current timer object.
   */
  get value()
  {
    return this.timer;
  }

  // methods ==================================================================

  /**
   * Formats a recurrence configuration into a human-readable text string.
   * 
   * @param {TimerRecurrence} recurrence - The recurrence configuration object.
   * @returns {string|null} Formatted recurrence text or null if non-recurring.
   */
  static Format_Recurrence(recurrence)
  {
    if (!recurrence || !recurrence.rate || recurrence.rate <= 0)
    {
      return null;
    }

    const rate = recurrence.rate;
    const scale = recurrence.scale;
    let scale_str = "";

    switch (scale)
    {
      case "SCALE_DAY":
        scale_str = rate === 1 ? "day" : "days";
        break;
      case "SCALE_WEEK":
        scale_str = rate === 1 ? "week" : "weeks";
        break;
      case "SCALE_MONTH":
        scale_str = rate === 1 ? "month" : "months";
        break;
      case "SCALE_YEAR":
        scale_str = rate === 1 ? "year" : "years";
        break;
      default:
        return null;
    }

    let text = rate === 1 ? "Every " + scale_str : "Every " + rate + " " + scale_str;

    if (scale === "SCALE_WEEK" && recurrence.weekdays && recurrence.weekdays.length > 0)
    {
      const day_map = {
        "WEEKDAYS_MONDAY": "Monday",
        "WEEKDAYS_TUESDAY": "Tuesday",
        "WEEKDAYS_WEDNESDAY": "Wednesday",
        "WEEKDAYS_THURSDAY": "Thursday",
        "WEEKDAYS_FRIDAY": "Friday",
        "WEEKDAYS_SATURDAY": "Saturday",
        "WEEKDAYS_SUNDAY": "Sunday"
      };
      const days = recurrence.weekdays.map(d => day_map[d] || d);
      text += " on " + days.join(", ");
    }

    if (scale === "SCALE_MONTH" && recurrence.month)
    {
      if (recurrence.month === "MONTH_DAY")
      {
        text += " on the same day of the month";
      }
      else if (recurrence.month === "MONTH_WEEK")
      {
        text += " on the same day and week of the month";
      }
    }

    return text;
  }

  /**
   * Determines whether the current timer timestamp has elapsed.
   * 
   * @returns {boolean} True if the timer is past due.
   */
  Is_Overdue()
  {
    return this.timer && this.timer.time ? this.timer.time <= Date.now() : false;
  }

  /**
   * Sets or clears the active alarm state and toggles the silence button.
   * 
   * @param {boolean} [active=true] - True to activate alarm visual styles, false to deactivate.
   */
  Set_Alarm(active = true)
  {
    if (this.quiet_btn)
    {
      this.quiet_btn.hidden = !active;
    }
    if (active)
    {
      this.classList.add("alarm");
    }
    else
    {
      this.classList.remove("alarm");
    }
  }

  /**
   * Applies dial animation CSS classes based on user preferences in localStorage.
   */
  Set_Animations()
  {
    let show_animations = true;
    const show_animations_str = localStorage.getItem("tempustoi-show-anim");
    if (show_animations_str)
    {
      show_animations = JSON.parse(show_animations_str);
    }
    if (show_animations)
    {
      const dial_seconds = this.querySelector(".seconds");
      dial_seconds?.classList.add("anim-seconds");

      const dial_minutes = this.querySelector(".minutes");
      dial_minutes?.classList.add("anim-minutes");

      const dial_hours = this.querySelector(".hours");
      dial_hours?.classList.add("anim-hours");

      const dial_days = this.querySelector(".days");
      dial_days?.classList.add("anim-days");
    }
  }

  /**
   * Updates the timer title, formatted date/time string, and overdue badge.
   */
  Render_Title()
  {
    if (!this.timer) return;

    if (this.timer.time)
    {
      const date = new Date(this.timer.time);
      const date_format =
      {
        weekday: "short",
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      };
      const date_str = date.toLocaleString(undefined, date_format);
      this.time_elem.textContent = date_str;

      if (this.Is_Overdue())
      {
        this.overdue_elem.style.display = null;
      }
      else
      {
        this.overdue_elem.style.display = "none";
      }
    }
    else
    {
      this.time_elem.textContent = "";
      this.overdue_elem.style.display = "none";
    }

    if (this.timer.title)
    {
      this.title_text_elem.textContent = this.timer.title;
    }
    else
    {
      this.title_text_elem.textContent = "";
    }

    if (this.timer.time || this.timer.title)
    {
      this.title_elem.style.display = null;
    }
    else
    {
      this.title_elem.style.display = "none";
    }
  }

  /**
   * Synchronizes all visual elements and the child countdown timer with current timer state.
   */
  Update()
  {
    if (!this.timer) return;

    this.Render_Title();

    if (this.timer_elem)
    {
      this.timer_elem.timer = this.timer;
      this.timer_elem.time = this.timer.time;
      if (this.Is_Overdue())
      {
        this.timer_elem.classList.add("overdue");
      }
      else
      {
        this.timer_elem.classList.remove("overdue");
      }
      this.timer_elem.start?.();
    }

    this.Set_Animations();
  }

  /**
   * Pauses the countdown timer.
   */
  Stop()
  {
    this.timer_elem?.stop?.();
  }

  /**
   * Toggles the countdown timer between running and paused states.
   */
  Toggle()
  {
    this.timer_elem?.toggle?.();
  }

  // events ===================================================================

  /**
   * Handles click on the View button and dispatches a 'view' event.
   * @param {MouseEvent} [e] - Click event.
   */
  On_Click_View(e)
  {
    e?.stopPropagation?.();
    this.dispatchEvent(new CustomEvent("view", {
      detail: { timer: this.timer },
      bubbles: true,
      composed: true
    }));
  }

  /**
   * Handles click on the Edit button and dispatches an 'edit' event.
   * @param {MouseEvent} [e] - Click event.
   */
  On_Click_Edit(e)
  {
    e?.stopPropagation?.();
    this.dispatchEvent(new CustomEvent("edit", {
      detail: { timer: this.timer },
      bubbles: true,
      composed: true
    }));
  }

  /**
   * Handles click on the Delete button and dispatches a 'delete' event.
   * @param {MouseEvent} [e] - Click event.
   */
  On_Click_Delete(e)
  {
    e?.stopPropagation?.();
    this.dispatchEvent(new CustomEvent("delete", {
      detail: { timer: this.timer },
      bubbles: true,
      composed: true
    }));
  }

  /**
   * Handles click on the Stop/Pause button, toggles timer state, and dispatches a 'stop' event.
   * @param {MouseEvent} [e] - Click event.
   */
  On_Click_Stop(e)
  {
    e?.stopPropagation?.();
    this.Toggle();
    this.dispatchEvent(new CustomEvent("stop", {
      detail: { timer: this.timer },
      bubbles: true,
      composed: true
    }));
  }

  /**
   * Handles click on the Silence button, clears alarm state, and dispatches a 'quiet' event.
   * @param {MouseEvent} [e] - Click event.
   */
  On_Click_Quiet(e)
  {
    e?.stopPropagation?.();
    this.Set_Alarm(false);
    this.dispatchEvent(new CustomEvent("quiet", {
      detail: { timer: this.timer },
      bubbles: true,
      composed: true
    }));
  }

  /**
   * Handles click events on the countdown dials.
   * @param {MouseEvent} event - Click event.
   */
  On_Timer_Click(event)
  {
    const elems = event.composedPath();
    const counter_elem = elems.find(elem => elem.classList?.contains("counter"));
    if (counter_elem && this.timer_elem?.On_Dial_Completed)
    {
      this.timer_elem.On_Dial_Completed(counter_elem);
    }
  }

  /**
   * Handles the 'completed' event from the child timer, activates alarm, and dispatches 'completed'.
   * @param {CustomEvent} [e] - Completed event.
   */
  On_Timer_Completed(e)
  {
    if (this.timer && (!this.timer.recurrence || !this.timer.recurrence.rate || this.timer.recurrence.rate <= 0))
    {
      this.timer.triggered = true;
    }
    this.Set_Alarm(true);
    this.dispatchEvent(new CustomEvent("completed", {
      detail: { timer: this.timer },
      bubbles: true,
      composed: true
    }));
  }

  // rendering ================================================================

  /**
   * Imports the layout template, populates the component, sets up element shortcuts,
   * attaches event listeners, and initializes data if pending.
   */
  async Render()
  {
    const html = await Utils.Import_HTML(html_url);
    const html_elements = Utils.To_Document(html, this);
    this.replaceChildren(html_elements);
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.view_btn.addEventListener("click", this.On_Click_View);
    this.edit_btn.addEventListener("click", this.On_Click_Edit);
    this.del_btn.addEventListener("click", this.On_Click_Delete);
    this.stop_btn.addEventListener("click", this.On_Click_Stop);
    this.quiet_btn.addEventListener("click", this.On_Click_Quiet);

    this.timer_elem.addEventListener("click", this.On_Timer_Click);
    this.timer_elem.addEventListener("completed", this.On_Timer_Completed);

    this.rendered = true;
    if (this.pending_value)
    {
      this.value = this.pending_value;
      this.pending_value = null;
    }
  }
}

Utils.Register_Element(DeEvent);
export default DeEvent;
