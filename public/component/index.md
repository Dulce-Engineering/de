# Web Components Directory

This directory contains reusable, frameworkless custom Web Components built with native JavaScript (ES Modules), HTML5, and CSS for the Dulce Engineering platform.

---

## Component Index

| Component | Class Name | Tag Name | Documentation | Description |
|---|---|---|---|---|
| [de-component](./de-component) | `DeComponent` | `<de-component>` | [readme.md](./de-component/readme.md) | Component scaffold and template implementing standard lifecycle hooks, property caching, and event binding patterns. |
| [de-text](./de-text) | `DeText` | `<de-text>` | [readme.md](./de-text/readme.md) | Lightweight reactive text display component that updates its inner text dynamically via the `.value` property. |
| [DeCarousel](./DeCarousel) | `DeCarousel` | `<de-carousel>` | *None* | Modal dialog carousel that cycles through slotted elements with Next and Close navigation controls. |
| [DeDial](./DeDial) | `DeDial`, `DeClock`, `DeTimer`, `DeTimerCompact`, `DeGauge`, `DeCounter`, `DeDialMarks`, `DeClockDial`, `DeActionBtn` | `<de-dial>`, `<de-clock>`, `<de-timer>`, `<de-timer-compact>`, `<de-gauge>`, `<de-counter>`, `<de-dialmarks>`, `<de-clock-dial>`, `<de-action-btn>` | *None* | Radial gauges, analog/digital clocks, timers, and counter dials with customizable tick marks, animations, and controls. |
| [DeDialogAlert](./DeDialogAlert) | `DeDialogAlert` | `<de-dialog-alert>` | *None* | Modal alert dialog with customizable header, body content, and OK confirmation button. |
| [DeDialogConfirm](./DeDialogConfirm) | `DeDialogConfirm` | `<de-dialog-confirm>` | *None* | Asynchronous confirmation modal dialog with OK/Cancel actions, returning a Promise resolving to a boolean result. |
| [DeDialogForm](./DeDialogForm) | `DeDialogForm` | `<de-dialog-form>` | [readme.md](./DeDialogForm/readme.md) | Modal dialog form that automatically binds object fields to form inputs by `name` attribute and manages async submission. |
| [DeDialogLogin](./DeDialogLogin) | `DeDialogLogin`, `DeDialogNewAccount`, `DeDialogNewCharityAccount`, `DeDialogRecoverAccount` | `<de-dialog-login>`, `<de-dialog-new-account>`, `<de-dialog-new-charity-account>`, `<de-dialog-recover-account>` | *None* | Modal authentication dialogs for user login, account registration, and credential recovery. |
| [DeDivider](./DeDivider) | `DeDivider` | `<de-divider>` | [README.md](./DeDivider/README.md) | Ornamental SVG divider component that fetches and renders decorative graphic dividers based on `div-type`. |
| [DeFilter](./DeFilter) | `DeFilter` | `<de-filter>` | [readme.md](./DeFilter/readme.md) | Interactive data filter bar supporting text, select, numeric, and date/time criteria with collapsible views and filter chips. |
| [DeFooter](./DeFooter) | `DeFooter` | `<de-footer>` | *None* | Global application footer displaying corporate branding, copyright information, and a contact modal trigger. |
| [DeForm](./DeForm) | `DeForm` | `<de-form>` | [readme.md](./DeForm/readme.md) | Form container offering automated two-way data binding between object properties and nested inputs matching `name` attributes. |
| [DeHeader](./DeHeader) | `DeHeader` | `<de-header>` | *None* | Responsive application header with an animated SVG morphing overlay navigation menu toggled via hamburger button. |
| [DeImage](./DeImage) | `DeImage` | `<de-image>` | [readme.md](./DeImage/readme.md) | Image wrapper component providing a reactive `.value` property for getting and setting image `src` URLs. |
| [DeInputImage](./DeInputImage) | `DeInputImage` | `<de-input-image>` | *None* | Image file upload component providing instant local previews via `FileReader` and exposing the raw `File` and data URL. |
| [DeInputList](./DeInputList) | `DeInputList` | `<de-input-list>` | [readme.md](./DeInputList/readme.md) | Dynamic list manager that maintains an array of items and renders each item using an internal template and render events. |
| [DeInputPassword](./DeInputPassword) | `DeInputPassword` | `<de-input-password>` | *None* | Password input control with an interactive toggle button to switch between hidden and plain text visibility. |
| [DeInputPdf](./DeInputPdf) | `DeInputPdf` | `<de-input-pdf>` | *None* | File input control restricted to selecting and validating PDF documents (`application/pdf`). |
| [DeInputPeriod](./DeInputPeriod) | `DeInputPeriod` | `<de-input-period>` | *None* | Duration input component with separate fields for Days, Hours, Minutes, and Seconds, converting values to total milliseconds. |
| [DeInputRefNo](./DeInputRefNo) | `DeInputRefNo` | `<de-input-refno>` | *None* | Reference number input field that strictly restricts and sanitizes input to numeric digits only. |
| [DeInputRepeat](./DeInputRepeat) | `DeInputRepeat` | `<de-input-repeat>` | *None* | Recurrence scheduler component for configuring event repeat rules across daily, weekly, monthly, and yearly intervals. |
| [DeInputTree](./DeInputTree) | `DeInputTree` | `<de-input-tree>` | *None* | Hierarchical tree input control rendering nested items with checkboxes for multiple selection. |
| [DeIntersection](./DeIntersection) | `DeIntersection` | `<de-intersection>` | [readme.md](./DeIntersection/readme.md) | Viewport observer wrapping `IntersectionObserver` to toggle CSS classes on target elements as they scroll into view. |
| [DeLineChart](./DeLineChart) | `DeLineChart` | `<de-line-chart>` | [readme.md](./DeLineChart/readme.md) | Interactive SVG line chart supporting multiple data series, curve interpolation, axis labels, highlight ranges, and clicks. |
| [DeLink](./DeLink) | `DeLink` | `<de-link>` | [readme.md](./DeLink/readme.md) | Hyperlink component wrapping an anchor (`<a>`) tag targeting a new tab (`target="_blank"`) with dynamic `.value` binding. |
| [DeRange](./DeRange) | `DeRange` | `<de-range>` | [readme.md](./DeRange/readme.md) | Range slider combining a native `<input type="range">` with a synchronized real-time numeric and percentage display. |
| [DeSelectImg](./DeSelectImg) | `DeSelectImg` | `<de-select-img>` | *None* | Image dropdown component displaying the currently selected image and expanding an options picker to select another. |
| [DeSelectTree](./DeSelectTree) | `DeSelectTree` | `<de-select-tree>` | *None* | Form-associated hierarchical tree select dropdown with selection chips, clear action, and tree picker. |
| [DeSort](./DeSort) | `DeSort` | `<de-sort>` | *None* | Multi-criteria sorting builder allowing users to add, order, toggle direction (asc/desc), and remove sort rules. |
| [DeTable](./DeTable) | `DeTable` | `<de-table>` | [README.md](./DeTable/README.md) | Data table component that automatically maps array records to columns with customizable cell rendering and column headers. |
| [DeTextAnims](./DeTextAnims) | `DeCursor`, `DeSnake` | `<de-cursor>`, `<de-snake>` | *None* | Text animation suite providing mask reveal typewriter effects (`de-cursor`) and curved SVG path text motion (`de-snake`). |
| [DeTextEffect](./DeTextEffect) | `DeTextEffect` | `<de-text-effect>` | [README.md](./DeTextEffect/README.md) | SVG text distortion component rendering typography along curved paths with gradient fills and variable font scaling. |
| [DeTree](./DeTree) | `DeInputTree` | `<de-tree>` | *None* | Hierarchical tree view widget for displaying and navigating nested folder/item structures. |
| [DeViewport](./DeViewport) | `De_Viewport` | `<de-viewport>` | [readme.md](./DeViewport/readme.md) | Canvas-based 2D graphic viewport supporting pan, zoom, marquee selection, and grid navigation with mouse and touch input. |

---

## Component Details

### de-component
- **Class Name**: `DeComponent`
- **Tag Name**: `<de-component>`
- **Directory**: `public/component/de-component`
- **Documentation**: [readme.md](./de-component/readme.md)
- **Description**: Starter template and scaffold for creating Dulce Engineering custom Web Components. Implements standard lifecycle hooks (`connectedCallback`, `attributeChangedCallback`), pending value caching prior to rendering, and event binding conventions.

### de-text
- **Class Name**: `DeText`
- **Tag Name**: `<de-text>`
- **Directory**: `public/component/de-text`
- **Documentation**: [readme.md](./de-text/readme.md)
- **Description**: Lightweight text container component that dynamically reflects its `.value` property into its inner text.

### DeCarousel
- **Class Name**: `DeCarousel`
- **Tag Name**: `<de-carousel>`
- **Directory**: `public/component/DeCarousel`
- **Documentation**: *None*
- **Description**: Modal dialog carousel component based on `<dialog>`. Cycles sequentially through slotted items (`slot="items"`) using Next and Close buttons.

### DeDial
- **Class Name**: `DeDial` (with `DeClock`, `DeTimer`, `DeTimerCompact`, `DeGauge`, `DeCounter`, `DeDialMarks`, `DeClockDial`, `DeActionBtn`)
- **Tag Name**: `<de-dial>`, `<de-clock>`, `<de-timer>`, `<de-timer-compact>`, `<de-gauge>`, `<de-counter>`, `<de-dialmarks>`, `<de-clock-dial>`, `<de-action-btn>`
- **Directory**: `public/component/DeDial`
- **Documentation**: *None* (HTML interactive documentation and samples available in component directory)
- **Description**: Comprehensive circular instrumentation library providing radial dials, analog and digital clocks, countdown/elapsed timers, gauges, and animated counters with customizable scale marks, themes, and interactive buttons.

### DeDialogAlert
- **Class Name**: `DeDialogAlert`
- **Tag Name**: `<de-dialog-alert>`
- **Directory**: `public/component/DeDialogAlert`
- **Documentation**: *None*
- **Description**: Modal alert dialog box element implementing `<dialog>`. Provides custom header and body content slots alongside a configurable OK confirmation button (`label-ok`).

### DeDialogConfirm
- **Class Name**: `DeDialogConfirm`
- **Tag Name**: `<de-dialog-confirm>`
- **Directory**: `public/component/DeDialogConfirm`
- **Documentation**: *None*
- **Description**: Asynchronous confirmation modal dialog. The `Confirm(message)` method presents an alert with OK and Cancel buttons and returns a Promise that resolves to `true` or `false` based on user action.

### DeDialogForm
- **Class Name**: `DeDialogForm`
- **Tag Name**: `<de-dialog-form>`
- **Directory**: `public/component/DeDialogForm`
- **Documentation**: [readme.md](./DeDialogForm/readme.md)
- **Description**: Modal dialog form component extending `HTMLElement`. Automatically populates input fields matching object properties by `name` attribute and collects edited values upon submission through `Show_Async()`.

### DeDialogLogin
- **Class Name**: `DeDialogLogin` (with `DeDialogNewAccount`, `DeDialogNewCharityAccount`, `DeDialogRecoverAccount`)
- **Tag Name**: `<de-dialog-login>`, `<de-dialog-new-account>`, `<de-dialog-new-charity-account>`, `<de-dialog-recover-account>`
- **Directory**: `public/component/DeDialogLogin`
- **Documentation**: *None*
- **Description**: Modal user authentication suite extending `DeForm`. Contains login dialogs with username/password inputs, password masking, loading indicators, error banners, and event hooks for new account registration and account recovery.

### DeDivider
- **Class Name**: `DeDivider`
- **Tag Name**: `<de-divider>`
- **Directory**: `public/component/DeDivider`
- **Documentation**: [README.md](./DeDivider/README.md)
- **Description**: Decorative SVG section divider component. Dynamically fetches and inlines SVG vector graphics from its `image/` directory according to the `div-type` attribute (e.g., `vintage-1`).

### DeFilter
- **Class Name**: `DeFilter`
- **Tag Name**: `<de-filter>`
- **Directory**: `public/component/DeFilter`
- **Documentation**: [readme.md](./DeFilter/readme.md)
- **Description**: Advanced data filtering and query builder toolbar. Supports text, dropdown select, numeric, and date/time filter criteria across compact, medium, and full views, complete with active filter chips and search refresh triggers.

### DeFooter
- **Class Name**: `DeFooter`
- **Tag Name**: `<de-footer>`
- **Directory**: `public/component/DeFooter`
- **Documentation**: *None*
- **Description**: Application footer component displaying branding, copyright notices, and a contact button that opens an embedded `<dialog>` inquiry form.

### DeForm
- **Class Name**: `DeForm`
- **Tag Name**: `<de-form>`
- **Directory**: `public/component/DeForm`
- **Documentation**: [readme.md](./DeForm/readme.md)
- **Description**: Automated form data binding component. Reads and sets values on child inputs matching the properties of an assigned JavaScript object based on each input's `name` attribute via the `.value` property.

### DeHeader
- **Class Name**: `DeHeader`
- **Tag Name**: `<de-header>`
- **Directory**: `public/component/DeHeader`
- **Documentation**: *None*
- **Description**: Top-level application header with an animated SVG path morphing overlay (`ShapeOverlays`) triggered by an animated hamburger button.

### DeImage
- **Class Name**: `DeImage`
- **Tag Name**: `<de-image>`
- **Directory**: `public/component/DeImage`
- **Documentation**: [readme.md](./DeImage/readme.md)
- **Description**: Image element wrapper providing an internal shortcut to an `<img>` tag and reactive `.value` getter/setter for the image source URL.

### DeInputImage
- **Class Name**: `DeInputImage`
- **Tag Name**: `<de-input-image>`
- **Directory**: `public/component/DeInputImage`
- **Documentation**: *None*
- **Description**: Image file input component that allows users to pick image files, generates an instant client-side preview via `FileReader`, and exposes the raw `File` reference and data URL.

### DeInputList
- **Class Name**: `DeInputList`
- **Tag Name**: `<de-input-list>`
- **Directory**: `public/component/DeInputList`
- **Documentation**: [readme.md](./DeInputList/readme.md)
- **Description**: Dynamic list management component that maintains an array of items, instantiates DOM elements from an internal template, and fires `render` events for custom item formatting. Supports programmatic `Add(item)` and `Remove(id)`.

### DeInputPassword
- **Class Name**: `DeInputPassword`
- **Tag Name**: `<de-input-password>`
- **Directory**: `public/component/DeInputPassword`
- **Documentation**: *None*
- **Description**: Password input component featuring integrated SVG eye icons to easily toggle between masked password characters and plain text.

### DeInputPdf
- **Class Name**: `DeInputPdf`
- **Tag Name**: `<de-input-pdf>`
- **Directory**: `public/component/DeInputPdf`
- **Documentation**: *None*
- **Description**: PDF file upload element restricted to `application/pdf` MIME types with client-side file type validation.

### DeInputPeriod
- **Class Name**: `DeInputPeriod`
- **Tag Name**: `<de-input-period>`
- **Directory**: `public/component/DeInputPeriod`
- **Documentation**: *None*
- **Description**: Duration input component with four numeric inputs (Days, Hours, Minutes, Seconds). Calculates and returns the cumulative time period in milliseconds via `.value`.

### DeInputRefNo
- **Class Name**: `DeInputRefNo`
- **Tag Name**: `<de-input-refno>`
- **Directory**: `public/component/DeInputRefNo`
- **Documentation**: *None*
- **Description**: Specialized reference number text input that enforces numeric-only characters by intercepting keyboard strokes, paste events, and input mutations.

### DeInputRepeat
- **Class Name**: `DeInputRepeat`
- **Tag Name**: `<de-input-repeat>`
- **Directory**: `public/component/DeInputRepeat`
- **Documentation**: *None*
- **Description**: Event recurrence selector allowing users to configure repetition rules (rate, daily/weekly/monthly/yearly scale, days of week, month day, end date or occurrences).

### DeInputTree
- **Class Name**: `DeInputTree`
- **Tag Name**: `<de-input-tree>`
- **Directory**: `public/component/DeInputTree`
- **Documentation**: *None*
- **Description**: Hierarchical tree input control rendering parent-child relationships with multi-select checkboxes, returning an array of checked IDs via `.value`.

### DeIntersection
- **Class Name**: `DeIntersection`
- **Tag Name**: `<de-intersection>`
- **Directory**: `public/component/DeIntersection`
- **Documentation**: [readme.md](./DeIntersection/readme.md)
- **Description**: Viewport visibility tracker wrapping the native `IntersectionObserver` API. Adds or removes configured CSS animation/transition classes as the target element enters or leaves the screen.

### DeLineChart
- **Class Name**: `DeLineChart`
- **Tag Name**: `<de-line-chart>`
- **Directory**: `public/component/DeLineChart`
- **Documentation**: [readme.md](./DeLineChart/readme.md)
- **Description**: Interactive vector SVG line chart component. Supports single or multi-series datasets, smooth interpolation, axis labels, highlight ranges, and custom click interaction events.

### DeLink
- **Class Name**: `DeLink`
- **Tag Name**: `<de-link>`
- **Directory**: `public/component/DeLink`
- **Documentation**: [readme.md](./DeLink/readme.md)
- **Description**: Hyperlink component encapsulating an `<a>` element configured with `target="_blank"`. Binds its destination URL and text dynamically to its `.value` property.

### DeRange
- **Class Name**: `DeRange`
- **Tag Name**: `<de-range>`
- **Directory**: `public/component/DeRange`
- **Documentation**: [readme.md](./DeRange/readme.md)
- **Description**: Slider component combining a standard range input with an integrated real-time numeric/percentage indicator element.

### DeSelectImg
- **Class Name**: `DeSelectImg`
- **Tag Name**: `<de-select-img>`
- **Directory**: `public/component/DeSelectImg`
- **Documentation**: *None*
- **Description**: Image dropdown selector component. Displays the current active image and opens an image selection list (`[{value, src}]`) upon user interaction.

### DeSelectTree
- **Class Name**: `DeSelectTree`
- **Tag Name**: `<de-select-tree>`
- **Directory**: `public/component/DeSelectTree`
- **Documentation**: *None*
- **Description**: Form-associated tree picker control with selection chips, clear action, and an expandable modal tree picker for choosing items in a hierarchy.

### DeSort
- **Class Name**: `DeSort`
- **Tag Name**: `<de-sort>`
- **Directory**: `public/component/DeSort`
- **Documentation**: *None*
- **Description**: Multi-level sorting builder component. Enables users to add sorting fields, toggle sort direction between ascending and descending, and dispatch `sort` events when changed.

### DeTable
- **Class Name**: `DeTable`
- **Tag Name**: `<de-table>`
- **Directory**: `public/component/DeTable`
- **Documentation**: [README.md](./DeTable/README.md)
- **Description**: Data table component that automatically maps array objects to rows and columns, with custom cell rendering callback functions (`cellRender`) and column definitions.

### DeTextAnims
- **Class Name**: `DeCursor`, `DeSnake`
- **Tag Name**: `<de-cursor>`, `<de-snake>`
- **Directory**: `public/component/DeTextAnims`
- **Documentation**: *None*
- **Description**: Text animation utilities featuring `DeCursor` for typewriter-style mask animations and `DeSnake` for rendering and animating text running along an SVG curve path.

### DeTextEffect
- **Class Name**: `DeTextEffect`
- **Tag Name**: `<de-text-effect>`
- **Directory**: `public/component/DeTextEffect`
- **Documentation**: [README.md](./DeTextEffect/README.md)
- **Description**: Typographic effect component that renders text along curved SVG bezier paths with gradient fills and variable font sizing per character.

### DeTree
- **Class Name**: `DeInputTree`
- **Tag Name**: `<de-tree>`
- **Directory**: `public/component/DeTree`
- **Documentation**: *None*
- **Description**: Hierarchical tree navigation view component for rendering nested parent-child trees with expandable branches and item selection.

### DeViewport
- **Class Name**: `De_Viewport`
- **Tag Name**: `<de-viewport>`
- **Directory**: `public/component/DeViewport`
- **Documentation**: [readme.md](./DeViewport/readme.md)
- **Description**: High-performance 2D canvas viewport component supporting panning, zooming, rectangular selection, and grid snapping with mouse and touch gestures.
