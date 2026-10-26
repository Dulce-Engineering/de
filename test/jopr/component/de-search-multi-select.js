import './dom-mock.js';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import DeSearchMultiSelect from '../../../public/app/jopr/component/de-search-multi-select/index.js';

test('DeSearchMultiSelect.constructor()', Test_Constructor);
test('DeSearchMultiSelect.get value()', Test_Get_Value);
test('DeSearchMultiSelect.set value()', Test_Set_Value);
test('DeSearchMultiSelect.get items()', Test_Get_Items);
test('DeSearchMultiSelect.set items()', Test_Set_Items);
test('DeSearchMultiSelect.get selected()', Test_Get_Selected);
test('DeSearchMultiSelect.set selected()', Test_Set_Selected);
test('DeSearchMultiSelect.get name()', Test_Get_Name);
test('DeSearchMultiSelect.set name()', Test_Set_Name);
test('DeSearchMultiSelect.get placeholder()', Test_Get_Placeholder);
test('DeSearchMultiSelect.set placeholder()', Test_Set_Placeholder);
test('DeSearchMultiSelect.Find_Item()', Test_Find_Item);
test('DeSearchMultiSelect.Add_Item()', Test_Add_Item);
test('DeSearchMultiSelect.Remove_Item()', Test_Remove_Item);
test('DeSearchMultiSelect.On_Click_Input()', Test_On_Click_Input);
test('DeSearchMultiSelect.On_Click_Items()', Test_On_Click_Items);
test('DeSearchMultiSelect.On_Input()', Test_On_Input);
test('DeSearchMultiSelect.On_Click_Add_Btn()', Test_On_Click_Add_Btn);
test('DeSearchMultiSelect.On_Click_Edit_Item()', Test_On_Click_Edit_Item);
test('DeSearchMultiSelect.On_Click_Delete_Item()', Test_On_Click_Delete_Item);
test('DeSearchMultiSelect.Render_Options()', Test_Render_Options);
test('DeSearchMultiSelect.Render_Option_HTML()', Test_Render_Option_HTML);
test('DeSearchMultiSelect.Render_Selected_Item_Element()', Test_Render_Selected_Item_Element);
test('DeSearchMultiSelect.Render_Selected_Items()', Test_Render_Selected_Items);
test('DeSearchMultiSelect.Render()', Test_Render);
test('DeSearchMultiSelect.connectedCallback()', Test_ConnectedCallback);
test('DeSearchMultiSelect.attributeChangedCallback()', Test_AttributeChangedCallback);

function Create_Test_Element()
{
  const element = new DeSearchMultiSelect();
  element.connectedCallback();
  return element;
}

function Test_Constructor()
{
  const element = new DeSearchMultiSelect();
  assert.strictEqual(element.items_array, null);
  assert.deepStrictEqual(element.selected_items, []);
  assert.strictEqual(DeSearchMultiSelect.tname, 'de-search-multi-select');
  assert.deepStrictEqual(DeSearchMultiSelect.observedAttributes, ['name', 'placeholder']);
}

function Test_Get_Value()
{
  const element = Create_Test_Element();
  assert.deepStrictEqual(element.value, []);

  element.selected = [
    { title: 'Item 1', value: '10' },
    { title: 'Item 2', value: '20' }
  ];
  assert.deepStrictEqual(element.value, ['10', '20']);
}

function Test_Set_Value()
{
  const element = Create_Test_Element();
  element.items = [
    { title: 'Apple', value: 'a' },
    { title: 'Banana', value: 'b' }
  ];

  // Scenario 1: Set array of existing values
  element.value = ['a', 'b'];
  assert.deepStrictEqual(element.value, ['a', 'b']);
  assert.strictEqual(element.selected.length, 2);
  assert.strictEqual(element.selected[0].title, 'Apple');

  // Scenario 2: Set array containing unknown value
  element.value = ['a', 'unknown_id'];
  assert.deepStrictEqual(element.value, ['a', 'unknown_id']);
  assert.strictEqual(element.selected[1].title, undefined);

  // Scenario 3: Set null or empty clears value
  element.value = null;
  assert.deepStrictEqual(element.value, []);
  assert.deepStrictEqual(element.selected, []);
}

function Test_Get_Items()
{
  const element = Create_Test_Element();
  assert.strictEqual(element.items, null);

  const sample = [{ title: 'Opt 1', value: 1 }];
  element.items = sample;
  assert.deepStrictEqual(element.items, sample);
}

function Test_Set_Items()
{
  const element = Create_Test_Element();
  const sample = [
    { title: 'Option Alpha', value: 'alpha' },
    { title: 'Option Beta', value: 'beta' }
  ];

  element.items = sample;
  assert.deepStrictEqual(element.items_array, sample);
  assert.strictEqual(element.items_list.rendered_options.length, 3);
}

function Test_Get_Selected()
{
  const element = Create_Test_Element();
  assert.deepStrictEqual(element.selected, []);

  element.selected = [{ title: 'Selected Contact', value: 'sc1' }];
  assert.strictEqual(element.selected.length, 1);
  assert.strictEqual(element.selected[0].title, 'Selected Contact');
}

function Test_Set_Selected()
{
  const element = Create_Test_Element();
  element.items = [
    { title: 'Jonathan Rhodes', value: 'jr' },
    { title: 'Debbie Teakle', value: 'dt' }
  ];

  // Scenario 1: Set array of full items
  element.selected = [
    { title: 'Jonathan Rhodes', value: 'jr' },
    { title: 'Debbie Teakle', value: 'dt' }
  ];
  assert.strictEqual(element.selected.length, 2);
  assert.strictEqual(element.selected_items_elem.children.length, 2);

  // Scenario 2: Set array of primitive IDs (automatically resolves title from items)
  element.selected = ['jr'];
  assert.strictEqual(element.selected.length, 1);
  assert.strictEqual(element.selected[0].title, 'Jonathan Rhodes');

  // Scenario 3: Set null clears selections
  element.selected = null;
  assert.deepStrictEqual(element.selected, []);
  assert.strictEqual(element.selected_items_elem.children.length, 0);
}

function Test_Get_Name()
{
  const element = Create_Test_Element();
  assert.strictEqual(element.name, null);

  element.setAttribute('name', 'contact_ids');
  assert.strictEqual(element.name, 'contact_ids');
}

function Test_Set_Name()
{
  const element = Create_Test_Element();
  element.name = 'user_tags';
  assert.strictEqual(element.getAttribute('name'), 'user_tags');

  element.name = null;
  assert.strictEqual(element.hasAttribute('name'), false);
}

function Test_Get_Placeholder()
{
  const element = Create_Test_Element();
  assert.strictEqual(element.placeholder, 'Type to search...');

  element.setAttribute('placeholder', 'Search users...');
  assert.strictEqual(element.placeholder, 'Search users...');
}

function Test_Set_Placeholder()
{
  const element = Create_Test_Element();
  element.placeholder = 'Search items...';
  assert.strictEqual(element.getAttribute('placeholder'), 'Search items...');

  element.placeholder = null;
  assert.strictEqual(element.hasAttribute('placeholder'), false);
}

function Test_Find_Item()
{
  const element = Create_Test_Element();
  element.items_array = [
    { title: 'First', value: '1' },
    { title: 'Second', value: '2' }
  ];

  assert.deepStrictEqual(element.Find_Item('1'), { title: 'First', value: '1' });
  assert.deepStrictEqual(element.Find_Item('2'), { title: 'Second', value: '2' });
  assert.strictEqual(element.Find_Item('99'), null);
  assert.strictEqual(element.Find_Item(null), null);
}

function Test_Add_Item()
{
  const element = Create_Test_Element();
  element.items = [
    { title: 'Item A', value: 'a' },
    { title: 'Item B', value: 'b' }
  ];

  // Scenario 1: Add new item
  element.Add_Item('a');
  assert.deepStrictEqual(element.value, ['a']);
  assert.strictEqual(element.selected.length, 1);
  assert.strictEqual(element.selected[0].title, 'Item A');

  // Scenario 2: Adding duplicate value is ignored
  element.Add_Item('a');
  assert.strictEqual(element.selected.length, 1);

  // Scenario 3: Add second item
  element.Add_Item('b');
  assert.deepStrictEqual(element.value, ['a', 'b']);
  assert.strictEqual(element.selected.length, 2);
}

function Test_Remove_Item()
{
  const element = Create_Test_Element();
  element.selected = [
    { title: 'First', value: '1' },
    { title: 'Second', value: '2' }
  ];

  // Scenario 1: Remove existing item
  element.Remove_Item('1');
  assert.deepStrictEqual(element.value, ['2']);
  assert.strictEqual(element.selected.length, 1);

  // Scenario 2: Remove non-existent item does not change list
  element.Remove_Item('999');
  assert.deepStrictEqual(element.value, ['2']);
}

function Test_On_Click_Input()
{
  const element = Create_Test_Element();
  element.items = [{ title: 'Item 1', value: '1' }];

  element.On_Click_Input();
  assert.strictEqual(element.items_list.popover_open, true);
}

function Test_On_Click_Items()
{
  const element = Create_Test_Element();
  element.items = [
    { title: 'Jonathan Rhodes', value: 'c1' },
    { title: 'Debbie Teakle', value: 'c2' }
  ];

  let change_fired = false;
  element.addEventListener('change', () => { change_fired = true; });

  // Scenario 1: Select item adds to value array
  const opt = element.items_list.rendered_options[1]; // 'c1'
  element.On_Click_Items({ target: opt });

  assert.deepStrictEqual(element.value, ['c1']);
  assert.strictEqual(element.input_elem.value, '');
  assert.strictEqual(element.items_list.popover_open, false);
  assert.strictEqual(change_fired, true);

  // Scenario 2: Select 'None' clears value array
  change_fired = false;
  const none_opt = element.items_list.rendered_options[0]; // 'null'
  element.On_Click_Items({ target: none_opt });

  assert.deepStrictEqual(element.value, []);
  assert.strictEqual(change_fired, true);
}

function Test_On_Input()
{
  const element = Create_Test_Element();
  element.items = [
    { title: 'Jonathan Rhodes', value: '1' },
    { title: 'Debbie Teakle', value: '2' },
    { title: 'Jun Ling', value: '3' }
  ];

  element.input_elem.value = 'j';
  element.On_Input();

  // "None" + "Jonathan Rhodes" + "Jun Ling" = 3
  assert.strictEqual(element.items_list.rendered_options.length, 3);
}

function Test_On_Click_Add_Btn()
{
  const element = Create_Test_Element();
  let add_fired = false;
  element.addEventListener('add', () => { add_fired = true; });

  element.On_Click_Add_Btn();
  assert.strictEqual(add_fired, true);
}

function Test_On_Click_Edit_Item()
{
  const element = Create_Test_Element();
  let edited_value = null;

  element.addEventListener('edit', (event) => {
    edited_value = event.value || event.detail;
  });

  element.On_Click_Edit_Item({ title: 'Jun Ling', value: 'c3' });
  assert.strictEqual(edited_value, 'c3');
}

function Test_On_Click_Delete_Item()
{
  const element = Create_Test_Element();
  element.selected = [
    { title: 'Jonathan Rhodes', value: 'c1' },
    { title: 'Debbie Teakle', value: 'c2' }
  ];

  let deleted_value = null;
  let change_fired = false;

  element.addEventListener('delete', (event) => {
    deleted_value = event.value || event.detail;
  });
  element.addEventListener('change', () => {
    change_fired = true;
  });

  element.On_Click_Delete_Item({ title: 'Jonathan Rhodes', value: 'c1' });

  assert.strictEqual(deleted_value, 'c1');
  assert.deepStrictEqual(element.value, ['c2']);
  assert.strictEqual(change_fired, true);
}

function Test_Render_Options()
{
  const element = Create_Test_Element();
  element.Render_Options([
    { title: 'Role 1', value: 'r1' },
    { title: 'Role 2', value: 'r2' }
  ]);

  assert.strictEqual(element.items_list.rendered_options.length, 3);
  assert.strictEqual(element.items_list.rendered_options[0].textContent, 'None');
  assert.strictEqual(element.items_list.rendered_options[1].textContent, 'Role 1');
  assert.strictEqual(element.items_list.rendered_options[2].textContent, 'Role 2');
}

function Test_Render_Option_HTML()
{
  const element = Create_Test_Element();

  const none_html = element.Render_Option_HTML();
  assert.ok(none_html.includes('item-value="null"'));
  assert.ok(none_html.includes('None'));

  const opt_html = element.Render_Option_HTML({ title: 'Admin', value: 'adm' });
  assert.ok(opt_html.includes('item-value="adm"'));
  assert.ok(opt_html.includes('Admin'));
}

function Test_Render_Selected_Item_Element()
{
  const element = Create_Test_Element();
  const item = { title: 'Debbie Teakle', value: 'c2' };

  const item_elem = element.Render_Selected_Item_Element(item);

  assert.strictEqual(item_elem.tagName, 'DIV');
  assert.strictEqual(item_elem.getAttribute('data-value'), 'c2');

  const h2 = item_elem.querySelector('h2');
  assert.ok(h2, 'Contains an h2 element');
  assert.strictEqual(h2.textContent, 'Debbie Teakle');

  const menu = item_elem.querySelector('de-toolbar-menu');
  assert.ok(menu, 'Contains a de-toolbar-menu element');
  assert.ok(menu.hasAttribute('show-edit'), 'Has show-edit attribute');
  assert.ok(menu.hasAttribute('show-delete'), 'Has show-delete attribute');

  // Trigger edit via menu event
  let edit_fired = false;
  element.addEventListener('edit', (e) => {
    if ((e.value || e.detail) === 'c2') edit_fired = true;
  });
  menu.dispatchEvent(new CustomEvent('edit', { detail: 'c2', bubbles: true }));
  assert.strictEqual(edit_fired, true);

  // Trigger delete via menu event
  element.selected = [item];
  let delete_fired = false;
  element.addEventListener('delete', (e) => {
    if ((e.value || e.detail) === 'c2') delete_fired = true;
  });
  menu.dispatchEvent(new CustomEvent('delete', { detail: 'c2', bubbles: true }));
  assert.strictEqual(delete_fired, true);
  assert.deepStrictEqual(element.value, []);
}

function Test_Render_Selected_Items()
{
  const element = Create_Test_Element();
  element.selected_items = [
    { title: 'User 1', value: 'u1' },
    { title: 'User 2', value: 'u2' }
  ];

  element.Render_Selected_Items();
  assert.strictEqual(element.selected_items_elem.children.length, 2);
}

async function Test_Render()
{
  const element = new DeSearchMultiSelect();
  element.setAttribute('placeholder', 'Multi search...');
  element.selected_items = [{ title: 'Item 1', value: '1' }];

  await element.Render();

  assert.ok(element.input_elem, 'input_elem shortcut set');
  assert.ok(element.add_btn, 'add_btn shortcut set');
  assert.ok(element.items_list, 'items_list shortcut set');
  assert.ok(element.selected_items_elem, 'selected_items_elem shortcut set');
  assert.strictEqual(element.selected_items_elem.children.length, 1);
}

function Test_ConnectedCallback()
{
  const element = new DeSearchMultiSelect();
  let rendered = false;
  element.Render = () => { rendered = true; };

  element.connectedCallback();
  assert.strictEqual(rendered, true);
}

function Test_AttributeChangedCallback()
{
  const element = Create_Test_Element();
  element.attributeChangedCallback('placeholder', 'Old', 'New Placeholder');
  assert.strictEqual(element.input_elem.placeholder, 'New Placeholder');
}
