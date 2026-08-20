import DE from "/dedial/dedial.js?v=4";
import "../DeSunMoon/index.js?v=4";
import "/component/DeInputPeriod/index.js?v=4";
import "/component/DeInputRepeat/index.js?v=4";

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
 * @property {Repeat} recurrence - Optional recurrence rules for the timer.
 */

Main();
async function Main()
{
  if ("serviceWorker" in navigator) 
  {
    await navigator.serviceWorker.register("./lib/tempustoi-service-worker.js");
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
  load_btn.addEventListener("click", On_Click_Load);
  ics_btn.addEventListener("click", On_Click_Ics);
  menu_close_btn.addEventListener("click", On_Click_Close_Menu);

  Increment_Timers();
  const timers = Select_Timers();
  Render_Timers(timers);
  Update_Nav();
  date_elem.innerText = 
    new Date().toLocaleDateString(undefined, { dateStyle: "full" });
  
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

function On_Click_Close_Menu()
{
  menu_panel.hidePopover();
}

function On_Click_About()
{
  about_panel.showPopover();
}

function On_Click_Load()
{
  menu_panel.hidePopover();

  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json,.tt,application/json";
  input.onchange = On_Change_File;
  input.click();

  function On_Change_File(event)
  {
    const file = event.target.files[0];
    if (file)
    {
      const reader = new FileReader();
      reader.onload = On_Load_File;
      reader.readAsText(file);
    }
  }
  
  function On_Load_File(reader_event)
  {
    const timers = reader_event.target.result;
    Save_Timers(timers);
    Render_Timers(timers);
    Update_Nav();
  }
}

function On_Click_Ics()
{
  menu_panel.hidePopover();

  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".ics,text/calendar";
  input.onchange = On_Change_File;
  input.click();

  function On_Change_File(event)
  {
    const file = event.target.files[0];
    if (file)
    {
      const reader = new FileReader();
      reader.onload = On_Load_File;
      reader.readAsText(file);
    }
  }
  
  function On_Load_File(reader_event)
  {
    const icsText = reader_event.target.result;
    const events = Parse_Ics(icsText);
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
}

function Parse_Ics(text)
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
  timer_form.reset();
  timer_dlg.showModal();
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

function On_Click_Delete_Ok(e)
{
  const btn_elem = e.target;
  const timer_id = btn_elem.timer.id;

  const timer_elem = document.getElementById("timer_" + timer_id);
  timer_elem.stop();

  const panel_elem = document.getElementById("panel_" + timer_id);
  panel_elem.remove();
  
  Update_Nav();

  Delete_Timer(timer_id);
}

function On_Click_Ok()
{
  const timer = Dlg_Get_Value();
  timer.id = crypto.randomUUID();

  Save_Timer(timer);

  const timers = Select_Timers();
  Render_Timers(timers);
  Update_Nav();
}

function On_Timer_Completed(e)
{
  const timer_elem = e.target;
  const timer = timer_elem.timer;
  if (timer.recurrence.rate > 0)
  {
    Increment_Timer(timer);
    Save_Timer(timer);
  }

  Alarm_On(timer);
  setTimeout(() => Alarm_Off(timer), 30000);
}

function On_Click_Quiet(e) 
{
  const timer = e.target.timer;
  Alarm_Off(timer);
}

// Function referenced by the confirm delete all dialog
function On_Click_Del_All_Ok()
{
  for (const timer_elem of document.querySelectorAll("de-timer"))
  {
    timer_elem.stop();
  }

  timers_elem.replaceChildren();
  Update_Nav();

  Delete_Timers();
}

function On_Click_Stop(e)
{
  const stop_btn_elem = e.target;
  const timer_elem = document.getElementById("timer_" + stop_btn_elem.timer.id);

  timer_elem.toggle();
}

function On_Timer_Click(e)
{
  const timer_elem = e.currentTarget;
  const elems = e.composedPath();
  const counter_elem = elems.find(elem => elem.classList.contains("counter"));
  timer_elem.On_Dial_Completed(counter_elem);
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

      const panel_elem = document.createElement("div");
      panel_elem.id = "panel_" + timer.id;
      panel_elem.classList.add("timer-panel");
      timers_elem.append(panel_elem);
      Render_Timer(timer);
    }
  }
}

function Render_Timer_Title(timer)
{
  let date_str = "";
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
    date_str = 
      "<span class=\"time\">" + 
        date.toLocaleString(undefined, date_format) + 
      "</span>";
    if (Timer_Is_Overdue(timer))
    {
      date_str +=
        " <span class=\"time overdue\">(overdue)</span>";
    }
  }

  const title_html = 
    DE.Utils.Is_Empty(timer.title) && DE.Utils.Is_Empty(date_str) ? "" : 
    `<label>${DE.Utils.Append_Str(date_str, timer.title, "<br>")}</label>`;
  
  return title_html;
}

function Render_Timer(timer)
{
  const title_html = Render_Timer_Title(timer);
  const timer_elem_id = "timer_" + timer.id;
  const del_btn_id = "del_btn_" + timer.id;
  const stop_btn_id = "stop_btn_" + timer.id;
  const quiet_btn_id = "quiet_btn_" + timer.id;
  const panel_id = "panel_" + timer.id;

  const html = `
    <header class="timer">
      ${title_html}
      <button id="${quiet_btn_id}" hidden>Silence!</button>
      <button id="${stop_btn_id}" class="stop-btn img">
        <img src="/images/pause.svg" alt="Pause">
      </button>
      <button id="${del_btn_id}" class="del-btn img">
        <img src="/images/bin.svg" alt="Delete">
      </button>
    </header>
    <de-timer id="${timer_elem_id}" show-labels></de-timer>
  `;
  const panel_elem = document.getElementById(panel_id);
  panel_elem.innerHTML = html;

  const timer_elem = document.getElementById(timer_elem_id);
  timer_elem.timer = timer;
  timer_elem.time = timer.time;
  if (Timer_Is_Overdue(timer)) timer_elem.classList.add("overdue");
  timer_elem.start();
  timer_elem.addEventListener("completed", On_Timer_Completed);
  timer_elem.addEventListener("click", On_Timer_Click);

  const quiet_btn_elem = document.getElementById(quiet_btn_id);
  quiet_btn_elem.timer = timer;
  quiet_btn_elem.addEventListener("click", On_Click_Quiet);

  const stop_btn_elem = document.getElementById(stop_btn_id);
  stop_btn_elem.timer = timer;
  stop_btn_elem.addEventListener("click", On_Click_Stop);

  const del_btn_elem = document.getElementById(del_btn_id);
  del_btn_elem.timer = timer;
  del_btn_elem.addEventListener("click", On_Click_Delete);

  Set_Animations(panel_elem);
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
  alarm.play();

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
  alarm.pause();
  alarm.currentTime = 0;

  const panel_elem = document.getElementById("panel_" + timer.id);
  if (panel_elem)
  {
    panel_elem.classList.remove("alarm");
  }

  //Render_Timer(timer);
  const timers = Select_Timers();
  Render_Timers(timers);
}

// misc =====================================================================================

function Timer_Is_Overdue(timer)
{
  return timer.time < Date.now();
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
    time,
    recurrence: timer_repeat.value
  };

  return res;
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
      if (t1.time > now && t2.time > now) return t1.time - t2.time;
      else if (t1.time < now && t2.time < now) return t2.time - t1.time;
      else if (t1.time > now) return -1;
      else if (t2.time > now) return 1;
      else return 0;
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
  localStorage.removeItem("tempustoi");
}

function Delete_Timer(id)
{
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

function Increment_Timers()
{
  let is_incremented = false;
  let timers = Select_Timers() || [];
  for (const timer of timers)
  {
    is_incremented = is_incremented || Increment_Timer(timer);
  }

  if (is_incremented)
  {
    Save_Timers(timers);
  }
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
