
import Utils from "../../lib/Utils.js";

class DeTextEffect extends HTMLElement
{
  static tname = "de-text-effect";

  static effect1_html = `
    <svg cid="svg_elem" xviewBox="290 350 400 250">
      <defs>
        <path id="logo-curve" d="M 0 1000 Q 0 500 1000 400" />
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:var(--hdr-grd-start);stop-opacity:1" />
          <stop offset="100%" style="stop-color:var(--hdr-grd-end);stop-opacity:1" />
        </linearGradient>
      </defs>
      <use href="#logo-curve" class="trace" />
      <rect x="300" y="350" width="400" height="250" class="viewbox" />
      <text cid="text_elem">
        <textPath cid="path_elem" href="#logo-curve" startOffset="61%" text-anchor="middle">
        </textPath>
      </text>
    </svg>
  `;

  constructor()
  {
    super();
    //Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  Render_effect1()
  {
    const text = this.innerText;

    this.innerHTML = DeTextEffect.effect1_html;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    for (let i = 0; i < text.length; i++)
    {
      const font_size = Utils.Map_Index(i, 180, 60, text.length);
      const character = text.charAt(i);
      const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      tspan.innerHTML = character;
      tspan.setAttribute("font-size", font_size + "px");

      this.path_elem.appendChild(tspan);
    }
    const bbox = this.text_elem.getBBox();
    const view_attr_value = `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`;
    this.svg_elem.setAttribute("viewBox", view_attr_value);
  }

  Render()
  {
    const effect_type = this.getAttribute("effect-type") || "effect1";
    const effect_fn_name = "Render_" + effect_type;
    const effect_fn = this[effect_fn_name].bind(this);
    effect_fn();
  }
}

Utils.Register_Element(DeTextEffect);
export default DeTextEffect;
