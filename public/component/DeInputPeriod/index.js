import Utils from "../../lib/Utils.js";

class DeInputPeriod extends HTMLElement
{
  static tname = "de-input-period";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  get value()
  {
    const days = this.days_elem.valueAsNumber || 0;
    const hours = this.hours_elem.valueAsNumber || 0;
    const mins = this.mins_elem.valueAsNumber || 0;
    const secs = this.secs_elem.valueAsNumber || 0;

    const millis = days * Utils.MILLIS_DAY + hours * Utils.MILLIS_HOUR + mins * Utils.MILLIS_MINUTE + secs * Utils.MILLIS_SECOND;
    const str = millis == 0 ? "" : millis.toString();

    return str;
  }
  
  Render()
  {
    this.innerHTML = `
      <input cid="days_elem" type="number" placeholder="Days">
      <input cid="hours_elem" type="number" placeholder="Hours">
      <input cid="mins_elem" type="number" placeholder="Minutes">
      <input cid="secs_elem" type="number" placeholder="Seconds">
    `;
    Utils.Set_Id_Shortcuts(this, this, "cid");
  }
}

Utils.Register_Element(DeInputPeriod);
export default DeInputPeriod;
