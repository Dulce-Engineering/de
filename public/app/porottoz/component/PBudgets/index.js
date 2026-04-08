import Utils from "/lib/Utils.js";

class PBudgets extends HTMLElement
{
  static tname = "p-budgets";

  //static observedAttributes = [ "attribute-name" ];
  //attributeChangedCallback(name, old_value, new_value) { }

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  set value(budgets)
  {
    this.replaceChildren();
    if (budgets)
    {
      for (const budget of budgets)
      {
        this.Add(budget, false);
      }
    }
  }

  get value()
  {
    const budgets = [];

    const budget_elems = this.querySelectorAll("li");
    for (const budget_elem of budget_elems)
    {
      budgets.push(budget_elem.budget);
    }

    return budgets;
  }

  get length()
  {
    return this.querySelectorAll("li").length;
  }

  Add(budget, with_events = true)
  {
    const budget_elem = this.Render_Budget(budget);
    const old_elem = this.Find(budget.id);
    if (old_elem)
    {
      old_elem.On_Remove_Elem();
      old_elem.replaceWith(budget_elem);
    }
    else
    {
      this.appendChild(budget_elem);
    }

    this.Update_Budget_Funds(budget_elem);
    budget_elem.timer_elem.start();

    if (with_events)
    {
      this.dispatchEvent(new Event("change"));
    }
  }

  Remove(budget)
  {
    const budget_elem = this.Find(budget.id);
    if (budget_elem)
    {
      budget_elem.On_Remove_Elem();
      this.removeChild(budget_elem);
      this.dispatchEvent(new Event("change"));
    }
  }

  Find(id)
  {
    let res = null;

    if (id)
    {
      const budget_elems = this.querySelectorAll("li");
      for (const budget_elem of budget_elems)
      {
        const budget = budget_elem.budget;
        if (budget.id == id)
        {
          res = budget_elem;
        }
      }
    }

    return res;
  }

  On_Click_Edit_Btn(budget_elem)
  {
    this.dispatchEvent
      (new CustomEvent("edit", { detail: budget_elem.budget }));
  }

  On_Click_Delete_Btn(budget_elem)
  {
    this.dispatchEvent
      (new CustomEvent("remove", { detail: budget_elem.budget }));
  }

  On_Click_Spend_Btn(budget_elem)
  {
    this.dispatchEvent
      (new CustomEvent("purchase", { detail: budget_elem.budget }));
  }

  On_Click_Earn_Btn(budget_elem)
  {
    this.dispatchEvent
      (new CustomEvent("acquire", { detail: budget_elem.budget }));
  }

  Update_Budget_Funds(budget_elem)
  {
    const budget = budget_elem.budget;
    const now = Date.now();
    const avail = budget.balance - budget.reserve;
    const millis = budget.date - now;

    if (millis > 0 && avail > 0)
    {
      const days = Math.ceil(millis / Utils.MILLIS_DAY);
      const hours = Math.ceil(millis / Utils.MILLIS_HOUR);
      const minutes = Math.ceil(millis / Utils.MILLIS_MINUTE);
      const seconds = Math.ceil(millis / Utils.MILLIS_SECOND);

      const avail_per_day = avail / days;
      budget_elem.funds_elem.value = (avail_per_day / avail * 100);
      budget_elem.allowance_text.textContent = avail_per_day.toFixed(2);
      budget_elem.hr_text.textContent = this.Render_Avail(avail / hours, "hr");
      budget_elem.min_text.textContent = this.Render_Avail(avail / minutes, "min");
      budget_elem.sec_text.textContent = this.Render_Avail(avail / seconds, "sec");
    }
    else if (avail > 0)
    {
      budget_elem.funds_elem.value = avail;
      budget_elem.allowance_text.textContent = avail.toFixed(2);
      budget_elem.hr_text.textContent = "";
      budget_elem.min_text.textContent = "";
      budget_elem.sec_text.textContent = "";
    }
    else
    {
      budget_elem.funds_elem.value = 0;
      budget_elem.allowance_text.textContent = 0;
      budget_elem.hr_text.textContent = "";
      budget_elem.min_text.textContent = "";
      budget_elem.sec_text.textContent = "";
    }
  }

  Render_Avail(avail_per_time, time_str)
  {
    let value_str = avail_per_time.toFixed(2);
    if (value_str != "0.00")
    {
      value_str += "/" + time_str;
    }
    else
    {
      value_str = "";
    }

    return value_str;
  }

  Render_Budget(budget)
  {
    const html = `
      <li cid="item_elem">
        <nav>
          <h1 cid="title_elem">Title</h1>
          <div class="buttons">
            <button cid="earn_btn" title="Add Money">💰</button>
            <button cid="spend_btn" title="Buy Something">💸</button>
            <button cid="edit_btn" title="Edit Budget">✏️</button>
            <button cid="del_btn" title="Delete Budget">🗑️</button>
          </div>
        </nav>

        <div class="details">
          <div class="funds-gauge">
            <de-gauge 
              cid="funds_elem" 
              base-type="small" 
              value="0"
              max-value="100"
              show-shadow
            ></de-gauge>
            <div class="funds-label">
              <h2>Daily<br>Allowance</h2>
              <span cid="allowance_text"></span>
              <span cid="hr_text"></span>
              <span cid="min_text"></span>
              <span cid="sec_text"></span>
            </div>
          </div>

          <div class="sub-details">
            <de-timer-compact 
              cid="timer_elem" 
              split-days 
              sublabel-text="Time Left"
            ></de-timer-compact>

            <div class="avail-funds">
              <h3>Target Date</h3>
              <span cid="date_text"></span> 

              <h3>Balance</h3>
              <span cid="bal_text"></span> 

              <h3 cid="res_title" hidden>Reserve</h3>
              <span cid="res_text" hidden></span> 

              <h3 cid="avail_title" hidden>Funds Available</h3>
              <span cid="avail_text" hidden></span> 
            </div>
          </div>
        </div>
      </li>
    `;
    const budget_elem = Utils.toDocument(html).children[0];
    Utils.Set_Id_Shortcuts(budget_elem, budget_elem, "cid");

    const avail = budget.balance - budget.reserve;
    const date = budget.date == null ? new Date() : new Date(budget.date);
    const date_str = date.toLocaleDateString();
    const balance = budget.balance == null ? 0 : budget.balance;
    const reserve = budget.reserve == null ? 0 : budget.reserve;
    const title = budget.title || "";

    budget_elem.title_elem.textContent = title;
    budget_elem.date_text.textContent = date_str;
    budget_elem.bal_text.textContent = balance.toFixed(2);
    if (reserve > 0)
    {
      budget_elem.res_title.hidden = false;
      budget_elem.avail_title.hidden = false;
      budget_elem.res_text.hidden = false;
      budget_elem.avail_text.hidden = false;

      budget_elem.res_text.textContent = reserve.toFixed(2);
      budget_elem.avail_text.textContent = avail.toFixed(2);
    }

    budget_elem.budget = budget;
    budget_elem.On_Remove_Elem = () => budget_elem.timer_elem.stop();

    budget_elem.timer_elem.addEventListener
      ("tick", () => this.Update_Budget_Funds(budget_elem));
    customElements.whenDefined("de-timer-compact")
      .then(() => budget_elem.timer_elem.time = date);

    budget_elem.earn_btn.addEventListener
      ("click", () => this.On_Click_Earn_Btn(budget_elem));
    budget_elem.spend_btn.addEventListener
      ("click", () => this.On_Click_Spend_Btn(budget_elem));
    budget_elem.edit_btn.addEventListener
      ("click", () => this.On_Click_Edit_Btn(budget_elem));
    budget_elem.del_btn.addEventListener
      ("click", () => this.On_Click_Delete_Btn(budget_elem));

    return budget_elem;
  }

  Render()
  {
    //const html = ``;
    //const html_elements = Utils.To_Document(html, this);
    //this.replaceChildren(html_elements);
    //Utils.Set_Id_Shortcuts(this, this, "cid");

    //this.some_elem.addEventListener("click", this.On_Click_Btn);
  }
}

Utils.Register_Element(PBudgets);
export default PBudgets;
