import { test, describe, it } from 'node:test';
import assert from 'node:assert';

// Test ICS generation and date formatting logic
function Format_Ics_Date(timestamp) {
  const d = new Date(timestamp);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  const hours = String(d.getUTCHours()).padStart(2, "0");
  const minutes = String(d.getUTCMinutes()).padStart(2, "0");
  const seconds = String(d.getUTCSeconds()).padStart(2, "0");
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

function Escape_Ics_Text(text) {
  if (!text) return "";
  return String(text)
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function Generate_Ics_Rrule(recurrence) {
  if (!recurrence || !recurrence.rate || recurrence.rate <= 0) return null;

  const rate = recurrence.rate;
  let freq = "";
  switch (recurrence.scale) {
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

  if (recurrence.scale === "SCALE_WEEK" && recurrence.weekdays && recurrence.weekdays.length > 0) {
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
    if (days.length > 0) {
      rrule += `;BYDAY=${days.join(",")}`;
    }
  }

  return rrule;
}

function Generate_Ics(timers) {
  const now_str = Format_Ics_Date(Date.now());
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Dulce Engineering//TempusToi//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:TempusToi"
  ];

  for (const timer of timers) {
    if (!timer || !timer.time) continue;

    const cal_id = timer.calendar_id || `${timer.id || "test-id"}@tempustoi`;
    const sequence = typeof timer.sequence === "number" ? timer.sequence : 0;
    const updated_at_str = timer.updated_at ? Format_Ics_Date(timer.updated_at) : now_str;
    const start_str = Format_Ics_Date(timer.time);
    const end_str = Format_Ics_Date(timer.time + 30 * 60 * 1000);

    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${cal_id}`);
    lines.push(`SEQUENCE:${sequence}`);
    lines.push(`DTSTAMP:${now_str}`);
    lines.push(`LAST-MODIFIED:${updated_at_str}`);
    lines.push(`DTSTART:${start_str}`);
    lines.push(`DTEND:${end_str}`);
    lines.push(`SUMMARY:${Escape_Ics_Text(timer.title || "Timer Event")}`);

    if (timer.description) {
      lines.push(`DESCRIPTION:${Escape_Ics_Text(timer.description)}`);
    }

    if (timer.recurrence && timer.recurrence.rate > 0) {
      const rrule = Generate_Ics_Rrule(timer.recurrence);
      if (rrule) {
        lines.push(`RRULE:${rrule}`);
      }
    }

    lines.push("STATUS:CONFIRMED");
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}

describe('TempusToi ICS Generation & Timer Tracking', () => {
  it('formats dates in RFC 5545 UTC format', () => {
    const ts = Date.UTC(2026, 9, 1, 12, 30, 0); // 2026-10-01 12:30:00 UTC
    assert.strictEqual(Format_Ics_Date(ts), '20261001T123000Z');
  });

  it('escapes special characters for ICS text', () => {
    const text = 'Meeting; Room 1, floor \\ 2\nNotes: Bring laptops';
    const escaped = Escape_Ics_Text(text);
    assert.strictEqual(escaped, 'Meeting\\; Room 1\\, floor \\\\ 2\\nNotes: Bring laptops');
  });

  it('generates RRULE for recurring timers', () => {
    const weeklyRecur = {
      rate: 2,
      scale: 'SCALE_WEEK',
      weekdays: ['WEEKDAYS_MONDAY', 'WEEKDAYS_WEDNESDAY']
    };
    assert.strictEqual(Generate_Ics_Rrule(weeklyRecur), 'FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,WE');
  });

  it('generates valid multi-event ICS file with unique UID, SEQUENCE, and timestamps', () => {
    const timers = [
      {
        id: 'timer-1',
        calendar_id: 'unique-uid-1@tempustoi',
        sequence: 2,
        updated_at: Date.UTC(2026, 9, 1, 10, 0, 0),
        title: 'Project Deadline',
        time: Date.UTC(2026, 9, 5, 17, 0, 0),
        description: 'Submit Q3 deliverables'
      },
      {
        id: 'timer-2',
        calendar_id: 'unique-uid-2@tempustoi',
        sequence: 0,
        updated_at: Date.UTC(2026, 9, 1, 10, 0, 0),
        title: 'Daily Standup',
        time: Date.UTC(2026, 9, 2, 9, 0, 0),
        recurrence: { rate: 1, scale: 'SCALE_DAY' }
      }
    ];

    const ics = Generate_Ics(timers);
    assert.ok(ics.startsWith('BEGIN:VCALENDAR\r\n'));
    assert.ok(ics.includes('VERSION:2.0\r\n'));
    assert.ok(ics.includes('UID:unique-uid-1@tempustoi\r\n'));
    assert.ok(ics.includes('SEQUENCE:2\r\n'));
    assert.ok(ics.includes('SUMMARY:Project Deadline\r\n'));
    assert.ok(ics.includes('DESCRIPTION:Submit Q3 deliverables\r\n'));
    assert.ok(ics.includes('UID:unique-uid-2@tempustoi\r\n'));
    assert.ok(ics.includes('SEQUENCE:0\r\n'));
    assert.ok(ics.includes('RRULE:FREQ=DAILY;INTERVAL=1\r\n'));
    assert.ok(ics.endsWith('END:VCALENDAR\r\n'));
  });
});
