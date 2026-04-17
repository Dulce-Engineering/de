import assert from 'node:assert/strict';
import { test } from 'node:test';
import Logic from '../public/app/blottolog/lib/logic.js';

test('Get_Wait_Time_To_Next_Drink returns 0 minutes when BAC is under the threshold', () => {
  const logic = new Logic();
  const user = {
    sex: 'male',
    age: 30,
    weight: 90,
    height: 180
  };

  const drinks = [
    {
      id: 1,
      type_id: 1,
      size_id: 1,
      drink_type: { alc_vol: 5 },
      drink_size: { ml: 330 },
      start_time: Date.now() - 45 * 60 * 1000,
      end_time: null
    }
  ];

  const waitTime = logic.Get_Wait_Time_To_Next_Drink(drinks, user);
  assert.strictEqual(waitTime, 0);
});

test('Get_Wait_Time_To_Next_Drink returns a positive wait time when BAC is above the threshold', () => {
  const logic = new Logic();
  const user = {
    sex: 'male',
    age: 28,
    weight: 70,
    height: 175
  };

  const drinks = [
    {
      id: 2,
      type_id: 1,
      size_id: 1,
      drink_type: { alc_vol: 12 },
      drink_size: { ml: 500 },
      start_time: Date.now() - 30 * 60 * 1000,
      end_time: null
    }
  ];

  const waitTime = logic.Get_Wait_Time_To_Next_Drink(drinks, user);
  assert.ok(waitTime > 0, `expected positive wait time, got ${waitTime}`);
  assert.ok(waitTime < 300, `expected wait time under 300 minutes, got ${waitTime}`);
});
