import Utils from "../../lib/Utils.js";

class DeSelectImg extends HTMLElement
{
  static tname = "de-select-img";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  // [{value, src}]
  set items(values)
  {
    let html = "";
    for (const value of values)
    {
      html += `
        <li value="${value.value}" src="${value.src}">
          <img src="${value.src}">
        </li>
      `;
    }
    this.img_items.innerHTML = html;

    for (const img_item of this.img_items.children)
    {
      img_item.addEventListener("click", this.On_Click);
    }
  }

  set value(img_value)
  {
    const selected_item = this.img_items.querySelector(`[value="${img_value}"]`);
    if (selected_item)
    {
      this.Select_Item(selected_item);
    }
  }

  get value()
  {
    return this.selected_img.value;
  }

  Select_Item(selected_item)
  {
    this.selected_img.src = selected_item.getAttribute("src");
    this.selected_img.value = selected_item.getAttribute("value");
  }

  On_Click(e)
  {
    const selected_item = e.currentTarget;
    this.Select_Item(selected_item);
    this.popover_elem.hidePopover();
  }

  Render()
  {
    const html = `
      <img cid="selected_img" src="image/null.png" class="bk">
      <button popovertarget="${this.id}_list" type="button" class="edit">
        <img src="image/image.svg">
      </button>
      <div cid="popover_elem" id="${this.id}_list" popover class="img-panel">
        <ul cid="img_items"></ul>
      </div>
    `;
    const elements = Utils.To_Document(html, this);
    this.replaceChildren(elements);
    Utils.Set_Id_Shortcuts(this, this, "cid");

    //this.input_elem.addEventListener("input", this.On_Input);
    //this.input_elem.max = Utils.Get_Attr_Def(this, "max", "100");
    //this.value = Utils.Get_Attr_Def(this, "value", "0");
  }
}

Utils.Register_Element(DeSelectImg);
export default DeSelectImg;
