/**
 * DeTaskList is a custom element that renders a list of tasks.
 *
 * @customElement de-task-list
 * @property {Array<object>} items - Array of task objects to render.
 */
class DeTaskList extends HTMLElement
{
  static tname = "de-task-list";
  _items = null;

  set items(value)
  {
    this._items = Array.isArray(value) ? value : null;
    this.Render(value);
  }

  connectedCallback()
  {
    this.Render();
  }

  Render(items = this._items)
  {
    if (!items || items.length === 0)
    {
      this.innerHTML = "";
    }

    const html = `
      <ul>
        ${items.map((item) => `
          <li>
            <div>${item.description}</div>
            <footer>
              <span>${item.key}</span>
              <span>${item.priority}</span>
            </footer>
          </li>
        `).join("")}
      </ul>`;

    this.innerHTML = html;
  }
}

customElements.define(DeTaskList.tname, DeTaskList);
//export default DeTaskList;
