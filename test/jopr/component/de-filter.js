import './dom-mock.js';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import DeFilter from '../../../public/app/jopr/component/de-filter/index.js';

test('DeFilter.constructor()', Test_Constructor);
test('DeFilter.get value()', Test_Get_Value);
test('DeFilter.set value()', Test_Set_Value);
test('DeFilter.get db()', Test_Get_Db);
test('DeFilter.set db()', Test_Set_Db);
test('DeFilter.get store_name()', Test_Get_Store_Name);
test('DeFilter.set store_name()', Test_Set_Store_Name);
test('DeFilter.get db_name()', Test_Get_Db_Name);
test('DeFilter.set db_name()', Test_Set_Db_Name);
test('DeFilter.Get_Db_And_Store_Names()', Test_Get_Db_And_Store_Names);
test('DeFilter.Load_Filters()', Test_Load_Filters);
test('DeFilter.Save_Filters()', Test_Save_Filters);
test('DeFilter.On_Click_Select_Filters_Btn()', Test_On_Click_Select_Filters_Btn);
test('DeFilter.On_Click_Delete_Btn()', Test_On_Click_Delete_Btn);
test('DeFilter.Update_Summary()', Test_Update_Summary);
test('DeFilter.Render()', Test_Render);
test('DeFilter.connectedCallback()', Test_ConnectedCallback);
test('DeFilter.attributeChangedCallback()', Test_AttributeChangedCallback);

function Test_Constructor()
{
  const element = new DeFilter();
  assert.strictEqual(element.value, null);
  assert.strictEqual(element.db, null);
  assert.strictEqual(element.store_name, null);
  assert.strictEqual(element.db_name, null);
}

function Test_Get_Value()
{
  const element = new DeFilter();
  element.form_values = { is_active: true, match_str: 'engineer' };
  assert.deepStrictEqual(element.value, { is_active: true, match_str: 'engineer' });
}

function Test_Set_Value()
{
  const element = new DeFilter();
  element.value = { is_active: false, match_str: 'architect' };
  assert.deepStrictEqual(element.form_values, { is_active: false, match_str: 'architect' });
}

function Test_Get_Db()
{
  const element = new DeFilter();
  assert.strictEqual(element.db, null);
  const mock_db = { id: 'db1' };
  element.db_instance = mock_db;
  assert.strictEqual(element.db, mock_db);
}

function Test_Set_Db()
{
  const element = new DeFilter();
  let load_called = false;
  element.Load_Filters = async () => { load_called = true; };
  element.setAttribute('store-name', 'filters');

  const mock_db = { id: 'db_test' };
  element.db = mock_db;

  assert.strictEqual(element.db_instance, mock_db);
  assert.ok(load_called);
}

function Test_Get_Store_Name()
{
  const element = new DeFilter();
  assert.strictEqual(element.store_name, null);
  element.setAttribute('store-name', 'filters');
  assert.strictEqual(element.store_name, 'filters');
}

function Test_Set_Store_Name()
{
  const element = new DeFilter();
  element.store_name = 'my_filters';
  assert.strictEqual(element.getAttribute('store-name'), 'my_filters');

  element.store_name = null;
  assert.strictEqual(element.hasAttribute('store-name'), false);
}

function Test_Get_Db_Name()
{
  const element = new DeFilter();
  assert.strictEqual(element.db_name, null);
  element.setAttribute('db-name', 'JobTrakDB');
  assert.strictEqual(element.db_name, 'JobTrakDB');
}

function Test_Set_Db_Name()
{
  const element = new DeFilter();
  element.db_name = 'TestDB';
  assert.strictEqual(element.getAttribute('db-name'), 'TestDB');

  element.db_name = null;
  assert.strictEqual(element.hasAttribute('db-name'), false);
}

function Test_Get_Db_And_Store_Names()
{
  // Scenario 1: Standard separate attributes
  {
    const element = new DeFilter();
    element.setAttribute('store-name', 'filters');
    element.setAttribute('db-name', 'JobTrakDB');
    assert.deepStrictEqual(element.Get_Db_And_Store_Names(), {
      db_name: 'JobTrakDB',
      store_name: 'filters'
    });
  }

  // Scenario 2: Slash compound attribute
  {
    const element = new DeFilter();
    element.setAttribute('store-name', 'JobTrakDB/filters');
    assert.deepStrictEqual(element.Get_Db_And_Store_Names(), {
      db_name: 'JobTrakDB',
      store_name: 'filters'
    });
  }

  // Scenario 3: Colon compound attribute via 'store'
  {
    const element = new DeFilter();
    element.setAttribute('store', 'JobTrakDB:filters');
    assert.deepStrictEqual(element.Get_Db_And_Store_Names(), {
      db_name: 'JobTrakDB',
      store_name: 'filters'
    });
  }

  // Scenario 4: No attributes set
  {
    const element = new DeFilter();
    assert.deepStrictEqual(element.Get_Db_And_Store_Names(), {
      db_name: null,
      store_name: null
    });
  }
}

async function Test_Load_Filters()
{
  // Scenario 1: Without db or store name provided (no persistence processed)
  {
    const element = new DeFilter();
    const result = await element.Load_Filters();
    assert.strictEqual(result, null);
    assert.strictEqual(element.value, null);
  }

  // Scenario 2: With db and store name, successful retrieval from IndexedDB
  {
    const element = new DeFilter();
    element.setAttribute('store-name', 'filters');
    const mock_stored_data = {
      id: 1,
      is_active: true,
      match_str: 'TypeScript'
    };

    let requested_store = null;
    element.db_instance = {
      Select_First: async (store) => {
        requested_store = store;
        return mock_stored_data;
      }
    };

    const loaded = await element.Load_Filters();
    assert.strictEqual(requested_store, 'filters');
    assert.deepStrictEqual(loaded, { is_active: true, match_str: 'TypeScript' });
    assert.deepStrictEqual(element.value, { is_active: true, match_str: 'TypeScript' });
  }

  // Scenario 3: With db and store name, empty table
  {
    const element = new DeFilter();
    element.setAttribute('store-name', 'filters');
    element.db_instance = {
      Select_First: async () => null
    };

    const loaded = await element.Load_Filters();
    assert.strictEqual(loaded, null);
    assert.strictEqual(element.value, null);
  }
}

async function Test_Save_Filters()
{
  // Scenario 1: Without db or store name provided (no persistence processed)
  {
    const element = new DeFilter();
    const result = await element.Save_Filters();
    assert.strictEqual(result, null);
  }

  // Scenario 2: With db and store name, successful persistence to IndexedDB
  {
    const element = new DeFilter();
    element.setAttribute('store-name', 'filters');
    element.value = { is_active: true, match_str: 'React' };

    let saved_store = null;
    let saved_item = null;
    element.db_instance = {
      Save: async (store, item) => {
        saved_store = store;
        saved_item = item;
        return 1;
      }
    };

    const save_result = await element.Save_Filters();
    assert.strictEqual(save_result, 1);
    assert.strictEqual(saved_store, 'filters');
    assert.deepStrictEqual(saved_item, { id: 1, is_active: true, match_str: 'React' });
  }
}

async function Test_On_Click_Select_Filters_Btn()
{
  // Scenario 1: User saves filters in dialog
  {
    const element = new DeFilter();
    await element.Render();

    let save_called = false;
    element.Save_Filters = async () => {
      save_called = true;
      return 1;
    };

    let search_fired = false;
    element.addEventListener('search', () => {
      search_fired = true;
    });

    element.filter_form.Show_Async = async (curr) => {
      return { is_active: true, match_str: 'Node.js' };
    };

    await element.On_Click_Select_Filters_Btn();
    assert.deepStrictEqual(element.value, { is_active: true, match_str: 'Node.js' });
    assert.ok(save_called);
    assert.ok(search_fired);
  }

  // Scenario 2: User cancels dialog (returns null) - does not clear stored filters
  {
    const element = new DeFilter();
    await element.Render();
    element.value = { is_active: true };

    let save_called = false;
    element.Save_Filters = async () => {
      save_called = true;
      return 1;
    };

    let search_fired = false;
    element.addEventListener('search', () => {
      search_fired = true;
    });

    element.filter_form.Show_Async = async () => null;

    await element.On_Click_Select_Filters_Btn();
    assert.deepStrictEqual(element.value, { is_active: true });
    assert.ok(!save_called);
    assert.ok(!search_fired);
  }
}

async function Test_On_Click_Delete_Btn()
{
  const element = new DeFilter();
  await element.Render();
  element.value = { is_active: true, match_str: 'Fullstack' };

  let save_called = false;
  element.Save_Filters = async () => {
    save_called = true;
    return 1;
  };

  let search_fired = false;
  element.addEventListener('search', () => {
    search_fired = true;
  });

  const mock_event = {
    currentTarget: {
      parentElement: {
        getAttribute: (attr) => attr === 'name' ? 'match_str' : null
      }
    }
  };

  await element.On_Click_Delete_Btn(mock_event);
  assert.strictEqual(element.value.match_str, null);
  assert.strictEqual(element.value.is_active, true);
  assert.ok(save_called);
  assert.ok(search_fired);
}

async function Test_Update_Summary()
{
  const element = new DeFilter();
  await element.Render();

  element.value = { is_active: true, match_str: 'DevOps' };
  element.Update_Summary();
  assert.strictEqual(element.summ_elem.style.display, null);

  element.value = { is_active: null, match_str: null, contact_name: null };
  element.Update_Summary();
  assert.strictEqual(element.summ_elem.style.display, 'none');
}

async function Test_Render()
{
  const element = new DeFilter();
  await element.Render();

  assert.ok(element.sel_filters_btn);
  assert.ok(element.summ_elem);
  assert.ok(element.filter_form);
  assert.ok(element.sel_filters_btn.listeners['click'].length > 0);
}

async function Test_ConnectedCallback()
{
  const element = new DeFilter();
  element.setAttribute('store-name', 'filters');

  let load_called = false;
  element.Load_Filters = async () => {
    load_called = true;
  };
  element.db_instance = { Select_First: async () => null };

  await element.connectedCallback();
  assert.ok(load_called);
}

async function Test_AttributeChangedCallback()
{
  const element = new DeFilter();
  let load_called = false;
  element.Load_Filters = async () => {
    load_called = true;
  };
  element.db_instance = { Select_First: async () => null };

  element.setAttribute('store-name', 'filters');
  element.attributeChangedCallback('store-name', null, 'filters');
  assert.ok(load_called);
}
