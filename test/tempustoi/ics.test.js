import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import ICS from '../../public/app/tempustoi/lib/ICS.js';

describe('TempusToi ICS Class (lib/ICS.js)', () => {
  it('formats dates in RFC 5545 UTC format', () => {
    const ts = Date.UTC(2026, 9, 1, 12, 30, 0); // 2026-10-01 12:30:00 UTC
    assert.strictEqual(ICS.Format_Date(ts), '20261001T123000Z');
  });

  it('escapes special characters for ICS text', () => {
    const text = 'Meeting; Room 1, floor \\ 2\nNotes: Bring laptops';
    const escaped = ICS.Escape_Text(text);
    assert.strictEqual(escaped, 'Meeting\\; Room 1\\, floor \\\\ 2\\nNotes: Bring laptops');
  });

  it('generates RRULE for recurring timers', () => {
    const weeklyRecur = {
      rate: 2,
      scale: 'SCALE_WEEK',
      weekdays: ['WEEKDAYS_MONDAY', 'WEEKDAYS_WEDNESDAY']
    };
    assert.strictEqual(ICS.Generate_Rrule(weeklyRecur), 'FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,WE');
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

    const ics = ICS.Generate(timers);
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

  it('parses an ICS file back into event structures with UID, sequence and dates', () => {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      'UID:cal-123@tempustoi',
      'SEQUENCE:3',
      'SUMMARY:Review Code',
      'DESCRIPTION:Pair programming session',
      'DTSTART:20261005T140000Z',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const parsed = ICS.Parse(icsData);
    assert.strictEqual(parsed.length, 1);
    assert.strictEqual(parsed[0].calendar_id, 'cal-123@tempustoi');
    assert.strictEqual(parsed[0].sequence, 3);
    assert.strictEqual(parsed[0].title, 'Review Code');
    assert.strictEqual(parsed[0].description, 'Pair programming session');
    assert.strictEqual(parsed[0].time, new Date('2026-10-05T14:00:00Z').getTime());
  });
});
