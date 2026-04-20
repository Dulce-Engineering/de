
import Utils from "../../lib/Utils.js";

/**
 * DeLineChart is a custom HTML element that renders interactive line charts using SVG.
 * It supports one or more data series, axis labels, highlight ranges, and click interaction events.
 * The chart automatically scales data to fit the viewport, draws smooth interpolated lines,
 * and optionally renders individual data points.
 *
 * @class DeLineChart
 * @extends HTMLElement
 * @slot title - Custom title content (optional, overrides title attribute text)
 * @attr {string} title - Chart title text (default: "Title")
 * @attr {string} x-label - X-axis label text (default: "X Axis")
 * @attr {string} y-label - Y-axis label text (default: "Y Axis")
 * @attr {boolean} data-points - When present, draws circle markers at each data point
 * @attr {string} chart-type - Line rendering mode: "smooth" (default) for curves or "line" for straight segments
 * @property {Array|Object<string, Array<{x:number,y:number}>>} items - Data series to render; either an array of points or an object keyed by series name
 * @property {number} highlight_start - Highlight range start as percentage of chart width (0-100)
 * @property {number} highlight_end - Highlight range end as percentage of chart width (0-100)
 * @fires point-selected - Fired when the user clicks the chart; event detail contains nearest data points per series
 * @example
 * <de-line-chart title="Sales Data" x-label="Time" y-label="Revenue" data-points>
 *   <button slot="title">Custom Title</button>
 * </de-line-chart>
 *
 * const chart = document.querySelector('de-line-chart');
 * chart.items = {
 *   seriesA: [
 *     { x: 1000, y: 50 },
 *     { x: 2000, y: 75 }
 *   ],
 *   seriesB: [
 *     { x: 1000, y: 40 },
 *     { x: 2000, y: 60 }
 *   ]
 * };
 * chart.highlight_start = 10;
 * chart.highlight_end = 40;
 */
class DeLineChart extends HTMLElement
{
  static tname = "de-line-chart";

  static get observedAttributes()
  {
    return ["title", "chart-type"];
  }

  plot_width = 800;
  plot_height = 200;

  padding_top = 10;
  padding_right = 40;
  padding_bottom = 60;
  padding_left = 80;

  padding_axis = 20;
  overhang_axis = 10;

  data_bounds = null;
  // attr: title = "Title";
  // attr: x-label = "X Axis";
  // attr: y-label = "Y Axis";

  /**
   * Creates a new DeLineChart instance.
   * Initializes the component and binds event handlers.
   */
  constructor()
  {
    super();

    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  // properties ===============================================================

  /**
   * Sets the data series to be displayed in the chart.
   * Data should be an array of objects with x and y properties.
   * Automatically re-renders the chart when set.
   *
   * @param {Array<{x: number, y: number}>} data - Array of data points with x,y coordinates
   */
  set items(data)
  {
    this.data = data;
    this.Render_Chart();
  }

  /**
   * Sets the start position of the highlight range as a percentage (0-100).
   * Updates the visual highlight overlay on the chart.
   *
   * @param {number} value - Start position as percentage (0-100)
   */
  set highlight_start(value)
  {
    const h = this.Get_Highlight();
    h.x1 = value / 100 * this.plot_width;
    this.Set_Highlight(h);
  }

  /**
   * Sets the end position of the highlight range as a percentage (0-100).
   * Updates the visual highlight overlay on the chart.
   *
   * @param {number} value - End position as percentage (0-100)
   */
  set highlight_end(value)
  {
    const h = this.Get_Highlight();
    h.x2 = value / 100 * this.plot_width;
    this.Set_Highlight(h);
  }

  // attributes ===============================================================

  /**
   * Handles changes to observed attributes.
   * Currently responds to 'title' attribute changes by updating the title element.
   *
   * @param {string} name - Name of the attribute that changed
   * @param {string} old_value - Previous value of the attribute
   * @param {string} new_value - New value of the attribute
   */
  attributeChangedCallback(name, old_value, new_value)
  {
    if (this.isConnected)
    {
      if (name == "title" && this.title_elem)
      {
        this.title_elem.innerHTML = new_value;
      }
      else if (name == "chart-type")
      {
        this.Render_Chart();
      }
    }
  }

  // methods ==================================================================

  /**
   * Updates the visual highlight overlay on the chart.
   * Validates the range and applies it to the highlight rectangle element.
   *
   * @param {Object} svg_range - Range object with x1 and x2 properties
   * @param {number} svg_range.x1 - Start X coordinate in SVG space
   * @param {number} svg_range.x2 - End X coordinate in SVG space
   */
  Set_Highlight(svg_range)
  {
    const range_valid = 
      svg_range && svg_range.x1 >= 0 && svg_range.x2 <= this.plot_width &&
      svg_range.x1 <= svg_range.x2 && svg_range.x2 >= svg_range.x1;
    if (range_valid)
    {
      this.highlight.setAttribute("x", svg_range.x1);
      const range_width = svg_range.x2 - svg_range.x1;
      this.highlight.setAttribute("width", range_width);
    }

    const has_range = svg_range != null && svg_range != undefined;
    this.highlight.classList.toggle("on", has_range);
  }

  /**
   * Gets the current highlight range from the visual highlight element.
   *
   * @returns {Object|null} Range object with x1 and x2 properties, or null if no highlight is active
   * @returns {number} .x1 - Start X coordinate in SVG space
   * @returns {number} .x2 - End X coordinate in SVG space
   */
  Get_Highlight()
  {
    let res = null;

    if (this.highlight.classList.contains("on"))
    {
      const x1 = parseFloat(this.highlight.getAttribute("x"));
      const w = parseFloat(this.highlight.getAttribute("width"));
      const x2 = x1 + w;
      res = { x1, x2 };
    }

    return res;
  }

  /**
   * Calculates and sets the data bounds for all series in the chart.
   * Determines min/max values for X and Y axes across all data points.
   * This information is used for scaling data to fit the chart viewport.
   */
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
    //console.log("Set_Bounds(): data_bounds =", this.data_bounds);
  }

  /**
   * Maps a data point to SVG coordinates within the chart viewport.
   * Scales the data point based on the calculated data bounds.
   *
   * @param {Object} data - Data point with x and y properties
   * @param {number} data.x - X coordinate in data space
   * @param {number} data.y - Y coordinate in data space
   * @returns {Object} SVG point with x and y properties
   * @returns {number} .x - X coordinate in SVG space
   * @returns {number} .y - Y coordinate in SVG space
   */
  Map_Data_To_SVG_Point(data)
  {
    const dx = data.x - this.data_bounds.min_x;
    const rx = dx / this.data_bounds.width;
    const x = rx * this.plot_width;

    const dy = data.y - this.data_bounds.min_y;
    const ry = dy / this.data_bounds.height;
    const y = ry * this.plot_height;

    return { x, y };
  }

  /**
   * Maps an SVG point back to data coordinates.
   * Converts viewport coordinates back to original data scale.
   *
   * @param {Object} svg_pt - SVG point with x and y properties
   * @param {number} svg_pt.x - X coordinate in SVG space
   * @param {number} svg_pt.y - Y coordinate in SVG space
   * @returns {Object} Data point with x and y properties
   * @returns {number} .x - X coordinate in data space
   * @returns {number} .y - Y coordinate in data space
   */
  Map_SVG_Point_To_Data(svg_pt)
  {
    const x = (svg_pt.x / this.plot_width) * this.data_bounds.width + this.data_bounds.min_x;
    const y = (svg_pt.y / this.plot_height) * this.data_bounds.height + this.data_bounds.min_y;
    return { x, y };
  }

  /**
   * Finds the data point in a series with the X coordinate closest to the given value.
   * Used for interpolating Y values when clicking on the chart.
   *
   * @param {Array<{x: number, y: number}>} series - Array of data points
   * @param {number} x - Target X coordinate to find nearest point for
   * @returns {Object|null} Nearest data point or null if series is empty
   * @returns {number} .x - X coordinate of nearest point
   * @returns {number} .y - Y coordinate of nearest point
   */
  Nearest_Y_For_X(series, x)
  {
    if (!series || series.length === 0) return null;

    // find the point whose x is closest to the provided value
    let best = series[0];
    let bestDist = Math.abs(best.x - x);
    for (let i = 1; i < series.length; i++)
    {
      const pt = series[i];
      const d = Math.abs(pt.x - x);
      if (d < bestDist)
      {
        bestDist = d;
        best = pt;
      }
    }
    // return a shallow copy to avoid external mutation
    return { x: best.x, y: best.y };
  }

  /**
   * Finds the nearest data point across all series to the given coordinates.
   * Used for click interactions to determine which data point was clicked.
   *
   * @param {number} clickX - X coordinate of click in data space
   * @param {number} clickY - Y coordinate of click in data space
   * @returns {Object|null} Nearest point information or null if no data
   * @returns {number} .x - X coordinate of nearest point
   * @returns {number} .y - Y coordinate of nearest point
   * @returns {string} .series - Key/name of the series containing the point
   */
  Find_Nearest_Point(clickX, clickY)
  {
    let nearestPoint = null;
    let minDistance = Infinity;

    for (const seriesKey in this.data)
    {
      const series = this.data[seriesKey];
      for (const point of series)
      {
        const distance = Math.sqrt((point.x - clickX) ** 2 + (point.y - clickY) ** 2);
        if (distance < minDistance)
        {
          minDistance = distance;
          nearestPoint = {
            x: point.x,
            y: point.y,
            series: seriesKey
          };
        }
      }
    }

    return nearestPoint;
  }

  /**
   * Calculates the X offset for the SVG viewBox to account for axis labels and padding.
   *
   * @returns {number} X offset value for SVG viewBox
   * @private
   */
  Calc_SVG_X_Offset()
  {
    const x = 0 - this.padding_axis - this.padding_left;
    return x;
  }

  /**
   * Calculates the Y offset for the SVG viewBox to account for axis labels and padding.
   *
   * @returns {number} Y offset value for SVG viewBox
   * @private
   */
  Calc_SVG_Y_Offset()
  {
    const y = 0 - this.padding_axis - this.padding_bottom;
    return y;
  }

  /**
   * Calculates the total width needed for the SVG viewBox.
   * Includes plot area, padding, and axis space.
   *
   * @returns {number} Total width for SVG viewBox
   * @private
   */
  Calc_SVG_Width()
  {
    const w = 
      this.plot_width + // data rendering width
      (this.padding_left + this.padding_right) + // outer padding for axes
      this.padding_axis; // inner padding for axes

    return w;
  }

  /**
   * Calculates the total height needed for the SVG viewBox.
   * Includes plot area, padding, and axis space.
   *
   * @returns {number} Total height for SVG viewBox
   * @private
   */
  Calc_SVG_Height()
  {
    const h = 
      this.plot_height + // data rendering height
      (this.padding_top + this.padding_bottom) + 
      this.padding_axis;

    return h;
  }

  // events ===================================================================

  /**
   * Handles click events on the SVG chart area.
   * Converts click coordinates to data coordinates and finds nearest points for all series.
   * Dispatches a 'point-selected' custom event with the nearest points.
   *
   * @param {MouseEvent} event - The click event
   * @fires point-selected - With detail containing nearest points for all series
   * @private
   */
  On_SVG_Click(event)
  {
    const rect = this.svg.getBoundingClientRect();

    const elem_x = event.clientX - rect.left;
    const elem_y = (rect.top + rect.height) - event.clientY;
    const elem_pt = { x: elem_x, y: elem_y };

    const svg_x = (elem_x / rect.width * this.Calc_SVG_Width()) + this.Calc_SVG_X_Offset();
    const svg_y = (elem_y / rect.height * this.Calc_SVG_Height()) + this.Calc_SVG_Y_Offset();
    const svg_pt = { x: svg_x, y: svg_y };

    const data_pt = this.Map_SVG_Point_To_Data(svg_pt);

    const nearest_data_pts = {};
    for (const key in this.data)
    {
      const series = this.data[key];
      const nearest = this.Nearest_Y_For_X(series, data_pt.x);
      if (nearest)
      {
        nearest_data_pts[key] = { x: Math.trunc(data_pt.x), y: nearest.y };
      }
    }

    this.dispatchEvent(new CustomEvent("point-selected", {detail: nearest_data_pts}));
    
  }

  // rendering ================================================================

  /**
   * Renders data points as SVG circles for a given data series.
   * Creates circle elements positioned at each data point.
   *
   * @param {Array<{x: number, y: number}>} data - Array of data points to render
   * @returns {Array<SVGCircleElement>} Array of SVG circle elements
   * @private
   */
  Render_Data_Points(data)
  {
    const elements = [];
    for (const data_point of data) 
    {
      const point = this.Map_Data_To_SVG_Point(data_point);
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

  /**
   * Renders the complete chart component structure.
   * Creates the SVG element with proper viewBox, title, and event handlers.
   * Only renders if the component is connected to the DOM.
   *
   * @private
   */
  Render()
  {
    if (this.isConnected)
    {
      const x = this.Calc_SVG_X_Offset();
      const y = this.Calc_SVG_Y_Offset();
      const w = this.Calc_SVG_Width();
      const h = this.Calc_SVG_Height();
      const title = this.getAttribute("title") || "Title";
      //console.log("Render(): x, y, w, h =", x, y, w, h);

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

      this.svg.addEventListener("click", this.On_SVG_Click);

      this.Render_Chart();
    }
  }

  /**
   * Renders the chart content within the SVG element.
   * Clears existing content and renders all data series, axes, highlight, and input mask.
   * Only renders if the component is connected and has data.
   *
   * @private
   */
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

          if (this.hasAttribute("data-points"))
          {
            const circles = this.Render_Data_Points(line_data);
            this.svg.append(...circles);
          }
        }

        const xAxis = this.Render_X_Axis();
        this.svg.append(...xAxis);

        const yAxis = this.Render_Y_Axis();
        this.svg.append(...yAxis);

        this.highlight = this.Render_Highlight();
        this.svg.appendChild(this.highlight);

        this.mask = this.Render_Input_Mask();
        this.svg.appendChild(this.mask);
      }
    }
  }

  /**
   * Renders a data series as a line (smooth curves or straight segments).
   * The rendering mode is controlled by the chart-type attribute.
   * Each series gets a different color automatically.
   *
   * @param {Array<{x: number, y: number}>} data - Array of data points for this series
   * @returns {SVGPathElement} SVG path element representing the line
   * @private
   */
  Render_Line(data)
  {
    data = data.sort((a, b) => a.x - b.x);
    const points = data.map(d => this.Map_Data_To_SVG_Point(d));

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    let pathData = "";

    const chartType = this.getAttribute("chart-type") || "smooth";

    if (points.length > 1) 
    {
      if (chartType === "line")
      {
        // Render straight line segments
        pathData = `M ${points[0].x},${points[0].y}`;
        for (let i = 1; i < points.length; i++)
        {
          pathData += ` L ${points[i].x},${points[i].y}`;
        }
      }
      else
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

  /**
   * Renders the X-axis line and label.
   * Creates an SVG line element for the axis and a text element for the label.
   *
   * @returns {Array<SVGElement>} Array containing the axis line and label elements
   * @private
   */
  Render_X_Axis()
  {
    const x1 = -this.padding_axis - this.overhang_axis;
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

  /**
   * Renders the Y-axis line and label.
   * Creates an SVG line element for the axis and a rotated text element for the label.
   *
   * @returns {Array<SVGElement>} Array containing the axis line and label elements
   * @private
   */
  Render_Y_Axis()
  {
    const x1 = -this.padding_axis;
    const y1 = -this.padding_axis - this.overhang_axis;
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

  /**
   * Renders the highlight overlay rectangle.
   * Creates a transparent rectangle that covers the entire plot area for highlighting ranges.
   *
   * @returns {SVGRectElement} SVG rectangle element for highlighting
   * @private
   */
  Render_Highlight()
  {
    const x = 0;
    const y = 0 - this.padding_axis - this.overhang_axis;
    const w = this.plot_width;
    const h = this.plot_height + this.padding_axis + this.overhang_axis;
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", w);
    rect.setAttribute("height", h);
    rect.classList.add("highlight");

    return rect;
  }

  /**
   * Renders an invisible input mask rectangle over the plot area.
   * This element captures click events on the chart area.
   *
   * @returns {SVGRectElement} SVG rectangle element for input capture
   * @private
   */
  Render_Input_Mask()
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
    rect.classList.add("input-mask");

    return rect;
  }
}

Utils.Register_Element(DeLineChart);
export default DeLineChart;