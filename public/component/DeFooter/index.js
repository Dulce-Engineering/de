import Utils from "../Utils.js";

class DeFooter extends HTMLElement
{
  static tname = "de-footer";

  /*constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }*/

  connectedCallback()
  {
    this.Render();
  }

  Render()
  {
    this.classList.add("footer");
    this.innerHTML = `
      <img src="images-de/logo.svg" alt="Image">
      <ul hidden class="social-media">
        <li><a href="#">FB</a></li>
        <li><a href="#">TW</a></li>
        <li><a href="#">YT</a></li>
        <li><a href="#">BE</a></li>
      </ul>
      <h4>Creativity Starts Here</h4>
      <h2>Have an idea or project? Let's talk</h2>
      <a href="mailto:it@dulceeng.com.au" class="btn-contact"><span data-hover="LET'S DO THIS">GET IN TOUCH</span></a>
      <div class="footer-bar"> 
        © 2022 Dulce Engineering - All rights reserved.
      </div>
    `;
    //Utils.Set_Id_Shortcuts(this, this, "cid");

    const height = this.clientHeight+100;
    this.previousElementSibling.style = "padding-bottom:"+height+"px";
  }
}

Utils.Register_Element(DeFooter);
export default DeFooter;
