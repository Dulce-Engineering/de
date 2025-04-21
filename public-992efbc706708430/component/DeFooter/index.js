import Utils from "../../lib/Utils.js";

class DeFooter extends HTMLElement
{
  static tname = "de-footer";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  On_Click_Open()
  {
    this.name_elem.value = "";
    this.email_elem.value = "";
    this.msg_elem.value = "";
    this.status_elem.style = "visibility:hidden;";
    this.dlg_elem.showModal();
  }

  On_Click_Close()
  {
    this.dlg_elem.close();
  }

  On_Click_Send()
  {
    this.status_elem.style = "visibility:visible;";
    setTimeout(() => this.dlg_elem.close(), 3000);
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
      <a cid="open_btn" class="btn-contact">
        <span data-hover="LET'S DO THIS">GET IN TOUCH</span>
      </a>
      <div class="footer-bar"> 
        © 2022 Dulce Engineering - All rights reserved.
      </div>

      <dialog cid="dlg_elem">
        <header>
          <h5>Contact Us</h5>
          <img cid="close_btn" src="/images/cross-white.svg">
        </header>
        <main>
          <label for="name">Name</label><input cid="name_elem" type="text">
          <label for="email">Email</label><input cid="email_elem" type="email">
          <label for="message">Message</label><textarea cid="msg_elem" rows="10"></textarea>
        </main>
        <footer>
          <span cid="status_elem">Your message was sent!</span>
          <button cid="send_btn">Send</button>
        </footer>
      </dialog>
    `;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.open_btn.addEventListener("click", this.On_Click_Open);
    this.close_btn.addEventListener("click", this.On_Click_Close);
    this.send_btn.addEventListener("click", this.On_Click_Send);

    const height = this.clientHeight+100;
    this.previousElementSibling.style = "padding-bottom:"+height+"px";
  }
}

Utils.Register_Element(DeFooter);
export default DeFooter;
