import Utils from "../Utils.js";

class ShapeOverlays 
{
  constructor(elm) 
  {
    this.elm = elm;
    this.path = elm.querySelectorAll('path');
    this.numPoints = 2;
    this.duration = 600;
    this.delayPointsArray = [];
    this.delayPointsMax = 0;
    this.delayPerPath = 200;
    this.timeStart = Date.now();
    this.isOpened = false;
    this.isAnimating = false;
  }

  toggle() {
    this.isAnimating = true;
    for (var i = 0; i < this.numPoints; i++) {
      this.delayPointsArray[i] = 0;
    }
    if (this.isOpened === false) {
      this.open();
    } else {
      this.close();
    }
  }

  open() {
    this.isOpened = true;
    this.elm.classList.add('is-opened');
    $("body").addClass('overflow-hidden');
    this.timeStart = Date.now();
    this.renderLoop();
  }

  close() {
    this.isOpened = false;
    this.elm.classList.remove('is-opened');
    $("body").removeClass('overflow-hidden');
    this.timeStart = Date.now();
    this.renderLoop();
  }

  updatePath(time) {
    const points = [];
    for (var i = 0; i < this.numPoints; i++) {
      const thisEase = this.isOpened ? 
                        (i == 1) ? ease.cubicOut : ease.cubicInOut:
                        (i == 1) ? ease.cubicInOut : ease.cubicOut;
      points[i] = thisEase(Math.min(Math.max(time - this.delayPointsArray[i], 0) / this.duration, 1)) * 100
    }

    let str = '';
    str += (this.isOpened) ? `M 0 0 V ${points[0]} ` : `M 0 ${points[0]} `;
    for (var i = 0; i < this.numPoints - 1; i++) {
      const p = (i + 1) / (this.numPoints - 1) * 100;
      const cp = p - (1 / (this.numPoints - 1) * 100) / 2;
      str += `C ${cp} ${points[i]} ${cp} ${points[i + 1]} ${p} ${points[i + 1]} `;
    }
    str += (this.isOpened) ? `V 0 H 0` : `V 100 H 0`;
    return str;
  }

  render() {
    if (this.isOpened) {
      for (var i = 0; i < this.path.length; i++) {
        this.path[i].setAttribute('d', this.updatePath(Date.now() - (this.timeStart + this.delayPerPath * i)));
      }
    } else {
      for (var i = 0; i < this.path.length; i++) {
        this.path[i].setAttribute('d', this.updatePath(Date.now() - (this.timeStart + this.delayPerPath * (this.path.length - i - 1))));
      }
    }
  }

  renderLoop() {
    this.render();
    if (Date.now() - this.timeStart < this.duration + this.delayPerPath * (this.path.length - 1) + this.delayPointsMax) {
      requestAnimationFrame(() => {
        this.renderLoop();
      });
    }
    else {
      this.isAnimating = false;
    }
  }
}

class DeHeader extends HTMLElement
{
  static tname = "de-header";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  On_Click_Hamburger()
  {
    this.link.play();
    this.overlay.toggle();
    if (this.overlay.isOpened === true) 
    {
      this.hamburger.classList.add('is-opened-navi');
      this.gNavItems.classList.add('is-opened');
    } 
    else 
    {
      this.hamburger.classList.remove('is-opened-navi');
      this.gNavItems.classList.remove('is-opened');
    }
  }

  On_Click_Item(e)
  {
    this.hamburger.click();

    var goTo = e.currentTarget.getAttribute("href"); 
    setTimeout(function() {window.location = goTo;},1000);       
    e.preventDefault();                  
  }

  Render()
  {
    this.innerHTML = `
      <ul cid="gNavItems" class="hamburger-navigation">
        <li><a href="index.html">Home</a></li>
        <li><a href="index.html#clients">Clients</a></li>
        <li><a href="index.html#services">Services</a></li>
        <li><a href="/dedial/index.html">DeDial Component</a></li>
        <li><a href="/dedial/docs.html">DeDial Reference</a></li>
      </ul>

      <svg cid="elmOverlay" class="shape-overlays" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path class="shape-overlays__path" d=""></path>
        <path class="shape-overlays__path" d=""></path>
        <path class="shape-overlays__path" d=""></path>
      </svg>

      <header class="header">
        <div class="logo"><img src="images-de/logo.svg" alt="Image"></div>
        <span class="phone" hidden>t: +380 83 857 5 577</span>
        <a href="mailto:it@dulceeng.com.au" target="_blank" class="phone" >it@dulceeng.com.au</a>
        <div cid="hamburger" class="hamburger">
          <div class="hamburger__line hamburger__line--01">
            <div class="hamburger__line-in hamburger__line-in--01"></div>
          </div>
          <div class="hamburger__line hamburger__line--02">
            <div class="hamburger__line-in hamburger__line-in--02"></div>
          </div>
          <div class="hamburger__line hamburger__line--03">
            <div class="hamburger__line-in hamburger__line-in--03"></div>
          </div>
          <div class="hamburger__line hamburger__line--cross01">
            <div class="hamburger__line-in hamburger__line-in--cross01"></div>
          </div>
          <div class="hamburger__line hamburger__line--cross02">
            <div class="hamburger__line-in hamburger__line-in--cross02"></div>
          </div>
        </div>
        <div hidden class="equalizer"> <span></span> <span></span> <span></span> <span></span> </div>
        <ul class="language" hidden>
          <li><a href="#">EN</a></li>
          <li><a href="#">RU</a></li>
        </ul>
      </header>

      <audio cid="link" src="audio/link.mp3" preload="auto"></audio>
    `;
    Utils.Set_Id_Shortcuts(this, this, "cid");

    this.overlay = new ShapeOverlays(this.elmOverlay);
    this.hamburger.addEventListener('click', this.On_Click_Hamburger);

    const item_elems = this.gNavItems.querySelectorAll('li a');
    for (const item_elem of item_elems)
    {
      item_elem.addEventListener('click', this.On_Click_Item);
    }
  }
}

Utils.Register_Element(DeHeader);
export default DeHeader;
