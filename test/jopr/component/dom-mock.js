class MockElement {
  constructor(tag = "div") {
    this.tagName = tag.toUpperCase();
    this.attributes = {};
    this.listeners = {};
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

  querySelectorAll(selector) {
    if (selector === '[cid]') {
      if (!this._cachedChildren) {
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
