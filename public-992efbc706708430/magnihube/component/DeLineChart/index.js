
import Utils from "../../../lib/Utils.js";

class DeLineChart extends HTMLElement
{
  static tname = "de-line-chart";

  plot_width = 800;
  plot_height = 200;
  padding_top = 10;
  padding_right = 40;
  padding_bottom = 60;
  padding_left = 80;
  padding_axis = 20;
  data_bounds = null;
  // attr: title = "Title";
  // attr: x-label = "X Axis";
  // attr: y-label = "Y Axis";

  constructor()
  {
    super();

    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  set items(data)
  {
    this.data = data;
    this.Render_Chart(data);
  }

  set highlight_start(value)
  {
    const h = this.Get_Highlight();
    h.x1 = value / 100 * this.plot_width;
    this.Set_Highlight(h);
  }

  set highlight_end(value)
  {
    const h = this.Get_Highlight();
    h.x2 = value / 100 * this.plot_width;
    this.Set_Highlight(h);
  }

  Set_Highlight(h)
  {
    if (h.x1 >= 0 && h.x2 <= this.plot_width && 
      h.x1 <= h.x2 && h.x2 >= h.x1)
    {
      this.highlight.setAttribute("x", h.x1);
      this.highlight.setAttribute("width", h.x2 - h.x1);
    }
  }

  Get_Highlight()
  {
    const x1 = parseFloat(this.highlight.getAttribute("x"));
    const w = parseFloat( this.highlight.getAttribute("width"));
    const x2 = x1 + w;

    return {x1, x2};
  }

  Render_Chart() 
  {
    if (this.isConnected)
    {
      this.svg.replaceChildren();
      if (this.data && this.data.length > 0) 
      {
        this.data_bounds =
        {
          min_x: Math.min(...this.data.map((d) => d.x)),
          min_y: Math.min(...this.data.map((d) => d.y)),
          max_x: Math.max(...this.data.map((d) => d.x)),
          max_y: Math.max(...this.data.map((d) => d.y)),
        };
        this.data_bounds.width = this.data_bounds.max_x - this.data_bounds.min_x;
        this.data_bounds.height = this.data_bounds.max_y - this.data_bounds.min_y;

        //const title_elem = this.Render_Title();
        //this.svg.appendChild(title_elem);

        const path = this.Render_Line(this.data);
        this.svg.appendChild(path);

        const circles = this.Render_Data_Points(this.data);
        this.svg.append(...circles);

        const xAxis = this.Render_X_Axis();
        this.svg.append(...xAxis);

        const yAxis = this.Render_Y_Axis();
        this.svg.append(...yAxis);

        this.highlight = this.Render_Highlight();
        this.svg.appendChild(this.highlight);
      }
    }
  }

  Map(data)
  {
    const x = (data.x - this.data_bounds.min_x) / this.data_bounds.width * this.plot_width;
    const y = (data.y - this.data_bounds.min_y) / this.data_bounds.height * this.plot_height;
    return {x, y};
  }

  Render_Highlight()
  {
    const x = 0;
    const y = 0;
    const w = this.plot_width;
    const h = this.plot_height;
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", w);
    rect.setAttribute("height", h);
    rect.classList.add("highlight");

    return rect;
  }

  Render_Line(data)
  {
    data = data.sort((a, b) => a.x - b.x);
    const o = this.Map(data[0]);

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    let pathData = `M ${o.x},${o.y}`;
    for (let i = 1; i < data.length; i++) 
    {
      const p = this.Map(data[i]);
      pathData += ` L ${p.x},${p.y}`;
    }
    path.setAttribute("d", pathData);
    path.setAttribute("stroke", "blue");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("fill", "none");

    return path;
  }

  Render_Data_Points(data)
  {
    const elements = [];
    for (const data_point of data) 
    {
      const point = this.Map(data_point);
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", point.x);
      circle.setAttribute("cy", point.y);
      circle.setAttribute("r", "4");
      circle.setAttribute("fill", "red");
      elements.push(circle);
    }
  
    return elements;
  }

  Render_Title()
  {
    const x = -this.padding_axis - this.padding_left + 40;
    const y = this.plot_height + 40;
    const label_elem = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label_elem.setAttribute("x", x); 
    label_elem.setAttribute("y", y);
    label_elem.setAttribute("transform-origin", `${x} ${y}`);
    label_elem.setAttribute("transform", "scale(1, -1)");
    label_elem.classList.add("title");
    label_elem.innerHTML = this.title;

    return label_elem;
  }

  Render_X_Axis()
  {
    const x1 = -this.padding_axis - 10;
    const y1 = -this.padding_axis;
    const x2 = this.plot_width;
    const y2 = y1;
    const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    xAxis.setAttribute("x1", x1); xAxis.setAttribute("y1", y1);
    xAxis.setAttribute("x2", x2); xAxis.setAttribute("y2", y2);
    xAxis.setAttribute("stroke", "black");
    xAxis.setAttribute("stroke-width", "2");

    const x = x1 + 40;
    const y = y1 - 20;
    const label_elem = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label_elem.setAttribute("x", x); 
    label_elem.setAttribute("y", y);
    label_elem.setAttribute("alignment-baseline", "hanging");
    label_elem.setAttribute("transform-origin", `${x} ${y}`);
    label_elem.setAttribute("transform", "scale(1, -1)");
    label_elem.classList.add("axis-label");
    label_elem.classList.add("axis-x");
    label_elem.innerHTML = this.getAttribute("x-label") || "X Axis";

    return [xAxis, label_elem];
  }

  Render_Y_Axis()
  {
    const x1 = -this.padding_axis;
    const y1 = -this.padding_axis - 10;
    const x2 = x1;
    const y2 = this.plot_height;
    const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    yAxis.setAttribute("x1", x1); yAxis.setAttribute("y1", y1);
    yAxis.setAttribute("x2", x2); yAxis.setAttribute("y2", y2);
    yAxis.setAttribute("stroke", "black");
    yAxis.setAttribute("stroke-width", "1");

    const x = x1 - 20;
    const y = y1 + 40;
    const label_elem = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label_elem.setAttribute("x", x); 
    label_elem.setAttribute("y", y);
    label_elem.setAttribute("transform-origin", `${x} ${y}`);
    label_elem.setAttribute("transform", "scale(1, -1), rotate(-90)");
    label_elem.classList.add("axis-label");
    label_elem.classList.add("axis-y");
    label_elem.innerHTML = this.getAttribute("y-label") || "Y Axis";

    return [yAxis, label_elem];
  }

  Render()
  {
    if (this.isConnected)
    {
      const x = 0 - this.padding_axis - this.padding_left;
      const y = 0 - this.padding_axis - this.padding_bottom;
      const w = this.plot_width + (this.padding_left + this.padding_right) + this.padding_axis;
      const h = this.plot_height + (this.padding_top + this.padding_bottom) + this.padding_axis;
      const title = this.getAttribute("title") || "Title";

      const html = `
        <h1 cid="title_elem" class="title">
          <span>${title}</span>
          <slot name="title"></slot>
        </h1>
        <svg 
          cid="svg" 
          viewBox="${x} ${y} ${w} ${h}" 
          style="transform: scale(1, -1);"
          preserveAspectRatio="none"
        >
        </svg>
      `;
      const elems = Utils.toDocument(html, this);
      this.replaceChildren(elems);
      Utils.Set_Id_Shortcuts(this, this, "cid");

      this.Render_Chart();
    }
  }
}

Utils.Register_Element(DeLineChart);
export default DeLineChart;