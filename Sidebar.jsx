import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = ({ taskLists, selectTaskList, deleteTaskList, showSidebar, toggleSidebar, addTaskList }) => {
  const [newTaskListName, setNewTaskListName] = useState('');

  const handleAddTaskList = () => {
    if (newTaskListName.trim()) {
      addTaskList(newTaskListName);
      setNewTaskListName('');
    }
  };

  return (
    <div className={`sidebar ${showSidebar ? 'open' : ''}`}>
      <button className="close-btn" onClick={toggleSidebar}>✖</button>
      <h2>Task Lists</h2>
      <div className="task-lists">
        {taskLists.map((list, index) => (
          <div key={index} className="task-list-item">
            <span className="task-list-name" onClick={() => selectTaskList(index)}>
              {list.name}
            </span>
            <button className="delete-btn" onClick={() => deleteTaskList(index)}>🗑️</button>
          </div>
        ))}
      </div>
      <div className="add-task-list">
        <input
          type="text"
          placeholder="New Task List"
          value={newTaskListName}
          onChange={(e) => setNewTaskListName(e.target.value)}
        />
        <button onClick={handleAddTaskList}>Add</button>
      </div>
    </div>
  );
};

export default Sidebar;
