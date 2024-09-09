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
    this.innerHTML = `
      <div class="footer-spacing"></div>
      <footer class="footer"> 
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
          <span class="pull-left">© 2022 Dulce Engineering - All rights reserved.</span> 
          <span hidden class="pull-right">Site created by <a href="#">Themezinho</a></span> 
        </div>
      </footer>
    `;
    //Utils.Set_Id_Shortcuts(this, this, "cid");
  }
}

Utils.Register_Element(DeFooter);
export default DeFooter;
