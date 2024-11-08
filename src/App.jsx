import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [task, setTask] = useState('');
  const [steps, setSteps] = useState([]);
  const [complexity, setComplexity] = useState(1);

  const handleTaskSubmit = () => {
    if (task.trim()) {
      const generatedSteps = generateSteps(task, complexity);
      setSteps(generatedSteps);
    }
  };

  const generateSteps = (task, complexity) => {
    const stepsList = [];
    for (let i = 1; i <= complexity * 3; i++) {
      stepsList.push({ id: i, text: `Step ${i} for: ${task}`, editable: false });
    }
    return stepsList;
  };

  const toggleEdit = (id) => {
    setSteps(steps.map(step => step.id === id ? { ...step, editable: !step.editable } : step));
  };

  const updateStepText = (id, text) => {
    setSteps(steps.map(step => step.id === id ? { ...step, text } : step));
  };

  const deleteStep = (id) => {
    setSteps(steps.filter(step => step.id !== id));
  };

  return (
    <div className="container">
      <header className="header">
        <button className="tab-button">☰ Tabs</button>
        <h1 className="title">Habit Hero</h1>
        <div className="complexity-buttons">
          {[1, 2, 3].map((level) => (
            <button 
              key={level} 
              className={`complexity-button ${complexity === level ? 'active' : ''}`} 
              onClick={() => setComplexity(level)}
            >
              {level}
            </button>
          ))}
        </div>
      </header>

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
        {steps.map((step) => (
          <div key={step.id} className="step-item">
            {step.editable ? (
              <input 
                type="text" 
                value={step.text} 
                onChange={(e) => updateStepText(step.id, e.target.value)} 
              />
            ) : (
              <span>{step.text}</span>
            )}
            <button onClick={() => toggleEdit(step.id)}>
              {step.editable ? 'Save' : 'Edit'}
            </button>
            <button onClick={() => deleteStep(step.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
