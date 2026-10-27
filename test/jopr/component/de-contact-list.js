import './dom-mock.js';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import DeContactList from '../../../public/app/jopr/component/de-contact-list/index.js';

test('DeContactList.constructor()', Test_Constructor);
test('DeContactList.get value()', Test_Get_Value);
test('DeContactList.set value()', Test_Set_Value);
test('DeContactList.get items()', Test_Get_Items);
test('DeContactList.set items()', Test_Set_Items);
test('DeContactList.get view_type()', Test_Get_View_Type);
test('DeContactList.set view_type()', Test_Set_View_Type);
test('DeContactList.Init_View()', Test_Init_View);
test('DeContactList.Add()', Test_Add);
test('DeContactList.Remove()', Test_Remove);
test('DeContactList.On_Render_Item()', Test_On_Render_Item);
test('DeContactList.On_Click_Add()', Test_On_Click_Add);
test('DeContactList.On_Click_Sel()', Test_On_Click_Sel);
test('DeContactList.Render()', Test_Render);
test('DeContactList.Render_Select()', Test_Render_Select);
test('DeContactList.Render_Sublist()', Test_Render_Sublist);
test('DeContactList.Render_Compact()', Test_Render_Compact);
test('DeContactList.connectedCallback()', Test_ConnectedCallback);
test('DeContactList.attributeChangedCallback()', Test_AttributeChangedCallback);

function Create_Test_Element(view_type = 'list')
{
  const element = new DeContactList();
  if (view_type !== 'list')
  {
    element.setAttribute('view-type', view_type);
  }
  element.connectedCallback();
  return element;
}

function Test_Constructor()
{
  const element = new DeContactList();
  assert.strictEqual(DeContactList.tname, 'de-contact-list');
  assert.deepStrictEqual(DeContactList.observedAttributes, ['view-type']);
  assert.strictEqual(element.view_type, 'list');
}

function Test_Get_Value()
{
  // Scenario 1: Default list returns contacts_list.value
  {
    const element = Create_Test_Element('list');
    const sample_contacts = [
      { id: 1, name: 'Jonathan Rhodes' },
      { id: 2, name: 'Debbie Teakle' }
    ];
    element.value = sample_contacts;
    assert.deepStrictEqual(element.value, sample_contacts);
  }

  // Scenario 2: Select view returns only checked contact(s)
  {
    const element = Create_Test_Element('select');
    const sample_contacts = [
      { id: 10, name: 'Contact 10' },
      { id: 20, name: 'Contact 20' }
    ];
    element.value = sample_contacts;

    // Simulate radio checked for ID 20
    const checked_radio = { value: '20' };
    element.contacts_list.items_elem.checked_elements = [checked_radio];

    assert.deepStrictEqual(element.value, [{ id: 20, name: 'Contact 20' }]);
  }

  // Scenario 3: Sublist view returns contact objects
  {
    const element = Create_Test_Element('sublist');
    const sample_contacts = [
      { id: 101, title: 'Alice Walker', name: 'Alice Walker' },
      { id: 102, title: 'Bob Builder', name: 'Bob Builder' }
    ];
    element.value = sample_contacts;
    assert.deepStrictEqual(element.value, [
      { id: 101, title: 'Alice Walker', name: 'Alice Walker', value: 101 },
      { id: 102, title: 'Bob Builder', name: 'Bob Builder', value: 102 }
    ]);
  }
}

function Test_Set_Value()
{
  // Scenario 1: Default list
  {
    const element = Create_Test_Element();
    const contacts = [{ id: 100, name: 'Alice Walker' }];

    element.value = contacts;
    assert.deepStrictEqual(element.contacts_list.value, contacts);
  }

  // Scenario 2: Sublist view
  {
    const element = Create_Test_Element('sublist');
    const contacts = [{ id: 200, name: 'Bob Builder' }];
    element.value = contacts;
    assert.strictEqual(element.contacts_search_select.selected.length, 1);
  }
}

function Test_Get_Items()
{
  // Scenario 1: Initial state returns null
  const element = new DeContactList();
  assert.strictEqual(element.items, null);

  // Scenario 2: Returns items set on element
  const sample_items = [
    { title: 'Jonathan Rhodes @ Hays', value: 1 },
    { title: 'Debbie Teakle @ Michael Page', value: 2 }
  ];
  element.items = sample_items;
  assert.deepStrictEqual(element.items, sample_items);

  // Scenario 3: In sublist view, delegates to contacts_search_select.items
  const sublist_el = Create_Test_Element('sublist');
  sublist_el.items = sample_items;
  assert.deepStrictEqual(sublist_el.items, sample_items);
  assert.deepStrictEqual(sublist_el.contacts_search_select.items, sample_items);
}

function Test_Set_Items()
{
  // Scenario 1: Sets items when contacts_search_select is present in sublist view
  const element = Create_Test_Element('sublist');
  const sample_items = [
    { title: 'Alice Walker', value: 10 },
    { title: 'Bob Builder', value: 20 }
  ];
  element.items = sample_items;
  assert.deepStrictEqual(element.items, sample_items);
  assert.deepStrictEqual(element.contacts_search_select.items, sample_items);

  // Scenario 2: Preserves items set before sublist view is initialized
  const pre_el = new DeContactList();
  pre_el.items = sample_items;
  pre_el.view_type = 'sublist';
  pre_el.connectedCallback();
  assert.deepStrictEqual(pre_el.items, sample_items);
  assert.deepStrictEqual(pre_el.contacts_search_select.items, sample_items);
}

function Test_Get_View_Type()
{
  const element = Create_Test_Element('sublist');
  assert.strictEqual(element.view_type, 'sublist');

  const default_el = Create_Test_Element();
  assert.strictEqual(default_el.view_type, 'list');
}

function Test_Set_View_Type()
{
  const element = Create_Test_Element();
  element.view_type = 'select';
  assert.strictEqual(element.getAttribute('view-type'), 'select');

  element.view_type = null;
  assert.strictEqual(element.hasAttribute('view-type'), false);
  assert.strictEqual(element.view_type, 'list');
}

function Test_Init_View()
{
  const element = new DeContactList();
  element.value = [{ id: 1, name: 'Test' }];

  let rendered_type = null;
  element.Render_Sublist = () => { rendered_type = 'sublist'; };
  element.view_type = 'sublist';

  element.Init_View();
  assert.strictEqual(rendered_type, 'sublist');
}

function Test_Add()
{
  // Scenario 1: Default list
  {
    const element = Create_Test_Element();
    element.value = [{ id: 1, name: 'Initial' }];

    element.Add({ id: 2, name: 'Added Contact' });
    assert.strictEqual(element.contacts_list.value.length, 2);
    assert.strictEqual(element.contacts_list.value[1].name, 'Added Contact');
  }

  // Scenario 2: Sublist view
  {
    const element = Create_Test_Element('sublist');
    element.value = [{ id: 1, name: 'Initial' }];
    element.Add({ id: 2, name: 'Added in Sublist' });
    assert.strictEqual(element.contacts_search_select.selected.length, 2);
  }
}

function Test_Remove()
{
  // Scenario 1: Default list
  {
    const element = Create_Test_Element();
    element.value = [
      { id: 10, name: 'First' },
      { id: 20, name: 'Second' }
    ];

    element.Remove(10);
    assert.strictEqual(element.contacts_list.value.length, 1);
    assert.strictEqual(element.contacts_list.value[0].id, 20);
  }

  // Scenario 2: Sublist view
  {
    const element = Create_Test_Element('sublist');
    element.value = [
      { id: 10, name: 'First' },
      { id: 20, name: 'Second' }
    ];

    element.Remove(10);
    assert.strictEqual(element.contacts_search_select.selected.length, 1);
    assert.strictEqual(element.contacts_search_select.selected[0].id, 20);
  }
}

function Test_On_Render_Item()
{
  const element = Create_Test_Element();

  const mock_item = {
    contact_title_elem: { textContent: '', htmlFor: '' },
    sel_contact_radio: { id: '', value: '' },
    contact_email_elem: { value: '' },
    contact_phone_elem: { value: '' },
    contact_position_elem: { value: '' },
    contact_linkedin_elem: { value: '' },
    contact_menu: { event_data: null }
  };

  const contact_obj = {
    id: 5,
    name: 'Jonathan Rhodes',
    email: 'jonathan@example.com',
    phone: '0412 345 678',
    position: 'Lead Recruiter',
    linkedin: 'https://linkedin.com/in/jonathan',
    agency: { name: 'Hays' }
  };

  element.On_Render_Item({
    detail: { item_elem: mock_item, obj: contact_obj }
  });

  // Scenario 1: Formats title as name @ agency
  assert.strictEqual(mock_item.contact_title_elem.textContent, 'Jonathan Rhodes @ Hays');

  // Scenario 2: Sets fields email, phone, position, linkedin
  assert.strictEqual(mock_item.contact_email_elem.value, 'jonathan@example.com');
  assert.strictEqual(mock_item.contact_phone_elem.value, '0412 345 678');
  assert.strictEqual(mock_item.contact_position_elem.value, 'Lead Recruiter');
  assert.strictEqual(mock_item.contact_linkedin_elem.value, 'https://linkedin.com/in/jonathan');

  // Scenario 3: Binds radio ID and radio value
  assert.ok(mock_item.sel_contact_radio.id.startsWith('scr_'));
  assert.strictEqual(mock_item.contact_title_elem.htmlFor, mock_item.sel_contact_radio.id);
  assert.strictEqual(mock_item.sel_contact_radio.value, 5);

  // Scenario 4: Assigns event_data on toolbar menu
  assert.deepStrictEqual(mock_item.contact_menu.event_data, contact_obj);

  // Scenario 5: Fallback to email if name is missing
  const unnamed_contact = { id: 6, email: 'anonymous@corp.com' };
  element.On_Render_Item({
    detail: { item_elem: mock_item, obj: unnamed_contact }
  });
  assert.strictEqual(mock_item.contact_title_elem.textContent, 'anonymous@corp.com');
}

function Test_On_Click_Add()
{
  const element = Create_Test_Element();
  let add_fired = false;
  element.addEventListener('add', () => { add_fired = true; });

  element.On_Click_Add({ stopPropagation: () => {} });
  assert.strictEqual(add_fired, true);
}

function Test_On_Click_Sel()
{
  const element = Create_Test_Element();
  let sel_fired = false;
  element.addEventListener('select', () => { sel_fired = true; });

  element.On_Click_Sel({ stopPropagation: () => {} });
  assert.strictEqual(sel_fired, true);
}

function Test_Render()
{
  const element = new DeContactList();
  element.Render();

  assert.ok(element.contacts_list, 'contacts_list shortcut populated');
  assert.ok(element.add_contact_btn, 'add_contact_btn shortcut populated');
  assert.ok(element.innerHTML.includes('details slot="item"'));
}

function Test_Render_Select()
{
  const element = new DeContactList();
  element.Render_Select();

  assert.ok(element.contacts_list, 'contacts_list shortcut populated');
  assert.ok(element.innerHTML.includes('name="selected_contact_id"'));
}

function Test_Render_Sublist()
{
  const element = new DeContactList();
  element.Render_Sublist();

  // Scenario 1: Populates contacts_search_select shortcut
  assert.ok(element.contacts_search_select, 'contacts_search_select shortcut populated');

  // Scenario 2: Renders h2 Contacts heading before de-search-multi-select
  assert.ok(element.innerHTML.includes('<h2>Contacts</h2>'), 'renders h2 Contacts heading');
  assert.ok(element.innerHTML.includes('de-search-multi-select'), 'renders de-search-multi-select');
  const h2_idx = element.innerHTML.indexOf('<h2>Contacts</h2>');
  const sel_idx = element.innerHTML.indexOf('<de-search-multi-select');
  assert.ok(h2_idx !== -1 && sel_idx !== -1 && h2_idx < sel_idx, 'h2 appears before de-search-multi-select');
}

function Test_Render_Compact()
{
  const element = new DeContactList();
  element.Render_Compact();

  assert.ok(element.contacts_list, 'contacts_list shortcut populated');
  assert.ok(element.innerHTML.includes('jopr-contact-details'));
}

function Test_ConnectedCallback()
{
  // Scenario 1: Default list
  const el_default = new DeContactList();
  el_default.connectedCallback();
  assert.strictEqual(el_default.view_type, 'list');

  // Scenario 2: Compact
  const el_compact = new DeContactList();
  el_compact.setAttribute('view-type', 'compact');
  el_compact.connectedCallback();
  assert.strictEqual(el_compact.view_type, 'compact');
}

function Test_AttributeChangedCallback()
{
  const element = Create_Test_Element('list');
  let init_called = false;
  element.Init_View = () => { init_called = true; };

  element.attributeChangedCallback('view-type', 'list', 'sublist');
  assert.strictEqual(element.view_type, 'sublist');
  assert.strictEqual(init_called, true);
}
