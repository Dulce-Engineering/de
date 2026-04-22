import Utils from "../../../lib/Utils.js";

class BL_Drink extends HTMLElement
{
  static tname = "bl-drink";

  connectedCallback()
  {
    this.Render();
  }

  get value()
  {
    const drink_summary =
    {
      type_id: this.dataset.drinkType ? parseInt(this.dataset.drinkType) : null,
      size_id: this.dataset.drinkSize ? parseInt(this.dataset.drinkSize) : null,
      size_ml: this.dataset.drinkSizeMl ? parseFloat(this.dataset.drinkSizeMl) : null,
      alc_vol: this.dataset.drinkAlc ? parseFloat(this.dataset.drinkAlc) : null,
    };
    return drink_summary;
  }

  set value(drink_summary)
  {
    if (drink_summary.type_id) this.dataset.drinkType = drink_summary.type_id;
    if (drink_summary.size_id) this.dataset.drinkSize = drink_summary.size_id;
    if (drink_summary.size_ml) this.dataset.drinkSizeMl = drink_summary.size_ml;
    if (drink_summary.alc_vol) this.dataset.drinkAlc = drink_summary.alc_vol;
  }

  static observedAttributes = ['icon'];
  attributeChangedCallback(name, oldValue, newValue)
  {
    if (name === 'icon')
    {
      this.Update_Icon();
    }
  }

  On_Click()
  {
    if (this.hasAttribute("get-alc"))
    {
      this.dataset.drinkAlc = prompt("Enter Alcohol %:");
    }
    if (this.hasAttribute("get-ml"))
    {
      this.dataset.drinkSizeMl = prompt("Enter Drink Size (ml):");
    }
  }

  Update_Icon()
  {
    if (this.drink_icon)
    {
      const icon = this.getAttribute("icon") || "🍹";
      this.drink_icon.innerHTML = icon;
    }
  }

  Render()
  {
    const label = this.getAttribute("label") || "";
    this.innerHTML = `
      <span cid="drink_icon" class="icon"></span> 
      <span cid="drink_label" class="label">${label}</span> 
    `;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.addEventListener("click", this.On_Click);

    this.Update_Icon();
  }
}
Utils.Register_Element(BL_Drink);
