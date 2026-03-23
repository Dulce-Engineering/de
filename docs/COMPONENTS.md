# Component Documentation

Auto-generated from JSDoc comments.

## Classes

<dl>
<dt><a href="#DeDialogAlert">DeDialogAlert</a> ⇐ <code>HTMLElement</code></dt>
<dd></dd>
<dt><a href="#DeDialogAlert">DeDialogAlert</a></dt>
<dd></dd>
<dt><a href="#DeLineChart">DeLineChart</a> ⇐ <code>HTMLElement</code></dt>
<dd></dd>
<dt><a href="#DeLineChart">DeLineChart</a></dt>
<dd></dd>
</dl>

<a name="DeDialogAlert"></a>

## DeDialogAlert ⇐ <code>HTMLElement</code>
**Kind**: global class  
**Extends**: <code>HTMLElement</code>  
**Slot**: <code>HTMLElement</code> header - The dialog header content (optional)  
**Slot**: <code>HTMLElement</code> body - The dialog body/message content (optional)  
**Attr**: <code>string</code> label-ok - Custom label for the OK button (default: "OK")  

* [DeDialogAlert](#DeDialogAlert) ⇐ <code>HTMLElement</code>
    * [new DeDialogAlert()](#new_DeDialogAlert_new)
    * [new DeDialogAlert()](#new_DeDialogAlert_new)
    * [.Show()](#DeDialogAlert+Show)
    * [.Alert([msg])](#DeDialogAlert+Alert)

<a name="new_DeDialogAlert_new"></a>

### new DeDialogAlert()
DeDialogAlert is a custom HTML element that displays an alert dialog box.It provides a simple modal dialog with a message and an OK button.

**Example**  
```js
<de-dialog-alert label-ok="Accept">  <h2 slot="header">Alert Title</h2>  <p slot="body">Alert message content</p></de-dialog-alert>
```
<a name="new_DeDialogAlert_new"></a>

### new DeDialogAlert()
Creates a new DeDialogAlert instance.Initializes the component and binds event handlers.

<a name="DeDialogAlert+Show"></a>

### deDialogAlert.Show()
Shows the alert dialog.This is an alias for the Alert() method.

**Kind**: instance method of [<code>DeDialogAlert</code>](#DeDialogAlert)  
<a name="DeDialogAlert+Alert"></a>

### deDialogAlert.Alert([msg])
Displays an alert dialog with the specified message.If no message is provided, displays the content from the slot.

**Kind**: instance method of [<code>DeDialogAlert</code>](#DeDialogAlert)  

| Param | Type | Description |
| --- | --- | --- |
| [msg] | <code>string</code> | Optional message to display in the alert |

<a name="DeDialogAlert"></a>

## DeDialogAlert
**Kind**: global class  

* [DeDialogAlert](#DeDialogAlert)
    * [new DeDialogAlert()](#new_DeDialogAlert_new)
    * [new DeDialogAlert()](#new_DeDialogAlert_new)
    * [.Show()](#DeDialogAlert+Show)
    * [.Alert([msg])](#DeDialogAlert+Alert)

<a name="new_DeDialogAlert_new"></a>

### new DeDialogAlert()
DeDialogAlert is a custom HTML element that displays an alert dialog box.It provides a simple modal dialog with a message and an OK button.

**Example**  
```js
<de-dialog-alert label-ok="Accept">  <h2 slot="header">Alert Title</h2>  <p slot="body">Alert message content</p></de-dialog-alert>
```
<a name="new_DeDialogAlert_new"></a>

### new DeDialogAlert()
Creates a new DeDialogAlert instance.Initializes the component and binds event handlers.

<a name="DeDialogAlert+Show"></a>

### deDialogAlert.Show()
Shows the alert dialog.This is an alias for the Alert() method.

**Kind**: instance method of [<code>DeDialogAlert</code>](#DeDialogAlert)  
<a name="DeDialogAlert+Alert"></a>

### deDialogAlert.Alert([msg])
Displays an alert dialog with the specified message.If no message is provided, displays the content from the slot.

**Kind**: instance method of [<code>DeDialogAlert</code>](#DeDialogAlert)  

| Param | Type | Description |
| --- | --- | --- |
| [msg] | <code>string</code> | Optional message to display in the alert |

<a name="DeLineChart"></a>

## DeLineChart ⇐ <code>HTMLElement</code>
**Kind**: global class  
**Extends**: <code>HTMLElement</code>  
**Emits**: <code>point-selected - Fired when user clicks on chart,event: provides nearest data points for all series</code>  
**Slot**: <code>HTMLElement</code> title - Custom title content (optional, overrides title attribute)  
**Attr**: <code>string</code> title - Chart title text (default: "Title")  
**Attr**: <code>string</code> x-label - X-axis label text (default: "X Axis")  
**Attr**: <code>string</code> y-label - Y-axis label text (default: "Y Axis")  

* [DeLineChart](#DeLineChart) ⇐ <code>HTMLElement</code>
    * [new DeLineChart()](#new_DeLineChart_new)
    * [new DeLineChart()](#new_DeLineChart_new)
    * [.items](#DeLineChart+items)
    * [.highlight_start](#DeLineChart+highlight_start)
    * [.highlight_end](#DeLineChart+highlight_end)
    * [.attributeChangedCallback(name, old_value, new_value)](#DeLineChart+attributeChangedCallback)
    * [.Set_Highlight(svg_range)](#DeLineChart+Set_Highlight)
    * [.Get_Highlight()](#DeLineChart+Get_Highlight) ⇒ <code>Object</code> \| <code>null</code> \| <code>number</code> \| <code>number</code>
    * [.Set_Bounds()](#DeLineChart+Set_Bounds)
    * [.Map_Data_To_SVG_Point(data)](#DeLineChart+Map_Data_To_SVG_Point) ⇒ <code>Object</code> \| <code>number</code> \| <code>number</code>
    * [.Map_SVG_Point_To_Data(svg_pt)](#DeLineChart+Map_SVG_Point_To_Data) ⇒ <code>Object</code> \| <code>number</code> \| <code>number</code>
    * [.Nearest_Y_For_X(series, x)](#DeLineChart+Nearest_Y_For_X) ⇒ <code>Object</code> \| <code>null</code> \| <code>number</code> \| <code>number</code>
    * [.Find_Nearest_Point(clickX, clickY)](#DeLineChart+Find_Nearest_Point) ⇒ <code>Object</code> \| <code>null</code> \| <code>number</code> \| <code>number</code> \| <code>string</code>

<a name="new_DeLineChart_new"></a>

### new DeLineChart()
DeLineChart is a custom HTML element that renders interactive line charts using SVG.It supports multiple data series, axis labels, highlighting ranges, and click interactions.The chart automatically scales data to fit the viewport and provides smooth curve interpolation.

**Example**  
```js
<de-line-chart title="Sales Data" x-label="Time" y-label="Revenue">  <button slot="title">Custom Title Button</button></de-line-chart>// Set data programmaticallyconst chart = document.querySelector('de-line-chart');chart.items = [  { x: 1000, y: 50 },  // timestamp, value  { x: 2000, y: 75 },  { x: 3000, y: 60 }];
```
<a name="new_DeLineChart_new"></a>

### new DeLineChart()
Creates a new DeLineChart instance.Initializes the component and binds event handlers.

<a name="DeLineChart+items"></a>

### deLineChart.items
Sets the data series to be displayed in the chart.Data should be an array of objects with x and y properties.Automatically re-renders the chart when set.

**Kind**: instance property of [<code>DeLineChart</code>](#DeLineChart)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Array.&lt;{x: number, y: number}&gt;</code> | Array of data points with x,y coordinates |

<a name="DeLineChart+highlight_start"></a>

### deLineChart.highlight\_start
Sets the start position of the highlight range as a percentage (0-100).Updates the visual highlight overlay on the chart.

**Kind**: instance property of [<code>DeLineChart</code>](#DeLineChart)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>number</code> | Start position as percentage (0-100) |

<a name="DeLineChart+highlight_end"></a>

### deLineChart.highlight\_end
Sets the end position of the highlight range as a percentage (0-100).Updates the visual highlight overlay on the chart.

**Kind**: instance property of [<code>DeLineChart</code>](#DeLineChart)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>number</code> | End position as percentage (0-100) |

<a name="DeLineChart+attributeChangedCallback"></a>

### deLineChart.attributeChangedCallback(name, old_value, new_value)
Handles changes to observed attributes.Currently responds to 'title' attribute changes by updating the title element.

**Kind**: instance method of [<code>DeLineChart</code>](#DeLineChart)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of the attribute that changed |
| old_value | <code>string</code> | Previous value of the attribute |
| new_value | <code>string</code> | New value of the attribute |

<a name="DeLineChart+Set_Highlight"></a>

### deLineChart.Set\_Highlight(svg_range)
Updates the visual highlight overlay on the chart.Validates the range and applies it to the highlight rectangle element.

**Kind**: instance method of [<code>DeLineChart</code>](#DeLineChart)  

| Param | Type | Description |
| --- | --- | --- |
| svg_range | <code>Object</code> | Range object with x1 and x2 properties |
| svg_range.x1 | <code>number</code> | Start X coordinate in SVG space |
| svg_range.x2 | <code>number</code> | End X coordinate in SVG space |

<a name="DeLineChart+Get_Highlight"></a>

### deLineChart.Get\_Highlight() ⇒ <code>Object</code> \| <code>null</code> \| <code>number</code> \| <code>number</code>
Gets the current highlight range from the visual highlight element.

**Kind**: instance method of [<code>DeLineChart</code>](#DeLineChart)  
**Returns**: <code>Object</code> \| <code>null</code> - Range object with x1 and x2 properties, or null if no highlight is active<code>number</code> - .x1 - Start X coordinate in SVG space<code>number</code> - .x2 - End X coordinate in SVG space  
<a name="DeLineChart+Set_Bounds"></a>

### deLineChart.Set\_Bounds()
Calculates and sets the data bounds for all series in the chart.Determines min/max values for X and Y axes across all data points.This information is used for scaling data to fit the chart viewport.

**Kind**: instance method of [<code>DeLineChart</code>](#DeLineChart)  
<a name="DeLineChart+Map_Data_To_SVG_Point"></a>

### deLineChart.Map\_Data\_To\_SVG\_Point(data) ⇒ <code>Object</code> \| <code>number</code> \| <code>number</code>
Maps a data point to SVG coordinates within the chart viewport.Scales the data point based on the calculated data bounds.

**Kind**: instance method of [<code>DeLineChart</code>](#DeLineChart)  
**Returns**: <code>Object</code> - SVG point with x and y properties<code>number</code> - .x - X coordinate in SVG space<code>number</code> - .y - Y coordinate in SVG space  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Data point with x and y properties |
| data.x | <code>number</code> | X coordinate in data space |
| data.y | <code>number</code> | Y coordinate in data space |

<a name="DeLineChart+Map_SVG_Point_To_Data"></a>

### deLineChart.Map\_SVG\_Point\_To\_Data(svg_pt) ⇒ <code>Object</code> \| <code>number</code> \| <code>number</code>
Maps an SVG point back to data coordinates.Converts viewport coordinates back to original data scale.

**Kind**: instance method of [<code>DeLineChart</code>](#DeLineChart)  
**Returns**: <code>Object</code> - Data point with x and y properties<code>number</code> - .x - X coordinate in data space<code>number</code> - .y - Y coordinate in data space  

| Param | Type | Description |
| --- | --- | --- |
| svg_pt | <code>Object</code> | SVG point with x and y properties |
| svg_pt.x | <code>number</code> | X coordinate in SVG space |
| svg_pt.y | <code>number</code> | Y coordinate in SVG space |

<a name="DeLineChart+Nearest_Y_For_X"></a>

### deLineChart.Nearest\_Y\_For\_X(series, x) ⇒ <code>Object</code> \| <code>null</code> \| <code>number</code> \| <code>number</code>
Finds the data point in a series with the X coordinate closest to the given value.Used for interpolating Y values when clicking on the chart.

**Kind**: instance method of [<code>DeLineChart</code>](#DeLineChart)  
**Returns**: <code>Object</code> \| <code>null</code> - Nearest data point or null if series is empty<code>number</code> - .x - X coordinate of nearest point<code>number</code> - .y - Y coordinate of nearest point  

| Param | Type | Description |
| --- | --- | --- |
| series | <code>Array.&lt;{x: number, y: number}&gt;</code> | Array of data points |
| x | <code>number</code> | Target X coordinate to find nearest point for |

<a name="DeLineChart+Find_Nearest_Point"></a>

### deLineChart.Find\_Nearest\_Point(clickX, clickY) ⇒ <code>Object</code> \| <code>null</code> \| <code>number</code> \| <code>number</code> \| <code>string</code>
Finds the nearest data point across all series to the given coordinates.Used for click interactions to determine which data point was clicked.

**Kind**: instance method of [<code>DeLineChart</code>](#DeLineChart)  
**Returns**: <code>Object</code> \| <code>null</code> - Nearest point information or null if no data<code>number</code> - .x - X coordinate of nearest point<code>number</code> - .y - Y coordinate of nearest point<code>string</code> - .series - Key/name of the series containing the point  

| Param | Type | Description |
| --- | --- | --- |
| clickX | <code>number</code> | X coordinate of click in data space |
| clickY | <code>number</code> | Y coordinate of click in data space |

<a name="DeLineChart"></a>

## DeLineChart
**Kind**: global class  

* [DeLineChart](#DeLineChart)
    * [new DeLineChart()](#new_DeLineChart_new)
    * [new DeLineChart()](#new_DeLineChart_new)
    * [.items](#DeLineChart+items)
    * [.highlight_start](#DeLineChart+highlight_start)
    * [.highlight_end](#DeLineChart+highlight_end)
    * [.attributeChangedCallback(name, old_value, new_value)](#DeLineChart+attributeChangedCallback)
    * [.Set_Highlight(svg_range)](#DeLineChart+Set_Highlight)
    * [.Get_Highlight()](#DeLineChart+Get_Highlight) ⇒ <code>Object</code> \| <code>null</code> \| <code>number</code> \| <code>number</code>
    * [.Set_Bounds()](#DeLineChart+Set_Bounds)
    * [.Map_Data_To_SVG_Point(data)](#DeLineChart+Map_Data_To_SVG_Point) ⇒ <code>Object</code> \| <code>number</code> \| <code>number</code>
    * [.Map_SVG_Point_To_Data(svg_pt)](#DeLineChart+Map_SVG_Point_To_Data) ⇒ <code>Object</code> \| <code>number</code> \| <code>number</code>
    * [.Nearest_Y_For_X(series, x)](#DeLineChart+Nearest_Y_For_X) ⇒ <code>Object</code> \| <code>null</code> \| <code>number</code> \| <code>number</code>
    * [.Find_Nearest_Point(clickX, clickY)](#DeLineChart+Find_Nearest_Point) ⇒ <code>Object</code> \| <code>null</code> \| <code>number</code> \| <code>number</code> \| <code>string</code>

<a name="new_DeLineChart_new"></a>

### new DeLineChart()
DeLineChart is a custom HTML element that renders interactive line charts using SVG.It supports multiple data series, axis labels, highlighting ranges, and click interactions.The chart automatically scales data to fit the viewport and provides smooth curve interpolation.

**Example**  
```js
<de-line-chart title="Sales Data" x-label="Time" y-label="Revenue">  <button slot="title">Custom Title Button</button></de-line-chart>// Set data programmaticallyconst chart = document.querySelector('de-line-chart');chart.items = [  { x: 1000, y: 50 },  // timestamp, value  { x: 2000, y: 75 },  { x: 3000, y: 60 }];
```
<a name="new_DeLineChart_new"></a>

### new DeLineChart()
Creates a new DeLineChart instance.Initializes the component and binds event handlers.

<a name="DeLineChart+items"></a>

### deLineChart.items
Sets the data series to be displayed in the chart.Data should be an array of objects with x and y properties.Automatically re-renders the chart when set.

**Kind**: instance property of [<code>DeLineChart</code>](#DeLineChart)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Array.&lt;{x: number, y: number}&gt;</code> | Array of data points with x,y coordinates |

<a name="DeLineChart+highlight_start"></a>

### deLineChart.highlight\_start
Sets the start position of the highlight range as a percentage (0-100).Updates the visual highlight overlay on the chart.

**Kind**: instance property of [<code>DeLineChart</code>](#DeLineChart)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>number</code> | Start position as percentage (0-100) |

<a name="DeLineChart+highlight_end"></a>

### deLineChart.highlight\_end
Sets the end position of the highlight range as a percentage (0-100).Updates the visual highlight overlay on the chart.

**Kind**: instance property of [<code>DeLineChart</code>](#DeLineChart)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>number</code> | End position as percentage (0-100) |

<a name="DeLineChart+attributeChangedCallback"></a>

### deLineChart.attributeChangedCallback(name, old_value, new_value)
Handles changes to observed attributes.Currently responds to 'title' attribute changes by updating the title element.

**Kind**: instance method of [<code>DeLineChart</code>](#DeLineChart)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | Name of the attribute that changed |
| old_value | <code>string</code> | Previous value of the attribute |
| new_value | <code>string</code> | New value of the attribute |

<a name="DeLineChart+Set_Highlight"></a>

### deLineChart.Set\_Highlight(svg_range)
Updates the visual highlight overlay on the chart.Validates the range and applies it to the highlight rectangle element.

**Kind**: instance method of [<code>DeLineChart</code>](#DeLineChart)  

| Param | Type | Description |
| --- | --- | --- |
| svg_range | <code>Object</code> | Range object with x1 and x2 properties |
| svg_range.x1 | <code>number</code> | Start X coordinate in SVG space |
| svg_range.x2 | <code>number</code> | End X coordinate in SVG space |

<a name="DeLineChart+Get_Highlight"></a>

### deLineChart.Get\_Highlight() ⇒ <code>Object</code> \| <code>null</code> \| <code>number</code> \| <code>number</code>
Gets the current highlight range from the visual highlight element.

**Kind**: instance method of [<code>DeLineChart</code>](#DeLineChart)  
**Returns**: <code>Object</code> \| <code>null</code> - Range object with x1 and x2 properties, or null if no highlight is active<code>number</code> - .x1 - Start X coordinate in SVG space<code>number</code> - .x2 - End X coordinate in SVG space  
<a name="DeLineChart+Set_Bounds"></a>

### deLineChart.Set\_Bounds()
Calculates and sets the data bounds for all series in the chart.Determines min/max values for X and Y axes across all data points.This information is used for scaling data to fit the chart viewport.

**Kind**: instance method of [<code>DeLineChart</code>](#DeLineChart)  
<a name="DeLineChart+Map_Data_To_SVG_Point"></a>

### deLineChart.Map\_Data\_To\_SVG\_Point(data) ⇒ <code>Object</code> \| <code>number</code> \| <code>number</code>
Maps a data point to SVG coordinates within the chart viewport.Scales the data point based on the calculated data bounds.

**Kind**: instance method of [<code>DeLineChart</code>](#DeLineChart)  
**Returns**: <code>Object</code> - SVG point with x and y properties<code>number</code> - .x - X coordinate in SVG space<code>number</code> - .y - Y coordinate in SVG space  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Object</code> | Data point with x and y properties |
| data.x | <code>number</code> | X coordinate in data space |
| data.y | <code>number</code> | Y coordinate in data space |

<a name="DeLineChart+Map_SVG_Point_To_Data"></a>

### deLineChart.Map\_SVG\_Point\_To\_Data(svg_pt) ⇒ <code>Object</code> \| <code>number</code> \| <code>number</code>
Maps an SVG point back to data coordinates.Converts viewport coordinates back to original data scale.

**Kind**: instance method of [<code>DeLineChart</code>](#DeLineChart)  
**Returns**: <code>Object</code> - Data point with x and y properties<code>number</code> - .x - X coordinate in data space<code>number</code> - .y - Y coordinate in data space  

| Param | Type | Description |
| --- | --- | --- |
| svg_pt | <code>Object</code> | SVG point with x and y properties |
| svg_pt.x | <code>number</code> | X coordinate in SVG space |
| svg_pt.y | <code>number</code> | Y coordinate in SVG space |

<a name="DeLineChart+Nearest_Y_For_X"></a>

### deLineChart.Nearest\_Y\_For\_X(series, x) ⇒ <code>Object</code> \| <code>null</code> \| <code>number</code> \| <code>number</code>
Finds the data point in a series with the X coordinate closest to the given value.Used for interpolating Y values when clicking on the chart.

**Kind**: instance method of [<code>DeLineChart</code>](#DeLineChart)  
**Returns**: <code>Object</code> \| <code>null</code> - Nearest data point or null if series is empty<code>number</code> - .x - X coordinate of nearest point<code>number</code> - .y - Y coordinate of nearest point  

| Param | Type | Description |
| --- | --- | --- |
| series | <code>Array.&lt;{x: number, y: number}&gt;</code> | Array of data points |
| x | <code>number</code> | Target X coordinate to find nearest point for |

<a name="DeLineChart+Find_Nearest_Point"></a>

### deLineChart.Find\_Nearest\_Point(clickX, clickY) ⇒ <code>Object</code> \| <code>null</code> \| <code>number</code> \| <code>number</code> \| <code>string</code>
Finds the nearest data point across all series to the given coordinates.Used for click interactions to determine which data point was clicked.

**Kind**: instance method of [<code>DeLineChart</code>](#DeLineChart)  
**Returns**: <code>Object</code> \| <code>null</code> - Nearest point information or null if no data<code>number</code> - .x - X coordinate of nearest point<code>number</code> - .y - Y coordinate of nearest point<code>string</code> - .series - Key/name of the series containing the point  

| Param | Type | Description |
| --- | --- | --- |
| clickX | <code>number</code> | X coordinate of click in data space |
| clickY | <code>number</code> | Y coordinate of click in data space |

