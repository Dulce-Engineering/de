# jopr-header

`jopr-header` is a light DOM custom web component encapsulating the header bar of the JOPR application, including the trend line chart, retro digital clock, brand title, navigation toolbar, and animated terminal alert output element.

## Usage

### HTML
```html
<link rel="stylesheet" href="./component/jopr-header/style.css?v=2">
<script src="./component/jopr-header/index.js?v=2" type="module"></script>

<!-- Jobs page (default) -->
<jopr-header id="header" active-page="jobs"></jopr-header>

<!-- Profiles page -->
<jopr-header id="header" active-page="profiles"></jopr-header>

<!-- Custom feature page -->
<jopr-header id="header" active-page="custom" title-text="JOPR"></jopr-header>
```

### JavaScript
```javascript
import DeJoprHeader from "./component/jopr-header/index.js";

const header = document.querySelector("jopr-header");

// Listen for navigation toolbar actions
header.addEventListener("import", (e) => On_Click_Import());
header.addEventListener("export", (e) => On_Click_Export());
header.addEventListener("jobs", (e) => Show_View("jobs"));
header.addEventListener("profile", (e) => Show_View("profile"));

// Display typewriter-style alert in the terminal output
header.Alert("Job added successfully");

// Toggle navigation or optional buttons
header.Hide_Nav();
header.Show_Nav();
header.Show_Companies(true);
header.Show_Contacts(true);

// Update chart with trend analysis
await header.Update_Chart(ctx);
header.Start_Chart_Timer(ctx);
```

## Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `active-page` | `string` | `"jobs"` | Highlights active page button or converts between button and link (`"jobs"`, `"profiles"`, `"custom"`). |
| `title-text` | `string` | `"JOPR"` | Title text displayed in the header `h1.title`. |
| `hide-nav` | `boolean` | `false` | Hides the navigation toolbar (`nav#nav_elem`). |
| `hide-chart` | `boolean` | `false` | Hides the trend chart (`.chart`). |
| `hide-clock` | `boolean` | `false` | Hides the retro clock (`de-clock-2#clock_elem`). |
| `show-companies` | `boolean` | `false` | Unhides the companies button (`#companies_btn`). |
| `show-contacts` | `boolean` | `false` | Unhides the contacts button (`#contacts_btn`). |
| `analysis-href` | `string` | `"../job-woper"` | Destination URL for the market analysis link. |

## Properties / DOM Element Shortcuts

Since `jopr-header` renders into the light DOM with `cid` shortcuts and standard `id` attributes:

- `header.hdr_elem` (`#hdr_elem`)
- `header.chart_container` (`.chart`)
- `header.chart_elem` (`de-line-chart#chart_elem`)
- `header.title_elem` (`h1.title`)
- `header.clock_elem` (`de-clock-2#clock_elem`)
- `header.nav_elem` (`nav#nav_elem`)
- `header.import_btn` (`button#import_btn`)
- `header.export_btn` (`button#export_btn`)
- `header.jobs_btn` (`#jobs_btn`)
- `header.profile_btn` (`#profile_btn`)
- `header.companies_btn` (`button#companies_btn`)
- `header.contacts_btn` (`button#contacts_btn`)
- `header.analysis_btn` (`a#analysis_btn`)
- `header.alert_elem` (`output#alert_elem`)

## Events

- `import`: Fired when the upload/import button is clicked.
- `export`: Fired when the download/export button is clicked.
- `jobs`: Fired when the jobs button is clicked.
- `profile`: Fired when the profile button is clicked.
- `companies`: Fired when the companies button is clicked.
- `contacts`: Fired when the contacts button is clicked.
- `title-click`: Fired when the header title `h1` is clicked.

## Methods

- `Alert(msg, char_millis = 35, wait_millis = 5000)`: Plays typewriter text animation into `alert_elem`.
- `Clear_Alert_Timers()`: Cancels any active alert typing/erasing timer and clears the text.
- `Show_Nav(show = true)`: Shows or hides the navigation bar.
- `Hide_Nav()`: Hides the navigation bar.
- `Show_Companies(show = true)`: Toggles visibility of companies button.
- `Show_Contacts(show = true)`: Toggles visibility of contacts button.
- `Set_Trend(direction, title_html)`: Applies trend styling (`trend-up`, `trend-down`, `trend-flat`) and tooltip to chart.
- `Update_Chart(ctx, stats)`: Queries Stats for random market search query and updates chart.
- `Start_Chart_Timer(ctx, stats, interval_millis = 60000)`: Starts auto-refreshing chart on an interval.
- `Stop_Chart_Timer()`: Clears the chart refresh timer.
