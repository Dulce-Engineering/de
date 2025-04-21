
class DeTimerCompact extends HTMLElement
{
  static tname = "de-timer-compact";

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
    "sublabel-text",
    "style-label",
    "style-shadow",
    "style-dial",
    "style-str",
    "style-hrs",
    "style-mins",
    "style-secs",
    "style-anim-border",
    "style-sublabel",
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
    this.hours.value = timespan.hrs;
    this.minutes.value = timespan.mins;
    this.seconds.value = timespan.secs;

    const hrs_str = String(timespan.hrs).padStart(2, "0");
    const mins_str = String(timespan.mins).padStart(2, "0");
    const secs_str = String(timespan.secs).padStart(2, "0");
    this.label_elem.innerHTML = `${hrs_str}:${mins_str}:${secs_str}`;

    this.Check_Completed(timespan.secs, this);
  }

  Render()
  {
    if (this.isConnected)
    {
      const html = `
        <de-dial cid="hours" max-value="23" tick-width="4" show-shadow class="hrs" has-overflow></de-dial>
        <de-dial cid="minutes" max-value="59" show-shadow class="mins"></de-dial>
        <de-dial cid="seconds" max-value="59" show-shadow class="secs"></de-dial>
        <de-dialmarks cid="border" class="anim-border" value="80" gap-width="2"></de-dialmarks>
        <div cid="label" class="label">
          <span cid="label_elem"></span>
          <span cid="sublabel" class="sublabel"></span>
        </div>
      `;
      this.innerHTML = html;
      Utils.Set_Id_Shortcuts(this, this, "cid");

      if (this.hasAttribute("sublabel-text"))
      {
        const sublabel_text = this.getAttribute("sublabel-text");
        this.sublabel.innerHTML = sublabel_text;
      }

      Utils.Set_Styles(this);

      const auto_start = Utils.Get_Attribute_Bool(this, "auto-start");
      if (auto_start)
      {
        this.start();
      }
    }
  }
}
