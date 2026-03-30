import Utils from "../../lib/Utils.js";

class ButtonTask extends HTMLElement
{
  static tname = "button-task";

  constructor()
  {
    super();

    this.stop_time = null;

    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  set value(task)
  {
    this.task = {...task};
    if (this.isConnected)
    {
      this.Render_Task(task);
    }
  }

  get value()
  {
    const task = this.task;
    return task;
  }

  Set_Classes()
  {
    if (this.task.running)
    {
      this.millis_dial.classList.add("show-dial");
      this.sec_dial.classList.add("show-dial");
      this.min_dial.classList.add("show-dial");
      this.hr_dial.classList.add("show-dial");
      this.classList.add("running");
    }
    else
    {
      this.millis_dial.classList.remove("show-dial");
      this.sec_dial.classList.remove("show-dial");
      this.min_dial.classList.remove("show-dial");
      this.hr_dial.classList.remove("show-dial");
      this.classList.remove("running");
    }
  }

  To_Charge(timer)
  {
    let charge_str = "";

    if (timer.charge)
    {
      const charge_per_milli = timer.charge / Utils.MILLIS_HOUR;
      const charge = charge_per_milli * timer.elapsed_millis;
      charge_str = Utils.To_AUD(charge);
    }

    return charge_str;
  }

  Start_Timer()
  {
    if (!this.task.running)
    {
      this.task.start_time = Date.now();
      this.task.running = true;

      this.Set_Classes();

      this.On_Update_Timer();
    }
  }

  Stop_Timer()
  {
    this.stop_time = null;
    if (this.task.running)
    {
      this.task.running = false;
      this.stop_time = Date.now();
      const elapsed_millis = this.stop_time - this.task.start_time;
      this.task.elapsed_millis += elapsed_millis;

      this.Set_Classes();
    }

    if (this.timeout_id)
    {
      clearTimeout(this.timeout_id);
    }

    return this.stop_time;
  }

  Update_Timer()
  {
    if (this.task?.running)
    {
      // calculate how much time has passed since last update and accummulate it.
      const now = Date.now();
      const elapsed_millis = now - this.task.start_time;
      this.task.elapsed_millis += elapsed_millis;

      this.task.start_time = now;

      this.time_label.innerText = Utils.To_Time_Str(this.task.elapsed_millis);
      this.charge_label.innerText = this.To_Charge(this.task);

      const time = Utils.Split_Time(this.task.elapsed_millis);
      this.sec_dial.value = time.secs;
      this.min_dial.value = time.mins;
      this.hr_dial.value = time.hrs % 24;
    }
  }

  On_Update_Timer()
  {
    this.Update_Timer();
    this.timeout_id = setTimeout(this.On_Update_Timer, 1000);
  }

  On_Click_Menu_Btn(event)
  {
    event.stopPropagation();

    const new_event = new Event("clickmenu");
    this.dispatchEvent(new_event);
  }

  On_Click_Btn(event)
  {
    if (this.task.running)
    {
      this.Stop_Timer();
      this.dispatchEvent(new Event("stop", {bubbles: true}));
    }
    else
    {
      this.Start_Timer();
      this.dispatchEvent(new Event("start", {bubbles: true}));
    }
  }

  Render_Task(task)
  {
    this.time_name.innerText = task.name;
    this.time_label.innerText = Utils.To_Time_Str(task.elapsed_millis);
    this.charge_label.innerText = this.To_Charge(task);

    this.Set_Classes();
  }

  Render()
  {
    this.innerHTML = `
      <img cid="menu_btn" class="menu-btn" src="image/menu.svg">
      <span cid="time_name" class="time-name"></span>
      <span cid="time_label" class="time-label"></span>
      <span cid="charge_label" class="charge-label"></span>
      <svg cid="millis_dial" class="millis-dial" stroke="#fff" fill="none" viewBox="-100 -100 200 200">
        <circle cx="0" cy="0" r="90" pathLength="1000" 
        stroke-dasharray="3 17" 
        stroke-dashoffset="10"
        stroke-width="8" />
        </svg>
      <de-dial cid="sec_dial" max-value="59"></de-dial>
      <de-dial cid="min_dial" max-value="59"></de-dial>
      <de-dial cid="hr_dial" max-value="23" tick-width="4"></de-dial>
    `;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.menu_btn.addEventListener("click", this.On_Click_Menu_Btn);
    this.addEventListener("click", this.On_Click_Btn);

    if (this.task)
    {
      this.Render_Task(this.task);
    }
  }
}

Utils.Register_Element(ButtonTask);
export default ButtonTask;