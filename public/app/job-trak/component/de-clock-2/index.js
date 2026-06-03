import Utils from "../../../../lib/Utils.js";

class DeClock2 extends HTMLElement
{
  static tname = "de-clock-2";

  interval_id = null;

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();

    this.On_Tick_Clock();
    if (this.interval_id == null) this.interval_id = setInterval(this.On_Tick_Clock, 1000);
  }

  On_Tick_Clock()
  {
    let now = new Date();
    let hr = now.getHours() % 12;
    let min = now.getMinutes();
    let sec = now.getSeconds();

    this.sec_dial.value = sec;
    this.min_dial.value = min;
    this.hr_dial.value = hr;
    this.month_name_span.textContent = now.toLocaleString('default', { month: 'long' });
    this.date_span.textContent = now.getDate() + "/" + (now.getMonth() + 1) + "/" + now.getFullYear();
    this.day_name_span.textContent = now.toLocaleString('default', { weekday: 'long' });
    const options = { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true };
    this.time_span.textContent = now.toLocaleTimeString(undefined, options);
  }

  Render()
  {
    const html = `
      <svg cid="millis_dial" viewBox="-100 -100 200 200">
        <circle cx="0" cy="0" r="90" pathLength="1000" stroke-dasharray="3 17" stroke-dashoffset="10" stroke-width="8" />
      </svg>
      <de-dial cid="sec_dial" max-value="59"></de-dial>
      <de-dial cid="min_dial" max-value="59"></de-dial>
      <de-dial cid="hr_dial" max-value="23" tick-width="4"></de-dial>
      <div class="text">
        <span cid="month_name_span"></span>
        <span cid="date_span"></span>
        <span cid="day_name_span"></span>
        <span cid="time_span"></span>
      </div>
    `;
    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");
  }
}

Utils.Register_Element(DeClock2);
export default DeClock2;