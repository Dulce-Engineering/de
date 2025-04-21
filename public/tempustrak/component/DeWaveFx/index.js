import Utils from "../../lib/Utils.js";

const ease = 
{
  exponentialIn: (t) => {
    return t == 0.0 ? t : Math.pow(2.0, 10.0 * (t - 1.0));
  },
  exponentialOut: (t) => {
    return t == 1.0 ? t : 1.0 - Math.pow(2.0, -10.0 * t);
  },
  exponentialInOut: (t) => {
    return t == 0.0 || t == 1.0
      ? t
      : t < 0.5
        ? +0.5 * Math.pow(2.0, (20.0 * t) - 10.0)
        : -0.5 * Math.pow(2.0, 10.0 - (t * 20.0)) + 1.0;
  },
  sineOut: (t) => {
    const HALF_PI = 1.5707963267948966;
    return Math.sin(t * HALF_PI);
  },
  circularInOut: (t) => {
    return t < 0.5
        ? 0.5 * (1.0 - Math.sqrt(1.0 - 4.0 * t * t))
        : 0.5 * (Math.sqrt((3.0 - 2.0 * t) * (2.0 * t - 1.0)) + 1.0);
  },
  cubicIn: (t) => {
    return t * t * t;
  },
  cubicOut: (t) => {
    const f = t - 1.0;
    return f * f * f + 1.0;
  },
  cubicInOut: (t) => {
    return t < 0.5
      ? 4.0 * t * t * t
      : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
  },
  quadraticOut: (t) => {
    return -t * (t - 2.0);
  },
  quarticOut: (t) => {
    return Math.pow(t - 1.0, 3.0) * (1.0 - t) + 1.0;
  },
}

class DeWaveFx extends HTMLElement
{
  static tname = "de-wave-fx";

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
      <svg class="shape-overlays" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path class="shape-overlays__path" d=""></path>
        <path class="shape-overlays__path" d=""></path>
        <path class="shape-overlays__path" d=""></path>
      </svg>`;

    this.path = this.querySelectorAll('path');
    this.numPoints = 2;
    this.duration = 600;
    this.delayPointsArray = [];
    this.delayPointsMax = 0;
    this.delayPerPath = 200;
    this.timeStart = Date.now();
    this.isOpened = false;
    this.isAnimating = false;
  }

  toggle() 
  {
    if (this.isOpened === false) {
      this.open();
    } else {
      this.close();
    }
  }

  open() 
  {
    this.isAnimating = true;
    for (var i = 0; i < this.numPoints; i++) {
      this.delayPointsArray[i] = 0;
    }

    this.isOpened = true;
    this.classList.add('is-opened');
    
    document.body.classList.add('overflow-hidden');
    this.timeStart = Date.now();
    this.renderLoop();
  }

  close() 
  {
    this.isAnimating = true;
    for (var i = 0; i < this.numPoints; i++) {
      this.delayPointsArray[i] = 0;
    }

    this.isOpened = false;
    this.classList.remove('is-opened');
    document.body.classList.remove('overflow-hidden');
    this.timeStart = Date.now();
    this.renderLoop();
  }

  updatePath(time) 
  {
    const points = [];
    for (var i = 0; i < this.numPoints; i++) 
    {
      const thisEase = this.isOpened ? 
        (i == 1) ? ease.cubicOut : ease.cubicInOut:
        (i == 1) ? ease.cubicInOut : ease.cubicOut;
      points[i] = thisEase(Math.min(Math.max(time - this.delayPointsArray[i], 0) / this.duration, 1)) * 100
    }

    let str = '';
    str += (this.isOpened) ? `M 0 0 V ${points[0]} ` : `M 0 ${points[0]} `;
    for (var i = 0; i < this.numPoints - 1; i++) 
    {
      const p = (i + 1) / (this.numPoints - 1) * 100;
      const cp = p - (1 / (this.numPoints - 1) * 100) / 2;
      str += `C ${cp} ${points[i]} ${cp} ${points[i + 1]} ${p} ${points[i + 1]} `;
    }
    str += (this.isOpened) ? `V 0 H 0` : `V 100 H 0`;
    return str;
  }

  Render_Frame() 
  {
    if (this.isOpened) 
    {
      for (var i = 0; i < this.path.length; i++) 
      {
        const time = Date.now() - (this.timeStart + this.delayPerPath * i);
        const path_str = this.updatePath(time);
        this.path[i].setAttribute('d', path_str);
      }
    } 
    else 
    {
      for (var i = 0; i < this.path.length; i++) 
      {
        const time = Date.now() - (this.timeStart + this.delayPerPath * (this.path.length - i - 1));
        const path_str = this.updatePath(time);
        this.path[i].setAttribute('d', path_str);
      }
    }
  }

  renderLoop() 
  {
    this.Render_Frame();
    if (Date.now() - this.timeStart < this.duration + this.delayPerPath * (this.path.length - 1) + this.delayPointsMax) 
    {
      requestAnimationFrame(() => {this.renderLoop();});
    }
    else 
    {
      this.isAnimating = false;
    }
  }
}

Utils.Register_Element(DeWaveFx);
export default DeWaveFx;
