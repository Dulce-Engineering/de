import Utils from "../../lib/Utils.js";


class ListTask extends HTMLElement
{
  static tname = "list-task";

  constructor()
  {
    super();

    this.items = null;

    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  Get_Prj_Btns()
  {
    return this.querySelectorAll("button-task");
  }

  Find_Timer(id)
  {
    let timer_btn = null;
    const prj_btns = this.Get_Prj_Btns();
    for (const prj_btn of prj_btns)
    {
      if (prj_btn.value.id == id)
      {
        timer_btn = prj_btn;
        break;
      }
    }

    return timer_btn;
  }

  Stop_All_Timers()
  {
    let stop_time = null;

    const prj_btns = this.Get_Prj_Btns();
    for (const prj_btn of prj_btns)
    {
      stop_time = stop_time || prj_btn.Stop_Timer();
    }

    return stop_time;
  }

  Stop_Other_Timers(timer_id)
  {
    const prj_btns = this.Get_Prj_Btns();
    for (const prj_btn of prj_btns)
    {
      if (prj_btn.value.id != timer_id)
      {
        prj_btn.Stop_Timer();
      }
    }
  }

  /*Store_All_Timers()
  {
    const prj_btns = this.Get_Prj_Btns();
    if (Utils.isEmpty(prj_btns))
    {
      this.timer_api.Delete_All();
    }
    else
    {
      const timers = [];
      for (const prj_btn of prj_btns)
      {
        timers.push(prj_btn.value);
      }

      this.timer_api.Save_All(timers);
    }
  }*/

  set items(timers)
  {
    this.replaceChildren();
    if (timers)
    {
      for (const timer of timers)
      {
        this.Append_Timer(timer);
      }
    }
  }

  get items()
  {
    let timers = null;

    const prj_btns = this.Get_Prj_Btns();
    if (!Utils.isEmpty(prj_btns))
    {
      timers = [];
      for (const prj_btn of prj_btns)
      {
        timers.push(prj_btn.value);
      }
    }

    return timers;
  }

  set value(timer)
  {
    this.Stop_All_Timers();
    if (timer)
    {
      const prj_btn = this.Find_Timer(timer.id);
      if (prj_btn)
      {
        prj_btn.Start_Timer();
      }
    }
  }

  Get_Prj_Count()
  {
    const prj_btns = this.Get_Prj_Btns();
    return prj_btns.length;
  }

  Insert_Start(timer)
  {
    this.Stop_All_Timers();
    timer.running = false;
    const task_btn = project_list.Append_Timer(timer);
    setTimeout(() => task_btn.Start_Timer(), 0);
  }

  On_Start_Task_Btn(event)
  {
    this.Stop_Other_Timers(event.currentTarget.value.id);
    this.dispatchEvent(new Event("change"));
  }

  On_Stop_Task_Btn(event)
  {
    this.dispatchEvent(new Event("change"));
  }

  On_Click_Menu_Btn(event)
  {
    event.stopPropagation();
    task_menu.timer = event.currentTarget.value;
    task_menu.Show_Modal();
  }

  Append_Timer(timer)
  {
    const task_btn = this.Render_Timer(timer);
    this.append(task_btn);

    return task_btn;
  }

  Render_Timer(timer)
  {
    const task_btn = document.createElement("button-task");
    task_btn.value = timer;
    task_btn.addEventListener("start", this.On_Start_Task_Btn);
    task_btn.addEventListener("stop", this.On_Stop_Task_Btn);
    task_btn.addEventListener("clickmenu", this.On_Click_Menu_Btn);

    return task_btn;
  }

  Render()
  {
    this.innerHTML = `
    `;

    Utils.Set_Id_Shortcuts(this, this, "cid");
  }
}

Utils.Register_Element(ListTask);
export default ListTask;