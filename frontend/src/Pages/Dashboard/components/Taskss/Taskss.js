import React, { useState } from 'react';
import './Taskss.css';

function Taskss() {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Empathy mapping', completed: false },
    { id: 2, name: 'Create wireframes', completed: false },
    { id: 3, name: 'User research', completed: false },
    { id: 4, name: 'Dashboard-design', completed: false }
  ]);
  
  // Add message state
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  const toggleTaskCompletion = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const updatedTask = { ...task, completed: !task.completed };
        
        // Set message based on completion state
        if (updatedTask.completed) {
          setMessage(`Task "${updatedTask.name}" marked as completed!`);
        } else {
          setMessage(`Task "${updatedTask.name}" marked as incomplete.`);
        }
        
        // Show message and hide after 3 seconds
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
        }, 3000);
        
        return updatedTask;
      }
      return task;
    }));
  };

  return (
    <div className="tasks-container">
      <h2 className="tasks-title">Tasks</h2>
      
      {/* Message display */}
      {showMessage && (
        <div className="task-message">
          {message}
        </div>
      )}
      
      <div className="tasks-list">
        {tasks.map((task) => (
          <div key={task.id} className="task-item">
            <span
              className={`task-name ${task.completed ? 'completed' : ''}`}
              onClick={() => toggleTaskCompletion(task.id)}
            >
              {task.name}
            </span>
            <div
              className="task-checkbox"
              onClick={() => toggleTaskCompletion(task.id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className={`checkbox-icon ${task.completed ? 'completed' : ''}`}
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
          </div>
        ))}
      </div>
      
      <div className="button-container">
        <button className="view-all-button">View All</button>
      </div>
    </div>
  );
}

export default Taskss;