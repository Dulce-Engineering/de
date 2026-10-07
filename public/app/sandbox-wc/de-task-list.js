/**
 * DeTaskList is a custom element that renders a list of tasks.
 *
 * @customElement de-task-list
 * @property {Array<object>} items - Array of task objects to render.
 */
class DeTaskList extends HTMLElement
{
  static tname = "de-task-list";

  /** @type {Array<object>} */
  _items = [];

  get items()
  {
    return this._items;
  }

  set items(value)
  {
    this._items = Array.isArray(value) ? value : [];
    this.Render(value);
  }

  connectedCallback()
  {
    //this.Render();
  }

  Render(items)
  {
    if (!items || items.length === 0) {
      return null;
    }

    return `
      <ul id="task_list_elem">` +
        items..
        `<li>
          <div>${item.description}</div>
          <footer>
            <span>${item.key}</span>
            <span>${item.priority}</span>
          </footer>
        </li>` +
      `</ul>`;
  }
}

customElements.define(DeTaskList.tname, DeTaskList);
export default DeTaskList;
