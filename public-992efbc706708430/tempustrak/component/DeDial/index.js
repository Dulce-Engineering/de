import Utils from "../../lib/Utils.js";

class DeDial extends HTMLElement
{
  static tname = "de-dial";
  static DEF_MAX = 10;
  static DEF_TICK_WIDTH = 1;
  static DEF_GAP_WIDTH = 1;
  static DEF_WAIT_MILLIS = 1000;

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
    const max_value = Get_Attribute_Int(this, "max-value", DeDial.DEF_MAX);

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
    return Get_Attribute_Int(this, "value");
  }

  set labelText(str)
  {
    this.text_elem.innerText = str;
  }

  start()
  {
    const wait_millis = Get_Attribute_Int(this, "wait-millis", DeDial.DEF_WAIT_MILLIS);
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
      const max_value = Get_Attribute_Int(this, "max-value", DeDial.DEF_MAX);
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
    const max_value = Get_Attribute_Int(this, "max-value", DeDial.DEF_MAX);
    const tick_width = Get_Attribute_Int(this, "tick-width", DeDial.DEF_TICK_WIDTH);
    const gap_width = Get_Attribute_Int(this, "gap-width", DeDial.DEF_GAP_WIDTH);
    const path_length = max_value * (tick_width + gap_width);
    return path_length;
  }

  On_Interval()
  {
    const max_value = Get_Attribute_Int(this, "max-value", DeDial.DEF_MAX);
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

  Update()
  {
    let stroke_dasharray = null;
    const max_value = Get_Attribute_Int(this, "max-value", DeDial.DEF_MAX);
    const tick_width = Get_Attribute_Int(this, "tick-width", DeDial.DEF_TICK_WIDTH);
    const gap_width = Get_Attribute_Int(this, "gap-width", DeDial.DEF_GAP_WIDTH);
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
      this.text_elem.innerText = value;
    }
  }

  Render()
  {
    const path_length = this.Calc_Path_Length();

    const viewbox_radius = Get_Attribute_Int(this, "viewbox-radius", 100);
    const viewbox_diameter = Math.abs(viewbox_radius) * 2;
    const view_box = 
      "-" + viewbox_radius + " -" + viewbox_radius + 
      " " + viewbox_diameter + " " + viewbox_diameter;

    const html = `
      <svg viewBox="${view_box}" class="dial">
        <slot name="svg"></slot>
        <circle 
          cid="circle_elem"
          cx="0" cy="0" r="90" 
          pathLength="${path_length}"
          stroke-dasharray="0 ${path_length}" 
        />
      </svg>
      <span cid="text_elem" class="label"></span>
    `;
    const template = Utils.To_Template(html, this);
    this.innerHTML = template.innerHTML;
    Utils.Set_Id_Shortcuts(this, this, "cid");

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

function Get_Attribute_Int(elem, name, def)
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