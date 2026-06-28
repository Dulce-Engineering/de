import Utils from "./Utils.js";

const STOREKEY_EVENTS = "tempustrak-events";
const STOREKEY_ADJUSTMENTS = "tempustrak-adjustments";

class Event
{
  /*
    id: number
    timer_id: number
    start: time
    event: string("EVENT_START", "EVENT_BREAK");
  */

  static Get_Summary(timer, start_fn, range_millis)
  {
    let blocks = Event.Get_Blocks_By_Timer(timer.id);
    if (!Utils.isEmpty(blocks))
    {
      blocks = blocks.sort((a, b) => a.date - b.date);

      if (start_fn && range_millis)
      {
        const first_event = blocks[0];
        const last_event = blocks[blocks.length-1];

        const start_date = start_fn(first_event.date);
        const end_date = start_fn(last_event.date);

        const summ_blocks = [];
        for (let date=start_date; date <= end_date; date += range_millis)
        {
          const day_events = Event.Get_By_Range(blocks, date, date + range_millis);
          const duration_millis = Event.Total_Duration(day_events);
          if (duration_millis > 0)
          {
            const day = { date, duration_millis };
            summ_blocks.push(day);
          }
        }

        blocks = summ_blocks;
      }

      blocks = blocks.map(b => {return {...b, charge: Event.Calc_Charge(timer.charge, b.duration_millis)}})
    }

    return blocks;
  }

  static Get_Blocks_By_Timer(timer_id)
  {
    let blocks = null;

    let events = Event.Get_All();
    if (events && events.length > 0)
    {
      events = events.sort((a, b) => a.start_time - b.start_time);
      blocks = [];
      const now = Date.now();

      for (let i=0; i<events.length; i++)
      {
        const event = events[i];
        if (event.timer_id == timer_id)
        {
          let duration_millis = now - event.start;
          if (i < events.length-1)
          {
            const next_event = events[i+1];
            duration_millis = next_event.start - event.start;
          }

          const block =
          {
            timer_id: event.timer_id,
            date: event.start,
            duration_millis,
          };
          blocks.push(block);
        }
      }

      const adjustments = Event.Get_Adjustments_By_Timer(timer_id);
      blocks.push(...adjustments);
    }
  
    return blocks;
  }

  static Calc_Charge(charge, time)
  {
    const tot_charge = charge ? charge * (time/Utils.MILLIS_HOUR) : null;

    return tot_charge;
  }

  static Get_By_Range(blocks, start_millis, end_millis)
  {
    const res = blocks.filter(b => b.date >= start_millis && b.date < end_millis);
    return res;
  }

  static Total_Duration(blocks)
  {
    let elapsed_millis = 0;
    
    if (blocks && blocks.length > 0)
    {
      elapsed_millis = blocks.reduce((sum, b) => sum += b.duration_millis, 0);
    }

    return elapsed_millis;
  }

  static Time_By_Date(timer_events, date)
  {

  }

  static To_Date_Only(millis)
  {
    const date = new Date(millis);
    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setMinutes(0);
    date.setHours(0);

    return date.getTime();
  }

  static To_Start_Of_Week(millis)
  {
    const day_date = new Date(millis);
    day_date.setMilliseconds(0);
    day_date.setSeconds(0);
    day_date.setMinutes(0);
    day_date.setHours(0);

    const day_millis = day_date.getTime();
    const week_start_millis = day_millis - (day_date.getDay() * Utils.MILLIS_DAY);

    return week_start_millis;
  }

  static To_Start_Of_Month(millis)
  {
    const date = new Date(millis);
    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setMinutes(0);
    date.setHours(0);
    date.setDate(1);

    return date.getTime();
  }

  static To_Start_Of_Year(millis)
  {
    const date = new Date(millis);
    date.setMilliseconds(0);
    date.setSeconds(0);
    date.setMinutes(0);
    date.setHours(0);
    date.setDate(1);
    date.setMonth(0);

    return date.getTime();
  }

  static Get_Adjustments_By_Timer(timer_id)
  {
    let adjustments = Utils.Get_From_Local_Storage_JSON(STOREKEY_ADJUSTMENTS, []);
    adjustments = adjustments.filter(a => a.timer_id == timer_id);
    return adjustments;
  }

  static Adjust(timer_id, duration_millis)
  {
    const adjustments = Utils.Get_From_Local_Storage_JSON(STOREKEY_ADJUSTMENTS, []);
    const date = Date.now();

    const adjust = 
    {
      timer_id,
      date,
      duration_millis
    };
    adjustments.push(adjust);

    Utils.Set_Local_Storge_Json(STOREKEY_ADJUSTMENTS, adjustments);
  }

  static Coalesce(events)
  {
    let new_events = events;

    if (events)
    {
      let parent_event = null;
      new_events = [];

      for (let i = 0; i < events.length; i++)
      {
        const event = events[i];

        if (parent_event == null && event.event != "EVENT_BREAK")
        {
          parent_event = event;
          new_events.push(event);
        }
        else if (parent_event != null && 
          (event.timer_id != parent_event.timer_id || 
          event.event != parent_event.event))
        {
          parent_event = event;
          new_events.push(event);
        }
      }

      if (new_events.length == 1 && new_events[0].event == "EVENT_BREAK")
      {
        new_events = null;
      }
    }

    return new_events;
  }

  // Core API ===========================================================================

  static Log_Stop(start)
  {
    const event = 
    {
      timer_id: null, 
      start, 
      event: "EVENT_BREAK"
    };
    const res = Event.Insert(event);

    return res;
  }

  static Log_Start(timer_id, start)
  {
    const event = 
    {
      timer_id, 
      start, 
      event: "EVENT_START"
    };
    const res = Event.Insert(event);

    return res;
  }

  static Get_All()
  {
    let events = null;
    let events_json = localStorage.getItem(STOREKEY_EVENTS);
    if (events_json)
    {
      events = JSON.parse(events_json);
    }

    return events;
  }

  static Save_All(events)
  {
    if (events && events.length > 0)
    {
      const events_json = JSON.stringify(events);
      localStorage.setItem(STOREKEY_EVENTS, events_json);
    }
    else
    {
      localStorage.removeItem(STOREKEY_EVENTS);
    }
  }

  static Insert(event)
  {
    let events = Event.Get_All();
    if (!events)
    {
      events = [];
    }

    event.id = crypto.randomUUID();
    events.push(event);

    Event.Save_All(events);

    return event;
  }

  static Delete_By_Timer(timer_id)
  {
    let events = Event.Get_All();
    if (events && events.length > 0)
    {
      for (const event of events)
      {
        if (event.timer_id == timer_id)
        {
          event.timer_id = null;
          event.event = "EVENT_BREAK";
        }
      }
      events = Event.Coalesce(events); 
      Event.Save_All(events);
    } 
  }
}

export default Event;