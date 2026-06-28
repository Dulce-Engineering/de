import Utils from "./Utils.js";

const STOREKEY_TIMERS = "tempustrak-timers";

class Timer
{
  /*
    id: number
    name: string
    charge: number
    elapsed_millis: time
    running: boolean
    start_time: time
  */

  static Get_All()
  {
    const timers = Utils.Get_From_Local_Storage_JSON(STOREKEY_TIMERS);
    return timers;
  }

  static Get_All_With_Recalc(Event)
  {
    const timers = Utils.Get_From_Local_Storage_JSON(STOREKEY_TIMERS);
    if (timers && timers.length > 0)
    {
      const now = Date.now();
      for (const timer of timers)
      {
        timer.start_time = now;

        const blocks = Event.Get_Blocks_By_Timer(timer.id);
        timer.elapsed_millis = Event.Total_Duration(blocks);
      }
    }
    
    return timers;
  }

  static Get_By_Id(id)
  {
    const timers = Timer.Get_All();
    const timer = timers.find(t => t.id == id);
    return timer;
  }

  static Exists(id)
  {
    const timers = Timer.Get_All();
    const timer = timers?.find(t => t.id == id);
    return timer != null;
  }

  static Stop_All()
  {
    const timers = Timer.Get_All();
    if (timers)
    {
      for (const timer of timers)
      {
        timer.running = false;
      }
      Timer.Save_All(timers);
    }
  }

  static Save(timer)
  {
    if (timer)
    {
      if (timer.id)
      {
        Timer.Update(timer);
      }
      else
      {
        timer.start_time = null;
        timer.elapsed_millis = 0;
        timer.running = false;
        Timer.Insert(timer);
      }
    }
  }

  static Save_All(timers)
  {
    if (timers && timers.length > 0)
    {
      const timers_json = JSON.stringify(timers);
      localStorage.setItem(STOREKEY_TIMERS, timers_json);
    }
    else
    {
      Timer.Delete_All();
    }
  }

  static Insert(timer)
  {
    let timers = Timer.Get_All();
    if (!timers)
    {
      timers = [];
    }

    timer.id = crypto.randomUUID();
    timers.push(timer);

    Timer.Save_All(timers);
  }

  static Insert_Start(Event)
  {
    Timer.Stop_All();

    const timer = {};
    timer.start_time = Date.now();
    timer.elapsed_millis = 0;
    timer.running = true;
    timer.name = "Task " + (project_list.Get_Prj_Count() + 1);
    Timer.Insert(timer);

    Event.Log_Start(timer.id, timer.start_time);

    return timer;
  }

  static Update(timer)
  {
    if (Timer.Exists(timer.id))
    {
      let timers = Timer.Get_All();
      timers = timers.filter(t => t.id != timer.id);
      timers.push(timer);

      Timer.Save_All(timers);
    }
  }

  static Delete(id, Event)
  {
    let timers = Timer.Get_All();
    if (timers && timers.length > 0)
    {
      timers = timers.filter(t => t.id != id);
      Timer.Save_All(timers);
      Event.Delete_By_Timer(id);
    }
  }

  static Delete_All()
  {
    localStorage.removeItem(STOREKEY_TIMERS);
  }
}

export default Timer;