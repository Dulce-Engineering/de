import Utils from "../../lib/Utils.js";

class DeIntersection extends HTMLElement
{
  static tname = "de-intersection";

  constructor()
  {
    super();
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  set value(obj)
  {
  }

  get value()
  {
  }
  
  static observedAttributes = 
  [
    "attribute-name"
  ];
  attributeChangedCallback(name, old_value, new_value)
  {
  }

  On_Click_Btn()
  {
  }
  
  On_Intersection(entries)
  {
    for (const entry of entries)
    {
      if (entry.isIntersecting) 
      {
        this.for_elem.classList.add(this.in_class);
        //this.for_elem.classList.remove(out_class);
      } 
      else if (this.hasAttribute("in-remove"))
      {
        this.for_elem.classList.remove(this.in_class);
        //this.for_elem.classList.add(out_class);
        //this.for_elem.classList.remove(in_class);
      }
    }
  }

  Render()
  {
    /*const html = `
    `;
    const html_elements = Utils.To_Document(html, this);
    this.replaceChildren(html_elements);
    Utils.Set_Id_Shortcuts(this, this, "cid");*/

    //this.some_elem.addEventListener("click", this.On_Click_Btn);

    this.in_class = 
      Utils.Get_Attr_Def(this, "in-class", "in-intersect");

    if (this.hasAttribute("for")) 
    {
      const for_id = this.getAttribute("for");
      this.for_elem = document.getElementById(for_id);
      if (this.for_elem)
      {
        const rootMargin = Utils.Get_Attr_Def(this, "root-margin", "0px 0px 0px 0px");
        const threshold = Utils.Get_Attr_Def(this, "threshold", 0);
        const options = 
        {
          root: null, 
          rootMargin, 
          threshold
        };
        const observer = 
          new IntersectionObserver(this.On_Intersection, options);
        observer.observe(this);
      }
    }
  }
}

Utils.Register_Element(DeIntersection);
export default DeIntersection;