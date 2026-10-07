/**
 * TaskList component that renders a list of tasks.
 *
 * @param {{ items: Array<{ id: number, key: string, link: string, description: string, priority: number }> }} props
 */
export default function TaskList({ items = [] }) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <ul id="task_list_elem">
      {items.map((item) => (
        <li key={item.id ?? item.key}>
          <div>{item.description}</div>
          <footer>
            <span>{item.key}</span>
            <span>{item.priority}</span>
          </footer>
        </li>
      ))}
    </ul>
  );
}
