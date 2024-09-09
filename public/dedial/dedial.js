/* © 2024 Dulce Engineering */

class Utils
{
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

    if (new_value == null || new_value == undefined || new_value > max_value)
    {
      new_value = 0;
    }
    else if (new_value < 0)
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
      (count_reverse && this.value == 0) || (!count_reverse && this.value == max_value)
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
    const value = this.value;

    if (value == 0)
    {
      stroke_dasharray = "0 " + path_length;
    }
    else if (value == 1)
    {
      stroke_dasharray = "" + tick_width + " " + path_length;
    }
    else if (value > 1 && value <=max_value)
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
      this.labelText = value;
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
        <slot name="svg"></slot>
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

Utils.Register_Element(DeDial);
Utils.Register_Element(DeActionBtn);

export default 
{
  DeDial,
  DeActionBtn
};
