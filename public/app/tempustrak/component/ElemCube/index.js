import Utils from "../../lib/Utils.js";

class ElemCube extends HTMLElement
{
  static tname = "elem-cube";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  Render()
  {
    this.innerHTML = `
      <div cid="top_face" class="face"></div>
      <div cid="bottom_face" class="face"></div>
      <div cid="left_face" class="face"></div>
      <div cid="right_face" class="face"></div>
      <div cid="front_face" class="face"></div>
      <div cid="back_face" class="face"></div>
    `;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    const x_str = this.getAttribute("pos-x");
    const y_str = this.getAttribute("pos-y");
    const face_elems = this.querySelectorAll(".face");
    for (const face_elem of face_elems)
    {
      face_elem.style.left = x_str + "px";
      face_elem.style.top = y_str + "px";
    }
  }
}

Utils.Register_Element(ElemCube);
export default ElemCube;