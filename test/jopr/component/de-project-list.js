import './dom-mock.js';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import DeProjectList from '../../../public/app/jopr/component/de-project-list/index.js';
import Utils from '../../../public/lib/Utils.js';

test('DeProjectList.Render()', Test_Render);
test('DeProjectList.On_Click_Delete()', Test_On_Click_Delete);
test('DeProjectList.On_Click_Edit()', Test_On_Click_Edit);
test('DeProjectList.On_Render_Item()', Test_On_Render_Item);
test('DeProjectList.Alert()', Test_Alert);
test('DeProjectList.Update_Project()', Test_Update_Project);
test('DeProjectList.Remove()', Test_Remove);
test('DeProjectList.Add()', Test_Add);
test('DeProjectList.get value()', Test_GetValue);
test('DeProjectList.set value()', Test_SetValue);
test('DeProjectList.connectedCallback()', Test_ConnectedCallback);
test('DeProjectList.constructor()', Test_Constructor);

function Test_Constructor()
{
  const element = new DeProjectList();
  assert.strictEqual(element.view_type, 'list');
  assert.strictEqual(element.save_fn, null);
  assert.strictEqual(element.delete_fn, null);
}

function Test_ConnectedCallback()
{
  const element = new DeProjectList();
  let renderCalled = false;
  element.Render = () => { renderCalled = true; };
  element.connectedCallback();
  assert.strictEqual(element.view_type, 'list');
  assert.ok(renderCalled);
}

function Test_GetValue()
{
  const element = new DeProjectList();
  element.Render();
  const mockProjects = [{ id: 1, title: 'Project A' }];
  element.project_list.value = mockProjects;
  assert.deepStrictEqual(element.value, mockProjects);
}

function Test_SetValue()
{
  const element = new DeProjectList();
  element.Render();
  const mockProjects = [{ id: 1, title: 'Project A' }];
  element.value = mockProjects;
  assert.deepStrictEqual(element.project_list.value, mockProjects);
}

function Test_Add()
{
  const element = new DeProjectList();
  element.Render();
  const project = { id: 1, title: 'New Project' };
  element.Add(project);
  assert.deepStrictEqual(element.project_list.value, [project]);
}

function Test_Remove()
{
  const element = new DeProjectList();
  element.Render();
  const project1 = { id: 1, title: 'Proj 1' };
  const project2 = { id: 2, title: 'Proj 2' };
  element.value = [project1, project2];
  element.Remove(1);
  assert.deepStrictEqual(element.project_list.value, [project2]);
}

async function Test_Update_Project()
{
  // Test case 1: Successful save
  {
    const element = new DeProjectList();
    element.Render();
    
    let savedProject = null;
    element.save_fn = async (proj) => {
      savedProject = proj;
      return 42; // Returns new ID
    };
    
    let alertMsg = null;
    element.addEventListener('alert', (e) => {
      alertMsg = e.detail;
    });

    const project = { title: 'Test Project' };
    await element.Update_Project(project);

    assert.strictEqual(project.id, 42);
    assert.deepStrictEqual(savedProject, project);
    assert.deepStrictEqual(element.project_list.value, [project]);
    assert.strictEqual(alertMsg, 'Project saved successfully.');
  }

  // Test case 2: Failed save
  {
    const element = new DeProjectList();
    element.Render();
    
    element.save_fn = async (proj) => {
      return null;
    };
    
    let alertMsg = null;
    element.addEventListener('alert', (e) => {
      alertMsg = e.detail;
    });

    const project = { title: 'Test Project' };
    await element.Update_Project(project);

    assert.strictEqual(project.id, undefined);
    assert.strictEqual(alertMsg, 'Failed to save project.');
  }
}

function Test_Alert()
{
  const element = new DeProjectList();
  let receivedEvent = null;
  element.addEventListener('alert', (e) => {
    receivedEvent = e;
  });
  element.Alert('Test Message');
  assert.ok(receivedEvent);
  assert.strictEqual(receivedEvent.type, 'alert');
  assert.strictEqual(receivedEvent.detail, 'Test Message');
  assert.strictEqual(receivedEvent.bubbles, true);
}

async function Test_On_Click_Edit()
{
  const element = new DeProjectList();
  element.Render();

  const originalProject = { id: 1, title: 'Original Title', description: 'Original Description' };
  const updatedFormData = { title: 'Updated Title' };

  element.project_dialog.Show_Async = async (proj) => {
    assert.deepStrictEqual(proj, originalProject);
    return updatedFormData;
  };

  let updateCalled = false;
  element.Update_Project = async (proj) => {
    updateCalled = true;
    assert.deepStrictEqual(proj, {
      id: 1,
      title: 'Updated Title',
      description: 'Original Description'
    });
  };

  const mockEvent = {
    detail: originalProject
  };

  await element.On_Click_Edit(mockEvent);
  assert.ok(updateCalled);
}

async function Test_On_Click_Delete()
{
  // Test case 1: Deletion confirmed and successful
  {
    const element = new DeProjectList();
    element.Render();
    
    const project = { id: 1, title: 'Project to Delete' };
    element.value = [project];
    
    element.warning_dlg.Confirm = async (msg) => {
      assert.strictEqual(msg, 'Are you sure you want to delete this project?');
      return true;
    };

    let deletedId = null;
    element.delete_fn = async (id) => {
      deletedId = id;
      return true;
    };

    let alertMsg = null;
    element.addEventListener('alert', (e) => {
      alertMsg = e.detail;
    });

    const mockEvent = {
      detail: project
    };

    await element.On_Click_Delete(mockEvent);

    assert.strictEqual(deletedId, 1);
    assert.deepStrictEqual(element.value, []);
    assert.strictEqual(alertMsg, 'Contact deleted successfully.');
  }

  // Test case 2: Deletion confirmed but failed on server
  {
    const element = new DeProjectList();
    element.Render();
    
    const project = { id: 1, title: 'Project to Delete' };
    element.value = [project];
    
    element.warning_dlg.Confirm = async () => true;
    element.delete_fn = async () => false;

    let alertMsg = null;
    element.addEventListener('alert', (e) => {
      alertMsg = e.detail;
    });

    const mockEvent = {
      detail: project
    };

    await element.On_Click_Delete(mockEvent);

    assert.deepStrictEqual(element.value, [project]);
    assert.strictEqual(alertMsg, 'Failed to delete contact.');
  }

  // Test case 3: Deletion cancelled
  {
    const element = new DeProjectList();
    element.Render();
    
    const project = { id: 1, title: 'Project to Delete' };
    element.value = [project];
    
    element.warning_dlg.Confirm = async () => false;

    let deleteFnCalled = false;
    element.delete_fn = async () => {
      deleteFnCalled = true;
      return true;
    };

    const mockEvent = {
      detail: project
    };

    await element.On_Click_Delete(mockEvent);

    assert.ok(!deleteFnCalled);
    assert.deepStrictEqual(element.value, [project]);
  }
}

function Test_On_Render_Item()
{
  const element = new DeProjectList();
  element.Render();

  const mockItemElem = {
    project_title_elem: {},
    project_url_elem: { value: '' },
    project_description_elem: { value: '' },
    project_tech_elem: { value: '' },
    project_item_menu: {},
    sel_project_radio: { value: null }
  };

  const project = {
    id: 10,
    title: 'Project Title X',
    url: 'http://url.com',
    description: 'Desc X',
    tech: 'React'
  };

  const mockEvent = {
    detail: {
      item_elem: mockItemElem,
      obj: project
    }
  };

  element.On_Render_Item(mockEvent);

  assert.strictEqual(mockItemElem.project_title_elem.textContent, 'Project Title X');
  assert.strictEqual(mockItemElem.project_url_elem.value, 'http://url.com');
  assert.strictEqual(mockItemElem.project_description_elem.value, 'Desc X');
  assert.strictEqual(mockItemElem.project_tech_elem.value, 'React');
  assert.deepStrictEqual(mockItemElem.project_item_menu.event_data, project);
  assert.strictEqual(mockItemElem.sel_project_radio.value, 10);
}

function Test_Render()
{
  const element = new DeProjectList();
  element.Render();
  
  assert.ok(element.innerHTML.includes('cid="project_list"'));
  assert.ok(element.innerHTML.includes('cid="project_dialog"'));
  assert.ok(element.innerHTML.includes('cid="warning_dlg"'));
  
  assert.ok(element.project_list);
  assert.ok(element.project_dialog);
  assert.ok(element.warning_dlg);

  // Check event listeners registration
  assert.ok(element.project_list.listeners['render'].length > 0);
  assert.ok(element.project_list.listeners['add'].length > 0);
  assert.ok(element.project_list.listeners['edit'].length > 0);
  assert.ok(element.project_list.listeners['delete'].length > 0);
}
