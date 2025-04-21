import Utils from "../../lib/Utils.js";
import ChartTime from "./index.js";

class ChartTimeColumn extends ChartTime
{
  static tname = "chart-time-column";

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
    data_bounds.p1.y = 0;
    data_bounds.p2.x += this.timespan_millis;

    return data_bounds;
  }

  Render_Axis(ctx, data_bounds, chart_bounds)
  {
    const from_bounds = {x1: data_bounds.p1.x, x2: data_bounds.p2.x};
    const to_bounds = {x1: chart_bounds.p1.x, x2: chart_bounds.p2.x};
    const width = Utils.Scale_Value(this.timespan_millis, from_bounds, to_bounds);

    const centre_offset = width/2;
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
      ctx.rotate(Math.PI/8);
      ctx.fillText(date_str, 0, 0);
      ctx.restore();
    }

    const label_y = "Time Spent";
    ctx.save();
    ctx.font = 'normal 20px Fjalla One';
    ctx.translate(-10, 10);
    ctx.rotate(Math.PI/2);
    ctx.scale(1, -1);
    ctx.fillText(label_y, 0, 0);
    ctx.restore();
  }

  Render_Column(ctx, data_pt, data_bounds, chart_bounds)
  {
    const from_bounds = {x1: data_bounds.p1.x, x2: data_bounds.p2.x};
    const to_bounds = {x1: chart_bounds.p1.x, x2: chart_bounds.p2.x};
    const width = Utils.Scale_Value(this.timespan_millis, from_bounds, to_bounds);

    const ctx_pt = Map_Point(data_pt, data_bounds, chart_bounds);

    ctx.beginPath();
    ctx.rect(ctx_pt.x, ctx_pt.y, width, chart_bounds.p1.y - ctx_pt.y);
    ctx.fill();
  }
}

function Map_Point(from_pt, from_bounds, to_bound)
{
  const to_pt = {x: null, y: null};

  to_pt.x = (from_pt.x - from_bounds.p1.x) * (to_bound.p2.x - to_bound.p1.x) / (from_bounds.p2.x - from_bounds.p1.x) + to_bound.p1.x;
  to_pt.y = (from_pt.y - from_bounds.p1.y) * (to_bound.p2.y - to_bound.p1.y) / (from_bounds.p2.y - from_bounds.p1.y) + to_bound.p1.y;

  return to_pt;
}

Utils.Register_Element(ChartTimeColumn);
export default ChartTimeColumn;