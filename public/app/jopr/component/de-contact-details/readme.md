# de-contact-details

`de-contact-details` is a custom element that displays contact details (Name, Phone, Email, Position, Agency, and LinkedIn profile) using nested `<de-field>` components. It automatically manages its own visibility: it hides itself if all fields of the provided contact object are empty, and displays itself if any contact details are present.

## Usage

Include the component in your HTML structure:

```html
<de-contact-details cid="contact_details_elem"></de-contact-details>

<script type="module">
  const contactDetails = document.querySelector('de-contact-details');
  contactDetails.value = {
    name: "Jane Doe",
    phone: "+61400000000",
    email: "jane.doe@example.com",
    position: "Senior Software Engineer",
    agency_name: "Tech Agency",
    linkedin: "https://linkedin.com/in/janedoe"
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
| `value` | `Object` | **(Setter only)** Sets the contact details object. Automatically handles null/undefined inputs and toggles component visibility. |
| `contact_title` | `HTMLElement` | The DOM element representing the contact details section header (`<h3>`). |
| `contact_name_elem` | `DeField` | The `<de-field>` element displaying the contact's name. |
| `contact_phone_elem` | `DeField` | The `<de-field>` element displaying the contact's phone number. |
| `contact_email_elem` | `DeField` | The `<de-field>` element displaying the contact's email address. |
| `contact_position_elem` | `DeField` | The `<de-field>` element displaying the contact's job position. |
| `contact_agency_elem` | `DeField` | The `<de-field>` element displaying the contact's agency name. |
| `contact_linkedin_elem` | `DeField` | The `<de-field>` element displaying the contact's LinkedIn profile link. |

## Events

This component does not fire or listen to any custom events.

## Methods

| Method | Parameters | Returns | Description |
|---|---|---|---|
| `Update_Visibility(contact)` | `contact: Object` | `void` | Toggles display visibility between `null` and `"none"` depending on whether any field in the contact object is non-empty. |
| `Render()` | None | `void` | Renders the HTML structure containing the header and nested `<de-field>` components. Called automatically during connection. |
