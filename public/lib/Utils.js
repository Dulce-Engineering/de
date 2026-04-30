class Utils
{
  static Abbreviate(str)
  {
    const MAX_LENGTH = 200;
    let res;

    if (!Utils.isEmpty(str))
    {
      if (str.length > MAX_LENGTH)
      {
        res = str.substring(0, MAX_LENGTH) + "...";
      }
      else
      {
        res = str;
      }
    }

    return res;
  }

  static Add_Param(url, param_name, param_Value)
  {
    if (param_Value)
    {
      let sep = "&";

      if (!url.includes("?"))
      {
        sep = "?";
      }
      url = Utils.appendStr(url, param_name + "=" + param_Value, sep);
    }

    return url;
  }

  static Add_Stylesheet(elem, attrib_name = "style-src")
  {
    if (elem.hasAttribute(attrib_name))
    {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = elem.getAttribute(attrib_name);
      elem.shadowRoot.append(link);
    }
  }

  static appendParam(params, paramName, paramValue, defValue)
  {
    if (!Utils.isEmpty(paramValue))
    {
      params = Utils.appendStr(params, paramName + "=" + paramValue, "&");
    }
    else if (!Utils.isEmpty(defValue))
    {
      params = Utils.appendStr(params, paramName + "=" + defValue, "&");
    }

    return params;
  }

  static appendStr(a, b, sep)
  {
    let res = null;

    if (sep == null || sep == undefined)
    {
      sep = "";
    }
    if (a && b && a.length > 0 && b.length > 0)
    {
      res = a + sep + b;
    } else if (a && !b && a.length > 0)
    {
      res = a;
    } else if (!a && b && b.length > 0)
    {
      res = b;
    }

    return res;
  }

  static Back_And_Refresh()
  {
    document.referrer ? window.location = document.referrer : history.back();
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

  static Clone_Template(template_elem)
  {
    const clone = template_elem.content.cloneNode(true);
    Utils.Set_Id_Shortcuts(clone, clone);
    return clone;
  }

  static Connect_Store(elem, On_Store_Connected, event = "connected")
  {
    let store_elem = null;

    const store_id = elem.getAttribute("store-id");
    if (!Utils.isEmpty(store_id))
    {
      store_elem = document.getElementById(store_id);
      if (store_elem)
      {
        store_elem.addEventListener(event, On_Store_Connected);
      }
    }

    return store_elem;
  }

  static Disable(id)
  {
    const elem = document.getElementById(id);
    if (elem)
    {
      elem.disabled = true;
    }
  }

  static Extract_Str(src, prefix, postfix, from_index)
  {
    let res = null;

    let start_index = src.indexOf(prefix, from_index);
    if (start_index != -1)
    {
      start_index += prefix.length;
      const end_index = src.indexOf(postfix, start_index);
      if (end_index != -1)
      {
        res = src.substring(start_index, end_index);
      }
      else
      {
        res = src.substring(start_index);
      }
    }

    return res;
  }

  static async fetch(url, method, xApiKey, body)
  {
    let res = null;
    const options =
    {
      method,
      headers:
      {
        'Content-Type': 'application/json',
        'x-api-key': xApiKey
      }
    };

    if (body)
    {
      options.body = body;
    }

    const httpRes = await fetch(url, options);
    if (httpRes)
    {
      res = await httpRes.text();
    }

    return res;
  }

  static fetchGetJson(url, xApiKey)
  {
    return Utils.fetchJson(url, "GET", {'x-api-key':xApiKey});
  }

  static async fetchGetXml(url)
  {
    let res = null;
    const options = Utils.setOptions("GET", null, 'application/soap+xml');

    const httpRes = await fetch(url, options);
    if (httpRes)
    {
      const textRes = await httpRes.text();
      if (httpRes.ok)
      {
        res = Utils.xmlToJson(textRes);
      }
      else
      {
        console.error("Utils.fetchGetXml(): HTTP status, data -", httpRes.status, textRes);
      }
    }

    return res;
  }

  static async fetchJson(url, method, headers, body)
  {
    let res = null;
    const options =
    {
      method,
      headers,
      body
    };

    /*if (body)
    {
      options.body = body;
    }*/

    const httpRes = await fetch(url, options);
    if (httpRes)
    {
      const textRes = await httpRes.text();
      res = JSON.parse(textRes);
    }

    return res;
  }

  static fetchPostJson(url, xApiKey, bodyObj, auth)
  {
    let body;

    if (bodyObj)
    {
      body = JSON.stringify(bodyObj);
    }

    return Utils.fetchJson(url, "POST", {'x-api-key':xApiKey,Authorization:auth}, body);
  }

  static async Fetch_Text(url, method, headers, body)
  {
    let res = null;
    const options = 
    {
      method: method || "get",
      headers,
      body
    };

    const request = fetch(url, options);
    const response = await request;
    if (response)
    {
      const response_text = await response.text();
      if (response.ok)
      {
        res = response_text;
      }
      else
      {
        console.error("Utils.Fetch_Text(): " + response.status + " " + response.statusText + " " + response.url);
        console.error("Utils.Fetch_Text(): response_text =", response_text);
      }
    }

    return res;
  }

  static Focus_Input()
  {
    var input = document.getElementsByTagName('INPUT');
    for (var i = 0, n = input.length; i < n; i = i + 1)
    {
      if (input[i].value.length !== "")
      {
        input[i].focus();
      }
    }
  }

  static Get_Attr_Def(elem, name, def)
  {
    const attr_val = elem.getAttribute(name);
    return Utils.hasValue(attr_val) ? attr_val : def;
  }

  static getFromLocalStorge(key, defaultValue)
  {
    return Utils.Get_From_Storage(localStorage, key, defaultValue);
  }

  static getFromLocalStorgeInt(key, defaultValue)
  {
    return parseInt(Utils.getFromLocalStorge(key, defaultValue));
  }

  static Get_From_Local_Storage_JSON(key, defaultValue)
  {
    return Utils.Get_From_Storage_JSON(localStorage, key, defaultValue);
  }

  static Get_From_Storage(storage, key, defaultValue)
  {
    let res = defaultValue;

    const storageStr = storage.getItem(key);
    if (!Utils.isEmpty(storageStr))
    {
      res = storageStr;
    }

    return res;
  }

  static Get_From_Storage_JSON(storage, key, defaultValue)
  {
    let res = defaultValue;

    const json_str = storage.getItem(key);
    if (!Utils.isEmpty(json_str))
    {
      res = JSON.parse(json_str);
    }

    return res;
  }

  static getMethods(obj)
  {
    let properties = new Set();
    let currentObj = obj;
    do 
    {
      Object.getOwnPropertyNames(currentObj).map(item => properties.add(item));
    }
    while ((currentObj = Object.getPrototypeOf(currentObj)));
    return [...properties.keys()].filter(item => typeof obj[item] === 'function');
  }

  static Get_Param(param_name)
  {
    const urlParams = new URLSearchParams(window.location.search);
    const res = urlParams.get(param_name);
    return res;
  }

  static async Get_Storage_Download_URL(fb_strg, id)
  {
    const ref = fb_strg.ref().child(id);
    let url = null;

    try
    {
      url = await ref.getDownloadURL();
    }
    catch (error)
    {
      console.error(error);
    }

    return url;
  }

  static Get_Store_Id(user_uid)
  {
    let store_id = null;

    if (user_uid)
    {
      const key = "store_id." + user_uid;
      store_id = localStorage.getItem(key);
    }

    return store_id;
  }

  static Get_Query_Param(param_name)
  {
    let param_val = null;

    const params = new URL(document.location).searchParams;
    if (params.has(param_name))
    {
      param_val = params.get(param_name);
    }

    return param_val;
  }

  static Set_Query_Param(param_name, param_val)
  {
    const params = new URL(document.location).searchParams;
    params.set(param_name, param_val);
    
    return params;
  }

  static Handle_Errors(api_class)
  {
    if (api_class?.last_rpc?.error)
    {
      alert(api_class.last_rpc.error.code + ": " + api_class.last_rpc.error.message);
    }
    else
    {
      alert("There was a problem.");
    }
  }

  static hasValue(data)
  {
    let res = true;

    if (data == undefined || data == null)
    {
      res = false;
    }

    return res;
  }

  static Hide(id, parent_elem)
  {
    if (!parent_elem)
    {
      parent_elem = document;
    }

    const elem = parent_elem.querySelector("#" + id);
    if (elem)
    {
      elem.style.display = "none";
    }
  }

  static Hide_Element(elem)
  {
    if (elem)
    {
      const def_display = getComputedStyle(elem).getPropertyValue("display");
      if (def_display && def_display != "none")
      {
        elem.style.setProperty("--def-display", def_display);
      }
      
      elem.style.display = "none";
    }
  }

  static async Import_API(config, on_pre_fetch_fn, on_fetch_fn, token, on_error_fn)
  {
    const api = await import(config.api_client_url);
    for (const comp_class_name in api.default)
    {
      const comp_class = api.default[comp_class_name];
      comp_class.server_host = config.api_server_host;
      comp_class.On_Fetch = on_fetch_fn;
      comp_class.On_Pre_Fetch = on_pre_fetch_fn;
      comp_class.headers = !Utils.isEmpty(token) ? {authorization: "Firebase " + token} : null;
      comp_class.On_Error = on_error_fn;
      window[comp_class_name] = comp_class;
    }

    return api.default;
  }

  static Is_Empty(items)
  {
    return Utils.isEmpty(items);
  }

  static isEmpty(items)
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
        res = Utils.isEmptyObj(items);
      }
    }
    else if (items.length == 0)
    {
      res = true;
    }

    return res;
  }

  static isEmptyObj(obj)
  {
    if (!obj) return true;

    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }

  static nullIfEmpty(items)
  {
    let res = items;

    if (Utils.isEmpty(items))
    {
      res = null;
    }

    return res;
  }

  static nullIfEmptyObj(obj)
  {
    let res = null;

    if (obj && Object.keys(obj).length > 0)
    {
      res = obj;
    }

    return res;
  }

  static Set_APIs_Auth(token, apis)
  {
    for (const comp_class_name in apis)
    {
      const comp_class = apis[comp_class_name];
      if (token)
      {
        comp_class.headers = {authorization: "Firebase " + token};
      }
      else
      {
        comp_class.headers = null;
      }
    }
  }

  static Set_Filter(filters, id, value)
  {
    let res = null;

    if (filters)
    {
      filters[id] = value;
      res = filters;
    }
    else
    {
      res = {};
      res[id] = value;
    }

    return res;
  }

  static sleep(ms)
  {
    return new Promise((resolve) =>
    {
      setTimeout(resolve, ms);
    });
  }

  static Sort(items, field_name)
  {
    var res = null;

    if (items && items.length > 0)
    {
      res = items.sort(Compare);
    }
  
    return res;

    function Compare(a, b)
    {
      var res, a_val, b_val;

      a_val = a[field_name];
      b_val = b[field_name];
  
      if (a_val && !b_val)
        res = -1;
      else if (!a_val && b_val)
        res = 1;
      else if (!a_val && !b_val)
        res = 0;
      else if (a_val < b_val)
        res = -1;
      else if (a_val > b_val)
        res = 1;
      else
        res = 0;
  
      return res;
    }
  }

  static to2DigitStr(number)
  {
    let res;

    if (number < 10)
    {
      res = "0" + number;
    }
    else
    {
      res = "" + number;
    }

    return res;
  }

  static toAlwaysArray(array)
  {
    let res = array;
    if (array == null || array == undefined)
    {
      res = [];
    }

    return res;
  }

  static toArray(str)
  {
    let res = null;

    if (str)
    {
      const strObj = JSON.parse(str);
      if (strObj && Array.isArray(strObj) && strObj.length > 0)
      {
        res = strObj;
      }
    }

    return res;
  }

  static To_AUD(num)
  {
    let res = "n/a";
    if (num)
    {
      res = 
        Number.parseFloat(num).toLocaleString("en-AU", {style: "currency", currency: "AUD"});
    }

    return res;
  }

  static toBoolean(val)
  {
    let res = false;

    if (val != null && val != undefined)
    {
      const valType = typeof val;
      if (valType == "string")
      {
        val = val.toLowerCase();
        if (val == "true" || val == "yes" || val == "t")
        {
          res = true;
        }
      }
      else if (valType == "number")
      {
        if (val != 0)
        {
          res = true;
        }
      }
      else
      {
        res = (val);
      }
    }

    return res;
  }

  static To_Currency(value, currency)
  {
    let res = null;

    if (currency)
    {
      const style = 'currency';
      const formatter = new Intl.NumberFormat('en-US', { style, currency });
      // These options are needed to round to whole numbers if that's what you want.
      //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
      //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)

      res = formatter.format(value);
    }
    else
    {
      res = Utils.To_AUD(value);
    }

    return res;
  }

  static To_Class_Obj(obj, class_obj)
  {
    if (obj)
    {
      for (const key in obj)
      {
        class_obj[key] = obj[key];
      }
    }
  }

  static toEmptyStr(value)
  {
    let res = value;

    if (value == null || value == undefined)
    {
      res = "";
    }

    return res;
  }

  static toJSONArray(obj)
  {
    let res;

    if (obj)
    {
      res = JSON.stringify(obj);
    }

    return res;
  }

  static toJSONStr(obj)
  {
    let res;

    if (obj)
    {
      res = JSON.stringify(obj);
    }

    return res;
  }

  static toNull(value)
  {
    let res = value;

    if (value == undefined)
    {
      res = null;
    }

    return res;
  }

  static To_Obj(class_obj)
  {
    const obj = {};

    for (const key in class_obj)
    {
      obj[key] = class_obj[key];
    }

    return obj;
  }

  static toValueArray(str)
  {
    let res = null;
    const strArray = Utils.toArray(str);

    if (strArray)
    {
      res = strArray.map(item => item.value);
    }

    return res;
  }

  // HTML ===========================================================

  static Get_Slot_Content(src_elems, slot_name)
  {
    return src_elems.querySelector(`[slot='${slot_name}']`);
  }

   /**
   * Registers a custom element with the browser.
   *
   * This function checks if a custom element (identified by its tag name) has already been
   * defined in the browser's custom element registry. If not, it defines the element using
   * the provided class. Optionally, it can also handle hydrating existing elements in the
   * DOM that match the tag name but have not yet been associated with the custom element
   * class.
   *
   * @async
   * @static
   * @param {CustomElementConstructor} elem_class - The class that defines the custom element.
   *   This class should have a static `tname` property that specifies the tag name for the
   *   element (e.g., "my-custom-element").
   * @param {string} [hydration_class] - An optional CSS class name. If provided, this function
   *   will search the DOM for elements matching the custom element's tag name that do *not*
   *   have this class and will add the class to them. This is used for hydrating elements
   *   that were present in the initial HTML but have not yet been connected to the custom
   *   element class.
   * @returns {Promise<void>} A promise that resolves when the element is defined and any
   *   hydration is complete.
   *
   * @example
   * // Define a simple custom element class:
   * class MyElement extends HTMLElement {
   *   static tname = "my-element";
   *   // ... other class properties and methods ...
   * }
   *
   * // Register the element (without hydration):
   * Utils.Register_Element(MyElement);
   *
   * // Register the element with hydration:
   * Utils.Register_Element(MyElement, "hydrated");
   * // Any <my-element> in the initial HTML that doesn't have the "hydrated"
   * // class will get it.
   */
  static async Register_Element(elem_class, hydration_class)
  {
    const tag_name = elem_class.tname;
    const comp_class = customElements.get(tag_name);
    if (comp_class == undefined)
    {
      if (hydration_class)
      {
        await customElements.whenDefined(tag_name);
        const elements = document.querySelectorAll(tag_name + ':not(.' + hydration_class + ')');
        elements.forEach(e => {e.classList.add(hydration_class)});
      }
      customElements.define(tag_name, elem_class);
    }
  }

  static async Render_Wait(container_elem, fn)
  {
    container_elem.classList.add("waiting");
    await fn();
    container_elem.classList.remove("waiting");
  }

  static async Render_Wait_Btn(container_elem, fn, class_name)
  {
    let container_class_name = class_name;
    if (Utils.isEmpty(class_name) || class_name == "debug")
    {
      container_class_name = "waiting_btn";
    }

    container_elem.classList.add(container_class_name);
    if (class_name != "debug")
  {
    await fn();
      container_elem.classList.remove(container_class_name);
    }
  }

  /**
   * Sets up shortcuts to elements within a source element based on their attribute values.
   *
   * This function iterates through all descendants of a source element (`src_elem`) that have a
   * specified attribute (defaulting to "id"). For each such element, it adds a property to a
   * destination object (`dest_elem`) where the property name is the value of the attribute, and
   * the property value is the element itself. This provides a convenient way to access elements
   * directly by their attribute value without having to use `querySelector` repeatedly.
   *
   * @static
   * @param {Element} src_elem - The source element to search within.
   * @param {object} dest_elem - The destination object to add the shortcuts to. This is usually
   *   a DOM element or a plain JavaScript object.
   * @param {string} [attr_name="id"] - The name of the attribute to use as the basis for the
   *   shortcuts. Defaults to "id".
   *
   * @example
   * // Assuming you have the following HTML:
   * // <div id="my-container">
   * //   <button id="my-button">Click me</button>
   * //   <input id="my-input" type="text" />
   * // </div>
   *
   * const myContainer = document.getElementById("my-container");
   * const shortcuts = {}; // Create an empty object to store shortcuts
   *
   * // Call Set_Id_Shortcuts to create shortcuts in the `shortcuts` object:
   * Utils.Set_Id_Shortcuts(myContainer, shortcuts);
   *
   * // Now you can access the button and input directly:
   * console.log(shortcuts["my-button"]); // Logs the <button> element.
   * console.log(shortcuts["my-input"]);  // Logs the <input> element.
   * 
   * // Use it directly in the destination
   * Utils.Set_Id_Shortcuts(myContainer, myContainer);
   * // Now you can access the button and input directly:
   * console.log(myContainer["my-button"]); // Logs the <button> element.
   * console.log(myContainer["my-input"]);  // Logs the <input> element.
   *
   * // Using a custom attribute, for example "cid":
   * // <div id="my-container">
   * //   <button cid="my-button">Click me</button>
   * //   <input cid="my-input" type="text" />
   * // </div>
   * const shortcuts2 = {}; 
   * Utils.Set_Id_Shortcuts(myContainer, shortcuts2, "cid");
   * console.log(shortcuts2["my-button"]); // Logs the <button> element.
   * console.log(shortcuts2["my-input"]);  // Logs the <input> element.
   */
  static Set_Id_Shortcuts(src_elem, dest_elem, attr_name = "id")
  {
    const elements = src_elem.querySelectorAll("[" + attr_name + "]");
    for (const elem of elements)
    {
      const id_value = elem.getAttribute(attr_name);
      dest_elem[id_value] = elem;
    }
  }

  static Set_Local_Storge_Json(key, value)
  {
    const value_str = JSON.stringify(value);
    localStorage.setItem(key, value_str);
  }

  static Show(id, parent_elem)
  {
    if (!parent_elem)
    {
      parent_elem = document;
    }

    const elem = parent_elem.querySelector("#" + id);
    Utils.Show_Element(elem);
  }

  static Show_Element(elem)
  {
    if (elem)
    {
      const def_display = getComputedStyle(elem).getPropertyValue("--def-display");
      if (def_display)
      {
        elem.style.display = def_display;
      }
      else
      {
        elem.style.removeProperty("display");
      }
    }
  }

  static To_Document(html, src_elems) 
  {
    return Utils.To_Template(html, src_elems).content;
  }

  static toDocument(html, src_elems) 
  {
    return Utils.To_Document(html, src_elems);
  }

  static toElement(html) 
  {
    return Utils.toDocument(html).firstChild;
  }

  static toElements(html) 
  {
    return Utils.toDocument(html).childNodes;
  }

  static To_Template(html, src_elems) 
  {
    const template = document.createElement('template');
    template.innerHTML = html.trim();

    if (src_elems)
    {
      const slot_elems = template.content.querySelectorAll("slot"); 
      if (!Utils.isEmpty(slot_elems))
      {
        for (const slot_elem of slot_elems)
        {
          const slot_name = slot_elem.name || slot_elem.getAttribute('name');
          const content_elems = src_elems.querySelectorAll(`[slot='${slot_name}']`);
          if (!Utils.isEmpty(content_elems))
          {
            slot_elem.replaceWith(...content_elems);
          }
          else
          {
            slot_elem.remove();
          }
        }
      }
    }
  
    return template;
  }

  static On_Enter_Do_Click(button)
  {
    window.addEventListener("keyup", On_Window_Keyup);
    function On_Window_Keyup(event)
    {
      if (event.which == 13) 
      {
        button.click();
      }
    }
  }

  // Geometry =======================================================
  
  static Calc_Arrival_Time(x1, y1, t1, x2, y2, v)
  {
    const d = Utils.Calc_Distance(x1, y1, x2, y2);
    const t2 = t1 + d / v;

    return t2;
  }

  static Calc_Direction(vx, vy)
  {
    let res = 0;

    const m1 = 0.41421356237;
    const m2 = 2.41421356237;
    const m3 = -2.41421356237;
    const m4 = -0.41421356237;

    const m1y = m1 * vx;
    const m2y = m2 * vx;
    const m3y = m3 * vx;
    const m4y = m4 * vx;

    if (vy < m2y && vy < m3y)
    {
      res = 0
    }
    else if (vy < m1y && vy > m2y)
    {
      res = 1
    }
    else if (vy < m4y && vy > m1y)
    {
      res = 2
    }
    else if (vy < m3y && vy > m4y)
    {
      res = 3
    }
    else if (vy > m2y && vy > m3y)
    {
      res = 4
    }
    else if (vy > m1y && vy < m2y)
    {
      res = 5
    }
    else if (vy > m4y && vy < m1y)
    {
      res = 6
    }
    else if (vy > m3y && vy < m4y)
    {
      res = 7
    }

    return res;
  }

  static Calc_Distance(x1, y1, x2, y2)
  {
    return Math.hypot(x2 - x1, y2 - y1);
  }

  static Calc_Path(x1, y1, t1, x2, y2, t2)
  {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dt = t2 - t1;

    let mx = 0, my = 0;
    if (dt != 0)
    {
      mx = dx / dt;
      my = dy / dt;
    }

    const bx = x1 - mx * t1;
    const by = y1 - my * t1;

    const dir = Utils.Calc_Direction(mx, my);
    const path =
    {
      mx, bx, my, by, dir,
      x1, y1, t1,
      x2, y2, t2
    };

    return path
  }

  static Calc_Position(path, t)
  {
    let x = path.x1;
    let y = path.y1;

    if (t > path.t2)
    {
      x = path.x2;
      y = path.y2;
    }
    else if (t > path.t1)
    {
      x = path.mx * t + path.bx;
      y = path.my * t + path.by;
    }

    return { x, y };
  }

  static Find_Parents(element, tagName) 
  {
    const matchingParents = [];
    let currentElement = element.parentNode;

    tagName = tagName.toUpperCase();

    while (currentElement) 
    {
      if (currentElement.tagName === tagName) 
      {
        matchingParents.push(currentElement);
      }
      currentElement = currentElement.parentNode;
    }

    return matchingParents.length > 0 ? matchingParents : null;
  }

  static Is_Circle_Circle_Collision(x1, y1, r1, x2, y2, r2)
  {
    const d = Utils.Calc_Distance(x1, y1, x2, y2);
    return d < (r1 + r2);
  }

  static Is_Line_Circle_Collision(x1, y1, x2, y2, cx, cy, r)
  {
    // is either end INSIDE the circle?
    // if so, return true immediately
    const inside1 = Utils.Is_Point_Circle_Collision(x1, y1, cx, cy, r);
    const inside2 = Utils.Is_Point_Circle_Collision(x2, y2, cx, cy, r);
    if (inside1 || inside2) return true;

    // get length of the line
    const len = Utils.Calc_Distance(x1, y1, x2, y2);

    // get dot product of the line and circle
    const dot = (((cx - x1) * (x2 - x1)) + ((cy - y1) * (y2 - y1))) / Math.pow(len, 2);

    // find the closest point on the line
    const closestX = x1 + (dot * (x2 - x1));
    const closestY = y1 + (dot * (y2 - y1));

    // is this point actually on the line segment?
    // if so keep going, but if not, return false
    const onSegment = Utils.Is_Line_Point_Collision(x1, y1, x2, y2, closestX, closestY);
    if (!onSegment) return false;

    // get distance to closest point
    const distance = Utils.Calc_Distance(closestX, closestY, cx, cy);
    return (distance <= r);
  }

  static Is_Line_Point_Collision(x1, y1, x2, y2, px, py) 
  {
    const d1 = Utils.Calc_Distance(px, py, x1, y1);
    const d2 = Utils.Calc_Distance(px, py, x2, y2);
    const dp = Utils.Calc_Distance(x1, y1, x2, y2);
    const buffer = 0.1;    // higher # = less accurate
    return (d1 + d2 >= dp - buffer && d1 + d2 <= dp + buffer);
  }

  static Is_Point_Circle_Collision(px, py, cx, cy, r) 
  {
    const distance = Utils.Calc_Distance(px, py, cx, cy);
    return distance <= r;
  }

  static Line_Circle_Intersection(x1, y1, x2, y2, cx, cy, r)
  {
    let res;

    x1 = x1 - cx;
    y1 = y1 - cy;
    x2 = x2 - cx;
    y2 = y2 - cy;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const dr = dx * dx + dy * dy;
    const D = x1 * y2 - x2 * y1;
    const i = r * r * dr - D * D;

    if (i >= 0)
    {
      const sy = Utils.Sign(dy);
      const si = Math.sqrt(i);
      const ay = Math.abs(dy);

      const col_x1 = (D * dy + sy * dx * si) / dr;
      const col_y1 = (-D * dx + ay * si) / dr;
      let col_x2 = col_x1;
      let col_y2 = col_y1;
      if (i > 0)
      {
        col_x2 = (D * dy - sy * dx * si) / dr;
        col_y2 = (-D * dx - ay * si) / dr;
      }

      res =
        [
          { x: col_x1 + cx, y: col_y1 + cy },
          { x: col_x2 + cx, y: col_y2 + cy }
        ];
    }

    return res;
  }

  static Path_Circle_Intersection(x1, y1, x2, y2, cx, cy, r)
  {
    let res;

    const has_collision = Utils.Is_Line_Circle_Collision(x1, y1, x2, y2, cx, cy, r);
    if (has_collision)
    {
      const buffer = 1;
      let pts = Utils.Line_Circle_Intersection(x1, y1, x2, y2, cx, cy, r + buffer);
      pts[0].d = Utils.Calc_Distance(x1, y1, pts[0].x, pts[0].y);
      pts[1].d = Utils.Calc_Distance(x1, y1, pts[1].x, pts[1].y);
      pts = pts.sort((p1, p2) => p1.d - p2.d);
      res = { x: pts[0].x, y: pts[0].y };
    }

    return res;
  }

  // Numbers ========================================================

  static async Calc_Values(objs, res_field, calc_fn)
  {
    if (objs && objs.length > 0)
    {
      for (const obj of objs)
      {
        obj[res_field] = await calc_fn(obj);
      }
    }
  }

  /**
   * Calculates the ceiling value within bounded range divided into equal spans.
   *
   * This function divides the range between min and max into a specified number of
   * equal spans, then finds the smallest value that is greater than or equal to the
   * input value and falls on a span boundary.
   *
   * @param {number} val - The input value to find the ceiling for
   * @param {number} max - The upper bound of the range
   * @param {number} min - The lower bound of the range
   * @param {number} span_count - The number of equal spans to divide the range into
   * @returns {number|null} The ceiling value on a span boundary, or null if val is outside [min, max]
   *
   * @example
   * // Range 0-100 divided into 4 spans: [0-25], [25-50], [50-75], [75-100]
   * Utils.Ceiling_Bounded(17, 100, 0, 4); // Returns 25
   * Utils.Ceiling_Bounded(42, 100, 0, 4); // Returns 50
   * Utils.Ceiling_Bounded(150, 100, 0, 4); // Returns null (outside range)
   */
  static Ceiling_Bounded(val, max, min, span_count)
  {
    let ceil = null;
    const range = max - min;
    const span = range / span_count;

    if (val >= min && val <=max)
    {
      const norm_val = val - min;
      const unit_val = norm_val / span;
      const unit_ceil = Math.ceil(unit_val);
      ceil = unit_ceil * span + min;
    }

    return ceil;
  }

  static Group_By_Ceil_Span(items, field_name, span_count)
  {
    let groups = null;

    if (!Utils.isEmpty(items))
    {
      groups = [];
      const min_item = Utils.Minimum(items, field_name);
      const max_item = Utils.Maximum(items, field_name);
      const max = max_item[field_name];
      const min = min_item[field_name];

      for (const item of items)
      {
        const val = item[field_name];
        const group_id = Utils.Ceiling_Bounded(val, max, min, span_count);
        let group = groups.find(g => g.id == group_id);
        if (group == undefined || group == null)
        {
          group = {id: group_id, items: []};
          groups.push(group);
        }

        group.items.push(item);
      }

      groups.sort((a, b) => a.id - b.id);
    }

    return groups;
  }

  static Interpolate(x, pts)
  {
    let y = null;
  
    for (let i = 0; y == null && i < pts.length - 1; i++)
    {
      const pt0 = pts[i];
      const pt1 = pts[i + 1];
      if ((x >= pt0.x && x < pt1.x) || (i == pts.length - 2 && x == pt1.x))
      {
        const nx = (x - pt0.x) / (pt1.x - pt0.x);
        y = pt0.y + (pt1.y - pt0.y) * nx;
      }
    }
  
    return y;
  }

  static Interpolate_Colour(x, colours)
  {
    const reds = colours.map(pt => {return {x: pt.x, y: pt.colour.r}});
    const greens = colours.map(pt => {return {x: pt.x, y: pt.colour.g}});
    const blues = colours.map(pt => {return {x: pt.x, y: pt.colour.b}});
    const r = Math.round(Utils.Interpolate(x, reds));
    const g = Math.round(Utils.Interpolate(x, greens));
    const b = Math.round(Utils.Interpolate(x, blues));
  
    return {r, g, b};
  }

  static length(value)
  {
    let res = 0;

    if (value)
    {
      res = value.length;
    }

    return res;
  }

  static Maximum(items, field_name)
  {
    let res = null;

    if (!Utils.isEmpty(items) && !Utils.isEmpty(field_name))
    {
      res = items.reduce(Compare);
      function Compare(max_item, item)
      {
        return item[field_name] > max_item[field_name] ? item : max_item;
      }
    }
    
    return res;
  }

  static Minimum(items, field_name)
  {
    let res = null;

    if (!Utils.isEmpty(items) && !Utils.isEmpty(field_name))
    {
      res = items.reduce(Compare);
      function Compare(max_item, item)
      {
        return item[field_name] < max_item[field_name] ? item : max_item;
      }
    }

    return res;
  }

  static Mod(n, d)
  {
    return ((n % d) + d) % d;
  }

  /**
   * Generate random number between specified numeric range
   * @param {number} from - lower limit of range
   * @param {number} to - upper limit of range
   * @returns {number}
   */
  static Random(from, to)
  {
    const r = Math.random();
    const range = to - from;
    const res = r * range + from;

    return res;
  }

  /**
   * Scales a value from one numeric range to another using linear interpolation.
   *
   * This function maps a value from a source range [from_bounds.x1, from_bounds.x2]
   * to a corresponding value in the target range [to_bound.x1, to_bound.x2].
   * The scaling maintains the relative position within the range.
   *
   * @param {number} from_value - The value to scale from the source range
   * @param {Object} from_bounds - The source range bounds with x1 (min) and x2 (max) properties
   * @param {Object} to_bound - The target range bounds with x1 (min) and x2 (max) properties
   * @returns {number} The scaled value in the target range, or 0 if from_value is falsy
   *
   * @example
   * // Scale temperature from Celsius (0-100) to Fahrenheit (32-212)
   * const celsiusBounds = {x1: 0, x2: 100};
   * const fahrenheitBounds = {x1: 32, x2: 212};
   * Utils.Scale_Value(25, celsiusBounds, fahrenheitBounds); // Returns 77
   *
   * @example
   * // Scale percentage (0-1) to pixel coordinates (0-800)
   * const percentBounds = {x1: 0, x2: 1};
   * const pixelBounds = {x1: 0, x2: 800};
   * Utils.Scale_Value(0.5, percentBounds, pixelBounds); // Returns 400
   */
  static Scale_Value(from_value, from_bounds, to_bound)
  {
    let to_value = 0;

    if (from_value)
    {
      const from_range = from_bounds.x2 - from_bounds.x1;
      const to_range = to_bound.x2 - to_bound.x1;
      to_value = from_value * to_range / from_range;
    }

    return to_value;
  }

  static Sign(x)
  {
    return x < 0 ? -1 : 1;
  }

  static toCents(price)
  {
    let newPrice = 0;

    if (price)
    {
      newPrice = price * 100;
    }

    return newPrice;
  }

  static toDollarsCents(price)
  {
    let newPrice = 0;

    if (price)
    {
      newPrice = price / 100;
    }

    return newPrice;
  }

  static toFloat(value, defaultValue)
  {
    let res = value;

    if (Utils.isEmpty(value))
    {
      res = defaultValue;
    }
    else
    {
      res = parseFloat(value);
    }

    return res;
  }

  static To_Int(str_value, def_value = 0)
  {
    let res = def_value;

    if (!Utils.isEmpty(str_value))
    {
      const s = String(str_value).trim();
      const sign = s.startsWith('-') ? '-' : '';
      const digits = s.replace(/\D/g, '');
      if (digits)
      {
        res = parseInt(sign + digits, 10);
      }
    }

    return res;
  }

  static Wrap_To_Range(value, min, max)
  {
    const d = max - min;
    const n = value - min;
    const w = Utils.Mod(n, d);
    const m = w + min;

    return m;
  }

  /**
   * Maps a step index to a value within a numeric range.
   *
   * This function divides the range between min and max into equal steps and returns
   * the value at the specified index position. Index 0 returns min, and index (steps-1)
   * returns max.
   *
   * @param {number} index - The step index (starting from 0)
   * @param {number} min - The minimum value of the range
   * @param {number} max - The maximum value of the range
   * @param {number} steps - The total number of steps to divide the range into
   * @returns {number} The value at the specified index position within the range
   *
   * @example
   * // Range 0-100 with 5 steps: [0, 25, 50, 75, 100]
   * Utils.Map_Index(0, 0, 100, 5); // Returns 0
   * Utils.Map_Index(2, 0, 100, 5); // Returns 50
   * Utils.Map_Index(4, 0, 100, 5); // Returns 100
   *
   * @example
   * // Range 10-20 with 3 steps: [10, 15, 20]
   * Utils.Map_Index(1, 10, 20, 3); // Returns 15
   */
  static Map_Index(index, min, max, steps)
  {
    const range = max - min;
    const step_size = range / (steps - 1);
    return min + (index * step_size);
  }

  // Date/Time ======================================================

  static MILLIS_SECOND = 1000;
  static MILLIS_MINUTE = Utils.MILLIS_SECOND * 60;
  static MILLIS_HOUR = Utils.MILLIS_MINUTE * 60;
  static MILLIS_DAY = Utils.MILLIS_HOUR * 24;
  static MILLIS_WEEK = Utils.MILLIS_DAY * 7;
  static MILLIS_MONTH = Utils.MILLIS_WEEK * 4;
  static MILLIS_YEAR = Utils.MILLIS_MONTH * 12;

  static addDays(date, days)
  {
    const res = new Date(date);
    res.setDate(res.getDate() + days);

    return res;
  }

  static addMonths(date, months)
  {
    const res = new Date(date);
    res.setMonth(res.getMonth() + months);

    return res;
  }

  static getDayOfWeekName(date)
  {
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const day = date.getDay();
    const dayOfWeek = dayNames[day];

    return dayOfWeek;
  }

  static getCurrentDate()
  {
    const now = new Date();
    const res = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return res;
  }

  /**
   * Calculates the total milliseconds from days, hours, and minutes.
   *
   * @param {number} days - The number of days.
   * @param {number} hours - The number of hours.
   * @param {number} minutes - The number of minutes.
   * @returns {number} The total milliseconds.
   */
  static Get_Millis_From_Time_Parts(days, hours, minutes) 
  {
    let totalMillis = 0;

    if (days) {
      totalMillis += days * Utils.MILLIS_DAY;
    }

    if (hours) {
      totalMillis += hours * Utils.MILLIS_HOUR;
    }

    if (minutes) {
      totalMillis += minutes * Utils.MILLIS_MINUTE;
    }

    return totalMillis;
  }

  static Millis_To_ISO_String(millis)
  {
    const date = new Date(millis);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
  
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  static Split_Time(millis, include_days = false)
  {
    let days = null;
    if (include_days)
    {
      days = Math.trunc(millis/Utils.MILLIS_DAY);
      millis = millis % Utils.MILLIS_DAY;
    }

    const hrs = Math.trunc(millis/Utils.MILLIS_HOUR);
    millis = millis % Utils.MILLIS_HOUR;

    const mins = Math.trunc(millis/Utils.MILLIS_MINUTE);
    millis = millis % Utils.MILLIS_MINUTE;

    const secs = Math.trunc(millis/Utils.MILLIS_SECOND);
    millis = millis % Utils.MILLIS_SECOND;

    const time = 
    {
      days,
      hrs,
      mins,
      secs,
      millis
    };

    return time;
  }

  static toDateOnly(dateStr)
  {
    const values = dateStr.split("-");
    const year = parseInt(values[0]);
    const month = parseInt(values[1]) - 1;
    const day = parseInt(values[2]);
    const date = new Date(year, month, day);

    return date;
  }

  static toDateStr(date)
  {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const dateStr = year + "-" + Utils.to2DigitStr(month) + "-" + Utils.to2DigitStr(day);

    return dateStr;
  }

  static toDaysDiff(fromDateStr, toDateStr)
  {
    let days;

    if (fromDateStr && toDateStr)
    {
      const fromDate = Utils.toDateOnly(fromDateStr);
      const toDate = Utils.toDateOnly(toDateStr);
      const diffMillis = toDate - fromDate;
      days = diffMillis / 1000 / 60 / 60 / 24;
    }

    return days;
  }
  
  static toHours(minutes)
  {
    let res = '';
    if (minutes > 0)
    {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      if (h == 1) res += h + ' hour';
      if (h > 1) res += h + ' hours';
      if (m == 1) res += ` ${m} minute`;
      if (m > 1) res += ` ${m} minutes`;
    }

    return res.trim();
  }

  static To_Local_Date_Str(unix_time)
  {
    return !Utils.isEmpty(unix_time) ? (new Date(unix_time)).toDateString() : null;
  }

  static To_Local_Date_Time_Str(unix_time)
  {
    return !Utils.isEmpty(unix_time) ? (new Date(unix_time)).toLocaleString() : null;
  }

  static To_Time_Str(millis)
  {
    const time = Utils.Split_Time(millis);

    const time_str = 
      Utils.to2DigitStr(time.hrs) + ":" + 
      Utils.to2DigitStr(time.mins) + ":" + 
      Utils.to2DigitStr(time.secs);

    return time_str;
  }
}

export default Utils;
