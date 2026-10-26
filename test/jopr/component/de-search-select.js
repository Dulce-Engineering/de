import './dom-mock.js';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import DeSearchSelect from '../../../public/app/jopr/component/de-search-select/index.js';

test('DeSearchSelect.constructor()', Test_Constructor);
test('DeSearchSelect.get value()', Test_Get_Value);
test('DeSearchSelect.set value()', Test_Set_Value);
test('DeSearchSelect.get items()', Test_Get_Items);
test('DeSearchSelect.set items()', Test_Set_Items);
test('DeSearchSelect.get selected_item()', Test_Get_Selected_Item);
test('DeSearchSelect.set selected_item()', Test_Set_Selected_Item);
test('DeSearchSelect.get name()', Test_Get_Name);
test('DeSearchSelect.set name()', Test_Set_Name);
test('DeSearchSelect.get placeholder()', Test_Get_Placeholder);
test('DeSearchSelect.set placeholder()', Test_Set_Placeholder);
test('DeSearchSelect.Find_Item()', Test_Find_Item);
test('DeSearchSelect.On_Click_Input()', Test_On_Click_Input);
test('DeSearchSelect.On_Click_Items()', Test_On_Click_Items);
test('DeSearchSelect.On_Input()', Test_On_Input);
test('DeSearchSelect.On_Click_Add_Btn()', Test_On_Click_Add_Btn);
test('DeSearchSelect.Render_Options()', Test_Render_Options);
test('DeSearchSelect.Render_Option_HTML()', Test_Render_Option_HTML);
test('DeSearchSelect.Render()', Test_Render);
test('DeSearchSelect.connectedCallback()', Test_ConnectedCallback);
test('DeSearchSelect.attributeChangedCallback()', Test_AttributeChangedCallback);

function Create_Test_Element()
{
  const element = new DeSearchSelect();
  element.connectedCallback();
  return element;
}

function Test_Constructor()
{
  const element = new DeSearchSelect();
  assert.strictEqual(element.items_array, null);
  assert.strictEqual(element.active_item, null);
  assert.strictEqual(DeSearchSelect.tname, 'de-search-select');
  assert.deepStrictEqual(DeSearchSelect.observedAttributes, ['name', 'placeholder']);
}

function Test_Get_Value()
{
  const element = Create_Test_Element();
  assert.strictEqual(element.value, undefined);

  element.selected_item = { title: 'Test Option', value: 'opt_1' };
  assert.strictEqual(element.value, 'opt_1');
}

function Test_Set_Value()
{
  const element = Create_Test_Element();
  element.items = [
    { title: 'Alpha', value: 'a1' },
    { title: 'Beta', value: 'b2' }
  ];

  // Scenario 1: Select existing item
  element.value = 'b2';
  assert.strictEqual(element.value, 'b2');
  assert.strictEqual(element.selected_item.title, 'Beta');

  // Scenario 2: Select non-existent item (creates placeholder object)
  element.value = 'c3';
  assert.strictEqual(element.value, 'c3');
  assert.strictEqual(element.selected_item.title, undefined);

  // Scenario 3: Clear selection with null or "null"
  element.value = null;
  assert.strictEqual(element.value, undefined);
  assert.strictEqual(element.selected_item, null);

  element.value = 'a1';
  element.value = 'null';
  assert.strictEqual(element.value, undefined);
  assert.strictEqual(element.selected_item, null);
}

function Test_Get_Items()
{
  const element = Create_Test_Element();
  assert.strictEqual(element.items, null);

  const sample_items = [{ title: 'Item 1', value: 1 }];
  element.items = sample_items;
  assert.deepStrictEqual(element.items, sample_items);
}

function Test_Set_Items()
{
  const element = Create_Test_Element();
  const sample_items = [
    { title: 'Agency 1', value: 'ag1' },
    { title: 'Agency 2', value: 'ag2' }
  ];

  element.items = sample_items;
  assert.deepStrictEqual(element.items_array, sample_items);
  // Default "None" plus 2 items = 3 rendered options
  assert.strictEqual(element.items_list.rendered_options.length, 3);
}

function Test_Get_Selected_Item()
{
  const element = Create_Test_Element();
  assert.strictEqual(element.selected_item, null);

  const item = { title: 'Engineer', value: 42 };
  element.selected_item = item;
  assert.deepStrictEqual(element.selected_item, item);
}

function Test_Set_Selected_Item()
{
  const element = Create_Test_Element();
  const item = { title: 'Senior Dev', value: 99 };

  element.selected_item = item;
  assert.strictEqual(element.active_item, item);
  assert.strictEqual(element.input_elem.value, 'Senior Dev');

  // Setting null clears the input text
  element.selected_item = null;
  assert.strictEqual(element.active_item, null);
  assert.strictEqual(element.input_elem.value, '');
}

function Test_Get_Name()
{
  const element = Create_Test_Element();
  assert.strictEqual(element.name, null);

  element.setAttribute('name', 'agency_id');
  assert.strictEqual(element.name, 'agency_id');
}

function Test_Set_Name()
{
  const element = Create_Test_Element();
  element.name = 'role_id';
  assert.strictEqual(element.getAttribute('name'), 'role_id');

  element.name = null;
  assert.strictEqual(element.hasAttribute('name'), false);
}

function Test_Get_Placeholder()
{
  const element = Create_Test_Element();
  // Default placeholder
  assert.strictEqual(element.placeholder, 'Type to search...');

  element.setAttribute('placeholder', 'Choose contact');
  assert.strictEqual(element.placeholder, 'Choose contact');
}

function Test_Set_Placeholder()
{
  const element = Create_Test_Element();
  element.placeholder = 'Search role...';
  assert.strictEqual(element.getAttribute('placeholder'), 'Search role...');

  element.placeholder = null;
  assert.strictEqual(element.hasAttribute('placeholder'), false);
}

function Test_Find_Item()
{
  const element = Create_Test_Element();
  element.items_array = [
    { title: 'One', value: 1 },
    { title: 'Two', value: '2' }
  ];

  // Found
  assert.deepStrictEqual(element.Find_Item(1), { title: 'One', value: 1 });
  assert.deepStrictEqual(element.Find_Item('2'), { title: 'Two', value: '2' });

  // Not found
  assert.strictEqual(element.Find_Item(999), null);
  assert.strictEqual(element.Find_Item(null), null);
}

function Test_On_Click_Input()
{
  const element = Create_Test_Element();
  element.items = [{ title: 'Item A', value: 'a' }];

  element.On_Click_Input();
  assert.strictEqual(element.items_list.popover_open, true);
  assert.strictEqual(element.items_list.rendered_options.length, 2);
}

function Test_On_Click_Items()
{
  const element = Create_Test_Element();
  element.items = [
    { title: 'Company X', value: 'cx' },
    { title: 'Company Y', value: 'cy' }
  ];

  let change_fired = false;
  element.addEventListener('change', () => { change_fired = true; });

  // Scenario 1: Select an option
  const target_opt = element.items_list.rendered_options[1]; // 'Company X'
  element.On_Click_Items({ target: target_opt });

  assert.strictEqual(element.value, 'cx');
  assert.strictEqual(element.items_list.popover_open, false);
  assert.strictEqual(change_fired, true);

  // Scenario 2: Select 'None' (item-value="null")
  change_fired = false;
  const none_opt = element.items_list.rendered_options[0]; // 'None'
  element.On_Click_Items({ target: none_opt });

  assert.strictEqual(element.value, undefined);
  assert.strictEqual(element.selected_item, null);
  assert.strictEqual(change_fired, true);
}

function Test_On_Input()
{
  const element = Create_Test_Element();
  element.items = [
    { title: 'Apple', value: 1 },
    { title: 'Banana', value: 2 },
    { title: 'Apricot', value: 3 }
  ];

  // Filter with matching substring 'ap'
  element.input_elem.value = 'ap';
  element.On_Input();

  // None + Apple + Apricot = 3 rendered
  assert.strictEqual(element.items_list.rendered_options.length, 3);

  // Filter with non-matching substring
  element.input_elem.value = 'xyz';
  element.On_Input();
  // Only None rendered
  assert.strictEqual(element.items_list.rendered_options.length, 1);
}

function Test_On_Click_Add_Btn()
{
  const element = Create_Test_Element();
  let add_event_dispatched = false;
  element.addEventListener('add', () => {
    add_event_dispatched = true;
  });

  element.On_Click_Add_Btn();
  assert.strictEqual(add_event_dispatched, true);
}

function Test_Render_Options()
{
  const element = Create_Test_Element();
  assert.strictEqual(element.items_list.rendered_options.length, 0);

  element.Render_Options([
    { title: 'Tech 1', value: 't1' },
    { title: 'Tech 2', value: 't2' }
  ]);

  // "None" + 2 options = 3
  assert.strictEqual(element.items_list.rendered_options.length, 3);
  assert.strictEqual(element.items_list.rendered_options[0].textContent, 'None');
  assert.strictEqual(element.items_list.rendered_options[1].textContent, 'Tech 1');
  assert.strictEqual(element.items_list.rendered_options[2].textContent, 'Tech 2');
}

function Test_Render_Option_HTML()
{
  const element = Create_Test_Element();

  // Without item returns None
  const none_html = element.Render_Option_HTML();
  assert.ok(none_html.includes('item-value="null"'));
  assert.ok(none_html.includes('None'));

  // With item returns item title and value
  const item_html = element.Render_Option_HTML({ title: 'Sydney', value: 'syd' });
  assert.ok(item_html.includes('item-value="syd"'));
  assert.ok(item_html.includes('Sydney'));
}

async function Test_Render()
{
  const element = new DeSearchSelect();
  element.setAttribute('placeholder', 'Custom placeholder');
  element.active_item = { title: 'Pre-selected', value: 10 };
  element.items_array = [{ title: 'Pre-selected', value: 10 }];

  await element.Render();

  assert.ok(element.input_elem, 'input_elem shortcut set');
  assert.ok(element.add_btn, 'add_btn shortcut set');
  assert.ok(element.items_list, 'items_list shortcut set');
  assert.strictEqual(element.input_elem.value, 'Pre-selected');
}

function Test_ConnectedCallback()
{
  const element = new DeSearchSelect();
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
