import DE from "/dedial/dedial.js?v=4";
import "../component/de-sun-moon/index.js?v=4";
import "/component/DeInputPeriod/index.js?v=4";
import "/component/DeInputRepeat/index.js?v=4";
import "/component/DeDialogForm/index.js?v=4";
import "/app/jopr/component/de-field/index.js?v=4";
//import ICAL from "https://unpkg.com/ical.js/dist/ical.min.js";
import ICAL from "./ical.min.js";
import Utils from "/lib/Utils.js";

/**
 * @typedef {object} Repeat
 * @property {number} rate - The frequency of the recurrence (e.g., 1 for every, 2 for every other).
 * @property {'SCALE_DAY'|'SCALE_WEEK'|'SCALE_MONTH'|'SCALE_YEAR'} scale - The time unit for the recurrence.
 * @property {string} [weekdays] - A comma-separated list of weekdays for weekly recurrence (e.g., 'WEEKDAYS_MONDAY,WEEKDAYS_TUESDAY').
 * @property {'MONTH_DAY'|'MONTH_WEEK'} month - MONTH_DAY indicates that the event should recur on the same day of the month. MONTH_WEEK indicates that the event should recur on the same day and week of the month.
 */

/**
 * @typedef {object} Timer
 * @property {number} id - The unique identifier for the timer (timestamp).
 * @property {string} title - The optional title of the timer.
 * @property {number} time - The target time in milliseconds since the epoch.
 * @property {string} [description] - The optional description of the timer.
 * @property {Repeat} recurrence - Optional recurrence rules for the timer.
 */

const active_alarms = new Map();

Main();
async function Main()
{
  if ("serviceWorker" in navigator) 
  {
    await navigator.serviceWorker.register("./lib/tempustoi-service-worker.js");
  }
  if ("launchQueue" in window) 
  {
    window.launchQueue.setConsumer(On_Consume_Launch_Queue);
  }

  add_btn.addEventListener("click", On_Click_Add);
  add_timer_btn.addEventListener("click", On_Click_Add);
  add_event_btn.addEventListener("click", On_Click_Add);
  del_all_btn.addEventListener("click", On_Click_Del_All);
  ok_btn.addEventListener("click", On_Click_Ok);
  sound_btn.addEventListener("click", On_Click_Sound);
  timer_date.addEventListener("change", On_Date_Change);
  about_btn.addEventListener("click", On_Click_About);
  save_btn.addEventListener("click", On_Click_Save);
  load_btn.addEventListener("click", On_Click_Load_Btn);
  menu_close_btn.addEventListener("click", On_Click_Close_Menu);

  const alarmed_timers = Check_Startup_Alarms();
  const timers = Select_Timers();
  Render_Timers(timers);
  Update_Nav();
  date_elem.innerText = 
    new Date().toLocaleDateString(undefined, { dateStyle: "full" });

  for (const timer of alarmed_timers)
  {
    Alarm_On(timer);
  }
  
  //Ads();
}

function Ads()
{
  //ezstandalone.cmd.push(function() {ezstandalone.showAds(101)});

  const observer = new MutationObserver(On_Mutation);
  On_Mutation.observer = observer;
  observer.observe(document.documentElement, { childList: true, subtree: false });
  function On_Mutation(mutations)
  {
    for (const mutation of mutations)
    {
      for (const node of mutation.addedNodes)
      {
        if (ads_elem && node.nodeType === 1 && node.nodeName == "IFRAME")
        {
          node.style.cssText = "width:100%;position:relative;border:none;";
          ads_elem.appendChild(node);

          console.log("iframe intercepted.");
        }
      }
    }
  }
}

// events ===================================================================================

async function On_Consume_Launch_Queue(launchParams)
{
  if (!launchParams.files || !launchParams.files.length) return;

  for (const handle of launchParams.files) 
  {
    try 
    {
      // Obtain the native File object from the handle
      const file = await handle.getFile();
      
      if (file.name.toLowerCase().endsWith(".ics")) 
      {
        const text = await file.text();
        
        // Re-use your updated parsing logic
        const events = Parse_Ics(text); 
        
        if (events.length > 0) 
        {
          for (const ev of events) 
          {
            if (ev.time) 
            {
              const timer = 
              {
                id: crypto.randomUUID(),
                title: ev.title || "Imported Event",
                time: ev.time,
                description: ev.description || null,
                recurrence: { rate: 0 }
              };
              Save_Timer(timer);
            }
          }
          
          // Refresh UI
          const timers = Select_Timers();
          Render_Timers(timers);
          Update_Nav();
        }
      }
    } 
    catch (err) 
    {
      console.error("Failed to read launched file:", err);
    }
  }
}

function On_Click_Close_Menu()
{
  menu_panel.hidePopover();
}

function On_Click_About()
{
  about_panel.showPopover();
}

function On_Click_Load_Btn()
{
  menu_panel.hidePopover();

  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json,.tt,.ics,application/json,text/calendar";
  input.onchange = On_Change_File;
  input.click();

  function On_Change_File(event)
  {
    const file = event.target.files[0];
    if (file)
    {
      const reader = new FileReader();
      reader.onload = (e) => On_Load_File(e, file.name);
      reader.readAsText(file);
    }
  }
  
  function On_Load_File(reader_event, filename)
  {
    const text = reader_event.target.result;
    if (filename.toLowerCase().endsWith(".ics"))
    {
      const events = Parse_Ics(text);
      if (events.length === 0)
      {
        alert("No valid events found in the selected ICS file.");
        return;
      }

      let importedCount = 0;
      for (const ev of events)
      {
        if (ev.time)
        {
          const timer = {
            id: crypto.randomUUID(),
            title: ev.title || "Imported Event",
            time: ev.time,
            description: ev.description || null,
            recurrence: { rate: 0 }
          };
          Save_Timer(timer);
          importedCount++;
        }
      }

      if (importedCount > 0)
      {
        const timers = Select_Timers();
        Render_Timers(timers);
        Update_Nav();
      }
      else
      {
        alert("No events with valid start dates were found.");
      }
    }
    else
    {
      try
      {
        const timers = JSON.parse(text);
        Save_Timers(timers);
        Render_Timers(timers);
        Update_Nav();
      }
      catch (e)
      {
        alert("Failed to parse the loaded file as JSON.");
        console.error(e);
      }
    }
  }
}

function On_Click_Save()
{
  const json_str = localStorage.getItem("tempustoi");
  if (json_str)
  {
    const blob = new Blob([json_str], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "tempustoi.tt";
    link.click();
    
    URL.revokeObjectURL(url);
  }
}

function On_Click_Add()
{
  timer_edit_dlg.timer = null;
  timer_form.reset();
  const header_elem = timer_edit_dlg.querySelector("header");
  if (header_elem) header_elem.innerText = "Create Timer";
  timer_edit_dlg.showModal();
}

function On_Click_Del_All()
{
  confirm_msg.innerText = " you want to delete all timers";
  confirm_ok_btn.onclick = On_Click_Del_All_Ok;
  confirm_dlg.showModal();
}

function On_Click_Sound()
{
  sound_btn.innerText = "Sound On";
  sound_btn.classList.add("on");
}

function On_Click_Delete_Ok(e)
{
  const btn_elem = e.target;
  const timer_id = btn_elem.timer.id;

  Alarm_Stop(timer_id);

  const timer_elem = document.getElementById("timer_" + timer_id);
  if (timer_elem) timer_elem.stop();

  const panel_elem = document.getElementById("panel_" + timer_id);
  if (panel_elem) panel_elem.remove();
  
  Update_Nav();

  Delete_Timer(timer_id);
}

function On_Click_Ok()
{
  const timer = Dlg_Get_Value();
  if (timer_edit_dlg.timer)
  {
    timer.id = timer_edit_dlg.timer.id;
    if (timer.time > Date.now())
    {
      timer.triggered = false;
      Alarm_Stop(timer.id);
    }
  }
  else
  {
    timer.id = crypto.randomUUID();
  }

  Save_Timer(timer);

  const timers = Select_Timers();
  Render_Timers(timers);
  Update_Nav();
}

// Function referenced by the confirm delete all dialog
function On_Click_Del_All_Ok()
{
  Alarm_Stop_All();

  for (const timer_elem of document.querySelectorAll("de-timer"))
  {
    timer_elem.stop();
  }

  timers_elem.replaceChildren();
  Update_Nav();

  Delete_Timers();
}

function On_Date_Change(e)
{
  timer_repeat.date = timer_date.value;
}

// rendering ================================================================================

function Set_Animations(panel_elem)
{
  let show_animations = true;
  const show_animations_str = localStorage.getItem("tempustoi-show-anim");
  if (show_animations_str)
  {
    show_animations = JSON.parse(show_animations_str);
  }
  if (show_animations)
  {
    let dial = panel_elem.querySelector(".seconds");
    dial.classList.add("anim-seconds");

    dial = panel_elem.querySelector(".minutes");
    dial.classList.add("anim-minutes");

    dial = panel_elem.querySelector(".hours");
    dial.classList.add("anim-hours");

    dial = panel_elem.querySelector(".days");
    dial.classList.add("anim-days");
  }
}

function Render_Timers(timers)
{
  if (timers)
  {
    document.querySelectorAll(".timer-panel").forEach((elem) => elem.remove());

    Sort_Timers(timers);
    for (const timer of timers)
    {
      if (typeof timer.id =="string" && timer.id.startsWith("timer_"))
      {
        const id = parseInt(timer.id.slice(6));
        timer.id = id;
      }

      const event_elem = document.createElement("de-event");
      event_elem.id = "panel_" + timer.id;
      event_elem.classList.add("timer-panel");
      timers_elem.append(event_elem);
      Render_Timer(timer);
    }
  }
}

function Render_Timer_Title(panel_elem, timer)
{
  if (timer.time)
  {
    const date = new Date(timer.time);
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
    panel_elem.time_elem.textContent = date_str;

    if (Timer_Is_Overdue(timer))
    {
      panel_elem.overdue_elem.style.display = null;
    }
  }

  if (timer.title)
  {
    panel_elem.title_text_elem.textContent = timer.title;
  }

  if (timer.time || timer.title)
  {
    panel_elem.title_elem.style.display = null;
  }
}

function Update_Nav()
{
  const timer_elems = document.querySelectorAll("de-timer");
  const has_timers = timer_elems.length > 0;

  if (!has_timers)
  {
    about_panel.removeAttribute("popover");
    bk.hidden = false;
  }
  else
  {
    about_panel.setAttribute("popover", "auto");
    bk.hidden = true;
  }

  about_btn.hidden = !has_timers;
  del_all_btn.hidden = !has_timers;
  save_btn.hidden = !has_timers;

  if (window.matchMedia("(display-mode: standalone)").matches)
  {
    sound_btn.hidden = true;
  }
}

function Alarm_On(timer)
{
  if (!timer || !timer.id) return;

  if (active_alarms.has(timer.id))
  {
    clearTimeout(active_alarms.get(timer.id));
  }

  try
  {
    const playPromise = alarm.play();
    if (playPromise !== undefined)
    {
      playPromise.catch((err) => console.warn("Alarm audio play error:", err));
    }
  }
  catch (e)
  {
    console.warn("Alarm audio play error:", e);
  }

  const timeout_id = setTimeout(() => Alarm_Off(timer), 30000);
  active_alarms.set(timer.id, timeout_id);

  const quiet_btn_elem = document.getElementById("quiet_btn_" + timer.id);
  const panel_elem = document.getElementById("panel_" + timer.id);
  if (quiet_btn_elem && panel_elem)
  {
    quiet_btn_elem.hidden = false;
    panel_elem.classList.add("alarm");
  }
}

function Alarm_Off(timer)
{
  if (!timer || !timer.id) return;

  if (active_alarms.has(timer.id))
  {
    clearTimeout(active_alarms.get(timer.id));
    active_alarms.delete(timer.id);
  }

  if (active_alarms.size === 0)
  {
    alarm.pause();
    alarm.currentTime = 0;
  }

  const panel_elem = document.getElementById("panel_" + timer.id);
  if (panel_elem)
  {
    panel_elem.classList.remove("alarm");
  }

  const quiet_btn_elem = document.getElementById("quiet_btn_" + timer.id);
  if (quiet_btn_elem)
  {
    quiet_btn_elem.hidden = true;
  }

  const timers = Select_Timers() || [];
  const current_timer = timers.find(t => t.id == timer.id);
  if (current_timer && current_timer.recurrence && current_timer.recurrence.rate > 0 && current_timer.time <= Date.now())
  {
    Increment_Timer(current_timer);
    Save_Timers(timers);
  }

  Render_Timers(timers);
}

function Alarm_Stop(timer_id)
{
  if (!timer_id) return;

  if (active_alarms.has(timer_id))
  {
    clearTimeout(active_alarms.get(timer_id));
    active_alarms.delete(timer_id);
  }

  if (active_alarms.size === 0)
  {
    alarm.pause();
    alarm.currentTime = 0;
  }
}

function Alarm_Stop_All()
{
  for (const timeout_id of active_alarms.values())
  {
    clearTimeout(timeout_id);
  }
  active_alarms.clear();

  alarm.pause();
  alarm.currentTime = 0;
}

// misc =====================================================================================

function Parse_Ics(text)
{
  const events = [];

  try
  {
    // Parse raw text into an ICAL Component tree
    const jcalData = ICAL.parse(text);
    const comp = new ICAL.Component(jcalData);
    
    // Retrieve all VEVENT subcomponents
    const vevents = comp.getAllSubcomponents("vevent");

    for (const veventComp of vevents)
    {
      const event = new ICAL.Event(veventComp);

      // 1. Extract Summary / Title
      const title = event.summary || "Imported Event";

      // 2. Extract Description
      const description = event.description || null;

      // 3. Extract Start Time & convert to JavaScript epoch milliseconds
      let time = null;
      if (event.startDate)
      {
        const jsDate = event.startDate.toJSDate();
        if (jsDate && !isNaN(jsDate.getTime()))
        {
          time = jsDate.getTime();
        }
      }

      if (time)
      {
        events.push({
          title,
          time,
          description
        });
      }
    }
  }
  catch (e)
  {
    console.error("Failed to parse ICS file with ICAL.js:", e);
  }

  return events;
}

function Parse_Ics_1(text)
{
  const rawLines = text.split(/\r?\n/);
  const lines = [];
  for (let i = 0; i < rawLines.length; i++)
  {
    let line = rawLines[i];
    while (i + 1 < rawLines.length && (rawLines[i + 1].startsWith(" ") || rawLines[i + 1].startsWith("\t")))
    {
      line += rawLines[i + 1].slice(1);
      i++;
    }
    lines.push(line);
  }

  const events = [];
  let currentEvent = null;

  for (const line of lines)
  {
    if (!line.trim()) continue;
    
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    
    const key = line.slice(0, colonIdx).trim().toUpperCase();
    const value = line.slice(colonIdx + 1);

    if (key === "BEGIN" && value.trim().toUpperCase() === "VEVENT")
    {
      currentEvent = {};
    }
    else if (key === "END" && value.trim().toUpperCase() === "VEVENT")
    {
      if (currentEvent)
      {
        events.push(currentEvent);
        currentEvent = null;
      }
    }
    else if (currentEvent)
    {
      if (key.startsWith("SUMMARY"))
      {
        let summary = value
          .replace(/\\,/g, ",")
          .replace(/\\;/g, ";")
          .replace(/\\\\/g, "\\")
          .replace(/\\[nN]/g, "\n");
        currentEvent.title = summary.trim();
      }
      else if (key.startsWith("DTSTART"))
      {
        currentEvent.time = Parse_Ics_Date(value.trim());
      }
      else if (key.startsWith("DESCRIPTION"))
      {
        let desc = value
          .replace(/\\,/g, ",")
          .replace(/\\;/g, ";")
          .replace(/\\\\/g, "\\")
          .replace(/\\[nN]/g, "\n");
        currentEvent.description = desc.trim();
      }
    }
  }

  return events;
}

function Parse_Ics_Date(value)
{
  const clean = value.replace(/[^0-9TZ]/g, "");
  if (clean.length === 8)
  {
    const year = clean.slice(0, 4);
    const month = clean.slice(4, 6);
    const day = clean.slice(6, 8);
    const timeVal = new Date(`${year}-${month}-${day}T00:00:00`).getTime();
    return isNaN(timeVal) ? null : timeVal;
  }
  else if (clean.length >= 15)
  {
    const year = clean.slice(0, 4);
    const month = clean.slice(4, 6);
    const day = clean.slice(6, 8);
    const hour = clean.slice(9, 11);
    const min = clean.slice(11, 13);
    const sec = clean.slice(13, 15);
    const isUtc = clean.endsWith("Z");
    
    const dateStr = `${year}-${month}-${day}T${hour}:${min}:${sec}${isUtc ? "Z" : ""}`;
    const timeVal = new Date(dateStr).getTime();
    return isNaN(timeVal) ? null : timeVal;
  }
  return null;
}

function Timer_Is_Overdue(timer)
{
  return timer.time <= Date.now();
}

function To_Elements(html_str)
{
  const template = document.createElement("template");
  template.innerHTML = html_str.trim();
  const elements = template.content.children;

  const id_elems = template.querySelectorAll("[id]");
  for (const id_elem of id_elems)
  {
    const id = id_elem.getAttribute("id");
    elements[id] = id_elem;
  }

  return elements;
}

// db =======================================================================================

function Sort_Timers(timers)
{
  if (timers)
  {
    const now = Date.now();
    timers.sort(By_Now);
    function By_Now(t1, t2)
    {
      if (!t1.time && !t2.time) return 0;
      if (!t1.time) return 1;
      if (!t2.time) return -1;

      const t1_overdue = t1.time <= now;
      const t2_overdue = t2.time <= now;

      if (t1_overdue && !t2_overdue) return -1;
      if (!t1_overdue && t2_overdue) return 1;
      if (t1_overdue && t2_overdue) return t2.time - t1.time;
      return t1.time - t2.time;
    }
  }
}

function Select_Timers()
{
  let timers = null;
  const timers_str = localStorage.getItem("tempustoi");
  if (timers_str)
  {
    timers = JSON.parse(timers_str);
  }

  return timers;
}

function Save_Timers(timers)
{
  localStorage.setItem("tempustoi", JSON.stringify(timers));
}

function Save_Timer(timer)
{
  let timers = Select_Timers() || [];
  timers = timers.filter(t => t.id != timer.id);
  timers.push(timer);
  Save_Timers(timers);
}

function Delete_Timers()
{
  Alarm_Stop_All();
  localStorage.removeItem("tempustoi");
}

function Delete_Timer(id)
{
  Alarm_Stop(id);
  let timers = Select_Timers();
  if (timers)
  {
    timers = timers.filter(t => t.id != id);
    if (timers.length == 0)
    {
      Delete_Timers();
    }
    else
    {
      Save_Timers(timers);
    }
  }
}

function Check_Startup_Alarms()
{
  let is_changed = false;
  let alarmed_timers = [];
  let timers = Select_Timers() || [];
  for (const timer of timers)
  {
    if (timer.time && timer.time <= Date.now())
    {
      if (timer.recurrence && timer.recurrence.rate > 0)
      {
        alarmed_timers.push({ id: timer.id });
      }
      else if (!timer.triggered)
      {
        alarmed_timers.push({ id: timer.id });
        timer.triggered = true;
        is_changed = true;
      }
    }
  }

  if (is_changed)
  {
    Save_Timers(timers);
  }

  return alarmed_timers;
}

function Increment_Timer(timer)
{
  let res = false;

  if (timer?.recurrence?.rate > 0)
  {
    let next_time = new Date(timer.time);

    // Always increment to a future time
    while (next_time.getTime() <= Date.now()) 
    {
      switch (timer.recurrence.scale) 
      {
        case 'SCALE_DAY':
          next_time.setDate(next_time.getDate() + timer.recurrence.rate);
          res = true;
          break;
        case 'SCALE_WEEK':
          next_time.setDate(next_time.getDate() + (timer.recurrence.rate * 7));
          // todo: include days of week
          res = true;
          break;
        case 'SCALE_MONTH':
          next_time.setMonth(next_time.getMonth() + timer.recurrence.rate);
          // todo: include day of week eg fourth thursday of month
          res = true;
          break;
        case 'SCALE_YEAR':
          next_time.setFullYear(next_time.getFullYear() + timer.recurrence.rate);
          res = true;
          break;
      }
    }

    timer.time = next_time.getTime();
  }

  return res;
}

// de-event component =======================================================================

function Format_Recurrence(recurrence)
{
  if (!recurrence || !recurrence.rate || recurrence.rate <= 0)
  {
    return null;
  }

  const rate = recurrence.rate;
  const scale = recurrence.scale;
  let scaleStr = "";

  switch (scale)
  {
    case "SCALE_DAY":
      scaleStr = rate === 1 ? "day" : "days";
      break;
    case "SCALE_WEEK":
      scaleStr = rate === 1 ? "week" : "weeks";
      break;
    case "SCALE_MONTH":
      scaleStr = rate === 1 ? "month" : "months";
      break;
    case "SCALE_YEAR":
      scaleStr = rate === 1 ? "year" : "years";
      break;
    default:
      return null;
  }

  let text = rate === 1 ? "Every " + scaleStr : "Every " + rate + " " + scaleStr;

  if (scale === "SCALE_WEEK" && recurrence.weekdays && recurrence.weekdays.length > 0)
  {
    const dayMap = {
      "WEEKDAYS_MONDAY": "Monday",
      "WEEKDAYS_TUESDAY": "Tuesday",
      "WEEKDAYS_WEDNESDAY": "Wednesday",
      "WEEKDAYS_THURSDAY": "Thursday",
      "WEEKDAYS_FRIDAY": "Friday",
      "WEEKDAYS_SATURDAY": "Saturday",
      "WEEKDAYS_SUNDAY": "Sunday"
    };
    const days = recurrence.weekdays.map(d => dayMap[d] || d);
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

function Dlg_Set_Value(timer)
{
  if (timer)
  {
    timer_title.value = timer.title || "";
    timer_description.value = timer.description || "";

    if (timer.time)
    {
      const d = new Date(timer.time);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      timer_date.value = `${year}-${month}-${day}`;

      const hours = String(d.getHours()).padStart(2, "0");
      const mins = String(d.getMinutes()).padStart(2, "0");
      timer_time.value = `${hours}:${mins}`;

      timer_repeat.date = timer.time;
    }

    if (timer.recurrence)
    {
      timer_repeat.repeat_every.value = timer.recurrence.rate || 0;
      if (timer.recurrence.scale)
      {
        timer_repeat.repeat_scale.value = timer.recurrence.scale;
      }
    }
  }
}

function Dlg_Get_Value()
{
  let time = DE.Utils.Time_Strs_To_Millis
    (timer_date.value, timer_time.value, timer_millis.value);
  if (!time)
  {
    time = Date.now();
  }

  const res =
  {
    title: timer_title.value,
    description: timer_description.value || null,
    time,
    recurrence: timer_repeat.value
  };

  return res;
}

function On_Click_Edit_Btn(e)
{
  const btn_elem = e.currentTarget || e.target.closest("button");
  const timer = btn_elem.timer;

  timer_form.reset();
  timer_edit_dlg.timer = timer;

  const header_elem = timer_edit_dlg.querySelector("header");
  if (header_elem) header_elem.innerText = "Edit Timer";

  Dlg_Set_Value(timer);

  timer_edit_dlg.showModal();
}

function On_Click_View_Btn(e)
{
  const btn_elem = e.target;
  const timer = btn_elem.timer;

  const date_options = 
  {
    weekday: "long",
    year: "numeric", month: "long", day: "numeric",
    hour: "numeric", minute: "2-digit", second: "2-digit",
    hour12: true
  };
  const view_timer = 
  {
    ...timer,
    time:
      timer.time ? new Date(timer.time).toLocaleString(undefined, date_options) : null,
    recurrence: Format_Recurrence(timer.recurrence),
  }

  timer_view_dlg.Show_Modal(view_timer);
}

function On_Click_Delete(e)
{
  const del_btn = e.target;

  confirm_msg.innerText = 
    del_btn.timer.title ? 
      " you want to delete the \"" + del_btn.timer.title + "\" timer" :
      " you want to delete this timer";

  confirm_ok_btn.onclick = On_Click_Delete_Ok;
  confirm_ok_btn.timer = del_btn.timer;
  confirm_dlg.showModal();
}

function On_Click_Stop(e)
{
  const stop_btn_elem = e.target;
  const timer_elem = document.getElementById("timer_" + stop_btn_elem.timer.id);

  timer_elem.toggle();
}

function On_Click_Quiet(e) 
{
  const timer = e.target.timer;
  Alarm_Off(timer);
}

function On_Timer_Completed(e)
{
  const timer_elem = e.target;
  const timer = timer_elem.timer;
  if (!timer.recurrence || !timer.recurrence.rate || timer.recurrence.rate <= 0)
  {
    timer.triggered = true;
    Save_Timer(timer);
  }

  Alarm_On(timer);
}

function On_Timer_Click(event)
{
  const timer_elem = event.currentTarget;
  const elems = event.composedPath();
  const counter_elem = elems.find(elem => elem.classList.contains("counter"));
  timer_elem.On_Dial_Completed(counter_elem);
}

function Render_Timer(timer)
{
  const timer_elem_id = "timer_" + timer.id;
  const del_btn_id = "del_btn_" + timer.id;
  const view_btn_id = "view_btn_" + timer.id;
  const edit_btn_id = "edit_btn_" + timer.id;
  const stop_btn_id = "stop_btn_" + timer.id;
  const quiet_btn_id = "quiet_btn_" + timer.id;
  const panel_id = "panel_" + timer.id;

  const html = `
    <header class="timer">
      <label cid="title_elem" style="display:none;">
        <span cid="time_elem" class="time"></span>
        <span cid="overdue_elem" class="time overdue" style="display:none;">(overdue)</span>
        <div cid="title_text_elem"></div>
      </label>
      <div class="btns">
        <button id="${quiet_btn_id}" hidden>Silence!</button>
        <button id="${view_btn_id}" class="view-btn img">
          <img src="./image/zoom.svg" alt="View">
        </button>
        <button id="${edit_btn_id}" class="edit-btn img">
          <img src="./image/edit.svg" alt="Edit">
        </button>
        <button id="${stop_btn_id}" class="stop-btn img">
          <img src="/images/pause.svg" alt="Pause">
        </button>
        <button id="${del_btn_id}" class="del-btn img">
          <img src="/images/bin.svg" alt="Delete">
        </button>
      </div>
    </header>
    <de-timer id="${timer_elem_id}" show-labels></de-timer>
  `;
  const panel_elem = document.getElementById(panel_id);
  panel_elem.innerHTML = html;
  Utils.Set_Id_Shortcuts(panel_elem, panel_elem, "cid");
  Render_Timer_Title(panel_elem, timer);

  const timer_elem = document.getElementById(timer_elem_id);
  timer_elem.timer = timer;
  timer_elem.time = timer.time;
  if (Timer_Is_Overdue(timer)) timer_elem.classList.add("overdue");
  
  timer_elem.start();

  const quiet_btn_elem = document.getElementById(quiet_btn_id);
  quiet_btn_elem.timer = timer;
  if (active_alarms.has(timer.id))
  {
    quiet_btn_elem.hidden = false;
    panel_elem.classList.add("alarm");
  }
  const stop_btn_elem = document.getElementById(stop_btn_id);
  stop_btn_elem.timer = timer;
  const del_btn_elem = document.getElementById(del_btn_id);
  del_btn_elem.timer = timer;
  const view_btn_elem = document.getElementById(view_btn_id);
  view_btn_elem.timer = timer;
  const edit_btn_elem = document.getElementById(edit_btn_id);
  edit_btn_elem.timer = timer;
  Set_Animations(panel_elem);

  timer_elem.addEventListener("click", On_Timer_Click);
  timer_elem.addEventListener("completed", On_Timer_Completed);
  quiet_btn_elem.addEventListener("click", On_Click_Quiet);
  stop_btn_elem.addEventListener("click", On_Click_Stop);
  del_btn_elem.addEventListener("click", On_Click_Delete);
  view_btn_elem.addEventListener("click", On_Click_View_Btn);
  edit_btn_elem.addEventListener("click", On_Click_Edit_Btn);
}
