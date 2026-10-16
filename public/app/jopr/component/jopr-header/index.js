import Utils from "../../../../lib/Utils.js";
import * as StatsDefault from "../../../job-woper/lib/index.js?v=2";

/**
 * DeJoprHeader is a light DOM custom web component encapsulating the header
 * bar of the JOPR application, including the trend line chart, clock,
 * brand title, navigation toolbar, and terminal alert output element.
 *
 * @customElement jopr-header
 * @tag jopr-header
 * @attribute {string} [active-page="jobs"] - The currently active page ("jobs", "profile"|"profiles", or "other").
 * @attribute {string} [title-text="JOPR"] - The title text displayed in the header.
 * @attribute {boolean} [hide-nav] - Whether to hide the navigation toolbar.
 * @attribute {boolean} [hide-chart] - Whether to hide the trend line chart.
 * @attribute {boolean} [hide-clock] - Whether to hide the clock element.
 * @attribute {boolean} [show-companies] - Whether to show the companies button.
 * @attribute {boolean} [show-contacts] - Whether to show the contacts button.
 * @attribute {string} [analysis-href="../job-woper"] - URL for market analysis.
 * 
 * @property {HTMLElement} hdr_elem - The root <header id="hdr_elem"> element.
 * @property {HTMLElement} chart_container - Container wrapping the de-line-chart.
 * @property {HTMLElement} chart_elem - The <de-line-chart> element.
 * @property {HTMLElement} title_elem - The <h1 class="title"> element.
 * @property {HTMLElement} clock_elem - The <de-clock-2> element.
 * @property {HTMLElement} nav_elem - The <nav id="nav_elem"> element.
 * @property {HTMLButtonElement} import_btn - The upload / import button.
 * @property {HTMLButtonElement} export_btn - The download / export button.
 * @property {HTMLElement} jobs_btn - The jobs button or link.
 * @property {HTMLElement} profile_btn - The profile button or link.
 * @property {HTMLButtonElement} companies_btn - The companies button.
 * @property {HTMLButtonElement} contacts_btn - The contacts button.
 * @property {HTMLAnchorElement} analysis_btn - The market analysis link.
 * @property {HTMLOutputElement} alert_elem - The terminal <output id="alert_elem">.
 */
class JoprHeader extends HTMLElement
{
  static tname = "jopr-header";

  static observedAttributes =
  [
    "active-page",
    "title-text",
    "hide-nav",
    "hide-chart",
    "hide-clock",
    "show-companies",
    "show-contacts"
  ];

  /** @type {number|null} */
  chart_interval_id = null;

  /** @type {number|null} */
  alert_timer_id = null;

  /** @type {Object|null} */
  ctx = null;

  /** @type {Object|null} */
  stats = null;

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  disconnectedCallback()
  {
    this.Stop_Chart_Timer();
    this.Clear_Alert_Timers();
  }

  attributeChangedCallback(name, old_value, new_value)
  {
    if (old_value === new_value) return;

    if (!this.hdr_elem) return;

    switch (name)
    {
      case "active-page":
        this.Render_Nav();
        break;
      case "title-text":
        if (this.title_elem)
        {
          this.title_elem.innerHTML = `${new_value || "JOPR"}&nbsp;&nbsp;&nbsp;`;
        }
        break;
      case "hide-nav":
        this.Show_Nav(new_value === null);
        break;
      case "hide-chart":
        if (this.chart_container)
        {
          const hide = new_value !== null;
          this.chart_container.classList.toggle("hidden", hide);
          if (hide)
          {
            this.Stop_Chart_Timer();
          }
          else
          {
            this.Start_Chart_Timer();
          }
        }
        break;
      case "hide-clock":
        if (this.clock_elem)
        {
          this.clock_elem.classList.toggle("hidden", new_value !== null);
        }
        break;
      case "show-companies":
        this.Show_Companies(new_value !== null);
        break;
      case "show-contacts":
        this.Show_Contacts(new_value !== null);
        break;
    }
  }

  // Properties ===============================================================

  get active_page()
  {
    return this.getAttribute("active-page") || "jobs";
  }

  set active_page(val)
  {
    if (val)
    {
      this.setAttribute("active-page", val);
    }
    else
    {
      this.removeAttribute("active-page");
    }
  }

  get title_text()
  {
    return this.getAttribute("title-text") || "JOPR";
  }

  set title_text(val)
  {
    if (val)
    {
      this.setAttribute("title-text", val);
    }
    else
    {
      this.removeAttribute("title-text");
    }
  }

  // Public Methods ===========================================================

  /**
   * Displays an animated typewriter-style alert inside alert_elem.
   * Clears any active alert timers before running.
   * 
   * @param {string} msg - Message to display.
   * @param {number} [char_millis=35] - Milliseconds per character typed/cleared.
   * @param {number} [wait_millis=5000] - Duration to hold message before backspacing.
   */
  Alert(msg, char_millis = 35, wait_millis = 5000)
  {
    this.Clear_Alert_Timers();

    if (!this.alert_elem) return;
    if (!msg)
    {
      this.alert_elem.textContent = "";
      return;
    }

    const On_Completed_Clr = () =>
    {
      if (this.alert_elem) this.alert_elem.textContent = "";
    };

    const On_Completed_Reverse = () =>
    {
      this.alert_timer_id = setTimeout(() =>
      {
        On_Render(msg.length, -1, On_Completed_Clr);
      }, wait_millis);
    };

    const On_Render = (length, step, on_complete_fn) =>
    {
      if (!this.alert_elem) return;
      this.alert_elem.textContent = "[ " + msg.substring(0, length) + " ]";
      if ((step > 0 && length <= msg.length) || (step < 0 && length >= 0))
      {
        this.alert_timer_id = setTimeout(() =>
        {
          On_Render(length + step, step, on_complete_fn);
        }, char_millis);
      }
      else if (on_complete_fn)
      {
        on_complete_fn();
      }
    };

    On_Render(0, 1, On_Completed_Reverse);
  }

  /**
   * Clears all running alert animation timers and resets alert output text.
   */
  Clear_Alert_Timers()
  {
    if (this.alert_timer_id)
    {
      clearTimeout(this.alert_timer_id);
      this.alert_timer_id = null;
    }
    if (this.alert_elem)
    {
      this.alert_elem.textContent = "";
    }
  }

  /**
   * Toggles visibility of the navigation toolbar.
   * @param {boolean} [show=true]
   */
  Show_Nav(show = true)
  {
    if (this.nav_elem)
    {
      this.nav_elem.classList.toggle("hidden", !show);
    }
  }

  /**
   * Hides the navigation toolbar.
   */
  Hide_Nav()
  {
    this.Show_Nav(false);
  }

  /**
   * Toggles visibility of the companies button.
   * @param {boolean} [show=true]
   */
  Show_Companies(show = true)
  {
    if (this.companies_btn)
    {
      this.companies_btn.classList.toggle("hidden", !show);
    }
  }

  /**
   * Toggles visibility of the contacts button.
   * @param {boolean} [show=true]
   */
  Show_Contacts(show = true)
  {
    if (this.contacts_btn)
    {
      this.contacts_btn.classList.toggle("hidden", !show);
    }
  }

  /**
   * Sets trend styling and tooltip on the chart element.
   * @param {"up"|"down"|"flat"|null} direction
   * @param {string} title_html
   */
  Set_Trend(direction, title_html)
  {
    if (!this.chart_elem) return;

    if (this.chart_elem.svg)
    {
      this.chart_elem.svg.classList.remove("trend-up", "trend-down", "trend-flat");
      if (direction === "up")
      {
        this.chart_elem.svg.classList.add("trend-up");
      }
      else if (direction === "down")
      {
        this.chart_elem.svg.classList.add("trend-down");
      }
      else if (direction === "flat")
      {
        this.chart_elem.svg.classList.add("trend-flat");
      }
    }

    if (title_html)
    {
      this.chart_elem.setAttribute("title", title_html);
    }
  }

  /**
   * Updates trend line chart by querying Stats dataset if available.
   * @param {Object} [ctx] - Application context object.
   * @param {Object} [stats] - Optional Stats module (e.g., job-woper Stats).
   * @returns {Promise<void>}
   */
  async Update_Chart(ctx, stats)
  {
    const Stats = stats || this.stats || window.Stats || StatsDefault;
    const effective_utils = ctx?.Utils || this.ctx?.Utils || window.ctx?.Utils || Utils;

    if (!Stats?.Query?.Select_All || !Stats?.Trend?.Select_By_Query_Id)
    {
      return;
    }

    try
    {
      const queries = await Stats.Query.Select_All();
      const seek_queries = queries ? queries.filter(q => q.src == "seek") : [];
      if (!seek_queries.length) return;

      const random_index = Math.floor(Math.random() * seek_queries.length);
      const query = seek_queries[random_index];
      const query_id = query.id;
      const millis_week = effective_utils?.MILLIS_WEEK || Utils.MILLIS_WEEK || (7 * 24 * 60 * 60 * 1000);
      const one_week_ago = Date.now() - (millis_week * 4);
      const data = await Stats.Trend.Select_By_Query_Id(query_id);
      const recent_data = data ? data.filter(d => d.datetime >= one_week_ago) : [];

      if (recent_data && recent_data.length > 0 && this.chart_elem)
      {
        const chart_data = recent_data.map(t => ({ x: t.datetime, y: t.count }));
        this.chart_elem.items = { "items": chart_data };

        const chart_data_by_time = chart_data.sort((a, b) => a.x - b.x);
        const start_count = chart_data_by_time[0].y;
        const end_count = chart_data_by_time[chart_data_by_time.length - 1].y;
        const diff_count = end_count - start_count;
        const percent_change = start_count !== 0 ? (diff_count / start_count * 100) : 0;
        const title_html = query.title + "<br>" + percent_change.toFixed(2) + "%";

        const direction = percent_change > 0 ? "up" : (percent_change < 0 ? "down" : "flat");
        this.Set_Trend(direction, title_html);
      }
      else if (this.chart_elem)
      {
        this.chart_elem.items = null;
      }
    }
    catch (err)
    {
      console.warn("Failed to update chart in jopr-header:", err);
    }
  }

  /**
   * Starts recurring chart update timer and renders initial chart.
   * @param {Object} [ctx] - Application context object.
   * @param {Object} [stats] - Optional Stats module.
   * @param {number} [interval_millis=60000] - Timer interval in milliseconds.
   */
  Start_Chart_Timer(ctx, stats, interval_millis = 60000)
  {
    if (ctx) this.ctx = ctx;
    if (stats) this.stats = stats;
    this.Stop_Chart_Timer();
    this.Update_Chart(this.ctx, this.stats);
    this.chart_interval_id = setInterval(() => this.Update_Chart(this.ctx, this.stats), interval_millis);
  }

  /**
   * Stops recurring chart update timer.
   */
  Stop_Chart_Timer()
  {
    if (this.chart_interval_id)
    {
      clearInterval(this.chart_interval_id);
      this.chart_interval_id = null;
    }
  }

  // Event Handlers ===========================================================

  On_Click_Import(e)
  {
    this.dispatchEvent(new CustomEvent("import", { bubbles: true, composed: true, detail: { originalEvent: e } }));
  }

  On_Click_Export(e)
  {
    this.dispatchEvent(new CustomEvent("export", { bubbles: true, composed: true, detail: { originalEvent: e } }));
  }

  On_Click_Jobs(e)
  {
    this.dispatchEvent(new CustomEvent("jobs", { bubbles: true, composed: true, detail: { originalEvent: e } }));
  }

  On_Click_Profile(e)
  {
    this.dispatchEvent(new CustomEvent("profile", { bubbles: true, composed: true, detail: { originalEvent: e } }));
  }

  On_Click_Companies(e)
  {
    this.dispatchEvent(new CustomEvent("companies", { bubbles: true, composed: true, detail: { originalEvent: e } }));
  }

  On_Click_Contacts(e)
  {
    this.dispatchEvent(new CustomEvent("contacts", { bubbles: true, composed: true, detail: { originalEvent: e } }));
  }

  On_Click_Title(e)
  {
    this.dispatchEvent(new CustomEvent("title-click", { bubbles: true, composed: true, detail: { originalEvent: e } }));
  }

  // Rendering ================================================================

  /**
   * Returns HTML string for navigation bar buttons based on active-page.
   * @returns {string}
   */
  Get_Nav_HTML()
  {
    const active = this.active_page.toLowerCase();
    const is_jobs_active = (active === "jobs");
    const is_profile_active = (active === "profile" || active === "profiles");

    const jobs_item = is_jobs_active
      ? `<button id="jobs_btn" cid="jobs_btn" class="img active" title="Jobs"><img src="image/work.svg" alt="Jobs"></button>`
      : `<a id="jobs_btn" cid="jobs_btn" class="btn img" href="index.html" title="Jobs"><img src="image/work.svg" alt="Jobs"></a>`;

    const profile_item = is_profile_active
      ? `<button id="profile_btn" cid="profile_btn" class="img active" title="Profile"><img src="image/person.svg" alt="Profile"></button>`
      : `<a id="profile_btn" cid="profile_btn" class="btn img" href="./page/profiles.html" title="Profile"><img src="image/person.svg" alt="Profile"></a>`;

    const show_companies = this.hasAttribute("show-companies");
    const show_contacts = this.hasAttribute("show-contacts");
    const analysis_href = this.getAttribute("analysis-href") || "../job-woper";

    return `
      <button id="import_btn" cid="import_btn" class="img" title="Upload">
        <img src="image/upload.svg" alt="Upload">
      </button>
      <button id="export_btn" cid="export_btn" class="img" title="Download">
        <img src="image/download.svg" alt="Download">
      </button>
      ${jobs_item}
      ${profile_item}
      <button id="companies_btn" cid="companies_btn" class="img ${show_companies ? '' : 'hidden'}" title="Companies">
        <img src="image/factory.svg" alt="Companies">
      </button>
      <button id="contacts_btn" cid="contacts_btn" class="img ${show_contacts ? '' : 'hidden'}" title="Contacts">
        <img src="image/contacts.svg" alt="Contacts">
      </button>
      <a id="analysis_btn" cid="analysis_btn" class="btn img" href="${analysis_href}" title="Market Analysis">
        <img src="image/chart-4.svg" alt="Market Analysis">
      </a>
    `;
  }

  /**
   * Updates only the navigation toolbar markup and binds its events.
   */
  Render_Nav()
  {
    if (!this.nav_elem) return;

    this.nav_elem.innerHTML = this.Get_Nav_HTML();
    Utils.Set_Id_Shortcuts(this, this, "cid");
    this.Bind_Nav_Events();
  }

  /**
   * Binds event listeners to the navigation bar controls.
   */
  Bind_Nav_Events()
  {
    if (this.import_btn) this.import_btn.addEventListener("click", this.On_Click_Import);
    if (this.export_btn) this.export_btn.addEventListener("click", this.On_Click_Export);
    if (this.jobs_btn && this.jobs_btn.tagName === "BUTTON")
    {
      this.jobs_btn.addEventListener("click", this.On_Click_Jobs);
    }
    if (this.profile_btn && this.profile_btn.tagName === "BUTTON")
    {
      this.profile_btn.addEventListener("click", this.On_Click_Profile);
    }
    if (this.companies_btn) this.companies_btn.addEventListener("click", this.On_Click_Companies);
    if (this.contacts_btn) this.contacts_btn.addEventListener("click", this.On_Click_Contacts);
  }

  /**
   * Renders the complete light DOM header template.
   */
  Render()
  {
    const hide_chart = this.hasAttribute("hide-chart");
    const hide_clock = this.hasAttribute("hide-clock");
    const hide_nav = this.hasAttribute("hide-nav");

    const html = `
      <header id="hdr_elem" cid="hdr_elem" class="">
        <div class="chart ${hide_chart ? 'hidden' : ''}" cid="chart_container">
          <de-line-chart id="chart_elem" cid="chart_elem" hide-labels chart-type="smooth">
          </de-line-chart>
          <div class="b1"></div>
          <div class="b2"></div>
        </div>
        <h1 class="title" cid="title_elem">${this.title_text}&nbsp;&nbsp;&nbsp;</h1>
        <de-clock-2 id="clock_elem" cid="clock_elem" class="${hide_clock ? 'hidden' : ''}"></de-clock-2>
        <nav id="nav_elem" cid="nav_elem" class="${hide_nav ? 'hidden' : ''}">
          ${this.Get_Nav_HTML()}
        </nav>
        <output id="alert_elem" cid="alert_elem" role="status"></output>
      </header>
    `;

    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    if (this.title_elem)
    {
      this.title_elem.addEventListener("click", this.On_Click_Title);
    }
    this.Bind_Nav_Events();

    if (!hide_chart)
    {
      this.Start_Chart_Timer();
    }
  }
}

Utils.Register_Element(JoprHeader);
export default JoprHeader;
