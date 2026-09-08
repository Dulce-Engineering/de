import Utils from "../../../../lib/Utils.js";

class DeSearchSelect extends HTMLElement
{
  static tname = "de-search-select";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  // properties ===============================================================

  set value(v)
  {
  }

  get value()
  {
  }
  
  // attributes ===============================================================

  /*static observedAttributes = 
  [
    "attribute-name"
  ];
  attributeChangedCallback(name, old_value, new_value)
  {
  }*/

  // methods ==================================================================

  // events ===================================================================

  On_Click_Btn()
  {
  }

  // rendering ================================================================

  async Render()
  {
    const html = `
      <div class="combobox-wrapper">

        <input
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded="false"
          aria-haspopup="listbox"
          aria-controls="combobox-listbox"
          aria-labelledby="combobox-label"
          placeholder="Type to search..."
          autocomplete="off"
        />

        <button type="button">
          &plus;
        </button>

        <button
          type="button"
          aria-label="Clear selection"
        >
          &times;
        </button>
      </div>

      <ul
        role="listbox"
        aria-labelledby="combobox-label"
        popover
      >
        <li id="option-1" role="option" aria-selected="false" class="combobox-option">
          Option Item 1
        </li>
        <li id="option-2" role="option" aria-selected="false" class="combobox-option">
          Option Item 2
        </li>
      </ul>
    `;
    this.innerHTML = html;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    //this.some_elem.addEventListener("click", this.On_Click_Btn);
  }
}

Utils.Register_Element(DeSearchSelect);
export default DeSearchSelect;