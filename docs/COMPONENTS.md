# Component Documentation

Auto-generated from JSDoc comments.

## Classes

<dl>
<dt><a href="#DeDialogAlert">DeDialogAlert</a> ⇐ <code>HTMLElement</code></dt>
<dd></dd>
<dt><a href="#DeDialogAlert">DeDialogAlert</a></dt>
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

