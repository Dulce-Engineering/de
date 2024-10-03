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

  static Get_Attribute_Int(elem, name, def)
  {
    let value = def || 0;
  
    if (elem.hasAttribute(name))
    {
      const value_str = elem.getAttribute(name);
      const value_int = parseInt(value_str);
      if (!isNaN(value_int))
      {
        value = value_int;
      }
    }
  
    return value;
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

  static Register_Element(elem_class)
  {
    const comp_class = customElements.get(elem_class.tname);
    if (comp_class == undefined)
    {
      customElements.define(elem_class.tname, elem_class);
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

  Set_Style(elem, attr_name)
  {
    if (this.hasAttribute(attr_name))
    {
      const css = this.getAttribute(attr_name);
      elem.style = css;
    }
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

    this.Set_Style(this.svg_elem, "style-svg");

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

  Set_Style(elem, attr_name)
  {
    if (this.hasAttribute(attr_name))
    {
      const css = this.getAttribute(attr_name);
      elem.style = css;
    }
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

    this.Set_Style(this.svg_elem, "style-svg");

    this.Update();
  }
}

class DeClockDial extends HTMLElement
{
  static tname = "de-clock-dial";

  connectedCallback()
  {
    this.innerHTML = `
      <de-dialmarks value="12" tick-width="1" gap-width="10" class="hours"></de-dialmarks>
      <de-dialmarks value="60" tick-width="1" gap-width="10" class="minutes"></de-dialmarks>
    `;
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

  start()
  {
    if (!this.hasAttribute("time-str"))
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
    if (this.hasAttribute("time-str"))
    {
      now = new Date(this.getAttribute("time-str"));
    }

    let hr = now.getHours() % 12;
    let min = now.getMinutes();
    let sec = now.getSeconds();
    if (this.hasAttribute("time-zone"))
    {
      const timeZone = this.getAttribute("time-zone");
      hr = parseInt(now.toLocaleString("en-AU", {timeZone, hour12: false, hour: "numeric"}));
      min = parseInt(now.toLocaleString("en-AU", {timeZone, minute: "numeric"}));
      sec = parseInt(now.toLocaleString("en-AU", {timeZone, second: "numeric"}));
    }

    this.hr_elem.style = `transform: rotate(${hr*30-180}deg)`;
    this.min_elem.style = `transform: rotate(${min*6-180}deg)`;
    this.sec_elem.style = `transform: rotate(${sec*6-180}deg)`;

  }

  Render()
  {
    const html = `
      <de-clock-dial></de-clock-dial>
      <svg viewBox="-100 -100 200 200" width="100%" height="100%" class="hands">
        <path cid="hr_elem"  class="hand-hr"  d="M 0,50 L 8,0 0,-10 -8,0 z" />
        <path cid="min_elem" class="hand-min" d="M 0,80 L 5,0 0,-10 -5,0 z" />
        <path cid="sec_elem" class="hand-sec" d="M 0,80 L 0,-10 z" />

        <text x=  "0" y="-77" text-anchor="middle" dominant-baseline="hanging">12</text>

        <text x= "45" y="-67" text-anchor="end"    dominant-baseline="hanging">1</text>
        <text x= "67" y="-42" text-anchor="end"    dominant-baseline="hanging">2</text>

        <text x= "78" y=  "0" text-anchor="end"    dominant-baseline="middle">3</text>

        <text x= "67" y= "42" text-anchor="end"    dominant-baseline="text-bottom">4</text>
        <text x= "38" y= "68" text-anchor="end"    dominant-baseline="text-bottom">5</text>

        <text x=  "0" y= "77" text-anchor="middle" dominant-baseline="text-bottom">6</text>

        <text x="-38" y= "68" text-anchor="start" dominant-baseline="text-bottom">7</text>
        <text x="-67" y= "42" text-anchor="start" dominant-baseline="text-bottom">8</text>

        <text x="-78" y=  "0" text-anchor="start" dominant-baseline="middle">9</text>

        <text x="-70" y="-42" text-anchor="start" dominant-baseline="hanging">10</text>
        <text x="-45" y="-67" text-anchor="start" dominant-baseline="hanging">11</text>
      </svg>
    `;
    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.On_Update();

    if (this.hasAttribute("auto-start"))
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

  attributeChangedCallback(name, old_value, new_value)
  {
    
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
    if (this.isConnected)
    {
      this.Update();
    }
  }

  get value()
  {
    return Utils.Get_Attribute_Int(this, "value");
  }

  set labelText(str)
  {
    const prefix = this.hasAttribute("label-prefix") ? this.getAttribute("label-prefix") : "";
    const postfix = this.hasAttribute("label-postfix") ? this.getAttribute("label-postfix") : "";

    this.text_elem.innerHTML = prefix + str + postfix;
  }

  // auto-start
  // auto-stop
  // circle-radius
  // count-reverse
  // gap-width
  // label-prefix
  // label-postfix
  // max-value
  // show-label
  // stop-href
  // style-host
  // style-label
  // style-svg
  // tick-width
  // value
  // viewbox-radius
  // wait-millis

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

  On_Observe(entries, observer)
  {
    if (entries.length > 0 && entries[0].isIntersecting) 
    {
      this.start();
      observer.unobserve(this);
    }
  }

  Set_Style(elem, attr_name)
  {
    if (this.hasAttribute(attr_name))
    {
      const css = this.getAttribute(attr_name);
      elem.style = css;
    }
  }

  Update()
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

    if (this.hasAttribute("show-label"))
    {
      this.labelText = this.value;
    }
  }

  Render()
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
    if (this.hasAttribute("show-shadow"))
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

    const html = `
      <svg cid="svg_elem" viewBox="${view_box}" class="dial">
        <slot name="svg"></slot>
        ${shadow_svg}
        <circle 
          cid="circle_elem"
          cx="0" cy="0" r="${circle_radius}" 
          pathLength="${path_length}"
          stroke-dasharray="0 ${path_length}" 
        />
      </svg>
      <span cid="text_elem" class="label"></span>
    `;
    const template = Utils.To_Template(html, this);
    this.innerHTML = template.innerHTML;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.Set_Style(this, "style-host");
    this.Set_Style(this.svg_elem, "style-svg");
    this.Set_Style(this.text_elem, "style-label");

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

class DeTimer extends HTMLElement
{
  static tname = "de-timer";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }
  
  Get_Date()
  {
    const now_date = new Date();
    let def_year = now_date.getFullYear();
    const def_date = new Date(def_year, 10, 13, 0, 0, 0);
    if (def_date.getTime() <= now_date.getTime())
    {
      def_year++;
    }

    const yr = Utils.Get_Attribute_Int(this, "date-year", def_year);
    const mth = Utils.Get_Attribute_Int(this, "date-month", 11);
    const day = Utils.Get_Attribute_Int(this, "date-day", 13);
    const hr = Utils.Get_Attribute_Int(this, "date-hour", 0);
    const min = Utils.Get_Attribute_Int(this, "date-minute", 0);
    const sec = Utils.Get_Attribute_Int(this, "date-second", 0);
    const date = new Date(yr, mth-1, day, hr, min, sec);

    return date;
  }

  Check_Completed(value, elem)
  {
    if (value == 0 && !elem.is_completed)
    {
      this.On_Dial_Completed(elem);
      elem.is_completed = true;
    }
    else if (value != 0)
    {
      elem.is_completed = false;
    }
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

  // auto-start
  // auto-stop
  // label-sec
  // label-min
  // label-hr
  // label-day
  // show-labels
  // stop-href

  // style-host
  // style-label
  // style-svg
  // value

  // properties =========================================================================

  // value
  // labelText

  // methods ============================================================================

  start()
  {
    this.interval_id = setInterval(this.On_Interval, 1000);
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

  // events =============================================================================

  On_Dial_Completed(elem)
  {
    elem.addEventListener("animationend", this.On_Animation_End);
    elem.classList.add("completed");
  }

  On_Animation_End(event)
  {
    event.target.classList.remove("completed");
    event.target.removeEventListener("animationend", this.On_Animation_End);
  }

  On_Interval()
  {
    const now = Date.now();
    const target_date = this.Get_Date();
    const timespan_millis = Math.abs(target_date.getTime() - now);
    const timespan = this.Split_Timespan(timespan_millis);

    this.Update_Timer(timespan);

    this.dispatchEvent(new Event("tick"));

    const auto_stop = this.hasAttribute("auto-stop");
    const is_terminal_value = now >= target_date.getTime();
    if (auto_stop && is_terminal_value)
    {
      this.stop();
      this.dispatchEvent(new Event("completed"));

      if (this.hasAttribute("stop-href"))
      {
        const stop_href = this.getAttribute("stop-href");
        window.location.href = stop_href;
      }
    }
  }

  // rendering ==========================================================================

  Update_Timer(timespan)
  {
    this.days_elem.value = timespan.days;
    this.hours_elem.value = timespan.hrs;
    this.minutes_elem.value = timespan.mins;
    this.seconds_elem.value = timespan.secs;

    this.Check_Completed(timespan.days, this.days_counter_elem);
    this.Check_Completed(timespan.hrs, this.hours_counter_elem);
    this.Check_Completed(timespan.mins, this.minutes_counter_elem);
    this.Check_Completed(timespan.secs, this.seconds_counter_elem);
  }

  Render()
  {
    let 
      label_postfix_sec = "", 
      label_postfix_min = "", 
      label_postfix_hr = "", 
      label_postfix_day = "";
    const label_sec = this.hasAttribute("label-sec") ? this.getAttribute("label-sec") : "seconds";
    const label_min = this.hasAttribute("label-min") ? this.getAttribute("label-min") : "minutes";
    const label_hr = this.hasAttribute("label-hr") ? this.getAttribute("label-hr") : "hours";
    const label_day = this.hasAttribute("label-day") ? this.getAttribute("label-day") : "days";

    if (this.hasAttribute("show-labels"))
    {
      label_postfix_sec = "label-postfix=\"<br><span class='text-label'>" + label_sec + "</span>\"";
      label_postfix_min = "label-postfix=\"<br><span class='text-label'>" + label_min + "</span>\"";
      label_postfix_hr = "label-postfix=\"<br><span class='text-label'>" + label_hr + "</span>\"";
      label_postfix_day = "label-postfix=\"<br><span class='text-label'>" + label_day + "</span>\"";
    }

    const html = `
      <div cid="days_counter_elem" class="counter">
        <de-dial cid="days_elem" max-value="364" show-label show-shadow has-overflow
          ${label_postfix_day}
          class="ticks"></de-dial>
        <de-dial class="anim-border days" max-value="80" value="80" gap-width="2"></de-dial>
      </div>
      <div cid="hours_counter_elem" class="counter">
        <de-dial cid="hours_elem" max-value="23" show-label show-shadow
          ${label_postfix_hr}
          class="ticks"></de-dial>
        <de-dial class="anim-border hours" max-value="80" value="80" gap-width="2"></de-dial>
      </div>
      <div cid="minutes_counter_elem" class="counter">
        <de-dial cid="minutes_elem" max-value="59" show-label show-shadow
          ${label_postfix_min}
          class="ticks"></de-dial>
        <de-dial class="anim-border minutes" max-value="80" value="80" gap-width="2"></de-dial>
      </div>
      <div cid="seconds_counter_elem" class="counter">
        <de-dial cid="seconds_elem" max-value="59" show-label show-shadow
          ${label_postfix_sec}
          class="ticks"></de-dial>
        <de-dial class="anim-border seconds" max-value="80" value="80" gap-width="2"></de-dial>
      </div>
    `;
    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    const auto_start = this.hasAttribute("auto-start");
    if (auto_start)
    {
      this.start();
    }
  }
}

class DeTimerCompact extends HTMLElement
{
  static tname = "de-timer-compact";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }
  
  Get_Date()
  {
    const now_date = new Date();
    let def_year = now_date.getFullYear();
    const def_date = new Date(def_year, 10, 13, 0, 0, 0);
    if (def_date.getTime() <= now_date.getTime())
    {
      def_year++;
    }

    const yr = Utils.Get_Attribute_Int(this, "date-year", def_year);
    const mth = Utils.Get_Attribute_Int(this, "date-month", 11);
    const day = Utils.Get_Attribute_Int(this, "date-day", 13);
    const hr = Utils.Get_Attribute_Int(this, "date-hour", 0);
    const min = Utils.Get_Attribute_Int(this, "date-minute", 0);
    const sec = Utils.Get_Attribute_Int(this, "date-second", 0);
    const date = new Date(yr, mth-1, day, hr, min, sec);

    return date;
  }

  Check_Completed(value, elem)
  {
    if (value == 0 && !elem.is_completed)
    {
      this.On_Dial_Completed(elem);
      elem.is_completed = true;
    }
    else if (value != 0)
    {
      elem.is_completed = false;
    }
  }

  Split_Timespan(millis)
  {
    const res = {};
    
    res.hrs = Math.floor(millis / Utils.MILLIS_HOUR);
    millis = millis % Utils.MILLIS_HOUR;
      
    res.mins = Math.floor(millis / Utils.MILLIS_MINUTE);
    millis = millis % Utils.MILLIS_MINUTE;
      
    res.secs = Math.floor(millis / Utils.MILLIS_SECOND);
    millis = millis % Utils.MILLIS_SECOND;

    return res;
  }

  // attributes =========================================================================

  // auto-start
  // auto-stop
  // label-sec
  // label-min
  // label-hr
  // label-day
  // show-labels
  // stop-href

  // style-host
  // style-label
  // style-svg
  // value

  // properties =========================================================================

  // value
  // labelText

  // methods ============================================================================

  start()
  {
    this.interval_id = setInterval(this.On_Interval, 1000);
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

  // events =============================================================================

  On_Dial_Completed(elem)
  {
    elem.addEventListener("animationend", this.On_Animation_End);
    elem.classList.add("completed");
  }

  On_Animation_End(event)
  {
    event.target.classList.remove("completed");
    event.target.removeEventListener("animationend", this.On_Animation_End);
  }

  On_Interval()
  {
    const now = Date.now();
    const target_date = this.Get_Date();
    const timespan_millis = Math.abs(target_date.getTime() - now);
    const timespan = this.Split_Timespan(timespan_millis);

    this.Update_Timer(timespan);

    this.dispatchEvent(new Event("tick"));

    const auto_stop = this.hasAttribute("auto-stop");
    const is_terminal_value = now >= target_date.getTime();
    if (auto_stop && is_terminal_value)
    {
      this.stop();
      this.dispatchEvent(new Event("completed"));

      if (this.hasAttribute("stop-href"))
      {
        const stop_href = this.getAttribute("stop-href");
        window.location.href = stop_href;
      }
    }
  }

  // rendering ==========================================================================

  Update_Timer(timespan)
  {
    this.hours_elem.value = timespan.hrs;
    this.minutes_elem.value = timespan.mins;
    this.seconds_elem.value = timespan.secs;

    this.Check_Completed(timespan.secs, this);
  }

  Render()
  {
    let 
      label_postfix_sec = "", 
      label_postfix_min = "", 
      label_postfix_hr = "";
    const label_sec = this.hasAttribute("label-sec") ? this.getAttribute("label-sec") : "seconds";
    const label_min = this.hasAttribute("label-min") ? this.getAttribute("label-min") : "minutes";
    const label_hr = this.hasAttribute("label-hr") ? this.getAttribute("label-hr") : "hours";

    if (this.hasAttribute("show-labels"))
    {
      label_postfix_sec = "label-postfix=\"<br><span class='text-label'>" + label_sec + "</span>\"";
      label_postfix_min = "label-postfix=\"<br><span class='text-label'>" + label_min + "</span>\"";
      label_postfix_hr = "label-postfix=\"<br><span class='text-label'>" + label_hr + "</span>\"";
    }

    const html = `
      <de-dial cid="hours_elem" max-value="23" show-shadow has-overflow
        class="hrs"></de-dial>
      <de-dial cid="minutes_elem" max-value="59" show-shadow
        class="mins"></de-dial>
      <de-dial cid="seconds_elem" max-value="59" show-shadow
        class="secs"></de-dial>
      <de-dialmarks class="anim-border" value="80" gap-width="2"></de-dialmarks>
    `;
    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    const auto_start = this.hasAttribute("auto-start");
    if (auto_start)
    {
      this.start();
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

export default 
{
  DeDial,
  DeActionBtn
};
