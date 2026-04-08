
import Utils from "../../lib/Utils.js";

class DeDivider extends HTMLElement
{
  static tname = "de-divider";

  constructor()
  {
    super();
    //Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.render();
  }

  async render()
  {
    const img_name = this.getAttribute("div-type") || "vintage-1";
    const http_res = await fetch(`../../component/DeDivider/image/${img_name}.svg`);
    const vintage1_str = await http_res.text();
    const html = `
      ${vintage1_str}
    `;
    this.innerHTML = html;
  }
}

Utils.Register_Element(DeDivider);
export default DeDivider;
