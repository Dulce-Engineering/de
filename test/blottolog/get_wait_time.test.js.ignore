import assert from 'node:assert/strict';
import { test } from 'node:test';
import Logic from '../../public/app/blottolog/lib/logic.js';
import Utils from '../../public/lib/Utils.js';

test('Logic.Get_Wait_Time_To_Next_Drink()', Test_Get_Wait_Time_To_Next_Drink);
test('Logic.Get_Drink_Contribution()', Test_Get_Drink_Contribution);

function Test_Get_Wait_Time_To_Next_Drink()
{
  const now = Date.now();
  const user = 
  {
    sex: 'male',
    age: 30,
    weight: 90,
    height: 170
  };
  const drinks = 
  [
    {
      id: 1,
      type_id: 2,
      size_id: 2,
      drink_type: { alc_vol: 13.5 },
      drink_size: { ml: 200 },
      start_time: now,
      end_time: null
    },
    {
      id: 2,
      type_id: 2,
      size_id: 2,
      drink_type: { alc_vol: 13.5 },
      drink_size: { ml: 200 },
      start_time: now,
      end_time: null
    },
  ];

  for (let min = 0; min < 120; min ++)
  {
    const waitTime3 = 
      Logic.Get_Wait_Time_To_Next_Drink(drinks, user, now + (Utils.MILLIS_MINUTE * min));
    console.log('Wait Time after ' + min + ' minutes:', waitTime3, 'minutes');
  }
  
  //assert.strictEqual(waitTime1, 0);
  //assert.strictEqual(waitTime2, 0);
  //assert.strictEqual(waitTime3, 0);
}

function Test_Get_Drink_Contribution()
{
  const now = Date.now();
  const user = {
    sex: 'male',
    age: 30,
    weight: 90,
    height: 170
  };
  const drink = 
  {
    drink_type: { alc_vol: 13.5 },
    drink_size: { ml: 200 },
    start_time: now,
  };

  const r = Logic.Get_Widmark_Distribution_Factor(user);
  for (let min = 0; min < 120; min ++)
  {
    const contribution = Logic.Get_Drink_Contribution(drink, now + (Utils.MILLIS_MINUTE * min), user, r);
    console.log('BAC Contribution after ' + min + ' minutes:', contribution * 100, '%');
  }

  //assert.ok(contribution > 0, 'expected positive BAC contribution');
  //assert.ok(contribution < 0.03, `expected contribution < 0.03, got ${contribution}`);
}
