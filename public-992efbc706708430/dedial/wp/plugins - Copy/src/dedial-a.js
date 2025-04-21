
class DeTimer extends HTMLElement
{
  static tname = "de-timer";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  static observedAttributes = 
  [
    "auto-start",
    "auto-stop",
    "date",
    "time",
    "show-labels",
    "label-sec",
    "label-min",
    "label-hr",
    "label-day",
    "style-label",
    "style-shadow",
    "style-dial",
    "style-str",
    "style-hrs",
    "style-min",
    "style-sec",
    "style-anim",
    "style-label-sub",
    "style-counter",
    "style-day",
    "style-ticks",
  ];
  attributeChangedCallback(name, old_value, new_value)
  {
    if (name == "date" || name == "time")
    {
      this.target_date = null;
      Utils.Get_Date(this);
    }
    
    this.Render();
  }

  Check_Completed(value, elem)
  {
    if (value == 0 && !elem.is_completed)
    {
      this.On_Dial_Completed(elem);
      elem.is_completed = true;
    }
    else if (value != 0)
    {
      elem.is_completed = false;
    }
  }

  Split_Timespan(millis)
  {
    const res = {};
    
    res.days = Math.floor(millis / Utils.MILLIS_DAY);
    millis = millis % Utils.MILLIS_DAY;
      
    res.hrs = Math.floor(millis / Utils.MILLIS_HOUR);
    millis = millis % Utils.MILLIS_HOUR;
      
    res.mins = Math.floor(millis / Utils.MILLIS_MINUTE);
    millis = millis % Utils.MILLIS_MINUTE;
      
    res.secs = Math.floor(millis / Utils.MILLIS_SECOND);
    millis = millis % Utils.MILLIS_SECOND;

    return res;
  }

  // attributes =========================================================================

  // properties =========================================================================

  // methods ============================================================================

  start()
  {
    this.interval_id = setInterval(this.On_Interval, 1000);
  }

  stop()
  {
    if (this.interval_id)
    {
      clearInterval(this.interval_id);
      this.interval_id = null;
    }
  }

  toggle()
  {
    if (this.interval_id)
    {
      this.stop();
    }
    else
    {
      this.start();
    }
  }

  // events =============================================================================

  On_Dial_Completed(elem)
  {
    elem.addEventListener("animationend", this.On_Animation_End);
    elem.classList.add("completed");
  }

  On_Animation_End(event)
  {
    event.target.classList.remove("completed");
    event.target.removeEventListener("animationend", this.On_Animation_End);
  }

  On_Interval()
  {
    const now = Date.now();
    const target_date = Utils.Get_Date(this);
    const millis = Math.abs(target_date.getTime() - now);
    const timespan = this.Split_Timespan(millis);

    this.Update_Timer(timespan);

    this.dispatchEvent(new Event("tick"));

    const auto_stop = Utils.Get_Attribute_Bool(this, "auto-stop");
    const is_terminal_value = now >= target_date.getTime();
    if (auto_stop && is_terminal_value)
    {
      this.stop();
      this.dispatchEvent(new Event("completed"));

      if (this.hasAttribute("stop-href"))
      {
        const stop_href = this.getAttribute("stop-href");
        window.location.href = stop_href;
      }
    }
  }

  // rendering ==========================================================================

  Update_Timer(timespan)
  {
    this.days_elem.value = timespan.days;
    this.hours_elem.value = timespan.hrs;
    this.minutes_elem.value = timespan.mins;
    this.seconds_elem.value = timespan.secs;

    this.Check_Completed(timespan.days, this.days_counter_elem);
    this.Check_Completed(timespan.hrs, this.hours_counter_elem);
    this.Check_Completed(timespan.mins, this.minutes_counter_elem);
    this.Check_Completed(timespan.secs, this.seconds_counter_elem);
  }

  Render()
  {
    if (this.isConnected)
    {
      const max_marks = 60;
      let 
        label_postfix_sec = "", 
        label_postfix_min = "", 
        label_postfix_hrs = "", 
        label_postfix_day = "";
      const show_labels = Utils.Get_Attribute_Bool(this, "show-labels");
      if (show_labels)
      {
        const label_sec = Utils.Get_Attribute(this, "label-sec", "seconds");
        const label_min = Utils.Get_Attribute(this, "label-min", "minutes");
        const label_hrs = Utils.Get_Attribute(this, "label-hrs", "hours");
        const label_day = Utils.Get_Attribute(this, "label-day", "days");

        label_postfix_sec = "label-sub=\"" + label_sec + "\"";
        label_postfix_min = "label-sub=\"" + label_min + "\"";
        label_postfix_hrs = "label-sub=\"" + label_hrs + "\"";
        label_postfix_day = "label-sub=\"" + label_day + "\"";
      }

      const html = `
        <div cid="days_counter_elem" class="counter">
          <de-dial cid="days_elem" max-value="364" show-label show-shadow has-overflow
            ${label_postfix_day}
            class="ticks"></de-dial>
          <de-dial cid="anim_day_elem" class="anim-border days" max-value="${max_marks}" value="${max_marks}" gap-width="2"></de-dial>
        </div>
        <div cid="hours_counter_elem" class="counter">
          <de-dial cid="hours_elem" max-value="23" show-label show-shadow
            ${label_postfix_hrs}
            class="ticks"></de-dial>
          <de-dial cid="anim_hrs_elem" class="anim-border hours" max-value="${max_marks}" value="${max_marks}" gap-width="2"></de-dial>
        </div>
        <div cid="minutes_counter_elem" class="counter">
          <de-dial cid="minutes_elem" max-value="59" show-label show-shadow
            ${label_postfix_min}
            class="ticks"></de-dial>
          <de-dial cid="anim_min_elem" class="anim-border minutes" max-value="${max_marks}" value="${max_marks}" gap-width="2"></de-dial>
        </div>
        <div cid="seconds_counter_elem" class="counter">
          <de-dial cid="seconds_elem" max-value="59" show-label show-shadow
            ${label_postfix_sec}
            class="ticks"></de-dial>
          <de-dial cid="anim_sec_elem" class="anim-border seconds" max-value="${max_marks}" value="${max_marks}" gap-width="2"></de-dial>
        </div>
      `;
      this.innerHTML = html;
      Utils.Set_Id_Shortcuts(this, this, "cid");

      for (const elem of this.querySelectorAll(".counter"))
        Utils.Set_Style(this, elem, "style-counter");
      
      for (const elem of this.querySelectorAll(".shadow"))
        Utils.Set_Style(this, elem, "style-shadow");
      
      for (const elem of this.querySelectorAll(".label"))
        Utils.Set_Style(this, elem, "style-label");
      
      for (const elem of this.querySelectorAll(".label-sub"))
        Utils.Set_Style(this, elem, "style-label-sub");
      
      for (const elem of this.querySelectorAll(".dial"))
        Utils.Set_Style(this, elem, "style-dial");
      
      for (const elem of this.querySelectorAll(".ticks"))
        Utils.Set_Style(this, elem, "style-ticks");

      let css = this.getAttribute("style-anim") + this.getAttribute("style-day");
      this.anim_day_elem.style = css;
      css = this.getAttribute("style-anim") + this.getAttribute("style-hrs");
      this.anim_hrs_elem.style = css;
      css = this.getAttribute("style-anim") + this.getAttribute("style-min");
      this.anim_min_elem.style = css;
      css = this.getAttribute("style-anim") + this.getAttribute("style-sec");
      this.anim_sec_elem.style = css;

      Utils.Set_Style(this, this, "style-str");

      const auto_start = Utils.Get_Attribute_Bool(this, "auto-start");
      if (auto_start)
      {
        this.start();
      }
    }
  }
}
