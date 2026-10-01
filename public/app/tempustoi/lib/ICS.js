import ICAL from "./ical.min.js";

/**
 * @typedef {import('./index.js').Timer} Timer
 * @typedef {import('./index.js').Repeat} Repeat
 */

/**
 * ICS utility class for parsing and generating RFC 5545 iCalendar data.
 */
class ICS
{
  /**
   * Parses an iCalendar (.ics) string and extracts timer event objects.
   * 
   * @param {string} text - Raw iCalendar string data.
   * @returns {Array<Object>} List of parsed event objects.
   */
  static Parse(text)
  {
    const events = [];

    try
    {
      // Parse raw text into an ICAL Component tree
      const jcalData = ICAL.parse(text);
      const comp = new ICAL.Component(jcalData);
      
      // Retrieve all VEVENT subcomponents
      const vevents = comp.getAllSubcomponents("vevent");

      for (const veventComp of vevents)
      {
        const event = new ICAL.Event(veventComp);

        // 1. Extract Summary / Title
        const title = event.summary || "Imported Event";

        // 2. Extract Description
        const description = event.description || null;

        // 3. Extract UID and Sequence for change tracking
        const calendar_id = event.uid || veventComp.getFirstPropertyValue("uid") || null;
        const seq_prop = veventComp.getFirstPropertyValue("sequence");
        const sequence = seq_prop !== null && seq_prop !== undefined ? parseInt(seq_prop, 10) : 0;

        let updated_at = Date.now();
        const last_mod = veventComp.getFirstPropertyValue("last-modified");
        if (last_mod && typeof last_mod.toJSDate === "function")
        {
          const modDate = last_mod.toJSDate();
          if (modDate && !isNaN(modDate.getTime()))
          {
            updated_at = modDate.getTime();
          }
        }

        // 4. Extract Start Time & convert to JavaScript epoch milliseconds
        let time = null;
        if (event.startDate)
        {
          const jsDate = event.startDate.toJSDate();
          if (jsDate && !isNaN(jsDate.getTime()))
          {
            time = jsDate.getTime();
          }
        }

        if (time)
        {
          events.push({
            calendar_id,
            sequence,
            updated_at,
            title,
            time,
            description
          });
        }
      }
    }
    catch (e)
    {
      console.error("Failed to parse ICS file with ICAL.js, attempting fallback parser:", e);
      return ICS.Parse_Fallback(text);
    }

    return events;
  }

  /**
   * Fallback line-by-line parser for simple VEVENT components in case ICAL.js fails.
   * 
   * @param {string} text - Raw iCalendar string data.
   * @returns {Array<Object>} List of parsed event objects.
   */
  static Parse_Fallback(text)
  {
    const rawLines = text.split(/\r?\n/);
    const lines = [];
    for (let i = 0; i < rawLines.length; i++)
    {
      let line = rawLines[i];
      while (i + 1 < rawLines.length && (rawLines[i + 1].startsWith(" ") || rawLines[i + 1].startsWith("\t")))
      {
        line += rawLines[i + 1].slice(1);
        i++;
      }
      lines.push(line);
    }

    const events = [];
    let currentEvent = null;

    for (const line of lines)
    {
      if (!line.trim()) continue;
      
      const colonIdx = line.indexOf(":");
      if (colonIdx === -1) continue;
      
      const key = line.slice(0, colonIdx).trim().toUpperCase();
      const value = line.slice(colonIdx + 1);

      if (key === "BEGIN" && value.trim().toUpperCase() === "VEVENT")
      {
        currentEvent = {};
      }
      else if (key === "END" && value.trim().toUpperCase() === "VEVENT")
      {
        if (currentEvent)
        {
          events.push(currentEvent);
          currentEvent = null;
        }
      }
      else if (currentEvent)
      {
        if (key.startsWith("SUMMARY"))
        {
          let summary = value
            .replace(/\\,/g, ",")
            .replace(/\\;/g, ";")
            .replace(/\\\\/g, "\\")
            .replace(/\\[nN]/g, "\n");
          currentEvent.title = summary.trim();
        }
        else if (key.startsWith("UID"))
        {
          currentEvent.calendar_id = value.trim();
        }
        else if (key.startsWith("SEQUENCE"))
        {
          currentEvent.sequence = parseInt(value.trim(), 10) || 0;
        }
        else if (key.startsWith("DTSTART"))
        {
          currentEvent.time = ICS.Parse_Date(value.trim());
        }
        else if (key.startsWith("DESCRIPTION"))
        {
          let desc = value
            .replace(/\\,/g, ",")
            .replace(/\\;/g, ";")
            .replace(/\\\\/g, "\\")
            .replace(/\\[nN]/g, "\n");
          currentEvent.description = desc.trim();
        }
      }
    }

    return events;
  }

  /**
   * Parses an iCalendar date/datetime string into epoch milliseconds.
   * 
   * @param {string} value - Date string in YYYYMMDD or YYYYMMDDTHHMMSS[Z] format.
   * @returns {number|null} Timestamp in milliseconds or null if invalid.
   */
  static Parse_Date(value)
  {
    const clean = value.replace(/[^0-9TZ]/g, "");
    if (clean.length === 8)
    {
      const year = clean.slice(0, 4);
      const month = clean.slice(4, 6);
      const day = clean.slice(6, 8);
      const timeVal = new Date(`${year}-${month}-${day}T00:00:00`).getTime();
      return isNaN(timeVal) ? null : timeVal;
    }
    else if (clean.length >= 15)
    {
      const year = clean.slice(0, 4);
      const month = clean.slice(4, 6);
      const day = clean.slice(6, 8);
      const hour = clean.slice(9, 11);
      const min = clean.slice(11, 13);
      const sec = clean.slice(13, 15);
      const isUtc = clean.endsWith("Z");
      
      const dateStr = `${year}-${month}-${day}T${hour}:${min}:${sec}${isUtc ? "Z" : ""}`;
      const timeVal = new Date(dateStr).getTime();
      return isNaN(timeVal) ? null : timeVal;
    }
    return null;
  }

  /**
   * Formats an epoch timestamp into RFC 5545 UTC format (YYYYMMDDTHHMMSSZ).
   * 
   * @param {number} timestamp - Timestamp in milliseconds.
   * @returns {string} Formatted UTC date-time string.
   */
  static Format_Date(timestamp)
  {
    const d = new Date(timestamp);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    const hours = String(d.getUTCHours()).padStart(2, "0");
    const minutes = String(d.getUTCMinutes()).padStart(2, "0");
    const seconds = String(d.getUTCSeconds()).padStart(2, "0");
    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
  }

  /**
   * Escapes special characters for iCalendar text property values per RFC 5545.
   * 
   * @param {string} text - Raw text string.
   * @returns {string} Escaped text string.
   */
  static Escape_Text(text)
  {
    if (!text) return "";
    return String(text)
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\r?\n/g, "\\n");
  }

  /**
   * Generates an RFC 5545 RRULE string from a recurrence configuration object.
   * 
   * @param {Repeat} recurrence - Timer recurrence configuration.
   * @returns {string|null} RRULE string or null if non-recurring.
   */
  static Generate_Rrule(recurrence)
  {
    if (!recurrence || !recurrence.rate || recurrence.rate <= 0) return null;

    const rate = recurrence.rate;
    let freq = "";
    switch (recurrence.scale)
    {
      case "SCALE_DAY":
        freq = "DAILY";
        break;
      case "SCALE_WEEK":
        freq = "WEEKLY";
        break;
      case "SCALE_MONTH":
        freq = "MONTHLY";
        break;
      case "SCALE_YEAR":
        freq = "YEARLY";
        break;
      default:
        return null;
    }

    let rrule = `FREQ=${freq};INTERVAL=${rate}`;

    if (recurrence.scale === "SCALE_WEEK" && recurrence.weekdays && recurrence.weekdays.length > 0)
    {
      const dayMap = {
        "WEEKDAYS_MONDAY": "MO",
        "WEEKDAYS_TUESDAY": "TU",
        "WEEKDAYS_WEDNESDAY": "WE",
        "WEEKDAYS_THURSDAY": "TH",
        "WEEKDAYS_FRIDAY": "FR",
        "WEEKDAYS_SATURDAY": "SA",
        "WEEKDAYS_SUNDAY": "SU"
      };
      const days = recurrence.weekdays.map(d => dayMap[d] || d).filter(Boolean);
      if (days.length > 0)
      {
        rrule += `;BYDAY=${days.join(",")}`;
      }
    }

    return rrule;
  }

  /**
   * Generates a complete RFC 5545 compliant iCalendar string representing the given timers.
   * 
   * @param {Array<Timer>} timers - List of timers to export.
   * @returns {string} iCalendar formatted string with CRLF line endings.
   */
  static Generate(timers)
  {
    const now_str = ICS.Format_Date(Date.now());
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Dulce Engineering//TempusToi//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-CALNAME:TempusToi"
    ];

    for (const timer of timers)
    {
      if (!timer || !timer.time) continue;

      const cal_id = timer.calendar_id || `${timer.id || crypto.randomUUID()}@tempustoi`;
      const sequence = typeof timer.sequence === "number" ? timer.sequence : 0;
      const updated_at_str = timer.updated_at ? ICS.Format_Date(timer.updated_at) : now_str;
      const start_str = ICS.Format_Date(timer.time);
      const end_str = ICS.Format_Date(timer.time + 30 * 60 * 1000);

      lines.push("BEGIN:VEVENT");
      lines.push(`UID:${cal_id}`);
      lines.push(`SEQUENCE:${sequence}`);
      lines.push(`DTSTAMP:${now_str}`);
      lines.push(`LAST-MODIFIED:${updated_at_str}`);
      lines.push(`DTSTART:${start_str}`);
      lines.push(`DTEND:${end_str}`);
      lines.push(`SUMMARY:${ICS.Escape_Text(timer.title || "Timer Event")}`);

      if (timer.description)
      {
        lines.push(`DESCRIPTION:${ICS.Escape_Text(timer.description)}`);
      }

      if (timer.recurrence && timer.recurrence.rate > 0)
      {
        const rrule = ICS.Generate_Rrule(timer.recurrence);
        if (rrule)
        {
          lines.push(`RRULE:${rrule}`);
        }
      }

      lines.push("STATUS:CONFIRMED");
      lines.push("END:VEVENT");
    }

    lines.push("END:VCALENDAR");
    return lines.join("\r\n") + "\r\n";
  }

  /**
   * Generates and triggers a browser download of an .ics calendar file containing the timers.
   * 
   * @param {Array<Timer>} timers - List of timers to export.
   * @param {string} [filename="tempustoi.ics"] - Destination filename for download.
   */
  static Download(timers, filename = "tempustoi.ics")
  {
    const ics_str = ICS.Generate(timers);
    const blob = new Blob([ics_str], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  }
}

export default ICS;
