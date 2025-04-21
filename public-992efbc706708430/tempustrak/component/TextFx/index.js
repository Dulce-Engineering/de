import Utils from "../../lib/Utils.js";

class TextFx extends HTMLElement
{
  static tname = "text-fx";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  set text(text_str)
  {
    this.innerText = text_str;
    this.Render_Mask();
  }

  On_Animtion_End()
  {
    this.mask_elem.classList.remove("reveal");
    //this.removeEventListener("animationend", this.On_Animtion_End);
  }

  Render_Mask()
  {
    this.mask_elem = document.createElement("div");
    this.mask_elem.classList.add("mask");
    this.mask_elem.classList.add("reveal");
    this.prepend(this.mask_elem);
  }

  Render()
  {
    this.addEventListener("animationend", this.On_Animtion_End);
    this.Render_Mask();
  }
}

Utils.Register_Element(TextFx);
export default TextFx;