import Utils from "../../lib/Utils.js";

class DeFilter extends HTMLElement 
{
  static tname = "de-filter";

  // lifecycle ====================================================================================

  constructor() 
  {
    super();

    this.setAttribute("view", "min");
    this.filter_svg = `
      <svg fill="#fff" width="24px" height="24px" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
        <path
          d="M440-160q-17 0-28.5-11.5T400-200v-240L168-736q-15-20-4.5-42t36.5-22h560q26 0 36.5 22t-4.5 42L560-440v240q0 17-11.5 28.5T520-160h-80Zm40-308 198-252H282l198 252Zm0 0Z" />
      </svg>
    `;
    this.refresh_svg = `
      <svg fill="#fff" width="24px" height="24px" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
        <path
          d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
      </svg>
    `;

    this.search_btn_html = this.refresh_svg;
    this.delete_btn_html = "✕";
    //this.min_add_btn_html = "+ Add Filter";
    this.min_add_btn_html = this.filter_svg;
    this.mid_add_btn_html = "+ Add Filter";
    //this.mid_add_btn_html = this.filter_svg;

    this.OnClick_Switch_View_Btn = this.OnClick_Switch_View_Btn.bind(this);
    this.OnClick_Set_View = this.OnClick_Set_View.bind(this);
    this.OnClick_Min_Add_Filter_Btn = this.OnClick_Min_Add_Filter_Btn.bind(this);
    this.OnClick_Mid_Add_Filter_Btn = this.OnClick_Mid_Add_Filter_Btn.bind(this);
    this.OnClick_Search_Btn = this.OnClick_Search_Btn.bind(this);
    this.OnClick_Del_Filter_Btn = this.OnClick_Del_Filter_Btn.bind(this);
    this.OnClick_Max_Clear_Btn = this.OnClick_Max_Clear_Btn.bind(this);
    this.OnClick_Max_Cancel_Btn = this.OnClick_Max_Cancel_Btn.bind(this);
    this.Do_Search = this.Do_Search.bind(this);
  }

  connectedCallback()
  {
    this.Render();
  }

  // fields =======================================================================================

  // input types: text, time, time_range, date, date_range, timestamp, timestamp_range,
  // boolean, one_off, integer, integer_range, float, float_range, currency, currency_range
  // auto_complete
  
  set filters(filter_defs)
  {
    this.filter_defs = this.Copy_Defs(filter_defs);
    this.Render_View(this.mid_filter_defs, "mid_filters_div", "mid");
    this.Render_View(this.filter_defs, "max_filters_div", "max");
    this.Show_View();
  }

  set view(view_name)
  {
    this.Get_View_Data();
    this.Show_View_With_Data(view_name);
  }

  get view()
  {
    let res;

    if (!this.min_view_div.hidden)
    {
      res = "min";
    }
    else if (!this.mid_view_div.hidden)
    {
      res = "mid";
    }
    else if (this.max_view_div.open)
    {
      res = "max";
    }

    return res;
  }

  get mid_filter_defs()
  {
    let res;

    if (this.filter_defs)
    {
      res = this.filter_defs.filter(d => d.in_mid_view);
    }

    return res;
  }

  set srch_btn_html(html)
  {
    this.search_btn_html = html;
    this.min_search_btn.innerHTML = this.html;
    this.mid_search_btn.innerHTML = this.html;
  }

  get value()
  {
    this.Get_View_Data();
    const data = this.Get_Data();

    return data;
  }

  set value(data)
  {
    this.Set_Data(data);
    this.Set_View_Data();
    this.Render_Update_Summ();
    this.Do_Search();
  }

  // events =======================================================================================

  OnClick_Switch_View_Btn()
  {

  }

  OnClick_Set_View(event)
  {
    this.view = event.target.item_data;
  }

  OnClick_Min_Add_Filter_Btn()
  {
    this.return_view = "min";
    this.show_cancel_btn = true;
    this.view = "max";
  }

  OnClick_Mid_Add_Filter_Btn()
  {
    this.return_view = "mid";
    this.show_cancel_btn = true;
    this.view = "max";
  }

  OnClick_Search_Btn()
  {
    this.Do_Search();

    if (this.return_view)
    {
      this.view = this.return_view;
      this.return_view = null;
    }
  }

  OnClick_Del_Filter_Btn(def)
  {
    def.value = null;
    this.Render_Update_Summ();
    this.Do_Search();
  }

  OnClick_Max_Clear_Btn()
  {
    if (!Utils.Is_Empty(this.filter_defs))
    {
      for (const def of this.filter_defs)
      {
        def.value = null;
      }
    }
    this.Set_View_Data();
  }

  OnClick_Max_Cancel_Btn()
  {
    if (this.return_view)
    {
      this.Show_View_With_Data(this.return_view);
      this.return_view = null;
    }
  }

  // misc =========================================================================================

  Do_Search()
  {
    const search_event = new CustomEvent("search", {detail: this.value});
    this.dispatchEvent(search_event);
  }

  Copy_Defs(defs)
  {
    let res;

    if (!Utils.Is_Empty(defs))
    {
      res = [];
      for (const def of defs)
      {
        const new_def = {...def};
        res.push(new_def);
      }
    }

    return res;
  }

  Has_Filter_Values()
  {
    let res = false;

    if (!Utils.Is_Empty(this.filter_defs))
    {
      res = this.filter_defs.some(def => def.value != null);
    }

    return res;
  }

  Has_Filters()
  {
    let res = false;

    if (!Utils.Is_Empty(this.filter_defs))
    {
      res = this.filter_defs.some(def => Utils.Has_Value(def.filter_class));
    }

    return res;
  }

  Has_Max_Filters()
  {
    let res = false;

    if (!Utils.Is_Empty(this.filter_defs))
    {
      res = this.filter_defs.some(def => def.in_mid_view != true);
    }

    return res;
  }

  Get_View_Data()
  {
    const view = this.view;

    const defs = this.Get_Current_Defs();
    if (!Utils.Is_Empty(defs))
    {
      for (const def of defs)
      {
        const filter = def[view + "_filter"];
        def.value = filter.value;
        if (filter.Get_Text)
        {
          def.text = filter.Get_Text(def.value);
        }
      }
    }
  }

  Set_View_Data()
  {
    const view = this.view;

    const defs = this.Get_Current_Defs();
    if (!Utils.Is_Empty(defs))
    {
      for (const def of defs)
      {
        const filter = def[view + "_filter"];
        filter.value = def.value;
      }
    }
  }

  Get_Data()
  {
    let data;

    if (!Utils.Is_Empty(this.filter_defs))
    {
      data = {};
      for (const def of this.filter_defs)
      {
        if (def.value != null)
        {
          data[def.id] = def.value;
        }
      }
    }

    return Utils.nullIfEmpty(data);
  }

  Set_Data(data)
  {
    if (!Utils.Is_Empty(this.filter_defs))
    {
      for (const def of this.filter_defs)
      {
        def.value = Utils.hasValue(data[def.id]) ? data[def.id] : null;
        const filter = new def.filter_class(def, this);
        def.text = filter.Get_Text ? filter.Get_Text(def.value) : null;
      }
    }
  }

  Get_Current_Defs()
  {
    let defs;

    const view = this.view;
    if (view == "mid")
    {
      defs = this.mid_filter_defs;
    }
    else if (view == "max")
    {
      defs = this.filter_defs;
    }

    return defs;
  }

  Get_Elem_By_Id(id)
  {
    return this.querySelector("[cid="+id+"]");
  }

  // rendering ====================================================================================

  Show_View_With_Data(view_name)
  {
    this.Show_View(view_name);
    this.Set_View_Data();

    this.Render_Update_Summ();
  }

  Show_View(view_name)
  {
    if (view_name)
    {
      this.min_view_div.hidden = true;
      this.mid_view_div.hidden = true;
      this.max_view_div.close();

      if (view_name == "max")
      {
        this.max_view_div.showModal();
      }
      else
      {
        this[view_name + "_view_div"].hidden = false;
      }
    }
    else
    {
      view_name = this.view;
    }

    if (view_name == "min")
    {
      Utils.Hide_Elem_If(this.min_view_div, "min_add_filter_btn", () => !this.Has_Filters());
      Utils.Hide_Elem_If(this.min_view_div, "min_search_btn", () => !this.Has_Filter_Values());
    }
    else if (view_name == "mid")
    {
      Utils.Hide_Elem_If(this.mid_view_div, "mid_add_filter_btn", () => !this.Has_Max_Filters());
      //Utils.Hide_Elem_If(this, "mid_search_btn", () => !this.Has_Filter_Values());
    }
    else if (view_name == "max")
    {
      Utils.Hide_Elem_If(this.max_view_div, "max_clear_btn", () => !this.Has_Filters());
      Utils.Hide_Elem_If(this.max_view_div, "max_search_btn", () => !this.Has_Filters());
      Utils.Hide_Elem_If(this.max_view_div, "max_cancel_btn", () => !this.show_cancel_btn);
    }
  }

  Render_Update_Summ()
  {
    const view = this.view;
    const summ_div = this.Get_Elem_By_Id(view + "_summ_div");
    if (summ_div)
    {
      const summary_elems = [];

      let defs = this.filter_defs;
      if (!Utils.Is_Empty(defs))
      {
        if (view == "mid")
        {
          defs = defs.filter(d => !d.in_mid_view);
        }
      }

      if (!Utils.Is_Empty(defs))
      {
        for (const def of defs)
        {
          const summary_elem = this.Render_Summary_Elem(def);
          if (summary_elem)
          {
            summary_elems.push(summary_elem);
          }
        }
      }
      summ_div.replaceChildren(...summary_elems);
    }
  }

  Render_Summary_Elem(def)
  {
    let span;

    const value = def.value;
    if (value)
    {
      const delete_btn = document.createElement("button");
      delete_btn.addEventListener("click", () => this.OnClick_Del_Filter_Btn(def));
      delete_btn.classList.add("fb_del_btn");
      delete_btn.innerHTML = this.delete_btn_html;

      span = document.createElement("li");
      if (def.text)
      {
        span.innerText = def.label + ": " + def.text;
      }
      else
      {
        span.innerText = def.label + ": " + value;
      }
      span.classList.add("fb_summ");
      span.append(delete_btn);
    }

    return span;
  }

  Render_View(filter_defs, filters_div_id, view)
  {
    if (!Utils.Is_Empty(filter_defs))
    {
      const elems = [];
      for (const filter_def of filter_defs)
      {
        const filter = new filter_def.filter_class(filter_def, this);
        filter_def[view + "_filter"] = filter;

        const filter_elem = document.createElement("li");
        filter_elem.classList.add("filter_item");
        filter_elem.append(...filter.Render());

        elems.push(filter_elem);
      }
      
      const filters_div = this.Get_Elem_By_Id(filters_div_id);
      filters_div.replaceChildren(...elems.flat());
    }
  }

  Render()
  {
    const html = `
      <!--button cid="switch_view_btn">view</button>
      <span cid="switch_view_list_placeholder"></span-->

      <span cid="min_view_div" hidden>
        <button cid="min_add_filter_btn" class="fb_filter_btn">
          ${this.min_add_btn_html}
          </button>
        <ul cid="min_summ_div"></ul><button cid="min_search_btn">
          ${this.search_btn_html}
        </button>
      </span>

      <span cid="mid_view_div" hidden>
        <span cid="mid_filters_div"></span>
        <span cid="mid_btn_span">
          <button cid="mid_add_filter_btn" class="fb_filter_btn">${this.mid_add_btn_html}</button>
          <button cid="mid_search_btn">${this.search_btn_html}</button>
        </span>
        <div cid="mid_summ_div"></div>
      </span>

      <dialog cid="max_view_div">
        <form method="dialog" novalidate>
          <header>
            <h2>Filters</h2>
            <svg cid="max_close_btn" class="close-btn" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960">
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"></path>
            </svg>
          </header>

          <main cid="max_view_body">
            <ul cid="max_filters_div" class="filter_list"></ul>
          </main>

          <footer cid="max_btn_div">
            <button cid="max_search_btn" type="button">OK</button>
            <button cid="max_clear_btn" type="button">Clear</button>
            <button cid="max_cancel_btn" type="button">Cancel</button>
          </footer>
        </form>
      </dialog>
    `;
    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.min_search_btn.addEventListener("click", this.OnClick_Search_Btn);
    this.mid_search_btn.addEventListener("click", this.OnClick_Search_Btn);
    this.max_search_btn.addEventListener("click", this.OnClick_Search_Btn);

    this.min_add_filter_btn.addEventListener("click", this.OnClick_Min_Add_Filter_Btn);
    this.mid_add_filter_btn.addEventListener("click", this.OnClick_Mid_Add_Filter_Btn);

    this.max_clear_btn.addEventListener("click", this.OnClick_Max_Clear_Btn);
    this.max_cancel_btn.addEventListener("click", this.OnClick_Max_Cancel_Btn);
    this.max_close_btn.addEventListener("click", this.OnClick_Max_Cancel_Btn);
    
    this.view = this.getAttribute("view");
  }
}

class Text
{
  constructor(def, ctx)
  {
    this.def = def;
    this.ctx = ctx;
  }

  set value(input_value)
  {
    this.input.value = "";
    if (!Utils.Is_Empty(input_value))
    {
      this.input.value = input_value;
    }
  }

  get value()
  {
    let res;

    const input_value = this.input.value;
    if (!Utils.Is_Empty(input_value))
    {
      res = input_value;
    }

    return res;
  }

  Render_Input(def)
  {
    const input = document.createElement("input");
    input.id = "ptFilter_" + def.id;
    input.placeholder = def.placeholder || "";

    return input;
  }

  Render_Label(def, input)
  {
    const label = document.createElement("label");
    label.for = input.id;
    label.innerText = def.label;

    return label;
  }

  Render()
  {
    this.input = this.Render_Input(this.def);
    this.label = this.Render_Label(this.def, this.input);

    if (this.def.auto_search)
    {
      this.input.addEventListener("change", this.ctx.Do_Search);
    }

    return [this.label, this.input];
  }
}
DeFilter.Text = Text;

class Select
{
  constructor(def, ctx)
  {
    this.def = def;
    this.ctx = ctx;
  }

  set value(input_value)
  {
    this.select.value = "";
    if (!Utils.Is_Empty(input_value))
    {
      this.select.value = input_value;
    }
  }

  Get_Text(input_value)
  {
    let text;

    const option = this.def.options.find(o => o.value == input_value);
    if (option)
    {
      text = option.text;
    }

    return text;
  }

  get value()
  {
    let res;

    const input_value = this.select.value;
    if (!Utils.Is_Empty(input_value))
    {
      res = input_value;
    }

    return res;
  }

  Render_Select(def)
  {
    const select = document.createElement("select");
    select.id = "ptFilter_" + def.id;

    return select;
  }

  Render_Options(def, select)
  {
    if (def.options)
    {
      for (const def_option of def.options)
      {
        const option = document.createElement("option");
        option.value = def_option.value;
        option.innerText = def_option.text;
          select.append(option);
      }
    }
  }

  Render_Label(def, select)
  {
    const label = document.createElement("label");
    label.for = select.id;
    label.innerText = def.label;

    return label;
  }

  Render()
  {
    this.select = this.Render_Select(this.def);
    this.Render_Options(this.def, this.select);
    this.label = this.Render_Label(this.def, this.select);
    this.select.value = null;

    if (this.def.auto_search)
    {
      this.select.addEventListener("change", this.ctx.Do_Search);
    }

    return [this.label, this.select];
  }
}
DeFilter.Select = Select;

class Number
{
  constructor(def)
  {
    this.def = def;
  }

  set value(input_value)
  {
    this.input.value = "";
    if (!Utils.Is_Empty(input_value))
    {
      input_value = parseInt(input_value);
      if (isNaN(input_value))
      {
        input_value = 0;
      }
      this.input.value = input_value;
    }
  }

  get value()
  {
    let res;

    const input_value = this.input.value;
    if (!Utils.Is_Empty(input_value))
    {
      res = parseInt(input_value);
      if (isNaN(res))
      {
        res = 0;
      }
    }

    return res;
  }

  Render_Input(def)
  {
    const input = document.createElement("input");
    input.id = "ptFilter_" + def.id;
    input.type = "number";

    return input;
  }

  Render_Label(def, input)
  {
    const label = document.createElement("label");
    label.for = input.id;
    label.innerText = def.label;

    return label;
  }

  Render()
  {
    this.input = this.Render_Input(this.def);
    this.label = this.Render_Label(this.def, this.input);

    return [this.label, this.input];
  }
}
DeFilter.Number = Number;

class Date_Time
{
  constructor(def)
  {
    this.def = def;
  }

  set value(input_value)
  {
    this.input.value = "";
    if (!Utils.Is_Empty(input_value))
    {
      this.input.value = input_value;
    }
  }

  get value()
  {
    let res;

    const input_value = this.input.value;
    if (!Utils.Is_Empty(input_value))
    {
      res = input_value;
    }

    return res;
  }

  Get_Text(input_value)
  {
    const date = new Date(input_value);
    const res = date.toLocaleString();

    return res;
  }

  Render()
  {
    this.input = document.createElement("input");
    this.input.id = "ptFilter_" + this.def.id;
    this.input.type = "datetime-local";

    this.label = document.createElement("label");
    this.label.for = this.input.id;
    this.label.innerText = this.def.label;

    return [this.label, this.input];
  }
}
DeFilter.Date_Time = Date_Time;

Utils.Register_Element(DeFilter);

export default DeFilter;
