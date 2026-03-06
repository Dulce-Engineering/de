
import Utils from "../../lib/Utils.js";

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
    this.Render_Chart();
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

  static observedAttributes = ["title"];
  attributeChangedCallback(name, old_value, new_value)
  {
    if (this.isConnected)
    {
      if (name == "title" && this.title_elem)
      {
        this.title_elem.innerHTML = new_value;
      }
    }
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
    const w = parseFloat(this.highlight.getAttribute("width"));
    const x2 = x1 + w;

    return { x1, x2 };
  }

  Set_Bounds()
  {
    const all_points = Object.values(this.data).flat();
    const all_x_values = all_points.map((d) => d.x);
    const all_y_values = all_points.map((d) => d.y);

    this.data_bounds =
    {
      min_x: Math.min(...all_x_values),
      min_y: Math.min(...all_y_values),
      max_x: Math.max(...all_x_values),
      max_y: Math.max(...all_y_values),
    };
    this.data_bounds.width = this.data_bounds.max_x - this.data_bounds.min_x;
    this.data_bounds.height = this.data_bounds.max_y - this.data_bounds.min_y;
  }

  Render_Chart() 
  {
    if (this.isConnected)
    {
      this.svg.replaceChildren();
      if (this.data && Object.keys(this.data).length > 0) 
      {
        this.Set_Bounds();

        //const title_elem = this.Render_Title();
        //this.svg.appendChild(title_elem);

        this.color = 0;
        for (const key in this.data)
        {
          const line_data = this.data[key];

          const path = this.Render_Line(line_data);
          this.svg.appendChild(path);

          //const circles = this.Render_Data_Points(line_data);
          //this.svg.append(...circles);
        }

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
    return { x, y };
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
    const points = data.map(d => this.Map(d));

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    let pathData = "";

    if (points.length > 1) 
    {
      // Monotone Cubic Interpolation
      // 1. Calculate slopes (secants)
      const slopes = [];
      for (let i = 0; i < points.length - 1; i++)
      {
        const dx = points[i + 1].x - points[i].x;
        const dy = points[i + 1].y - points[i].y;
        slopes.push(dx === 0 ? Infinity : dy / dx);
      }

      // 2. Calculate tangents
      const tangents = [];
      tangents.push(slopes[0]);
      for (let i = 0; i < slopes.length - 1; i++)
      {
        tangents.push((slopes[i] + slopes[i + 1]) / 2);
      }
      tangents.push(slopes[slopes.length - 1]);

      // 3. Enforce monotonicity
      for (let i = 0; i < slopes.length; i++)
      {
        const s = slopes[i];
        if (s === 0)
        {
          tangents[i] = 0;
          tangents[i + 1] = 0;
        } 
        else
        {
          const alpha = tangents[i] / s;
          const beta = tangents[i + 1] / s;
          const magSq = alpha * alpha + beta * beta;
          if (magSq > 9)
          {
            const tau = 3 / Math.sqrt(magSq);
            tangents[i] = tau * alpha * s;
            tangents[i + 1] = tau * beta * s;
          }
        }
      }

      // 4. Generate path
      pathData = `M ${points[0].x},${points[0].y}`;
      for (let i = 0; i < points.length - 1; i++)
      {
        const p0 = points[i], p1 = points[i + 1];
        const m0 = tangents[i], m1 = tangents[i + 1];
        const dx = (p1.x - p0.x) / 3;
        pathData += ` C ${p0.x + dx},${p0.y + dx * m0} ${p1.x - dx},${p1.y - dx * m1} ${p1.x},${p1.y}`;
      }
    }
    else if (points.length === 1) 
    {
      pathData = `M ${points[0].x},${points[0].y}`;
    }
    path.setAttribute("d", pathData);
    path.classList.add("data-line");
    path.style.stroke = "var(--c" + this.color + ")";

    this.color++;

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
      circle.classList.add("data-point");
      elements.push(circle);
    }

    return elements;
  }

  /*Render_Title()
  {
    const x = -this.padding_axis - this.padding_left + 40;
    const y = this.plot_height + 40;
    this.label_elem = document.createElementNS("http://www.w3.org/2000/svg", "text");
    this.label_elem.setAttribute("x", x); 
    this.label_elem.setAttribute("y", y);
    this.label_elem.setAttribute("transform-origin", `${x} ${y}`);
    this.label_elem.setAttribute("transform", "scale(1, -1)");
    this.label_elem.classList.add("title");
    this.label_elem.innerHTML = this.title;

    return this.label_elem;
  }*/

  Render_X_Axis()
  {
    const x1 = -this.padding_axis - 10;
    const y1 = -this.padding_axis;
    const x2 = this.plot_width;
    const y2 = y1;
    const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    xAxis.setAttribute("x1", x1); xAxis.setAttribute("y1", y1);
    xAxis.setAttribute("x2", x2); xAxis.setAttribute("y2", y2);
    xAxis.classList.add("axis-line");
    xAxis.classList.add("axis-x");

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
    yAxis.classList.add("axis-line");
    yAxis.classList.add("axis-y");

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
        <h1 class="title">
          <span cid="title_elem">${title}</span>
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