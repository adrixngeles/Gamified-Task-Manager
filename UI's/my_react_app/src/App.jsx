import React, { useState } from 'react';
import './App.css';


const Sidebar = ({ taskLists, selectTaskList, deleteTaskList, showSidebar, toggleSidebar, addTaskList }) => {
  const [newTaskListName, setNewTaskListName] = useState('');


  const handleAddTaskList = () => {
    if (newTaskListName.trim()) {
      addTaskList(newTaskListName);
      setNewTaskListName(''); // Reset input after adding
    }
  };


  return (
    <div className={`sidebar ${showSidebar ? 'open' : ''}`}>
      <button className="close-btn" onClick={toggleSidebar}>X</button>
      <h2>Task Lists</h2>
      <ul>
        {taskLists.map((taskList, index) => (
          <li key={index}>
            <span
              onClick={() => selectTaskList(index)}
              className="task-list-name"
            >
              {taskList.name}
            </span>
            <button onClick={() => deleteTaskList(index)} className="delete-btn">Delete</button>
          </li>
        ))}
      </ul>
      <div className="add-task-list">
        <input
          type="text"
          value={newTaskListName}
          onChange={(e) => setNewTaskListName(e.target.value)}
          placeholder="New Task List Name"
        />
        <button onClick={handleAddTaskList}>Add Task List</button>
      </div>
    </div>
  );
};


const App = () => {
  const [taskLists, setTaskLists] = useState([]);
  const [activeTaskListIndex, setActiveTaskListIndex] = useState(null);
  const [task, setTask] = useState('');
  const [steps, setSteps] = useState([]);
  const [complexity, setComplexity] = useState(1);
  const [showSidebar, setShowSidebar] = useState(false);


  const addTaskList = (name) => {
    const newTaskLists = [...taskLists, { name, tasks: [] }];
    setTaskLists(newTaskLists);
  };


  const deleteTaskList = (index) => {
    const newTaskLists = taskLists.filter((_, i) => i !== index);
    setTaskLists(newTaskLists);
    if (activeTaskListIndex === index) {
      setActiveTaskListIndex(null); // Clear active task list if deleted
    }
  };


  const selectTaskList = (index) => {
    setActiveTaskListIndex(index);
  };


  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };


  const handleTaskSubmit = () => {
    if (task.trim() && activeTaskListIndex !== null) {
      const generatedSteps = generateSteps(task, complexity);
      const newTaskLists = [...taskLists];
      newTaskLists[activeTaskListIndex].tasks.push({ taskName: task, steps: generatedSteps });
      setTaskLists(newTaskLists);
      setTask('');
    }
  };


  const generateSteps = (task, complexity) => {
    const stepsList = [];
    for (let i = 1; i <= complexity * 3; i++) {
      stepsList.push({ id: i, text: `Step ${i} for: ${task}`, editable: false });
    }
    return stepsList;
  };


  const toggleEdit = (taskIndex, stepId) => {
    const updatedTaskLists = [...taskLists];
    const task = updatedTaskLists[activeTaskListIndex].tasks[taskIndex];
    task.steps = task.steps.map((step) => step.id === stepId ? { ...step, editable: !step.editable } : step);
    setTaskLists(updatedTaskLists);
  };


  const updateStepText = (taskIndex, stepId, text) => {
    const updatedTaskLists = [...taskLists];
    const task = updatedTaskLists[activeTaskListIndex].tasks[taskIndex];
    task.steps = task.steps.map((step) => step.id === stepId ? { ...step, text } : step);
    setTaskLists(updatedTaskLists);
  };


  const deleteStep = (taskIndex, stepId) => {
    const updatedTaskLists = [...taskLists];
    const task = updatedTaskLists[activeTaskListIndex].tasks[taskIndex];
    task.steps = task.steps.filter((step) => step.id !== stepId);
    setTaskLists(updatedTaskLists);
  };


  // Create a default task list on load if no task lists exist
  if (taskLists.length === 0) {
    const defaultTaskList = { name: 'Default Task List', tasks: [] };
    setTaskLists([defaultTaskList]);
    setActiveTaskListIndex(0);
  }


  return (
    <div className="app">
      <Sidebar
        taskLists={taskLists}
        selectTaskList={selectTaskList}
        deleteTaskList={deleteTaskList}
        showSidebar={showSidebar}
        toggleSidebar={toggleSidebar}
        addTaskList={addTaskList}
      />
      <div className="container">
        <header className="header">
          <button className="tab-button" onClick={toggleSidebar}>☰</button>
          <h1 className="title">Habit Hero</h1>
          <div className="knight-icon"></div>
        </header>


        {activeTaskListIndex !== null ? (
          <div>
            <h2>{taskLists[activeTaskListIndex].name}</h2>
            <div className="complexity-description">
              Choose a complexity level to adjust the number of steps.
            </div>
            <div className="complexity-buttons">
              {[1, 2, 3].map((level) => (
                <div key={level} className="complexity-container">
                  <div className="sword-icons">
                    {Array(level).fill('').map((_, index) => (
                      <span key={index} className="sword-icon"></span>
                    ))}
                  </div>
                  <button
                    className={`complexity-button ${complexity === level ? 'active' : ''}`}
                    onClick={() => setComplexity(level)}
                  >
                    {level}
                  </button>
                </div>
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


            <div className="steps-list">
              {taskLists[activeTaskListIndex].tasks.map((task, taskIndex) => (
                <div key={taskIndex}>
                  <h3>{task.taskName}</h3>
                  {task.steps.map((step) => (
                    <div key={step.id} className="step-item">
                      {step.editable ? (
                        <input
                          type="text"
                          value={step.text}
                          onChange={(e) => updateStepText(taskIndex, step.id, e.target.value)}
                        />
                      ) : (
                        <span>{step.text}</span>
                      )}
                      <button onClick={() => toggleEdit(taskIndex, step.id)}>
                        {step.editable ? 'Save' : 'Edit'}
                      </button>
                      <button onClick={() => deleteStep(taskIndex, step.id)}>Delete</button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="container">
            <h1 className="title">Select a Task List</h1>
          </div>
        )}
      </div>
    </div>
  );
};


export default App;