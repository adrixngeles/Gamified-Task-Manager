// App.jsx
import React, { useState } from 'react';
import './App.css';
import Sidebar from './Sidebar';
import LoginAuth from './LoginAuth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [taskLists, setTaskLists] = useState([{ name: 'Default Task List', tasks: [] }]);
  const [activeTaskListIndex, setActiveTaskListIndex] = useState(0);
  const [task, setTask] = useState('');
  const [complexity, setComplexity] = useState(1);
  const [showSidebar, setShowSidebar] = useState(false);

  const handleAuth = (username) => {
    setIsAuthenticated(true);
    setUsername(username);
  };

  const addTaskList = (name) => setTaskLists([...taskLists, { name, tasks: [] }]);

  const deleteTaskList = (index) => {
    const updatedTaskLists = taskLists.filter((_, i) => i !== index);
    setTaskLists(updatedTaskLists);
    setActiveTaskListIndex(0);
  };

  const selectTaskList = (index) => setActiveTaskListIndex(index);

  const toggleSidebar = () => setShowSidebar(!showSidebar);

  const handleTaskSubmit = () => {
    if (task.trim() && activeTaskListIndex !== null) {
      const newSteps = Array.from({ length: complexity * 3 }, (_, i) => ({
        id: i + 1,
        text: `Step ${i + 1} for: ${task}`,
        editable: false,
      }));
      const updatedTaskLists = [...taskLists];
      updatedTaskLists[activeTaskListIndex].tasks.push({ taskName: task, steps: newSteps });
      setTaskLists(updatedTaskLists);
      setTask('');
    }
  };

  const handleTaskEdit = (taskIndex) => {
    const editedTask = prompt("Edit task name:", taskLists[activeTaskListIndex].tasks[taskIndex].taskName);
    if (editedTask !== null && editedTask.trim() !== "") {
      const updatedTaskLists = [...taskLists];
      updatedTaskLists[activeTaskListIndex].tasks[taskIndex].taskName = editedTask;
      setTaskLists(updatedTaskLists);
    }
  };

  const handleStepEdit = (taskIndex, stepIndex) => {
    const editedStep = prompt("Edit step:", taskLists[activeTaskListIndex].tasks[taskIndex].steps[stepIndex].text);
    if (editedStep !== null && editedStep.trim() !== "") {
      const updatedTaskLists = [...taskLists];
      updatedTaskLists[activeTaskListIndex].tasks[taskIndex].steps[stepIndex].text = editedStep;
      setTaskLists(updatedTaskLists);
    }
  };

  const deleteTask = (taskIndex) => {
    const updatedTaskLists = [...taskLists];
    updatedTaskLists[activeTaskListIndex].tasks = updatedTaskLists[activeTaskListIndex].tasks.filter((_, i) => i !== taskIndex);
    setTaskLists(updatedTaskLists);
  };

  return (
    <div className="app">
      {isAuthenticated ? (
        <>
          <Sidebar
            taskLists={taskLists}
            selectTaskList={selectTaskList}
            deleteTaskList={deleteTaskList}
            showSidebar={showSidebar}
            toggleSidebar={toggleSidebar}
            addTaskList={addTaskList}
          />
          <div className={`container ${showSidebar ? 'shifted' : ''}`}>
            <header className="header">
              <button className="tab-button" onClick={toggleSidebar}>☰</button>
              <h1 className="title">Welcome, {username}</h1>
            </header>
            {activeTaskListIndex !== null ? (
              <div>
                <h2>{taskLists[activeTaskListIndex].name}</h2>
                <div className="complexity-buttons">
                  {[1, 2, 3].map((level) => (
                    <button
                      key={level}
                      className={`complexity-button ${complexity === level ? 'active' : ''}`}
                      onClick={() => setComplexity(level)}
                    >
                      Complexity {level}
                    </button>
                  ))}
                </div>
                <div className="search-bar">
                  <input
                    type="text"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    placeholder="Enter task to break down..."
                  />
                  <button onClick={handleTaskSubmit}>Generate Steps</button>
                </div>
                <div className="task-steps">
                  {taskLists[activeTaskListIndex].tasks.map((taskItem, taskIndex) => (
                    <div key={taskIndex} className="task-item">
                      <h3>
                        {taskItem.taskName}
                        <button onClick={() => handleTaskEdit(taskIndex)}>✎ Edit</button>
                        <button onClick={() => deleteTask(taskIndex)}>🗑 Delete</button>
                      </h3>
                      <ul>
                        {taskItem.steps.map((step, stepIndex) => (
                          <li key={step.id}>
                            {step.text}
                            <button onClick={() => handleStepEdit(taskIndex, stepIndex)}>✎</button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <h2>Select or Add a Task List</h2>
            )}
          </div>
        </>
      ) : (
        <LoginAuth onAuth={handleAuth} />
      )}
    </div>
  );
}

export default App;

