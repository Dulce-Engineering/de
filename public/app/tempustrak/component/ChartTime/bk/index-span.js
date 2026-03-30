import Utils from "../../lib/Utils.js";

class ChartTimeSpan extends HTMLElement
{
  static tname = "chart-time-span";

  constructor()
  {
    super();

    this.padding = {top: 20, right: 20, bottom: 40, left: 40};
    this.padding_axis = {top: 0, right: 0, bottom: 5, left: 5};
    this.bounds =
    {
      p1: {x: 0, y: 0},
      p2: {x: 0, y: 0}
    }
    Utils.Bind(this, "On_");
  }

  connectedCallback()
  {
    this.Render();
  }

  set value(data)
  {
    this.data = data;
    this.Update(data);
  }

  Update()
  {
    this.ctx.clearRect
      (this.bounds.p1.x, this.bounds.p1.y, 
      this.bounds.p2.x - this.bounds.p1.x, this.bounds.p2.y - this.bounds.p1.y);

    if (!Utils.isEmpty(this.data))
    {
      const chart_bounds = 
      {
        p1: 
        {
          x: this.padding_axis.left, 
          y: this.padding_axis.bottom
        },
        p2: 
        {
          x: this.bounds.p2.x - this.padding.right, 
          y: this.bounds.p2.y - this.padding.top
        }
      };
      //this.Render_Border(this.ctx, chart_bounds);

      // render origin
      this.Render_Origin(this.ctx, this.bounds);
      
      const field_name = 
      { 
        x: this.getAttribute("name-x"), 
        y: this.getAttribute("name-y") 
      };
      const data_bounds = this.Calc_Data_Bounds(this.data, field_name);

      this.ctx.fillStyle = '#ff0';
      for (let i=0; i<this.data.length; i++)
      {
        const item = this.data[i];
        const data_pt = 
        {
          x: item[field_name.x],
          y: item[field_name.y]
        };
        if (data_pt.x && data_pt.y)
        {
          this.Render_Column(this.ctx, data_pt, data_bounds, chart_bounds);
        }
      }

      // render axis
      this.Render_Axis(this.ctx, data_bounds, chart_bounds);
    }
  }

  Calc_Data_Bounds(data, field_name)
  {
    const data_bounds =
    {
      p1: 
      {
        x: Utils.Minimum(data, field_name.x)[field_name.x],
        y: Utils.Minimum(data, field_name.y)[field_name.y]
      },
      p2: 
      {
        x: Utils.Maximum(data, field_name.x)[field_name.x],
        y: Utils.Maximum(data, field_name.y)[field_name.y]
      }
    };

    return data_bounds;
  }

  Render_Axis(ctx, data_bounds, chart_bounds)
  {
    this.timespan_millis = Utils.MILLIS_DAY;
    //const width = Scale_Value(this.timespan_millis, data_bounds, chart_bounds);
    const centre_offset = 0;
    ctx.strokeStyle = '#ff0';
    ctx.lineWidth = 1;

    for (let t=data_bounds.p1.x; t<data_bounds.p2.x; t+=this.timespan_millis)
    {
      const pt = Map_Point({x: t, y: 0}, data_bounds, chart_bounds);
      ctx.beginPath();
      ctx.moveTo(pt.x+centre_offset, 0);
      ctx.lineTo(pt.x+centre_offset, -10);
      ctx.stroke();

      const date_str = this.Format_Date(t, this.date_format);
      ctx.save();
      ctx.font = 'normal 10px Fjalla One';
      ctx.translate(pt.x+centre_offset-25, -13);
      ctx.scale(1, -1);
      ctx.rotate(Math.PI/16);
      ctx.fillText(date_str, 0, 0);
      ctx.restore();
    }
    
    const label_y = this.getAttribute("title");
    ctx.save();
    ctx.font = 'normal 20px Fjalla One';
    ctx.translate(-10, 10);
    ctx.rotate(Math.PI/2);
    ctx.scale(1, -1);
    ctx.fillText(label_y, 0, 0);
    ctx.restore();
  }

  Format_Date(date_millis, view)
  {
    let date_options = null;
    if (view == "day" || view == "week") 
    {
      date_options = 
      {
        weekday:"short", 
        day:"numeric", 
        month:"numeric",
        year: "2-digit",
      };
    }
    else if (view == "month") 
    {
      date_options = 
      {
        month:"short",
        year: "numeric",
      };
    }
    else if (view == "year") 
    {
      date_options = 
      {
        year: "numeric",
      };
    }
    else
    {
      date_options = 
      {
        hour12: true,
        weekday:"short", 
        day:"numeric", 
        month:"numeric",
        year: "numeric",
        hour:"numeric", 
        minute:"numeric",
        second: "numeric"
      };
    }

    const date = new Date(date_millis);
    const date_format = new Intl.DateTimeFormat(undefined, date_options);
    let date_str = date_format.format(date);

    return date_str;
  }

  Render_Column(ctx, data_pt, data_bounds, chart_bounds)
  {
    const from_bounds = {x1: data_bounds.p1.x, x2: data_bounds.p2.x};
    const to_bounds = {x1: chart_bounds.p1.x, x2: chart_bounds.p2.x};
    const width = Utils.Scale_Value(data_pt.y, from_bounds, to_bounds);

    const ctx_pt = Map_Point(data_pt, data_bounds, chart_bounds);

    ctx.beginPath();
    ctx.rect(ctx_pt.x, chart_bounds.p1.y, width, 50);
    ctx.fill();
  }

  Render_Line(ctx, pt, i, data)
  {
    if (i == 0)
    {
      ctx.beginPath();
      ctx.moveTo(pt.x, pt.y);
    }
    else if (i == data.length-1)
    {
      ctx.lineTo(pt.x, pt.y);
      ctx.stroke();
    }
    else
    {
      ctx.lineTo(pt.x, pt.y);
    }
  }

  Render_Origin(ctx, bounds)
  {
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(bounds.p1.x, 0);
    ctx.lineTo(bounds.p2.x, 0);
    ctx.moveTo(0, bounds.p1.y);
    ctx.lineTo(0, bounds.p2.y);
    ctx.stroke();
  }

  Render_Border(ctx, bounds)
  {
    ctx.strokeStyle = '#f00';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(bounds.p1.x, bounds.p1.y);
    ctx.lineTo(bounds.p2.x, bounds.p1.y);
    ctx.lineTo(bounds.p2.x, bounds.p2.y);
    ctx.lineTo(bounds.p1.x, bounds.p2.y);
    ctx.lineTo(bounds.p1.x, bounds.p1.y);
    ctx.stroke();
  }

  Render()
  {
    this.canvas_elem = document.createElement("canvas");
    this.canvas_elem.width = 1000;
    this.canvas_elem.height = 200;
    this.append(this.canvas_elem);
    this.ctx = this.canvas_elem.getContext("2d");

    // reorient canvas
    this.bounds.p1.x = 0 - this.padding.left;
    this.bounds.p1.y = 0 - this.padding.bottom;
    this.bounds.p2.x = this.canvas_elem.width - this.padding.left;
    this.bounds.p2.y = this.canvas_elem.height - this.padding.bottom;
    this.ctx.translate(-this.bounds.p1.x, this.bounds.p2.y);
    this.ctx.scale(1, -1);
  }
}

function Map_Point(from_pt, from_bounds, to_bound)
{
  const to_pt = {x: null, y: null};

  to_pt.x = (from_pt.x - from_bounds.p1.x) * (to_bound.p2.x - to_bound.p1.x) / (from_bounds.p2.x - from_bounds.p1.x) + to_bound.p1.x;
  to_pt.y = (from_pt.y - from_bounds.p1.y) * (to_bound.p2.y - to_bound.p1.y) / (from_bounds.p2.y - from_bounds.p1.y) + to_bound.p1.y;

  return to_pt;
}

Utils.Register_Element(ChartTimeSpan);
export default ChartTimeSpan;