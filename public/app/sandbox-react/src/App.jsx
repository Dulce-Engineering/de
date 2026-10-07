import { useEffect, useState } from 'react';
import TaskList from './TaskList';
import { getTaskList } from './task-list-data.min.js';

export default function App() 
{
  async function loadTasks() 
  {
    const taskList = await getTaskList();
    if (taskList) 
    {
      taskList.sort((a, b) => a.priority - b.priority);
      setItems(taskList);
    }
  }

  const [items, setItems] = useState([]);
  useEffect(() => {loadTasks()}, []);

  return (
    <main>
      <TaskList items={items} />
    </main>
  );
}
