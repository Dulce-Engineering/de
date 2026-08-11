# de-job-details

`de-job-details` is a custom element that displays job information (Company, Duration, Location, Remuneration, Role Title, Role Type, Source, Last Update Time, and Link) using nested `<de-field>` components. It automatically manages its own visibility: it hides itself if all fields of the provided job object are empty, and displays itself if any job details are present.

## Usage

Include the component in your HTML structure:

```html
<de-job-details cid="job_details_elem"></de-job-details>

<script type="module">
  const jobDetails = document.querySelector('de-job-details');
  jobDetails.value = {
    company: "Dulce Engineering",
    duration: "Permanent",
    location: "Sydney, NSW",
    remuneration: 120000,
    remuneration_unit: "per year",
    role_title: "Senior Fullstack Engineer",
    role_type: "Full-time",
    source: "LinkedIn",
    last_update: Date.now(),
    link: "https://example.com/apply"
  };
</script>
```

## Slots

This component does not use slots.

## Attributes

This component does not support any public attributes.

## Fields / Properties

| Property | Type | Description |
|---|---|---|
| `value` | `Object` | **(Setter only)** Sets the job details object. Automatically handles null/undefined inputs, formats remuneration/dates, and toggles component visibility. |
| `job_title` | `HTMLElement` | The DOM element representing the job details section header (`<h3>`). |
| `role_title_elem` | `DeField` | The `<de-field>` element displaying the job's role title. |
| `company_elem` | `DeField` | The `<de-field>` element displaying the company name. |
| `role_type_elem` | `DeField` | The `<de-field>` element displaying the job's role type. |
| `duration_elem` | `DeField` | The `<de-field>` element displaying the job's duration. |
| `location_elem` | `DeField` | The `<de-field>` element displaying the job's location. |
| `remuneration_elem` | `DeField` | The `<de-field>` element displaying the remuneration and unit. |
| `source_elem` | `DeField` | The `<de-field>` element displaying the job source. |
| `last_update_elem` | `DeField` | The `<de-field>` element displaying the formatted last update time. |
| `link_elem` | `DeField` | The `<de-field>` element displaying the job URL. |

## Events

This component does not fire or listen to any custom events.

## Methods

| Method | Parameters | Returns | Description |
|---|---|---|---|
| `Update_Visibility(job)` | `job: Object` | `void` | Toggles display visibility between `null` and `"none"` depending on whether any field in the job object is non-empty. |
| `Render()` | None | `void` | Renders the HTML structure containing the header and nested `<de-field>` components. Called automatically during connection. |
