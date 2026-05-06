import * as wb from "@wordpress/blocks";
import * as wed from '@wordpress/block-editor';
import * as wc from '@wordpress/components';
import * as we from '@wordpress/element';
import * as wh from '@wordpress/hooks';

const icon = 
(
  <svg
    width="69mm" height="69mm"
    viewBox="0 0 69 69"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    >
    <g transform="matrix(1.1252665,0,0,1.1252665,-6.5736043,-3.9362786)">
      <path
        style={{ fill: "#f00" }}
        d="m 27.273505,3.9426279 c -0.817025,0.014454 -1.632945,0.07123 -2.445438,0.1634882 v 9.1792349 c 5.868486,-1.034901 12.313259,1.111079 16.512335,5.820373 7.789825,8.736339 6.124379,22.744068 -2.554277,30.426765 -3.837522,3.397131 -8.823705,5.448781 -13.951629,5.856654 v 9.089683 c 5.436097,-0.313089 10.745433,-1.963557 15.389501,-4.824288 1.568871,-0.96642 3.062118,-2.071544 4.458735,-3.307886 C 56.975774,45.464351 59.322704,25.753081 47.988321,13.041495 42.646238,7.0503143 34.925671,3.8072348 27.273505,3.9426279 Z m 0.380707,15.6691751 c -0.355729,0.003 -0.714825,0.02227 -1.07691,0.05741 -2.896693,0.281058 -6.314177,2.194211 -7.656863,5.639434 -1.065134,2.733026 -0.617144,4.240101 0.406884,6.322779 0.512012,1.041336 1.382961,2.369615 3.238541,3.088829 1.855559,0.719227 4.184979,0.110875 5.480996,-0.841322 a 4.5279644,4.4759299 89.039423 0 0 1.464967,-4.32969 c 0.796436,0.769067 1.214022,1.691624 1.219735,2.985962 0.0066,1.503815 -0.645631,3.264703 -1.645906,4.387553 -1.146845,1.287376 -2.640634,2.056052 -4.251161,2.380226 l 1e-6,9.191174 c 4.014687,-0.386174 7.900442,-2.139021 10.900915,-5.507172 2.585426,-2.902244 3.965516,-6.638026 3.948523,-10.489439 -0.017,-3.851413 -1.659732,-8.007503 -5.198567,-10.642364 -2.016586,-1.501462 -4.341027,-2.264387 -6.831155,-2.243375 z m -3.306508,6.561583 a 4.5279644,4.4759299 89.039423 0 0 -1.562784,0.379329 c 0.200625,-0.147401 0.841909,-0.313468 1.562784,-0.379329 z" />
    </g>
  </svg>
);

// DeDial =========================================================================================

class DeDial
{
  static BlockType = 
  {
    title: "DeDial",
    icon,
    category: "widgets",
    edit: DeDial.edit,
    save: DeDial.save,
    attributes:
    {
      value:
      {
        type: "number",
        default: 10,
      },
      fill:
      {
        type: "string",
        default: "none",
      },
      stroke:
      {
        type: "string",
        default: "#000",
      },
      stroke_width:
      {
        type: "string",
        default: "10px",
      },
      style:
      {
        type: "string",
        default: "position:relative;display:inline-block;width:150px;height:150px;color:#000;",
      },
      show_label:
      {
        type: "boolean",
        default: true,
      },
      show_shadow:
      {
        type: "boolean",
        default: true,
      },
      max_value:
      {
        type: "string",
        default: 10,
      },
      style_svg:
      {
        type: "string",
      },
      style_shadow:
      {
        type: "string",
      },
      style_label:
      {
        type: "string",
        default: "position:absolute;left:0;top:0;right:0;bottom:0;display:flex;flex-direction:column;align-items:center;justify-content:center;",
      },
      auto_start:
      {
        type: "boolean",
        default: false,
      },
      auto_stop:
      {
        type: "boolean",
        default: false,
      },
      count_reverse:
      {
        type: "boolean",
        default: false,
      },
      gap_width:
      {
        type: "string",
        default: "1",
      },
      label_postfix:
      {
        type: "string",
        default: "K+",
      },
      label_prefix:
      {
        type: "string",
        default: "$",
      },
      stop_href:
      {
        type: "string",
      },
      tick_width:
      {
        type: "string",
        default: "1",
      },
      viewbox_radius:
      {
        type: "string",
      },
      wait_millis:
      { 
        type: "string",
        default: 100, 
      },
      pause_millis:
      { 
        type: "string",
        default: 3000, 
      },
      label_sub:
      {
        type: "string",
        default: "Sales",
      }
    }
  };

  static Set_Property_Update(ref, props, attr_name, ref_name)
  {
    we.useEffect(On_Prop_Changed, [props.attributes[attr_name]]);
    function On_Prop_Changed()
    {
      if (ref.current && props.attributes[attr_name] != undefined)
      {
        ref.current[ref_name] = props.attributes[attr_name];
      }
    }
  }

  static Set_Style_Update(ref, props, attr_name, ref_name)
  {
    we.useEffect(On_Style_Changed, [props.attributes[attr_name]]);
    function On_Style_Changed()
    {
      if (ref.current && props.attributes[attr_name] != undefined)
      {
        ref.current.style[ref_name] = props.attributes[attr_name];
      }
    }
  }

  static Set_Attribute_Update(ref, props, attr_name, ref_name)
  {
    we.useEffect(On_Attribute_Changed, [props.attributes[attr_name]]);
    function On_Attribute_Changed()
    {
      if (ref.current && props.attributes[attr_name] != undefined)
      {
        ref.current.setAttribute(ref_name, props.attributes[attr_name]);
      }
    }
  }

  static Render_Inspector(props)
  {
    const inspector =
      <wed.InspectorControls>
        <wc.PanelBody title="Value & Labels">
          <wc.TextControl
            label="Value Prefix"
            value={props.attributes.label_prefix}
            onChange={label_prefix => props.setAttributes({ label_prefix })}
          />
          <wc.TextControl
            label="Value"
            value={props.attributes.value}
            onChange={value => props.setAttributes({ value })}
          />
          <wc.TextControl
            label="Value Postfix"
            value={props.attributes.label_postfix}
            onChange={label_postfix => props.setAttributes({ label_postfix })}
          />
          <wc.TextControl
            label="Maximum Value"
            value={props.attributes.max_value}
            onChange={max_value => props.setAttributes({ max_value })}
          />
          <wc.ToggleControl
            label="Show Label"
            checked={props.attributes.show_label}
            onChange={show_label => props.setAttributes({ show_label })}
          />
          <wc.TextControl
            label="Label Text"
            value={props.attributes.label_sub}
            onChange={label_sub => props.setAttributes({ label_sub })}
          />
          <wc.TextareaControl
            label="Label CSS"
            value={props.attributes.style_label}
            onChange={style_label => props.setAttributes({ style_label })}
          />
        </wc.PanelBody>
        <wc.PanelBody title="Dial & Marks" initialOpen={false}>
          <wc.TextControl
            label="Stroke"
            value={props.attributes.stroke}
            onChange={stroke => props.setAttributes({ stroke })}
          />
          <wc.TextControl
            label="Stroke Width"
            value={props.attributes.stroke_width}
            onChange={stroke_width => props.setAttributes({ stroke_width })}
          />
          <wc.TextControl
            label="Mark Width"
            value={props.attributes.tick_width}
            onChange={tick_width => props.setAttributes({ tick_width })}
          />
          <wc.TextControl
            label="Gap Width"
            value={props.attributes.gap_width}
            onChange={gap_width => props.setAttributes({ gap_width })}
          />
          <wc.TextControl
            label="Fill"
            value={props.attributes.fill}
            onChange={fill => props.setAttributes({ fill })}
          />
          <wc.TextControl
            label="Viewbox Radius"
            value={props.attributes.viewbox_radius}
            onChange={viewbox_radius => props.setAttributes({ viewbox_radius })}
          />
          <wc.ToggleControl
            label="Show Inactive Marks"
            checked={props.attributes.show_shadow}
            onChange={show_shadow => props.setAttributes({ show_shadow })}
          />
          <wc.TextareaControl
            label="CSS"
            value={props.attributes.style}
            onChange={style => props.setAttributes({ style })}
          />
          <wc.TextareaControl
            label="Dial CSS"
            value={props.attributes.style_svg}
            onChange={style_svg => props.setAttributes({ style_svg })}
          />
          <wc.TextareaControl
            label="Inactive Marks CSS"
            value={props.attributes.style_shadow}
            onChange={style_shadow => props.setAttributes({ style_shadow })}
          />
        </wc.PanelBody>
        <wc.PanelBody title="Animation" initialOpen={false}>
          <wc.ToggleControl
            label="Auto Start"
            checked={props.attributes.auto_start}
            onChange={auto_start => props.setAttributes({ auto_start })}
          />
          <wc.ToggleControl
            label="Auto Stop"
            checked={props.attributes.auto_stop}
            onChange={auto_stop => props.setAttributes({ auto_stop })}
          />
          <wc.ToggleControl
            label="Count Reverse"
            checked={props.attributes.count_reverse}
            onChange={count_reverse => props.setAttributes({ count_reverse })}
          />
          <wc.TextControl
            label="Framerate Milliseconds"
            value={props.attributes.wait_millis}
            onChange={wait_millis => props.setAttributes({ wait_millis })}
          />
          <wc.TextControl
            label="Pause Milliseconds"
            value={props.attributes.pause_millis}
            onChange={pause_millis => props.setAttributes({ pause_millis })}
          />
          <wc.TextControl
            label="Stop Link"
            value={props.attributes.stop_href}
            onChange={stop_href => props.setAttributes({ stop_href })}
          />
          <wc.Button
            onClick={ () => props.methods.restart() }
            variant="secondary"
            text="Restart"
            style={{ marginRight: "2px" }}
          />
          <wc.Button
            onClick={ () => props.methods.start() }
            variant="secondary"
            text="Start"
            style={{ marginRight: "2px" }}
          />
          <wc.Button
            onClick={ () => props.methods.stop() }
            variant="secondary"
            text="Stop"
          />
        </wc.PanelBody>
      </wed.InspectorControls>;

    return inspector;
  }

  static Build_Styles(attributes)
  {
    let style_str = attributes.style;
    if (attributes.fill)
    {
      style_str += "fill:" + attributes.fill + ";";
    }
    if (attributes.stroke)
    {
      style_str += "stroke:" + attributes.stroke + ";";
    }
    if (attributes.stroke_width)
    {
      style_str += "stroke-width:" + attributes.stroke_width + ";";
    }

    return style_str;
  }

  static Extra_Props(extraProps, blockType, attributes)
  {
    if (blockType.name == 'dulceeng/de-dial') 
    {
      //console.log("Extra_Props().extraProps:", extraProps);
      //console.log("Extra_Props().attributes:", attributes);

      extraProps.style = DeDial.Build_Styles(attributes);
    }
    return extraProps;
  }

  static edit(props)
  {
    const ref = we.createRef();

    we.useEffect(On_Style_Changed, 
      [props.attributes.fill, 
      props.attributes.stroke, 
      props.attributes.stroke_width,
      props.attributes.style]);
    function On_Style_Changed()
    {
      if (ref.current)
      {
        ref.current.style = DeDial.Build_Styles(props.attributes);
      }
    }
    DeDial.Set_Property_Update(ref, props, "value", "value");

    props.methods =
    {
      restart: () => ref.current.restart(),
      start: () => ref.current.start(),
      stop: () => ref.current.stop(),
    };

    const elements =
    [
      DeDial.Render_Inspector(props),
      <de-dial 
        ref={ref} 

        auto-start={props.attributes.auto_start?"true":"false"}
        auto-stop={props.attributes.auto_stop?"true":"false"}
        count-reverse={props.attributes.count_reverse?"true":"false"}
        show-label={props.attributes.show_label?"true":"false"}
        show-shadow={props.attributes.show_shadow?"true":"false"}

        max-value={props.attributes.max_value}
        style-svg={props.attributes.style_svg}
        style-shadow={props.attributes.style_shadow}
        style-label={props.attributes.style_label}
        gap-width={props.attributes.gap_width}
        label-postfix={props.attributes.label_postfix}
        label-prefix={props.attributes.label_prefix}
        stop-href={props.attributes.stop_href}
        tick-width={props.attributes.tick_width}
        viewbox-radius={props.attributes.viewbox_radius}
        wait-millis={props.attributes.wait_millis}
        pause-millis={props.attributes.pause_millis}
        label-sub={props.attributes.label_sub}
      ></de-dial>
    ];

    return elements;
  }

  static save(props)
  {
    //console.log("save().props:", props);

    return <de-dial 
      auto-start={props.attributes.auto_start?"true":"false"}
      auto-stop={props.attributes.auto_stop?"true":"false"}
      count-reverse={props.attributes.count_reverse?"true":"false"}
      show-label={props.attributes.show_label?"true":"false"}
      show-shadow={props.attributes.show_shadow?"true":"false"}

      value={props.attributes.value}
      max-value={props.attributes.max_value}
      style-svg={props.attributes.style_svg}
      style-shadow={props.attributes.style_shadow}
      style-label={props.attributes.style_label}
      gap-width={props.attributes.gap_width}
      label-postfix={props.attributes.label_postfix}
      label-prefix={props.attributes.label_prefix}
      stop-href={props.attributes.stop_href}
      tick-width={props.attributes.tick_width}
      viewbox-radius={props.attributes.viewbox_radius}
      wait-millis={props.attributes.wait_millis}
      pause-millis={props.attributes.pause_millis}
      label-sub={props.attributes.label_sub}
    ></de-dial>;
  }
}
wb.registerBlockType("dulceeng/de-dial", DeDial.BlockType);
wh.addFilter('blocks.getSaveContent.extraProps', 'dulceeng/de-dial-filter', DeDial.Extra_Props);

// DeClock ========================================================================================

class DeClock
{
  static Render_Inspector(props)
  {
    const inspector =
      <wed.InspectorControls>
        <wc.PanelBody title="Clock & Time" initialOpen={true}>
          <wc.TextControl
            label="Hour (1-12)"
            value={props.attributes.hour}
            onChange={hour => props.setAttributes({ hour })}
          />
          <wc.TextControl
            label="Minute (0-59)"
            value={props.attributes.minute}
            onChange={minute => props.setAttributes({ minute })}
          />
          <wc.TextControl
            label="Second (0-59)"
            value={props.attributes.second}
            onChange={second => props.setAttributes({ second })}
          />
          <wc.TextControl
            label="Timezone (IANA Code)"
            value={props.attributes.timezone}
            onChange={timezone => props.setAttributes({ timezone })}
          />
          <wc.ToggleControl
            label="Auto Start"
            checked={props.attributes.auto_start}
            onChange={auto_start => props.setAttributes({ auto_start })}
          />
          <wc.TextareaControl
            label="CSS"
            value={props.attributes.style}
            onChange={style => props.setAttributes({ style })}
          />
          <wc.Button
            onClick={ () => props.methods.start() }
            variant="secondary"
            text="Start"
            style={{ marginRight: "2px" }}
          />
          <wc.Button
            onClick={ () => props.methods.stop() }
            variant="secondary"
            text="Stop"
          />
        </wc.PanelBody>
        <wc.PanelBody title="Clock Hands & Marks" initialOpen={false}>
          <wc.TextareaControl
            label="CSS - Face"
            value={props.attributes.style_face}
            onChange={style_face => props.setAttributes({ style_face })}
          />
          <wc.TextareaControl
            label="CSS - Hand - Hours"
            value={props.attributes.style_hand_hr}
            onChange={style_hand_hr => props.setAttributes({ style_hand_hr })}
          />
          <wc.TextareaControl
            label="CSS - Hand - Minutes"
            value={props.attributes.style_hand_min}
            onChange={style_hand_min => props.setAttributes({ style_hand_min })}
          />
          <wc.TextareaControl
            label="CSS - Hand - Seconds"
            value={props.attributes.style_hand_sec}
            onChange={style_hand_sec => props.setAttributes({ style_hand_sec })}
          />
          <wc.TextareaControl
            label="CSS - Marks - Hours"
            value={props.attributes.style_ticks_hr}
            onChange={style_ticks_hr => props.setAttributes({ style_ticks_hr })}
          />
          <wc.TextareaControl
            label="CSS - Marks - Minutes/Seconds"
            value={props.attributes.style_ticks_min}
            onChange={style_ticks_min => props.setAttributes({ style_ticks_min })}
          />
          <wc.TextareaControl
            label="CSS - Numbers"
            value={props.attributes.style_numbers}
            onChange={style_numbers => props.setAttributes({ style_numbers })}
          />
        </wc.PanelBody>
      </wed.InspectorControls>;

    return inspector;
  }

  static edit(props)
  {
    const ref = we.createRef();
    props.methods =
    {
      start: () => ref.current.start(),
      stop: () => ref.current.stop(),
    };

    const elements =
    [
      DeClock.Render_Inspector(props),
      <de-clock 
        ref={ref} 
        auto-start={props.attributes.auto_start?"true":"false"}
        style-str={props.attributes.style}
        style-face={props.attributes.style_face}
        style-hand-hr={props.attributes.style_hand_hr}
        style-hand-min={props.attributes.style_hand_min}
        style-hand-sec={props.attributes.style_hand_sec}
        style-ticks-hr={props.attributes.style_ticks_hr}
        style-ticks-min={props.attributes.style_ticks_min}
        style-numbers={props.attributes.style_numbers}
        date-hour={props.attributes.hour}
        date-minute={props.attributes.minute}
        date-second={props.attributes.second}
        time-zone={props.attributes.timezone}
      ></de-clock>
    ];

    return elements;
  }

  static save(props)
  {
    const elements =
      <de-clock 
        auto-start={props.attributes.auto_start?"true":"false"}
        style-str={props.attributes.style}
        style-face={props.attributes.style_face}
        style-hand-hr={props.attributes.style_hand_hr}
        style-hand-min={props.attributes.style_hand_min}
        style-hand-sec={props.attributes.style_hand_sec}
        style-ticks-hr={props.attributes.style_ticks_hr}
        style-ticks-min={props.attributes.style_ticks_min}
        style-numbers={props.attributes.style_numbers}
        date-hour={props.attributes.hour}
        date-minute={props.attributes.minute}
        date-second={props.attributes.second}
        time-zone={props.attributes.timezone}
      ></de-clock>;

    return elements;
  }

  static BlockType = 
  {
    title: "DeClock",
    icon,
    category: "widgets",
    edit: DeClock.edit,
    save: DeClock.save,
    attributes:
    {
      auto_start:
      {
        type: "boolean",
        default: true,
      },
      style:
      {
        type: "string",
        default: "display:inline-block;width:200px;height:200px;border-radius:100%;position:relative;",
      },
      style_face:
      {
        type: "string",
        default: "position:absolute;left:0;top:0;width:100%;height:100%;",
      },
      style_hand_hr:
      {
        type: "string",
        default: "stroke:none;fill:#000;",
      },
      style_hand_min:
      {
        type: "string",
        default: "stroke:none;fill:#777;",
      },
      style_hand_sec:
      {
        type: "string",
        default: "stroke:#f00;stroke-width:1px;",
      },
      style_ticks_hr:
      {
        type: "string",
        default: "fill:none;stroke:#000;stroke-width:15px;display:inline-block;width:100%;height:100%;transform:rotate(-1deg);",
      },
      style_ticks_min:
      {
        type: "string",
        default: "fill:none;stroke:#f00;stroke-width:10px;position:absolute;left:0;top:0;width:100%;height:100%;",
      },
      style_numbers:
      {
        type: "string",
        default: "stroke:none;fill:#000;font-size:25px;",
      },
      hour:
      {
        type: "string",
      },
      minute:
      {
        type: "string",
      },
      second:
      {
        type: "string",
      },
      timezone:
      {
        type: "string",
      },
    }
  };
}
wb.registerBlockType("dulceeng/de-clock", DeClock.BlockType);

// DeTimer ========================================================================================

class DeTimer
{
  static BlockType = 
  {
    title: "DeTimer",
    icon,
    category: "widgets",
    edit: DeTimer.edit,
    save: DeTimer.save,
    attributes:
    {
      secs:
      {
        type: "string",
      },
      date:
      {
        type: "string",
      },
      time:
      {
        type: "string",
      },
      label_sec:
      {
        type: "string",
      },
      label_min:
      {
        type: "string",
      },
      label_hr:
      {
        type: "string",
      },
      label_day:
      {
        type: "string",
      },
      show_labels:
      {
        type: "boolean",
        default: true,
      },
      style_label:
      {
        type: "string",
        default: "font-size:1rem;position:absolute;left:0;top:0;right:0;bottom:0;display:flex;justify-content:center;align-items:center;flex-direction:column;",
      },
      style_label_sub:
      {
        type: "string",
      },
      auto_start:
      {
        type: "boolean",
        default: true,
      },
      auto_stop:
      {
        type: "boolean",
        default: false,
      },
      stop_href:
      {
        type: "string",
      },
      style_counter:
      {
        type: "string",
        // CSS - Counter
        default: "position:relative;width:25%;",
      },
      style_shadow:
      {
        type: "string",
      },
      style_str:
      {
        type: "string",
        // CSS
        default: "display:flex;justify-content:center;",
      },
      style_dial:
      {
        type: "string",
        // CSS - Marks (SVG Ticks)
        default: "fill:none;rotate:-91deg;",
      },
      style_anim:
      {
        type: "string",
        // CSS - Border Marks
        default: "position:absolute;left:0;right:0;top:0;stroke-width:3px;stroke:#f00;",
      },
      style_sec:
      {
        type: "string",
      },
      style_min:
      {
        type: "string",
      },
      style_hrs:
      {
        type: "string",
      },
      style_day:
      {
        type: "string",
      },
      style_ticks:
      {
        type: "string",
        // label="CSS - Dial"
        default: "stroke-width:15px;stroke:#000;display:inline-block;width:86%;padding:7%;position:relative;font-size:0;",
      },
    }
  };

  static Render_Inspector(props)
  {
    const inspector =
      <wed.InspectorControls>
        <wc.PanelBody title="Time & Labels" initialOpen={true}>
          <wc.TimePicker.TimeInput
            label="Time & Date"
            value={props.attributes.time}
            is12Hour={true}
            onChange={time => props.setAttributes({ time })}
          />
          <wc.DatePicker
            currentDate={props.attributes.date}
            onChange={date => props.setAttributes({ date })}
          />
          <wc.TextControl
            label="Seconds"
            value={props.attributes.secs}
            onChange={secs => props.setAttributes({ secs })}
          />
          <wc.TextControl
            label="Label - Seconds"
            value={props.attributes.label_sec}
            onChange={label_sec => props.setAttributes({ label_sec })}
          />
          <wc.TextControl
            label="Label - Minutes"
            value={props.attributes.label_min}
            onChange={label_min => props.setAttributes({ label_min })}
          />
          <wc.TextControl
            label="Label - Hours"
            value={props.attributes.label_hr}
            onChange={label_hr => props.setAttributes({ label_hr })}
          />
          <wc.TextControl
            label="Label - Days"
            value={props.attributes.label_day}
            onChange={label_day => props.setAttributes({ label_day })}
          />
          <wc.TextareaControl
            label="CSS - Label"
            value={props.attributes.style_label}
            onChange={style_label => props.setAttributes({ style_label })}
          />
          <wc.TextareaControl
            label="CSS - Sublabel"
            value={props.attributes.style_label_sub}
            onChange={style_label_sub => props.setAttributes({ style_label_sub })}
          />
        </wc.PanelBody>
        <wc.PanelBody title="Animation" initialOpen={false}>
          <wc.ToggleControl
            label="Auto Start"
            checked={props.attributes.auto_start}
            onChange={auto_start => props.setAttributes({ auto_start })}
          />
          <wc.ToggleControl
            label="Auto Stop"
            checked={props.attributes.auto_stop}
            onChange={auto_stop => props.setAttributes({ auto_stop })}
          />
          <wc.TextControl
            label="Stop URL"
            value={props.attributes.stop_href}
            onChange={stop_href => props.setAttributes({ stop_href })}
          />
        </wc.PanelBody>
        <wc.PanelBody title="Styling" initialOpen={false}>
          <wc.TextareaControl
            label="CSS - Counter"
            value={props.attributes.style_counter}
            onChange={style_counter => props.setAttributes({ style_counter })}
          />
          <wc.TextareaControl
            label="CSS - Inactive Marks"
            value={props.attributes.style_shadow}
            onChange={style_shadow => props.setAttributes({ style_shadow })}
          />
          <wc.TextareaControl
            label="CSS"
            value={props.attributes.style_str}
            onChange={style_str => props.setAttributes({ style_str })}
          />
          <wc.TextareaControl
            label="CSS - Marks (SVG Ticks)"
            value={props.attributes.style_dial}
            onChange={style_dial => props.setAttributes({ style_dial })}
          />
          <wc.TextareaControl
            label="CSS - Border Marks"
            value={props.attributes.style_anim}
            onChange={style_anim => props.setAttributes({ style_anim })}
          />
          <wc.TextareaControl
            label="CSS - Dial"
            value={props.attributes.style_ticks}
            onChange={style_ticks => props.setAttributes({ style_ticks })}
          />
          <wc.TextareaControl
            label="CSS - Seconds"
            value={props.attributes.style_sec}
            onChange={style_sec => props.setAttributes({ style_sec })}
          />
          <wc.TextareaControl
            label="CSS - Minutes"
            value={props.attributes.style_min}
            onChange={style_min => props.setAttributes({ style_min })}
          />
          <wc.TextareaControl
            label="CSS - Hours"
            value={props.attributes.style_hrs}
            onChange={style_hrs => props.setAttributes({ style_hrs })}
          />
          <wc.TextareaControl
            label="CSS - Days"
            value={props.attributes.style_day}
            onChange={style_day => props.setAttributes({ style_day })}
          />
        </wc.PanelBody>
      </wed.InspectorControls>;

    return inspector;
  }

  static To_Attributes(props)
  {
    let res = {};

    if (
      props.attributes.time != undefined && 
      props.attributes.time.hours != undefined && 
      props.attributes.time.minutes != undefined)
    {
      res.time = props.attributes.time.hours + ":" + props.attributes.time.minutes + ":0";
    }

    if (typeof props.attributes.date === 'string' || props.attributes.date instanceof String)
    {
      const tokens = props.attributes.date.split("T");
      res.date = tokens[0];
    }

    res.millis = (parseInt(props.attributes.secs) * 1000) || null;

    return res;
  }

  static edit(props)
  {
    const ref = we.createRef();
    props.methods =
    {
      start: () => ref.current.start(),
      stop: () => ref.current.stop(),
    };

    const attributes = DeTimerCompact.To_Attributes(props);

    const elements =
    [
      DeTimer.Render_Inspector(props),
      <de-timer 
        ref={ref} 

        millis={attributes.millis}
        date={attributes.date}
        time={attributes.time}
        label-sec={props.attributes.label_sec}
        label-min={props.attributes.label_min}
        label-hr={props.attributes.label_hr}
        label-day={props.attributes.label_day}
        show-labels={props.attributes.show_labels}
        style-label={props.attributes.style_label}
        style-label-sub={props.attributes.style_label_sub}

        auto-start={props.attributes.auto_start?"true":"false"}
        auto-stop={props.attributes.auto_stop?"true":"false"}
        stop-href={props.attributes.stop_href}

        style-counter={props.attributes.style_counter}
        style-shadow={props.attributes.style_shadow}
        style-str={props.attributes.style_str}
        style-dial={props.attributes.style_dial}
        style-anim={props.attributes.style_anim}
        style-sec={props.attributes.style_sec}
        style-min={props.attributes.style_min}
        style-hrs={props.attributes.style_hrs}
        style-day={props.attributes.style_day}
        style-ticks={props.attributes.style_ticks}
      ></de-timer>
    ];

    return elements;
  }

  static save(props)
  {
    const attributes = DeTimerCompact.To_Attributes(props);

    const elements =
    [
      <de-timer 
        millis={attributes.millis}
        date={attributes.date}
        time={attributes.time}
        label-sec={props.attributes.label_sec}
        label-min={props.attributes.label_min}
        label-hr={props.attributes.label_hr}
        label-day={props.attributes.label_day}
        show-labels={props.attributes.show_labels}
        style-label={props.attributes.style_label}
        style-label-sub={props.attributes.style_label_sub}

        auto-start={props.attributes.auto_start?"true":"false"}
        auto-stop={props.attributes.auto_stop?"true":"false"}
        stop-href={props.attributes.stop_href}

        style-counter={props.attributes.style_counter}
        style-shadow={props.attributes.style_shadow}
        style-str={props.attributes.style_str}
        style-dial={props.attributes.style_dial}
        style-anim={props.attributes.style_anim}
        style-sec={props.attributes.style_sec}
        style-min={props.attributes.style_min}
        style-hrs={props.attributes.style_hrs}
        style-day={props.attributes.style_day}
        style-ticks={props.attributes.style_ticks}
      ></de-timer>
    ];

    return elements;
  }
}
wb.registerBlockType("dulceeng/de-timer", DeTimer.BlockType);

// DeTimerCompact =================================================================================

class DeTimerCompact
{
  static BlockId = "dulceeng/de-timer-compact";
  static BlockType = 
  {
    title: "DeTimer Compact",
    icon,
    category: "widgets",
    supports: 
    {
      align: true, 
      spacing: 
      {
        padding: true,
        margin: true,
      },
      dimensions: 
      {
        minWidth: '200px', 
      },  
      color: 
      {
        text: true,
        background: true,
        gradients: true,
      },
      typography: 
      {
        lineHeight: true,
        fontStyle: true,
        fontWeight: true,
      },
    },
    edit: DeTimerCompact.edit,
    save: DeTimerCompact.save,
    attributes:
    {
      secs:
      {
        type: "string",
      },
      auto_start:
      {
        type: "boolean",
        default: true,
      },
      auto_stop:
      {
        type: "boolean",
        default: false,
      },
      stop_href:
      {
        type: "string",
      },
      date:
      {
        type: "string",
      },
      time:
      {
        type: "string",
      },
      sublabel_text:
      {
        type: "string",
        default: "Time Elapsed",
      },
      style_str:
      {
        type: "string",
        // CSS
        default: "fill:none;stroke-width:10px;display:block;position:relative;width:250px;font-size:0;",
      },
      style_hrs:
      {
        type: "string",
        // CSS - Hours Dial
        default: "position:absolute;top:0;left:0;bottom:0;right:0;stroke:#000;padding:4%;",
      },
      style_mins:
      {
        type: "string",
        // CSS - Minutes Dial
        default: "position:absolute;top:0;left:0;bottom:0;right:0;stroke:#000;padding:10%;",
      },
      style_secs:
      {
        type: "string",
        // CSS - Seconds Dial
        default: "position:absolute;top:0;left:0;bottom:0;right:0;stroke:#000;padding:15.5%;",
      },
      style_anim_border:
      {
        type: "string",
        // CSS - Border Dial
        default: "stroke:#f00;stroke-width:2px;display:block;animation:10s linear 0s infinite normal none running dedial-spin;",
      },
      style_label:
      {
        type: "string",
        // CSS - Label
        default: "position:absolute;top:0;left:0;bottom:0;right:0;width:100%;display:flex;justify-content:center;align-items:center;font-size:1.5rem;font-family:monospace;flex-direction:column;",
      },
      style_shadow:
      {
        type: "string",
        // CSS - Inactive Marks
        default: "stroke:#0002;",
      },
      style_sublabel:
      {
        type: "string",
        // CSS - Sub-label
        default: "font-size:1rem;",
      },
      style_dial:
      {
        type: "string",
        // CSS - Active Marks
        default: "rotate:-91deg;",
      },
    }
  };

  static Render_Inspector(props)
  {
    const inspector =
      <wed.InspectorControls>
        <wc.PanelBody title="Time & Labels" initialOpen={true}>
          <wc.TimePicker.TimeInput
            label="Time & Date"
            value={props.attributes.time}
            is12Hour={true}
            onChange={time => props.setAttributes({ time })}
          />
          <wc.DatePicker
            currentDate={props.attributes.date}
            onChange={date => props.setAttributes({ date })}
          />
          <wc.TextControl
            label="Label"
            value={props.attributes.sublabel_text}
            onChange={sublabel_text => props.setAttributes({ sublabel_text })}
          />
          <wc.TextControl
            label="Seconds"
            value={props.attributes.secs}
            onChange={secs => props.setAttributes({ secs })}
          />
        </wc.PanelBody>
        <wc.PanelBody title="Animation" initialOpen={false}>
          <wc.ToggleControl
            label="Auto Start"
            checked={props.attributes.auto_start}
            onChange={auto_start => props.setAttributes({ auto_start })}
          />
          <wc.ToggleControl
            label="Auto Stop"
            checked={props.attributes.auto_stop}
            onChange={auto_stop => props.setAttributes({ auto_stop })}
          />
          <wc.TextControl
            label="Stop URL"
            value={props.attributes.stop_href}
            onChange={stop_href => props.setAttributes({ stop_href })}
          />
        </wc.PanelBody>
        <wc.PanelBody title="Styling" initialOpen={false}>
        <wc.TextareaControl
            label="CSS"
            value={props.attributes.style_str}
            onChange={style_str => props.setAttributes({ style_str })}
          />
          <wc.TextareaControl
            label="CSS - Hours Dial"
            value={props.attributes.style_hrs}
            onChange={style_hrs => props.setAttributes({ style_hrs })}
          />
          <wc.TextareaControl
            label="CSS - Minutes Dial"
            value={props.attributes.style_mins}
            onChange={style_mins => props.setAttributes({ style_mins })}
          />
          <wc.TextareaControl
            label="CSS - Seconds Dial"
            value={props.attributes.style_secs}
            onChange={style_secs => props.setAttributes({ style_secs })}
          />
          <wc.TextareaControl
            label="CSS - Border Dial"
            value={props.attributes.style_anim_border}
            onChange={style_anim_border => props.setAttributes({ style_anim_border })}
          />
          <wc.TextareaControl
            label="CSS - Label"
            value={props.attributes.style_label}
            onChange={style_label => props.setAttributes({ style_label })}
          />
          <wc.TextareaControl
            label="CSS - Sub-label"
            value={props.attributes.style_sublabel}
            onChange={style_sublabel => props.setAttributes({ style_sublabel })}
          />
          <wc.TextareaControl
            label="CSS - Inactive Marks"
            value={props.attributes.style_shadow}
            onChange={style_shadow => props.setAttributes({ style_shadow })}
          />
          <wc.TextareaControl
            label="CSS - Active Marks"
            value={props.attributes.style_dial}
            onChange={style_dial => props.setAttributes({ style_dial })}
          />
        </wc.PanelBody>
      </wed.InspectorControls>;

    return inspector;
  }

  static To_Attributes(props)
  {
    let res = {};

    if (
      props.attributes.time != undefined && 
      props.attributes.time.hours != undefined && 
      props.attributes.time.minutes != undefined)
    {
      res.time = props.attributes.time.hours + ":" + props.attributes.time.minutes + ":0";
    }

    if (typeof props.attributes.date === 'string' || props.attributes.date instanceof String)
    {
      const tokens = props.attributes.date.split("T");
      res.date = tokens[0];
    }

    res.millis = (parseInt(props.attributes.secs) * 1000) || null;

    return res;
  }

  static edit(props)
  {
    const ref = we.createRef();
    props.methods =
    {
      start: () => ref.current.start(),
      stop: () => ref.current.stop(),
    };

    const attributes = DeTimerCompact.To_Attributes(props);

    const elements =
    [
      DeTimerCompact.Render_Inspector(props),
      <de-timer-compact 
        ref={ref} 

        millis={attributes.millis}
        date={attributes.date}
        time={attributes.time}
        sublabel-text={props.attributes.sublabel_text}
        auto-start={props.attributes.auto_start?"true":"false"}
        auto-stop={props.attributes.auto_stop?"true":"false"}
        stop-href={props.attributes.stop_href}
        style-str={props.attributes.style_str}
        style-hrs={props.attributes.style_hrs}
        style-mins={props.attributes.style_mins}
        style-secs={props.attributes.style_secs}
        style-anim-border={props.attributes.style_anim_border}
        style-label={props.attributes.style_label}
        style-shadow={props.attributes.style_shadow}
        style-sublabel={props.attributes.style_sublabel}
        style-dial={props.attributes.style_dial}
      ></de-timer-compact>
    ];

    return elements;
  }

  static save(props)
  {
    const attributes = DeTimerCompact.To_Attributes(props);

    const elements =
    [
      <de-timer-compact 
        millis={attributes.millis}
        date={attributes.date}
        time={attributes.time}
        sublabel-text={props.attributes.sublabel_text}
        auto-start={props.attributes.auto_start?"true":"false"}
        auto-stop={props.attributes.auto_stop?"true":"false"}
        stop-href={props.attributes.stop_href}
        style-str={props.attributes.style_str}
        style-hrs={props.attributes.style_hrs}
        style-mins={props.attributes.style_mins}
        style-secs={props.attributes.style_secs}
        style-anim-border={props.attributes.style_anim_border}
        style-label={props.attributes.style_label}
        style-shadow={props.attributes.style_shadow}
        style-sublabel={props.attributes.style_sublabel}
        style-dial={props.attributes.style_dial}
      ></de-timer-compact>
    ];

    return elements;
  }
}
wb.registerBlockType(DeTimerCompact.BlockId, DeTimerCompact.BlockType);
