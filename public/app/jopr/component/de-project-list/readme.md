# de-project-list

A custom HTML element designed to display, edit, add, and delete a list of projects. It encapsulates displaying lists via `<de-input-list>`, editing via `<de-dialog-form>`, and confirming deletion via `<de-dialog-confirm>`.

## Usage

Include the component in your HTML page:

```html
<de-project-list id="my-project-list"></de-project-list>
```

In your JavaScript code, initialize the element with data and the required save/delete callbacks:

```javascript
import DeProjectList from "./public/app/jopr/component/de-project-list/index.js";

const projectListEl = document.getElementById("my-project-list");

// 1. Set the initial project list
projectListEl.value = [
  {
    id: 1,
    title: "Project Alpha",
    url: "https://alpha.example.com",
    description: "An AI-powered automation platform.",
    tech: "Next.js, Python, Tailwind"
  }
];

// 2. Define the save callback (triggered on Add/Edit)
projectListEl.save_fn = async (project) => {
  try {
    const response = await fetch("/api/projects", {
      method: "POST",
      body: JSON.stringify(project),
      headers: { "Content-Type": "application/json" }
    });
    const data = await response.json();
    return data.id; // Return the saved/assigned project ID
  } catch (err) {
    console.error(err);
    return null;
  }
};

// 3. Define the delete callback (triggered on Delete confirmation)
projectListEl.delete_fn = async (projectId) => {
  try {
    const response = await fetch(`/api/projects/${projectId}`, {
      method: "DELETE"
    });
    return response.ok; // Return boolean success indicator
  } catch (err) {
    console.error(err);
    return false;
  }
};

// 4. Listen for alerts
projectListEl.addEventListener("alert", (event) => {
  console.log("Alert message:", event.detail);
});
```

## Slots

None. The component is self-contained and renders its inner DOM template dynamically.

## Attributes

None.

## Fields

* **`value`**: *Getter / Setter*. Sets or gets the current array of project objects. A project object has the following structure:
  ```typescript
  interface Project {
    id?: number | string;
    title: string;
    url: string;
    description: string;
    tech: string;
  }
  ```
* **`save_fn`**: *Property (Callback)*. Asynchronous callback function used to save/update a project when it is edited or created.
  * Signature: `(project: Object) => Promise<number | string | null>`
* **`delete_fn`**: *Property (Callback)*. Asynchronous callback function used to delete a project.
  * Signature: `(projectId: number | string) => Promise<boolean>`

## Events

* **`alert`**: Dispatched when an action succeeds or fails (e.g., project saved, project failed to delete).
  * `event.detail`: `string` (The alert message text).
  * Bubbles: `true`.

## Methods

* **`Add(obj)`**: Adds a new project object to the input list.
  * Parameter: `obj: Object` - The project object.
* **`Remove(obj_id)`**: Removes a project object from the input list.
  * Parameter: `obj_id: number | string` - The ID of the project to remove.
* **`Update_Project(project)`**: Internal asynchronous helper that handles invoking `save_fn` and showing success/failure alert banners.
  * Parameter: `project: Object`
* **`Alert(msg)`**: Helper to dispatch the `alert` event.
  * Parameter: `msg: string`
