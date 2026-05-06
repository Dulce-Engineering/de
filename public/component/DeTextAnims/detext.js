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
  
  static Get_Date(src_elem)
  {
    let date = src_elem.target_date;

    if (!date)
    {
      if (Utils.Has_Attribute(src_elem, "date") || Utils.Has_Attribute(src_elem, "time"))
      {
        date = new Date();
        
        if (Utils.Has_Attribute(src_elem, "date"))
        {
          const date_str = src_elem.getAttribute("date");
          const date_parts = date_str.split("-");
          if (date_parts?.length > 2)
          {
            const year = Utils.Parse_Int(date_parts[0]);
            const month = Utils.Parse_Int(date_parts[1]);
            const day = Utils.Parse_Int(date_parts[2]);
            date.setFullYear(year);
            date.setMonth(month-1);
            date.setDate(day);
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
          }
        }

        if (Utils.Has_Attribute(src_elem, "time"))
        {
          const time_str = src_elem.getAttribute("time");
          const time_parts = time_str.split(":");
          if (time_parts?.length > 2)
          {
            const hr = Utils.Parse_Int(time_parts[0]);
            const min = Utils.Parse_Int(time_parts[1]);
            const sec = Utils.Parse_Int(time_parts[2]);
            date.setHours(hr);
            date.setMinutes(min);
            date.setSeconds(sec);
          }
        }
      }
      else
      {
        date = new Date();

        if (Utils.Has_Attribute(src_elem, "date-year"))
        {
          const yr = Utils.Get_Attribute_Int(src_elem, "date-year");
          date.setFullYear(yr);
        }
        if (Utils.Has_Attribute(src_elem, "date-month"))
        {
          const mth = Utils.Get_Attribute_Int(src_elem, "date-month");
          date.setMonth(mth-1);
        }
        if (Utils.Has_Attribute(src_elem, "date-day"))
        {
          const day = Utils.Get_Attribute_Int(src_elem, "date-day");
          date.setDate(day);
        }
        if (Utils.Has_Attribute(src_elem, "date-hour"))
        {
          const hr = Utils.Get_Attribute_Int(src_elem, "date-hour");
          date.setHours(hr);
        }
        if (Utils.Has_Attribute(src_elem, "date-minute"))
        {
          const min = Utils.Get_Attribute_Int(src_elem, "date-minute");
          date.setMinutes(min);
        }
        if (Utils.Has_Attribute(src_elem, "date-second"))
        {
          const sec = Utils.Get_Attribute_Int(src_elem, "date-second");
          date.setSeconds(sec);
        }
      }

      src_elem.target_date = date;
    }

    return date;
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
      if (attr_name.startsWith("style-"))
      {
        const style_tokens = attr_name.split("-");
        const elem_name = style_tokens[1];

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
    if (src_elem.hasAttribute(attr_name) && style_elem)
    {
      const css = src_elem.getAttribute(attr_name);
      style_elem.style = css;
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

class DeCursor extends HTMLElement
{
  static tname = "de-cursor";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  On_Animation_End()
  {
    this.mask_elem.classList.remove("reveal");
    this.removeEventListener("animationend", this.On_Animation_End);
  }

  Render()
  {
    this.addEventListener("animationend", this.On_Animation_End);

    this.mask_elem = document.createElement("div");
    this.mask_elem.classList.add("mask");
    this.mask_elem.classList.add("reveal");
    this.prepend(this.mask_elem);
  }
}

class DeSnake extends HTMLElement
{
  static tname = "de-snake";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  Render()
  {
    const text = this.innerText.trim() || "No text provided!";
    const start_offset = Utils.Get_Attribute(this, "start-offset", "100%");
    const end_offset = Utils.Get_Attribute(this, "end-offset", "0%");
    const anim_duration = Utils.Get_Attribute(this, "anim-duration", "10s");
    const path_def = "M10,90 Q90,90 90,45 Q90,10 50,10 Q10,10 10,40 Q10,70 45,70 Q70,70 75,50";
    const path = Utils.Get_Attribute(this, "anim-path", path_def);
    const path_id = "path_" + crypto.randomUUID();

    const html = `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <!-- to hide the path, it is usually wrapped in a <defs> element -->
        <!-- <defs> -->
        <path
          id="${path_id}"
          fill="none"
          stroke="red"
          d="${path}" 
        />
        <!-- </defs> -->

        <text>
          <textPath href="#${path_id}">
            ${text}
            <animate
              attributeName="startOffset"
              values="${start_offset};${end_offset}"
              dur="${anim_duration}"
              fill="freeze"
              xrepeatCount="indefinite" 
            />
          </textPath>
        </text>
      </svg>
    `;
    this.innerHTML = html;
  }
}

Utils.Register_Element(DeCursor);
Utils.Register_Element(DeSnake);

//export default DeCursor;