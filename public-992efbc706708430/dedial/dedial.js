/* © 2024 Dulce Engineering */

class Utils
{
  static MILLIS_SECOND = 1000;
  static MILLIS_MINUTE = Utils.MILLIS_SECOND * 60;
  static MILLIS_HOUR = Utils.MILLIS_MINUTE * 60;
  static MILLIS_DAY = Utils.MILLIS_HOUR * 24;
  static MILLIS_WEEK = Utils.MILLIS_DAY * 7;
  static MILLIS_MONTH = Utils.MILLIS_WEEK * 4;
  static MILLIS_YEAR = Utils.MILLIS_MONTH * 12;

  static Append_Str(a, b, sep)
  {
    let res = null;

    if (sep == null || sep == undefined)
    {
      sep = "";
    }
    if (a && b && a.length > 0 && b.length > 0)
    {
      res = a + sep + b;
    } 
    else if (a && !b && a.length > 0)
    {
      res = a;
    } 
    else if (!a && b && b.length > 0)
    {
      res = b;
    }

    return res;
  }

  static Bind(obj, fn_prefix)
  {
    let prop_names = new Set();
    for (let curr_obj = obj; curr_obj; curr_obj = Object.getPrototypeOf(curr_obj))
    {
      Object.getOwnPropertyNames(curr_obj).forEach(name => prop_names.add(name));
    }

    for (const prop_name of prop_names.keys())
    {
      if (prop_name.startsWith(fn_prefix) && typeof obj[prop_name] == "function")
      {
        obj[prop_name] = obj[prop_name].bind(obj);
      }
    }
  }

  static Get_Attribute(elem, name, def)
  {
    return Utils.Has_Attribute(elem, name) ? elem.getAttribute(name) : def;
  }
  
  static Get_Attribute_Bool(elem, name, def)
  {
    let value = def || false;
  
    if (elem.hasAttribute(name))
    {
      let value_str = elem.getAttribute(name);
      if (Utils.Is_Empty(value_str))
      {
        value = true;
      }
      else
      {
        value_str = value_str.toLowerCase().trim();
        if (value_str == "true" || value_str == "yes" || value_str == "1" || value_str == "on")
        {
          value = true;
        }
      }
    }
  
    return value;
  }

  static Get_Attribute_Int(elem, name, def)
  {
    let value = def || 0;
  
    const value_str = Utils.Get_Attribute(elem, name, null);
    if (value_str)
    {
      const value_int = parseInt(value_str);
      if (!isNaN(value_int))
      {
        value = value_int;
      }
    }
  
    return value;
  }
  
  static Has_Attribute(elem, name)
  {
    return elem.hasAttribute(name) && !Utils.Is_Empty(elem.getAttribute(name));
  }

  static Is_Empty(items)
  {
    let res = false;
    const typeOfItems = typeof items;

    if (items == null || items == undefined)
    {
      res = true;
    }
    else if (Array.isArray(items))
    {
      if (items.length == 0)
      {
        res = true;
      }
    }
    else if (typeOfItems == "string")
    {
      const str = items.trim();
      if (str.length == 0 || str == "")
      {
        res = true;
      }
    }
    else if (typeOfItems == "object")
    {
      if (items?.constructor?.name == "NodeList")
      {
        res = items.length == 0;
      }
      else
      {
        res = Utils.Is_Empty_Obj(items);
      }
    }
    else if (items.length == 0)
    {
      res = true;
    }

    return res;
  }

  static Is_Empty_Obj(obj)
  {
    if (!obj) return true;

    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }

  static Parse_Bool(str)
  {
    let value = false;
    if (!Utils.Is_Empty(str))
    {
      str = str.toLowerCase().trim();
      if (str == "true" || str == "yes" || str == "1" || str == "on")
      {
        value = true;
      }
    }

    return value;
  }

  static Parse_Int(str, def = 0)
  {
    let value = def;
    if (!Utils.Is_Empty(str))
    {
      const value_int = parseInt(str);
      if (!isNaN(value_int))
      {
        value = value_int;
      }
    }

    return value;
  }

  static Register_Element(elem_class)
  {
    const comp_class = customElements.get(elem_class.tname);
    if (comp_class == undefined)
    {
      customElements.define(elem_class.tname, elem_class);
    }
  }

  static Set_Attribute(elem, attr_name, value)
  {
    if (value)
    {
      elem.setAttribute(attr_name, value);
    }
    else
    {
      elem.removeAttribute(attr_name);
    }
  }

  static Set_Id_Shortcuts(src_elem, dest_elem, attr_name = "id")
  {
    const elems = src_elem.querySelectorAll("[" + attr_name + "]");
    for (const elem of elems)
    {
      const id_value = elem.getAttribute(attr_name);
      dest_elem[id_value] = elem;
    }
  }

  static Set_Styles(parent_elem)
  {
    for (const attr_name of parent_elem.getAttributeNames())
    {
      if (attr_name == "style-str")
      {
        Utils.Set_Style(parent_elem, parent_elem, attr_name);
      }
      else if (attr_name.startsWith("style-"))
      {
        //const style_tokens = attr_name.split("-");
        const elem_name = attr_name.substring(6);

        const cid_elem = parent_elem.querySelector("[cid=" + elem_name + "]");
        if (cid_elem)
        {
          Utils.Set_Style(parent_elem, cid_elem, attr_name);
        }
        else
        {
          for (const class_elem of parent_elem.querySelectorAll("." + elem_name))
          {
            Utils.Set_Style(parent_elem, class_elem, attr_name);
          }
        }
      }
    }
  }

  static Set_Style(src_elem, style_elem, attr_name)
  {
    if (Utils.Has_Attribute(src_elem, attr_name) && style_elem)
    {
      const css = src_elem.getAttribute(attr_name);
      style_elem.style = css;
    }
  }

  static Time_Strs_To_Millis(date_str, time_str, period_str)
  {
    let target_millis = null;

    if (!Utils.Is_Empty(period_str))
    {
      const millis = parseInt(period_str);
      target_millis = Date.now() + millis;
    }
    else if (!Utils.Is_Empty(date_str) || !Utils.Is_Empty(time_str))
    {
      const date = new Date();

      if (!Utils.Is_Empty(date_str))
      {
        const date_parts = date_str.split("-");
        if (date_parts?.length > 2)
        {
          const year = Utils.Parse_Int(date_parts[0]);
          const month = Utils.Parse_Int(date_parts[1]);
          const day = Utils.Parse_Int(date_parts[2]);
          date.setDate(day);
          date.setMonth(month-1);
          date.setFullYear(year);
          date.setHours(0);
          date.setMinutes(0);
          date.setSeconds(0);
          date.setMilliseconds(0);
        }
      }

      if (!Utils.Is_Empty(time_str))
      {
        const time_parts = time_str.split(":");
        if (time_parts?.length > 1)
        {
          const hr = Utils.Parse_Int(time_parts[0]);
          const min = Utils.Parse_Int(time_parts[1]);
          const sec = Utils.Parse_Int(time_parts[2]);
          date.setHours(hr);
          date.setMinutes(min);
          date.setSeconds(sec);
        }
      }
      
      target_millis = date.getTime();
    }

    return target_millis;
  }

  static To_Template(html, src_elems) 
  {
    const template = document.createElement('template');
    template.innerHTML = html.trim();

    if (src_elems)
    {
      const slot_elems = template.content.querySelectorAll("slot"); 
      if (!Utils.Is_Empty(slot_elems))
      {
        for (const slot_elem of slot_elems)
        {
          const slot_name = slot_elem.name || slot_elem.getAttribute('name');
          const content_elems = src_elems.querySelectorAll(`[slot='${slot_name}']`);
          if (!Utils.Is_Empty(content_elems))
          {
            slot_elem.replaceWith(...content_elems);
          }
        }
      }
    }
  
    return template;
  }
}

class DeActionBtn extends HTMLElement
{
  static tname = "de-action-btn";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.addEventListener("click", this.On_Click);
  }

  On_Click()
  {
    const for_id = this.getAttribute("for");
    const for_action = this.getAttribute("for-action");
    if (for_id)
    {
      const elem = document.getElementById(for_id);
      if (elem)
      {
        elem[for_action]();
      }
    }
  }
}

class DeDialMarks extends HTMLElement
{
  static tname = "de-dialmarks";
  static DEF_MAX = 10;
  static DEF_TICK_WIDTH = 1;
  static DEF_GAP_WIDTH = 1;
  static DEF_CIRCLE_RADIUS = 90;
  static DEF_VIEW_RADIUS = 100;

  connectedCallback()
  {
    this.Render();
  }

  set value(new_value)
  {
    this.setAttribute("value", new_value);
    if (this.isConnected)
    {
      this.Update();
    }
  }

  get value()
  {
    return Utils.Get_Attribute_Int(this, "value", DeDialMarks.DEF_MAX);
  }

  Calc_Ticks_Length()
  {
    const value = Utils.Get_Attribute_Int(this, "value", DeDialMarks.DEF_MAX);
    const tick_width = Utils.Get_Attribute_Int(this, "tick-width", DeDialMarks.DEF_TICK_WIDTH);
    const gap_width = Utils.Get_Attribute_Int(this, "gap-width", DeDialMarks.DEF_GAP_WIDTH);
    let ticks_length = value * (tick_width + gap_width);

    if (this.hasAttribute("base-type"))
    {
      //ticks_length = value*tick_width + (value-1)*gap_width;
      ticks_length -= gap_width;
    }

    return ticks_length;
  }

  Calc_Base_Length()
  {
    let base_length = 0;
    const base_type = this.getAttribute("base-type");

    if (base_type == "small")
    { // value = 6, path = 12
      const ticks_length = this.Calc_Ticks_Length();
      base_length = ticks_length * 0.5;
    }
    else if (base_type == "medium")
    {
      const ticks_length = this.Calc_Ticks_Length();
      base_length = ticks_length;
    }
    else if (base_type == "large")
    {
      const ticks_length = this.Calc_Ticks_Length();
      base_length = ticks_length * 2;
    }

    return base_length;
  }

  Calc_Path_Length()
  {
    return this.Calc_Ticks_Length() + this.Calc_Base_Length();
  }

  Update()
  {
    let stroke_dasharray = null;
    let value = Utils.Get_Attribute_Int(this, "value", DeDialMarks.DEF_MAX);

    if (value == 0)
    {
      stroke_dasharray = "0 1";
    }
    else if (value == 1)
    {
      const base_length = this.Calc_Base_Length();
      const ticks_length = this.Calc_Path_Length() - base_length;
      stroke_dasharray = "" + ticks_length + " " + base_length;
    }
    else if (!this.hasAttribute("base-type"))
    {
      const tick_width = Utils.Get_Attribute_Int(this, "tick-width", DeDialMarks.DEF_TICK_WIDTH);
      const gap_width = Utils.Get_Attribute_Int(this, "gap-width", DeDialMarks.DEF_GAP_WIDTH);
      stroke_dasharray = "" + tick_width + " " + gap_width;
    }
    else
    {
      const base_length = this.Calc_Base_Length();
      const tick_width = Utils.Get_Attribute_Int(this, "tick-width", DeDialMarks.DEF_TICK_WIDTH);
      const gap_width = Utils.Get_Attribute_Int(this, "gap-width", DeDialMarks.DEF_GAP_WIDTH);

      stroke_dasharray = "";
      for (let v = 1; v <= value; v++)
      {
        stroke_dasharray += tick_width + " ";
        if (v != value)
        {
          stroke_dasharray += gap_width + " ";
        }
        else
        {
          stroke_dasharray += base_length;
        }
      }
    }
      
    if (stroke_dasharray)
    {
      this.circle_elem.setAttribute("stroke-dasharray", stroke_dasharray);
    }
  }

  Render()
  {
    const path_length = this.Calc_Path_Length();

    const viewbox_radius = Utils.Get_Attribute_Int(this, "viewbox-radius", DeDial.DEF_VIEW_RADIUS);
    const viewbox_diameter = Math.abs(viewbox_radius) * 2;
    const view_box = 
      "-" + viewbox_radius + " -" + viewbox_radius + 
      " " + viewbox_diameter + " " + viewbox_diameter;
    const circle_radius = Utils.Get_Attribute_Int(this, "circle-radius", DeDial.DEF_CIRCLE_RADIUS);

    const html = `
      <svg cid="svg_elem" viewBox="${view_box}" class="dial">
        <circle 
          cid="circle_elem"
          cx="0" cy="0" r="${circle_radius}" 
          pathLength="${path_length}"
          stroke-dasharray="0 ${path_length}" 
        />
      </svg>
    `;
    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    Utils.Set_Style(this, this.svg_elem, "style-svg");

    this.Update();
  }
}

class DeGauge extends HTMLElement
{
  static tname = "de-gauge";
  static DEF_MAX = 10;
  static DEF_TICK_WIDTH = 1;
  static DEF_GAP_WIDTH = 1;
  static DEF_CIRCLE_RADIUS = 90;
  static DEF_VIEW_RADIUS = 100;

  connectedCallback()
  {
    this.Render();
  }

  set value(new_value)
  {
    this.setAttribute("value", new_value);
    if (this.isConnected)
    {
      this.Update();
    }
  }

  get value()
  {
    return Utils.Get_Attribute_Int(this, "value", DeGauge.DEF_MAX);
  }

  /* 
    base-type
    circle-radius
    gap-width
    max-value
    show-shadow
    style-svg
    tick-width
    value
    viewbox-radius
  */

  Calc_Ticks_Length(value)
  {
    const tick_width = Utils.Get_Attribute_Int(this, "tick-width", DeGauge.DEF_TICK_WIDTH);
    const gap_width = Utils.Get_Attribute_Int(this, "gap-width", DeGauge.DEF_GAP_WIDTH);
    let ticks_length = value * (tick_width + gap_width) - gap_width;

    return ticks_length;
  }

  Calc_Base_Length()
  {
    const base_type = this.getAttribute("base-type");
    const max_value = Utils.Get_Attribute_Int(this, "max-value", DeGauge.DEF_MAX);
    const gap_width = Utils.Get_Attribute_Int(this, "gap-width", DeGauge.DEF_GAP_WIDTH);
    let base_length = 0;

    if (base_type == "small")
    {
      const ticks_length = this.Calc_Ticks_Length(max_value);
      base_length = ticks_length * 0.5;
    }
    else if (base_type == "medium")
    {
      const ticks_length = this.Calc_Ticks_Length(max_value);
      base_length = ticks_length;
    }
    else if (base_type == "large")
    {
      const ticks_length = this.Calc_Ticks_Length(max_value);
      base_length = ticks_length * 2;
    }
    else
    {
      base_length = gap_width;
    }

    return base_length;
  }

  Calc_Path_Length()
  {
    const max_value = Utils.Get_Attribute_Int(this, "max-value", DeGauge.DEF_MAX);
    return this.Calc_Ticks_Length(max_value) + this.Calc_Base_Length();
  }

  Calc_Remaining_Length(value)
  {
    return this.Calc_Path_Length() - this.Calc_Ticks_Length(value);
  }

  Calc_Dash_Array(value)
  {
    let stroke_dasharray = null;
    const max_value = Utils.Get_Attribute_Int(this, "max-value", DeGauge.DEF_MAX);

    if (value < 0)
    {
      value = 0;
    }
    else if (value > max_value)
    {
      value = max_value;
    }

    if (value == 0)
    {
      stroke_dasharray = "0 1";
    }
    else
    {
      const tick_width = Utils.Get_Attribute_Int(this, "tick-width", DeGauge.DEF_TICK_WIDTH);
      const gap_width = Utils.Get_Attribute_Int(this, "gap-width", DeGauge.DEF_GAP_WIDTH);

      stroke_dasharray = "";
      for (let v = 1; v <= value; v++)
      {
        stroke_dasharray += tick_width + " ";
        if (v != value)
        {
          stroke_dasharray += gap_width + " ";
        }
        else
        {
          stroke_dasharray += this.Calc_Remaining_Length(value);
        }
      }
    }

    //console.log("ticks length value: ", this.Calc_Ticks_Length(value));
    //console.log("ticks length max: ", this.Calc_Ticks_Length(max_value));
    //console.log("base length: ", this.Calc_Base_Length());
    //console.log("path length: ", this.Calc_Path_Length());
    //console.log("remaining length: ", this.Calc_Remaining_Length(value));
    
    return stroke_dasharray;
  }

  Update()
  {
    const value = Utils.Get_Attribute_Int(this, "value", DeGauge.DEF_MAX);
    const stroke_dasharray = this.Calc_Dash_Array(value);
    if (stroke_dasharray)
    {
      this.circle_elem.setAttribute("stroke-dasharray", stroke_dasharray);
    }
  }

  Render()
  {
    const path_length = this.Calc_Path_Length();

    const viewbox_radius = Utils.Get_Attribute_Int(this, "viewbox-radius", DeGauge.DEF_VIEW_RADIUS);
    const viewbox_diameter = Math.abs(viewbox_radius) * 2;
    const view_box = 
      "-" + viewbox_radius + " -" + viewbox_radius + 
      " " + viewbox_diameter + " " + viewbox_diameter;
    const circle_radius = Utils.Get_Attribute_Int(this, "circle-radius", DeGauge.DEF_CIRCLE_RADIUS);
    
    let shadow_svg = "";
    if (this.hasAttribute("show-shadow"))
    {
      const max_value = Utils.Get_Attribute_Int(this, "max-value", DeGauge.DEF_MAX);
      shadow_svg = `
        <circle 
          cid="shadow_elem"
          cx="0" cy="0" r="${circle_radius}" 
          pathLength="${path_length}"
          stroke-dasharray="${this.Calc_Dash_Array(max_value)}" 
          class="shadow"
        />
      `;
    }

    const html = `
      <svg cid="svg_elem" viewBox="${view_box}" class="dial">
        ${shadow_svg}
        <circle 
          cid="circle_elem"
          cx="0" cy="0" r="${circle_radius}" 
          pathLength="${path_length}"
          stroke-dasharray="0 ${path_length}" 
        />
      </svg>
    `;
    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    Utils.Set_Style(this, this.svg_elem, "style-svg");

    this.Update();
  }
}

class DeCounter extends HTMLElement
{
  static tname = "de-counter";
  static DEF_MAX = 10;
  static DEF_TICK_WIDTH = 1;
  static DEF_GAP_WIDTH = 1;
  static DEF_CIRCLE_RADIUS = 90;
  static DEF_VIEW_RADIUS = 100;

  connectedCallback()
  {
    this.Render();
  }

  set value(new_value)
  {
    this.setAttribute("value", new_value);
    if (this.isConnected)
    {
      this.Update();
    }
  }

  get value()
  {
    return Utils.Get_Attribute_Int(this, "value", DeCounter.DEF_MAX);
  }

  Calc_Ticks_Length(value)
  {
    const tick_width = Utils.Get_Attribute_Int(this, "tick-width", DeCounter.DEF_TICK_WIDTH);
    const gap_width = Utils.Get_Attribute_Int(this, "gap-width", DeCounter.DEF_GAP_WIDTH);
    let ticks_length = value * (tick_width + gap_width) - gap_width;

    return ticks_length;
  }

  Calc_Base_Length()
  {
    const base_type = this.getAttribute("base-type");
    const max_value = Utils.Get_Attribute_Int(this, "max-value", DeCounter.DEF_MAX);
    const gap_width = Utils.Get_Attribute_Int(this, "gap-width", DeCounter.DEF_GAP_WIDTH);
    let base_length = 0;

    if (base_type == "small")
    {
      const ticks_length = this.Calc_Ticks_Length(max_value);
      base_length = ticks_length * 0.5;
    }
    else if (base_type == "medium")
    {
      const ticks_length = this.Calc_Ticks_Length(max_value);
      base_length = ticks_length;
    }
    else if (base_type == "large")
    {
      const ticks_length = this.Calc_Ticks_Length(max_value);
      base_length = ticks_length * 2;
    }
    else
    {
      base_length = gap_width;
    }

    return base_length;
  }

  Calc_Path_Length()
  {
    const max_value = Utils.Get_Attribute_Int(this, "max-value", DeCounter.DEF_MAX);
    return this.Calc_Ticks_Length(max_value) + this.Calc_Base_Length();
  }

  Calc_Remaining_Length(value)
  {
    return this.Calc_Path_Length() - this.Calc_Ticks_Length(value);
  }

  Calc_Dash_Array(value)
  {
    let stroke_dasharray = null;
    const max_value = Utils.Get_Attribute_Int(this, "max-value", DeCounter.DEF_MAX);

    if (value < 0)
    {
      value = 0;
    }
    else if (value > max_value)
    {
      value = max_value;
    }

    if (value == 0)
    {
      stroke_dasharray = "0 1";
    }
    else
    {
      const tick_width = Utils.Get_Attribute_Int(this, "tick-width", DeCounter.DEF_TICK_WIDTH);
      const gap_width = Utils.Get_Attribute_Int(this, "gap-width", DeCounter.DEF_GAP_WIDTH);

      stroke_dasharray = "";
      for (let v = 1; v <= value; v++)
      {
        stroke_dasharray += tick_width + " ";
        if (v != value)
        {
          stroke_dasharray += gap_width + " ";
        }
        else
        {
          stroke_dasharray += this.Calc_Remaining_Length(value);
        }
      }
    }

    //console.log("ticks length value: ", this.Calc_Ticks_Length(value));
    //console.log("ticks length max: ", this.Calc_Ticks_Length(max_value));
    //console.log("base length: ", this.Calc_Base_Length());
    //console.log("path length: ", this.Calc_Path_Length());
    //console.log("remaining length: ", this.Calc_Remaining_Length(value));
    
    return stroke_dasharray;
  }

  start()
  {
    const wait_millis = Utils.Get_Attribute_Int(this, "wait-millis", DeDial.DEF_WAIT_MILLIS);
    this.interval_id = setInterval(this.On_Interval, wait_millis);
  }

  stop()
  {
    if (this.interval_id)
    {
      clearInterval(this.interval_id);
      this.interval_id = null;
    }
  }

  toggle()
  {
    if (this.interval_id)
    {
      this.stop();
    }
    else
    {
      this.start();
    }
  }

  reset()
  {
    const count_reverse = this.hasAttribute("count-reverse");
    if (count_reverse)
    {
      const max_value = Utils.Get_Attribute_Int(this, "max-value", DeDial.DEF_MAX);
      this.value = max_value;
    }
    else
    {
      this.value = 0;
    }
  }

  restart()
  {
    this.stop();
    this.reset();
    this.start();
  }

  On_Observe(entries, observer)
  {
    if (entries.length > 0 && entries[0].isIntersecting) 
    {
      this.start();
      observer.unobserve(this);
    }
  }

  On_Interval()
  {
    const max_value = Utils.Get_Attribute_Int(this, "max-value", DeDial.DEF_MAX);
    const count_reverse = this.hasAttribute("count-reverse");

    const inc = count_reverse ? -1 : 1;
    this.value += inc;

    this.dispatchEvent(new Event("tick"));

    const auto_stop = this.hasAttribute("auto-stop");
    const is_terminal_value = 
      (count_reverse && this.value == 0) || (!count_reverse && this.value == max_value);
    if (is_terminal_value)
    {
      this.dispatchEvent(new Event("completed"));
      if (auto_stop)
      {
        this.stop();
      }
      if (this.hasAttribute("stop-href"))
      {
        const stop_href = this.getAttribute("stop-href");
        window.location.href = stop_href;
      }
    }
  }

  Update()
  {
    const value = Utils.Get_Attribute_Int(this, "value", DeCounter.DEF_MAX);
    const stroke_dasharray = this.Calc_Dash_Array(value);
    if (stroke_dasharray)
    {
      this.circle_elem.setAttribute("stroke-dasharray", stroke_dasharray);
    }
  }

  Render()
  {
    const path_length = this.Calc_Path_Length();

    const viewbox_radius = Utils.Get_Attribute_Int(this, "viewbox-radius", DeCounter.DEF_VIEW_RADIUS);
    const viewbox_diameter = Math.abs(viewbox_radius) * 2;
    const view_box = 
      "-" + viewbox_radius + " -" + viewbox_radius + 
      " " + viewbox_diameter + " " + viewbox_diameter;
    const circle_radius = Utils.Get_Attribute_Int(this, "circle-radius", DeCounter.DEF_CIRCLE_RADIUS);
    
    let shadow_svg = "";
    if (this.hasAttribute("show-shadow"))
    {
      const max_value = Utils.Get_Attribute_Int(this, "max-value", DeCounter.DEF_MAX);
      shadow_svg = `
        <circle 
          cid="shadow_elem"
          cx="0" cy="0" r="${circle_radius}" 
          pathLength="${path_length}"
          stroke-dasharray="${this.Calc_Dash_Array(max_value)}" 
          class="shadow"
        />
      `;
    }

    const html = `
      <svg cid="svg_elem" viewBox="${view_box}" class="dial">
        ${shadow_svg}
        <circle 
          cid="circle_elem"
          cx="0" cy="0" r="${circle_radius}" 
          pathLength="${path_length}"
          stroke-dasharray="0 ${path_length}" 
        />
      </svg>
    `;
    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    Utils.Set_Style(this, this.svg_elem, "style-svg");

    this.Update();

    const auto_start = this.hasAttribute("auto-start");
    if (auto_start)
    {
      const options = { root: null, rootMargin: '0px', threshold: 0.5 };
      const observer = new IntersectionObserver(this.On_Observe, options);
      observer.observe(this);
    }
  }
}

class DeClockDial extends HTMLElement
{
  static tname = "de-clock-dial";

  connectedCallback()
  {
    this.innerHTML = `
      <de-dialmarks cid="ticks_min_elem" value="60" tick-width="1" gap-width="10" class="minutes"></de-dialmarks>
      <de-dialmarks cid="ticks_hr_elem" value="12" tick-width="1" gap-width="10" class="hours"></de-dialmarks>
    `;
    Utils.Set_Id_Shortcuts(this, this, "cid");
  }
}

class DeClock extends HTMLElement
{
  static tname = "de-clock";

  interval_id = null;

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  static observedAttributes = 
  [
    "auto-start",
    "style-str",
    "style-face",
    "style-hand-hr",
    "style-hand-min",
    "style-hand-sec",
    "style-ticks-hr",
    "style-ticks-min",
    "style-numbers",
    "date-hour",
    "date-minute",
    "date-second",
    "time-zone",
  ];
  attributeChangedCallback(name, old_value, new_value)
  {
    this.Render();
  }

  start()
  {
    if (!this.interval_id && !Utils.Has_Attribute(this, "time-str"))
    {
      this.interval_id = setInterval(this.On_Update, Utils.MILLIS_SECOND);
    }
  }

  stop()
  {
    if (this.interval_id)
    {
      clearInterval(this.interval_id);
      this.interval_id = null;
    }
  }

  toggle()
  {
    if (this.interval_id)
    {
      this.stop();
    }
    else
    {
      this.start();
    }
  }

  On_Update()
  {
    let now = new Date();
    if (!Utils.Is_Empty(this.getAttribute("date-hour")))
    {
      now.setHours(Utils.Get_Attribute_Int(this, "date-hour"));
    }
    if (!Utils.Is_Empty(this.getAttribute("date-minute")))
    {
      now.setMinutes(Utils.Get_Attribute_Int(this, "date-minute"));
    }
    if (!Utils.Is_Empty(this.getAttribute("date-second")))
    {
      now.setSeconds(Utils.Get_Attribute_Int(this, "date-second"));
    }
    
    let hr = now.getHours() % 12;
    let min = now.getMinutes();
    let sec = now.getSeconds();

    const timeZone = this.getAttribute("time-zone");
    if (!Utils.Is_Empty(timeZone))
    {
      try
      {
        hr = parseInt(now.toLocaleString("en-AU", {timeZone, hour12: false, hour: "numeric"}));
        min = parseInt(now.toLocaleString("en-AU", {timeZone, minute: "numeric"}));
        sec = parseInt(now.toLocaleString("en-AU", {timeZone, second: "numeric"}));
      }
      catch (e)
      {
        if (e.name != "RangeError") console.error(e);
      }
    }

    this.hr_elem.style = `transform: rotate(${hr*30-180}deg);` + this.style_hand_hr;
    this.min_elem.style = `transform: rotate(${min*6-180}deg);` + this.style_hand_min;
    this.sec_elem.style = `transform: rotate(${sec*6-180}deg);` + this.style_hand_sec;
  }

  Render()
  {
    const html = `
      <de-clock-dial cid="ticks_elem"></de-clock-dial>
      <svg cid="face_elem" viewBox="-100 -100 200 200" width="100%" height="100%" class="hands">

        <text x=  "0" y="-77" text-anchor="middle" dominant-baseline="hanging">12</text>

        <text x= "41" y="-67" text-anchor="end"    dominant-baseline="hanging">1</text>
        <text x= "67" y="-42" text-anchor="end"    dominant-baseline="hanging">2</text>

        <text x= "78" y=  "2" text-anchor="end"    dominant-baseline="middle">3</text>

        <text x= "67" y= "42" text-anchor="end"    dominant-baseline="text-bottom">4</text>
        <text x= "41" y= "68" text-anchor="end"    dominant-baseline="text-bottom">5</text>

        <text x=  "0" y= "77" text-anchor="middle" dominant-baseline="text-bottom">6</text>

        <text x="-38" y= "68" text-anchor="start" dominant-baseline="text-bottom">7</text>
        <text x="-67" y= "42" text-anchor="start" dominant-baseline="text-bottom">8</text>

        <text x="-78" y=  "2" text-anchor="start" dominant-baseline="middle">9</text>

        <text x="-70" y="-42" text-anchor="start" dominant-baseline="hanging">10</text>
        <text x="-45" y="-67" text-anchor="start" dominant-baseline="hanging">11</text>

        <path cid="hr_elem"  class="hand-hr"  d="M 0,50 L 8,0 0,-10 -8,0 z" />
        <path cid="min_elem" class="hand-min" d="M 0,80 L 5,0 0,-10 -5,0 z" />
        <path cid="sec_elem" class="hand-sec" d="M 0,80 L 0,-10 z" />

      </svg>
    `;
    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    Utils.Set_Style(this, this, "style-str");
    Utils.Set_Style(this, this.face_elem, "style-face");
    Utils.Set_Style(this, this.ticks_elem.ticks_hr_elem, "style-ticks-hr");
    Utils.Set_Style(this, this.ticks_elem.ticks_min_elem, "style-ticks-min");
    for (const elem of this.querySelectorAll("text"))
      Utils.Set_Style(this, elem, "style-numbers");      

    this.style_hand_hr = this.hasAttribute("style-hand-hr") ? this.getAttribute("style-hand-hr") : "";
    this.style_hand_min = this.hasAttribute("style-hand-min") ? this.getAttribute("style-hand-min") : "";
    this.style_hand_sec = this.hasAttribute("style-hand-sec") ? this.getAttribute("style-hand-sec") : "";

    this.On_Update();

    const auto_start = Utils.Get_Attribute_Bool(this, "auto-start", false);
    if (auto_start)
    {
      this.start();
    }
  }
}

class DeDial extends HTMLElement
{
  static tname = "de-dial";
  static DEF_MAX = 10;
  static DEF_TICK_WIDTH = 1;
  static DEF_GAP_WIDTH = 1;
  static DEF_WAIT_MILLIS = 1000;
  static DEF_CIRCLE_RADIUS = 90;
  static DEF_VIEW_RADIUS = 100;

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  static observedAttributes = 
  [
    'auto-start', 
    "auto-stop",
    "count-reverse",
    "gap-width", 
    "has-overflow",
    "label-postfix",
    "label-prefix",
    "label-sub",
    "max-value",
    "pause-millis",
    "show-label",
    "show-shadow",
    "stop-href",
    "tick-width",
    "value",
    "viewbox-radius",
    "wait-millis",
    "style-host",
    "style-label",
    "style-shadow",
    "style-svg",
  ];
  attributeChangedCallback(name, old_value, new_value)
  {
    if (name == "value")
    {
      this.Update();
    }
    else
    {
      this.Render();
    }
    //console.log("DeDial.attributeChangedCallback(name, old_value, new_value):", name, old_value, new_value);
  }

  set value(new_value)
  {
    const max_value = Utils.Get_Attribute_Int(this, "max-value", DeDial.DEF_MAX);
    const has_overflow = this.hasAttribute("has-overflow");

    if (new_value == null || new_value == undefined)
    {
      new_value = 0;
    }
    else if (new_value > max_value && !has_overflow)
    {
      new_value = 0;
    }
    else if (new_value < 0 && !has_overflow)
    {
      new_value = max_value;
    }
  
    this.setAttribute("value", new_value);
  }

  get value()
  {
    return Utils.Get_Attribute_Int(this, "value");
  }

  set labelText(str)
  {
    const show_label = Utils.Get_Attribute_Bool(this, "show-label");
    if (show_label)
    {
      const prefix = this.hasAttribute("label-prefix") ? this.getAttribute("label-prefix") : "";
      const postfix = this.hasAttribute("label-postfix") ? this.getAttribute("label-postfix") : "";

      this.text_elem.innerHTML = prefix + str + postfix;
    }
  }

  start()
  {
    this.stop();
    const wait_millis = Utils.Get_Attribute_Int(this, "wait-millis", DeDial.DEF_WAIT_MILLIS);
    this.interval_id = setInterval(this.On_Interval, wait_millis);
  }

  stop()
  {
    if (this.interval_id)
    {
      clearInterval(this.interval_id);
      this.interval_id = null;
    }
  }

  toggle()
  {
    if (this.interval_id)
    {
      this.stop();
    }
    else
    {
      this.start();
    }
  }

  reset()
  {
    const count_reverse = Utils.Get_Attribute_Bool(this, "count-reverse");
    if (count_reverse)
    {
      const max_value = Utils.Get_Attribute_Int(this, "max-value", DeDial.DEF_MAX);
      this.value = max_value;
    }
    else
    {
      this.value = 0;
    }
  }

  restart()
  {
    this.stop();
    this.reset();
    this.start();
  }

  Set_Observe(value)
  {
    if (value === true && this.interval_id == null)
    {
      if (!this.observer)
      {
        const options = { root: null, rootMargin: '0px', threshold: 0.5 };
        this.observer = new IntersectionObserver(this.On_Observe, options);
      }

      this.observer.observe(this);
    }
    else
    {
      if (this.observer)
      {
        this.observer.unobserve(this);
      }
    }
  }

  Calc_Path_Length()
  {
    const max_value = Utils.Get_Attribute_Int(this, "max-value", DeDial.DEF_MAX);
    const tick_width = Utils.Get_Attribute_Int(this, "tick-width", DeDial.DEF_TICK_WIDTH);
    const gap_width = Utils.Get_Attribute_Int(this, "gap-width", DeDial.DEF_GAP_WIDTH);
    const path_length = max_value * (tick_width + gap_width);
    return path_length;
  }

  On_Interval()
  {
    const max_value = Utils.Get_Attribute_Int(this, "max-value", DeDial.DEF_MAX);
    const count_reverse = Utils.Get_Attribute_Bool(this, "count-reverse");

    const inc = count_reverse ? -1 : 1;
    this.value += inc;

    this.dispatchEvent(new Event("tick"));

    const auto_stop = Utils.Get_Attribute_Bool(this, "auto-stop");
    const is_terminal_value = 
      (count_reverse && this.value == 0) || (!count_reverse && this.value == max_value);
    if (is_terminal_value)
    {
      this.dispatchEvent(new Event("completed"));
      if (auto_stop)
      {
        this.stop();
      }
      if (this.hasAttribute("stop-href"))
      {
        const stop_href = this.getAttribute("stop-href");
        window.location.href = stop_href;
      }

      const pause_millis = Utils.Get_Attribute_Int(this, "pause-millis");
      if (!auto_stop && pause_millis > 0)
      {
        this.stop();
        setTimeout(() => this.start(), pause_millis);
      }
    }
  }

  On_Observe(entries, observer)
  {
    if (entries.length > 0 && entries[0].isIntersecting) 
    {
      this.start();
      observer.unobserve(this);
    }
  }

  Update()
  {
    if (this.isConnected)
    {
      let stroke_dasharray = null;
      const max_value = Utils.Get_Attribute_Int(this, "max-value", DeDial.DEF_MAX);
      const tick_width = Utils.Get_Attribute_Int(this, "tick-width", DeDial.DEF_TICK_WIDTH);
      const gap_width = Utils.Get_Attribute_Int(this, "gap-width", DeDial.DEF_GAP_WIDTH);
      const path_length = this.Calc_Path_Length();

      let value = this.value;
      if (value > max_value)
      {
        value = max_value;
      }
      else if (value < 0)
      {
        value = 0;
      }

      if (value == 0)
      {
        stroke_dasharray = "0 " + path_length;
      }
      else if (value == 1)
      {
        stroke_dasharray = "" + tick_width + " " + path_length;
      }
      else //if (value > 1 && value <= max_value)
      {
        const tick = "" + gap_width + " " + tick_width + " ";
        stroke_dasharray = "" + tick_width + " " + tick.repeat(value - 1) + path_length;
      }

      if (stroke_dasharray)
      {
        this.circle_elem.setAttribute("stroke-dasharray", stroke_dasharray);
      }

      this.labelText = this.value;
    }
  }

  Render()
  {
    //console.log("DeDial.Render()");
    if (this.isConnected)
    {
      const path_length = this.Calc_Path_Length();
      const tick_width = Utils.Get_Attribute_Int(this, "tick-width", DeDial.DEF_TICK_WIDTH);
      const gap_width = Utils.Get_Attribute_Int(this, "gap-width", DeDial.DEF_GAP_WIDTH);

      const viewbox_radius = Utils.Get_Attribute_Int(this, "viewbox-radius", DeDial.DEF_VIEW_RADIUS);
      const viewbox_diameter = Math.abs(viewbox_radius) * 2;
      const view_box = 
        "-" + viewbox_radius + " -" + viewbox_radius + 
        " " + viewbox_diameter + " " + viewbox_diameter;
      const circle_radius = Utils.Get_Attribute_Int(this, "circle-radius", DeDial.DEF_CIRCLE_RADIUS);

      let shadow_svg = "";
      const show_shadow = Utils.Get_Attribute_Bool(this, "show-shadow");
      if (show_shadow)
      {
        shadow_svg = `
          <circle 
            cid="shadow_elem"
            cx="0" cy="0" r="${circle_radius}" 
            pathLength="${path_length}"
            stroke-dasharray="${tick_width} ${gap_width}" 
            class="shadow"
          />
        `;
      }

      let label_html = "";
      const show_label = Utils.Get_Attribute_Bool(this, "show-label");
      if (show_label)
      {
        const label_sub = Utils.Get_Attribute(this, "label-sub", "");
        label_html = `
          <div cid="label_elem" class="label">
            <span cid="text_elem"></span>
            <span cid="subtext_elem" class="label-sub">${label_sub}</span>
          </div>
        `;
      }
  
      const html = `
        <svg cid="svg_elem" viewBox="${view_box}" class="dial">
          <slot name="svg"></slot>
          ${shadow_svg}
          <circle 
            cid="circle_elem"
            cx="0" cy="0" r="${circle_radius}" 
            pathLength="${path_length}"
            stroke-dasharray="0 ${path_length}" 
            class="active-marks"
          />
        </svg>
        ${label_html}
      `;
      const template = Utils.To_Template(html, this);
      this.innerHTML = template.innerHTML;
      Utils.Set_Id_Shortcuts(this, this, "cid");

      Utils.Set_Style(this, this, "style-host");
      Utils.Set_Style(this, this.svg_elem, "style-svg");
      Utils.Set_Styles(this);

      this.Update();

      const auto_start = Utils.Get_Attribute_Bool(this, "auto-start", false);
      this.Set_Observe(auto_start);
    }
  }
}

class DeTimer extends HTMLElement
{
  static tname = "de-timer";

  constructor()
  {
    super();
    this.target_date = null;
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  static observedAttributes = 
  [
    "millis",
    "auto-start",
    "auto-stop",
    "date",
    "time",
    "show-labels",
    "label-sec",
    "label-min",
    "label-hr",
    "label-day",
    "style-label",
    "style-shadow",
    "style-dial",
    "style-str",
    "style-hrs",
    "style-min",
    "style-sec",
    "style-anim",
    "style-label-sub",
    "style-counter",
    "style-day",
    "style-ticks",
  ];
  attributeChangedCallback(name, old_value, new_value)
  {
    if (name == "date" || name == "time" || name == "millis")
    {
      const date_str = this.getAttribute("date");
      const time_str = this.getAttribute("time");
      const period_str = this.getAttribute("millis");
      this.target_date = Utils.Time_Strs_To_Millis(date_str, time_str, period_str)
    }
    else
    {
      this.Render();
    }
  }

  Check_Completed(value, elem)
  {
    if (elem.prev_value != undefined && value == 0 && elem.prev_value != 0)
    {
      this.On_Dial_Completed(elem);
    }
    elem.prev_value = value;
  }

  Split_Timespan(millis)
  {
    const res = {};
    
    res.days = Math.floor(millis / Utils.MILLIS_DAY);
    millis = millis % Utils.MILLIS_DAY;
      
    res.hrs = Math.floor(millis / Utils.MILLIS_HOUR);
    millis = millis % Utils.MILLIS_HOUR;
      
    res.mins = Math.floor(millis / Utils.MILLIS_MINUTE);
    millis = millis % Utils.MILLIS_MINUTE;
      
    res.secs = Math.floor(millis / Utils.MILLIS_SECOND);
    millis = millis % Utils.MILLIS_SECOND;

    return res;
  }

  // attributes =========================================================================

  // properties =========================================================================

  set time(value_int)
  {
    this.target_date = value_int;
    this.Update_Timer();
  }

  // methods ============================================================================

  start()
  {
    this.stop();
    this.On_Interval();
  }

  stop()
  {
    if (this.interval_id)
    {
      clearTimeout(this.interval_id);
      this.interval_id = null;
    }
  }

  toggle()
  {
    if (this.interval_id)
    {
      this.stop();
    }
    else
    {
      this.start();
    }
  }

  // events =============================================================================

  On_Dial_Completed(elem)
  {
    elem.addEventListener("animationend", this.On_Animation_End);
    elem.addEventListener("transitionend", this.On_Animation_End);
    elem.classList.add("completed");
  }

  On_Animation_End(event)
  {
    event.target.classList.remove("completed");
    event.target.removeEventListener("animationend", this.On_Animation_End);
    event.target.removeEventListener("transitionend", this.On_Animation_End);
  }

  On_Interval()
  {
    this.Update_Timer();

    this.dispatchEvent(new Event("tick"));

    const now = Date.now();
    const is_terminal_value = now >= this.target_date;
    const auto_stop = Utils.Get_Attribute_Bool(this, "auto-stop");

    if (is_terminal_value && auto_stop)
    {
      this.stop();
    }
    else
    {
      this.interval_id = setTimeout(this.On_Interval, 1000);
    }

    if (this.prev_date && this.prev_date <= this.target_date && now > this.target_date)
    {
      this.dispatchEvent(new Event("completed"));
    }
    this.prev_date = now;

    if (is_terminal_value && this.hasAttribute("stop-href"))
    {
      const stop_href = this.getAttribute("stop-href");
      window.location.href = stop_href;
    }
  }

  // rendering ==========================================================================

  Update_Timer()
  {
    if (this.isConnected)
    {
      const now = Date.now();
      const millis = Math.abs(this.target_date - now);
      const timespan = this.Split_Timespan(millis);

      this.days_elem.value = timespan.days;
      this.hours_elem.value = timespan.hrs;
      this.minutes_elem.value = timespan.mins;
      this.seconds_elem.value = timespan.secs;

      this.Check_Completed(timespan.days, this.days_counter_elem);
      this.Check_Completed(timespan.hrs, this.hours_counter_elem);
      this.Check_Completed(timespan.mins, this.minutes_counter_elem);
      this.Check_Completed(timespan.secs, this.seconds_counter_elem);
    }
  }

  Render()
  {
    if (this.isConnected)
    {
      const max_marks = 60;
      let 
        label_postfix_sec = "", 
        label_postfix_min = "", 
        label_postfix_hrs = "", 
        label_postfix_day = "";
      const show_labels = Utils.Get_Attribute_Bool(this, "show-labels");
      if (show_labels)
      {
        const label_sec = Utils.Get_Attribute(this, "label-sec", "seconds");
        const label_min = Utils.Get_Attribute(this, "label-min", "minutes");
        const label_hrs = Utils.Get_Attribute(this, "label-hrs", "hours");
        const label_day = Utils.Get_Attribute(this, "label-day", "days");

        label_postfix_sec = "label-sub=\"" + label_sec + "\"";
        label_postfix_min = "label-sub=\"" + label_min + "\"";
        label_postfix_hrs = "label-sub=\"" + label_hrs + "\"";
        label_postfix_day = "label-sub=\"" + label_day + "\"";
      }

      const html = `
        <div cid="days_counter_elem" class="counter">
          <de-dial cid="days_elem" max-value="100" show-label show-shadow has-overflow ${label_postfix_day} class="ticks"></de-dial>
          <de-dial cid="anim_day_elem" class="anim-border days" max-value="${max_marks}" value="${max_marks}" gap-width="1"></de-dial>
        </div>
        <div cid="hours_counter_elem" class="counter">
          <de-dial cid="hours_elem" tick-width="5" gap-width="1" max-value="23" show-label show-shadow ${label_postfix_hrs} class="ticks"></de-dial>
          <de-dial cid="anim_hrs_elem" class="anim-border hours" max-value="${max_marks}" value="${max_marks}" gap-width="1"></de-dial>
        </div>
        <div cid="minutes_counter_elem" class="counter">
          <de-dial cid="minutes_elem" tick-width="2" gap-width="1" max-value="59" show-label show-shadow ${label_postfix_min} class="ticks"></de-dial>
          <de-dial cid="anim_min_elem" class="anim-border minutes" max-value="${max_marks}" value="${max_marks}" gap-width="1"></de-dial>
        </div>
        <div cid="seconds_counter_elem" class="counter">
          <de-dial cid="seconds_elem" tick-width="2" gap-width="1" max-value="59" show-label show-shadow ${label_postfix_sec} class="ticks"></de-dial>
          <de-dial cid="anim_sec_elem" class="anim-border seconds" max-value="${max_marks}" value="${max_marks}" gap-width="1"></de-dial>
        </div>
      `;
      this.innerHTML = html;
      Utils.Set_Id_Shortcuts(this, this, "cid");

      for (const elem of this.querySelectorAll(".counter"))
        Utils.Set_Style(this, elem, "style-counter");
      
      for (const elem of this.querySelectorAll(".shadow"))
        Utils.Set_Style(this, elem, "style-shadow");
      
      for (const elem of this.querySelectorAll(".label"))
        Utils.Set_Style(this, elem, "style-label");
      
      for (const elem of this.querySelectorAll(".label-sub"))
        Utils.Set_Style(this, elem, "style-label-sub");
      
      for (const elem of this.querySelectorAll(".dial"))
        Utils.Set_Style(this, elem, "style-dial");
      
      for (const elem of this.querySelectorAll(".ticks"))
        Utils.Set_Style(this, elem, "style-ticks");

      let css = this.getAttribute("style-anim") + this.getAttribute("style-day");
      this.anim_day_elem.style = css;
      css = this.getAttribute("style-anim") + this.getAttribute("style-hrs");
      this.anim_hrs_elem.style = css;
      css = this.getAttribute("style-anim") + this.getAttribute("style-min");
      this.anim_min_elem.style = css;
      css = this.getAttribute("style-anim") + this.getAttribute("style-sec");
      this.anim_sec_elem.style = css;

      Utils.Set_Style(this, this, "style-str");

      const auto_start = Utils.Get_Attribute_Bool(this, "auto-start");
      if (auto_start)
      {
        this.start();
      }
    }
  }
}

class DeTimerCompact extends DeTimer
{
  static tname = "de-timer-compact";

  static observedAttributes = 
  [
    "millis",
    "auto-start",
    "auto-stop",
    "date",
    "time",
    "sublabel-text",
    "style-label",
    "style-shadow",
    "style-dial",
    "style-str",
    "style-hrs",
    "style-mins",
    "style-secs",
    "style-anim-border",
    "style-sublabel",
  ];

  Split_Timespan(millis)
  {
    const res = {};
        
    if (this.hasAttribute("split-days"))
    {
      res.days = Math.floor(millis / Utils.MILLIS_DAY);
      millis = millis % Utils.MILLIS_DAY;
    }

    res.hrs = Math.floor(millis / Utils.MILLIS_HOUR);
    millis = millis % Utils.MILLIS_HOUR;
      
    res.mins = Math.floor(millis / Utils.MILLIS_MINUTE);
    millis = millis % Utils.MILLIS_MINUTE;
      
    res.secs = Math.floor(millis / Utils.MILLIS_SECOND);
    millis = millis % Utils.MILLIS_SECOND;

    return res;
  }

  // attributes =========================================================================

  // properties =========================================================================

  // methods ============================================================================

  // events =============================================================================

  // rendering ==========================================================================

  Update_Timer()
  {
    if (this.isConnected)
    {
      const now = Date.now();
      const millis = Math.abs(this.target_date - now);
      const timespan = this.Split_Timespan(millis);

      this.hours.value = timespan.hrs;
      this.minutes.value = timespan.mins;
      this.seconds.value = timespan.secs;
      const hrs_str = String(timespan.hrs).padStart(2, "0");
      const mins_str = String(timespan.mins).padStart(2, "0");
      const secs_str = String(timespan.secs).padStart(2, "0");
      let label_str = `${hrs_str}:${mins_str}:${secs_str}`;

      if (this.hasAttribute("split-days"))
      {
        this.days.value = timespan.days;
        const days_str = String(timespan.days);
        label_str = `${days_str} days<br>${label_str}`;
      }

      this.label_elem.innerHTML = label_str;
      this.Check_Completed(timespan.secs, this);
    }
  }

  Render()
  {
    if (this.isConnected)
    {
      const html = `
        <de-dial cid="days" max-value="100" show-shadow class="days" has-overflow></de-dial>
        <de-dial cid="hours" max-value="23" tick-width="4" show-shadow class="hrs"></de-dial>
        <de-dial cid="minutes" max-value="59" show-shadow class="mins"></de-dial>
        <de-dial cid="seconds" max-value="59" show-shadow class="secs"></de-dial>
        <de-dialmarks cid="border" class="anim-border" value="80" gap-width="2"></de-dialmarks>
        <div cid="label" class="label">
          <span cid="label_elem"></span>
          <span cid="sublabel" class="sublabel"></span>
        </div>
      `;
      this.innerHTML = html;
      Utils.Set_Id_Shortcuts(this, this, "cid");

      if (this.hasAttribute("sublabel-text"))
      {
        const sublabel_text = this.getAttribute("sublabel-text");
        this.sublabel.innerHTML = sublabel_text;
      }

      Utils.Set_Styles(this);

      const auto_start = Utils.Get_Attribute_Bool(this, "auto-start");
      if (auto_start)
      {
        this.start();
      }
    }
  }
}

Utils.Register_Element(DeDialMarks);
Utils.Register_Element(DeClockDial);
Utils.Register_Element(DeClock);
Utils.Register_Element(DeDial);
Utils.Register_Element(DeActionBtn);
Utils.Register_Element(DeTimer);
Utils.Register_Element(DeTimerCompact);
Utils.Register_Element(DeGauge);
Utils.Register_Element(DeCounter);

export default 
{
  Utils,
  DeDial,
  DeActionBtn
};
