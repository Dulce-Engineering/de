class MockElement {
  constructor(tag = "div") {
    this.tagName = tag.toUpperCase();
    this.attributes = {};
    this.listeners = {};
    this.style = {};
    this.children = [];
    this.classList = {
      classes: new Set(),
      add: (c) => this.classList.classes.add(c),
      remove: (c) => this.classList.classes.delete(c),
      contains: (c) => this.classList.classes.has(c)
    };
    this.innerHTML = "";
    this._cachedChildren = null;
  }

  getAttribute(name) {
    return this.attributes[name] || null;
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
  }

  hasAttribute(name) {
    return name in this.attributes;
  }

  removeAttribute(name) {
    delete this.attributes[name];
  }

  addEventListener(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  removeEventListener(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  dispatchEvent(event) {
    const list = this.listeners[event.type];
    if (list) {
      list.forEach(cb => cb(event));
    }
    return true;
  }

  replaceChildren(...children) {
    this.children = children;
  }

  querySelector(selector) {
    if (selector.startsWith("[name=")) {
      const name = selector.slice(6, -1);
      return this.children.find(c => c.getAttribute?.("name") === name) || null;
    }
    if (selector === "de-field") {
      const field = new MockElement("de-field");
      field.value = null;
      return field;
    }
    if (selector === "button") {
      return new MockElement("button");
    }
    return null;
  }

  querySelectorAll(selector) {
    if (selector === '[cid]') {
      if (!this._cachedChildren) {
        const tname = (this.constructor?.tname || this.tagName || '').toLowerCase();
        if (tname === 'de-filter') {
          const sel_btn = new MockElement('button');
          sel_btn.setAttribute('cid', 'sel_filters_btn');

          const summ = new MockElement('ul');
          summ.setAttribute('cid', 'summ_elem');

          const del_btns = [];
          const filter_names = ['is_active', 'match_str', 'contact_name'];
          const li_elems = filter_names.map(name => {
            const li = new MockElement('li');
            li.setAttribute('name', name);
            const field = new MockElement('de-field');
            const btn = new MockElement('button');
            btn.parentElement = li;
            del_btns.push(btn);
            li.querySelector = (sel) => {
              if (sel === 'de-field') return field;
              if (sel === 'button') return btn;
              return null;
            };
            return li;
          });
          summ.children = li_elems;
          summ.querySelectorAll = (sel) => {
            if (sel === 'button') return del_btns;
            return [];
          };

          const dialog = new MockElement('de-dialog-form');
          dialog.setAttribute('cid', 'filter_form');
          dialog.Show_Async = async (val) => val;
          dialog.main_elem = new MockElement('div');

          const mock_fields = {
            is_active: { Get_Value_Label: (v) => v ? "Yes" : "No" },
            match_str: { Get_Value_Label: (v) => v || "" },
            contact_name: { Get_Value_Label: (v) => v || "" }
          };
          dialog.main_elem.querySelector = (sel) => {
            if (sel.startsWith('[name=')) {
              const name = sel.slice(6, -1);
              return mock_fields[name] || null;
            }
            return null;
          };

          this._cachedChildren = [sel_btn, summ, dialog];
        } else if (tname === 'de-search-select') {
          const input_elem = new MockElement('input');
          input_elem.setAttribute('cid', 'input_elem');
          input_elem.value = '';

          const add_btn = new MockElement('button');
          add_btn.setAttribute('cid', 'add_btn');

          const items_list = new MockElement('ul');
          items_list.setAttribute('cid', 'items_list');
          items_list.popover_open = false;
          items_list.showPopover = () => { items_list.popover_open = true; };
          items_list.hidePopover = () => { items_list.popover_open = false; };
          items_list.rendered_options = [];
          items_list.insertAdjacentHTML = (pos, html) => {
            const match = html.match(/item-value="([^"]*)"[^>]*>([^<]+)/);
            if (match) {
              const opt = new MockElement('li');
              opt.classList.add('option');
              opt.setAttribute('item-value', match[1]);
              opt.textContent = match[2].trim();
              opt.closest = (sel) => sel === '.option' ? opt : null;
              opt.remove = () => {
                const idx = items_list.rendered_options.indexOf(opt);
                if (idx !== -1) items_list.rendered_options.splice(idx, 1);
              };
              items_list.children.push(opt);
              items_list.rendered_options.push(opt);
            }
          };
          items_list.querySelectorAll = (sel) => {
            if (sel === '.option') return [...items_list.rendered_options];
            return [];
          };

          this._cachedChildren = [input_elem, add_btn, items_list];
        } else {
          const list = new MockElement('de-input-list');
          list.setAttribute('cid', 'project_list');
          list.value = [];
          list.Add = (obj) => {
            if (!list.value) list.value = [];
            list.value.push(obj);
          };
          list.Remove = (id) => {
            if (list.value) {
              list.value = list.value.filter(item => item.id !== id);
            }
          };

          const dialog = new MockElement('de-dialog-form');
          dialog.setAttribute('cid', 'project_dialog');
          dialog.Show_Async = async (proj) => proj;

          const confirm = new MockElement('de-dialog-confirm');
          confirm.setAttribute('cid', 'warning_dlg');
          confirm.Confirm = async (msg) => true;

          this._cachedChildren = [list, dialog, confirm];
        }
      }
      return this._cachedChildren;
    }
    return [];
  }
}

globalThis.HTMLElement = MockElement;

globalThis.customElements = {
  get: () => undefined,
  define: () => {}
};

globalThis.CustomEvent = class CustomEvent {
  constructor(type, options) {
    this.type = type;
    this.detail = options?.detail;
    this.bubbles = options?.bubbles || false;
  }
};

globalThis.fetch = async () => ({
  ok: true,
  text: async () => "<template></template>"
});

globalThis.document = {
  querySelectorAll: () => [],
  createElement: (tag) => {
    if (tag === 'template') {
      return {
        content: {
          querySelectorAll: () => []
        }
      };
    }
    return new MockElement(tag);
  }
};
