class Utils
{
  static Toggle_Field(value, value_elem, label_elem)
  {
    if (value)
    {
      value_elem.textContent = value;
      value_elem.style.display = null;
      label_elem.style.display = null;
    }
    else
    {
      value_elem.textContent = null;
      value_elem.style.display = "none";
      label_elem.style.display = "none";
    }
  }

  static Toggle_New_Agency_Fields(is_new_agency)
  {
    if (is_new_agency == undefined)
      is_new_agency = job_agency_select.value === "new";
    new_agency_label.hidden = !is_new_agency;
    new_agency_input.hidden = !is_new_agency;
  }

  static Toggle_New_Contact_Fields(is_new_contact)
  {
    if (is_new_contact == undefined)
      is_new_contact = job_contact_select.value === "new";
    contact_name_label.hidden = !is_new_contact;
    contact_name_input.hidden = !is_new_contact;
    contact_phone_label.hidden = !is_new_contact;
    contact_phone_input.hidden = !is_new_contact;
    contact_email_label.hidden = !is_new_contact;
    contact_email_input.hidden = !is_new_contact;
  }

  static Work_Type_Label(work_type)
  {
    const work_types =
    {
      "full-time": "Fulltime",
      "part-time": "Part-time",
      "contract": "Contract",
      "temp": "Temporary",
      "casual": "Casual",
      "internship": "Internship",
      "volunteer": "Volunteer",
      "vacation": "Vacation",
      "other": "Other"
    };
    const res = work_types[work_type?.toLowerCase()] || work_type["other"];

    return res;
  }

  static Str_To_HTML(str)
  {
    const div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML.replace(/\n/g, "<br>");
  }

  static Show_View(view_elem)
  {
    jobs_list.classList.add("hidden");
    contacts_list.classList.add("hidden");
    companies_list.classList.add("hidden");
    profile_elem.classList.add("hidden");
    view_elem.classList.remove("hidden");
  }

  static Duration_Str(start_time, end_time)
  {
    let res = "";

    if (start_time && end_time)
    {
      const diff_ms = end_time - start_time;
      const diff_years = diff_ms / (1000 * 60 * 60 * 24 * 365);
      //res = diff_years.toFixed(1) + " years";

      res = diff_years.toLocaleString('en-US',
        {
          minimumFractionDigits: 0,
          maximumFractionDigits: 1
        }) + " years";
    }

    return res;
  }

  static Set_Options(select_elem, items, value_fn, text_fn)
  {
    select_elem.innerHTML = '<option value="">None</option>';
    if (items)
    {
      for (const item of items)
      {
        const option = document.createElement("option");
        option.value = value_fn(item);
        option.textContent = text_fn(item);
        select_elem.appendChild(option);
      }
    }
  }

  static Alert(msg)
  {
    const char_millis = 35;
    const wait_millis = 5000;

    On_Render(0, 1, On_Completed_Reverse);

    function On_Completed_Reverse()
    {
      setTimeout(() => On_Render(msg.length, -1, On_Completed_Clr), wait_millis);
    }
    function On_Completed_Clr()
    {
      alert_elem.textContent = "";
    }
    function On_Render(length, step, on_complete_fn)
    {
      alert_elem.textContent = "[ " + msg.substring(0, length) + " ]";
      if ((step > 0 && length <= msg.length) || (step < 0 && length >= 0))
      {
        setTimeout(() => On_Render(length + step, step, on_complete_fn), char_millis);
      }
      else if (on_complete_fn)
      {
        on_complete_fn();
      }
    }
  }

}

export default Utils;
