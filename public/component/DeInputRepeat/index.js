import Utils from "../../lib/Utils.js";

function Is_Visible(elem)
{
  return elem.style.visibility != "hidden" ||
    elem.style.display != "none" || 
    elem.hidden != true;
}

class DeInputRepeat extends HTMLElement
{
  static tname = "de-input-repeat";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();

    if (this.repeat_every.form)
    {
      this.repeat_every.form.addEventListener("reset", this.On_Reset);
    }
  }

  // properties ===================================================================================

  set date(value)
  {
    this.start_date = value;
    this.Update_Month();
  }

  get value()
  {
    let weekdays = null;
    if (this.repeat_scale.value == "SCALE_WEEK")
    {
      weekdays = [];
      if (this.monday.checked) weekdays.push(this.monday.value);
      if (this.tuesday.checked) weekdays.push(this.tuesday.value);
      if (this.wednesday.checked) weekdays.push(this.wednesday.value);
      if (this.thursday.checked) weekdays.push(this.thursday.value);
      if (this.friday.checked) weekdays.push(this.friday.value);
      if (this.saturday.checked) weekdays.push(this.saturday.value);
      if (this.sunday.checked) weekdays.push(this.sunday.value);
      weekdays = weekdays.length > 0 ? weekdays : null;
    }

    const month = this.repeat_scale.value == "SCALE_MONTH" ? this.repeat_month.value : null;

    const res =
    {
      rate: this.repeat_every.value,
      scale: this.repeat_scale.value,
      weekdays,
      month,
    };
    return res;
  }

  set value(occurrence)
  {
    // todo
    console.log("occurrence =", occurrence);
  }

  // events =======================================================================================
  
  On_Repeat_Scale_Change()
  {
    this.repeat_weekdays.hidden = this.repeat_scale.value != "SCALE_WEEK";
    this.repeat_month.hidden = this.repeat_scale.value != "SCALE_MONTH";
  }

  On_Reset()
  {
    this.repeat_weekdays.hidden = true;
    this.repeat_month.hidden = true;
    this.date = null;
  }

  // rendering ====================================================================================

  Update_Month()
  {
    let day = "", position = "", day_name = "";

    if (this.start_date)
    {
      const date = new Date(this.start_date);
      day = date.getDate();

      const pos_str =
      [
        "first",
        "second",
        "third",
        "fourth",
        "fifth",
      ];
      const week = Math.trunc((day - 1) / 7);
      position = pos_str[week];

      const day_name_str =
      [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      day_name = day_name_str[date.getDay()];
    }

    this.month_day.innerText = day;
    this.position.innerText = position;
    this.day_name.innerText = day_name;
  }

  Render()
  {
    this.innerHTML = `
      <div>
        <label>Repeat every</label>
        <input cid="repeat_every" type="number" value="1">
        <select cid="repeat_scale">
          <option value="SCALE_DAY">days</option>
          <option value="SCALE_WEEK">weeks</option>
          <option value="SCALE_MONTH">months</option>
          <option value="SCALE_YEAR">years</option>
        </select>
      </div>

      <div cid="repeat_weekdays" hidden>
        <label>Repeat on</label>
        <input cid="monday" value="WEEKDAYS_MONDAY" type="checkbox">
        <input cid="tuesday" value="WEEKDAYS_TUESDAY" type="checkbox">
        <input cid="wednesday" value="WEEKDAYS_WEDNESDAY" type="checkbox">
        <input cid="thursday" value="WEEKDAYS_THURSDAY" type="checkbox">
        <input cid="friday" value="WEEKDAYS_FRIDAY" type="checkbox">
        <input cid="saturday" value="WEEKDAYS_SATURDAY" type="checkbox">
        <input cid="sunday" value="WEEKDAYS_SUNDAY" type="checkbox">
      </div>

      <select cid="repeat_month" hidden>
        <option value="MONTH_DAY">
          Monthly on day <span cid="month_day"></span>
        </option>
        <option value="MONTH_WEEK">
          Monthly on the 
          <span cid="position"></span>
          <span cid="day_name"></span>
        </option>
      </select>
    `;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.repeat_scale.addEventListener("change", this.On_Repeat_Scale_Change);
  }
}

Utils.Register_Element(DeInputRepeat);
export default DeInputRepeat;
