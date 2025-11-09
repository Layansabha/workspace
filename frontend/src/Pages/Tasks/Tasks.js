import React, { useState, useEffect } from 'react';
import './Tasks.css';
import Sidebar from '../Tasks/combonent/Sidebar/Sidebar';
import { FiPlus, FiFilter, FiSearch, FiMoreVertical } from 'react-icons/fi';
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa';

function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAddTask, setShowAddTask] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample initial tasks data
  useEffect(() => {
    const initialTasks = [
      {
        id: 1,
        title: 'Create wireframe for dashboard',
        completed: false,
        priority: 'high',
        dueDate: '2025-05-10',
        category: 'Design'
      },
      {
        id: 2,
        title: 'Review team progress',
        completed: true,
        priority: 'medium',
        dueDate: '2025-05-04',
        category: 'Management'
      },
      {
        id: 3,
        title: 'Prepare UI kit components',
        completed: false,
        priority: 'high',
        dueDate: '2025-05-08',
        category: 'Design'
      },
      {
        id: 4,
        title: 'Collaborate with developers on implementation',
        completed: false,
        priority: 'medium',
        dueDate: '2025-05-15',
        category: 'Development'
      },
      {
        id: 5,
        title: 'Client meeting preparation',
        completed: false,
        priority: 'high',
        dueDate: '2025-05-03',
        category: 'Client'
      }
    ];
    
    setTasks(initialTasks);
  }, []);

  // Toggle task completion status
  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? {...task, completed: !task.completed} : task
    ));
  };

  // Add new task
  const addNewTask = () => {
    if (newTaskTitle.trim() === '') return;
    
    const newTask = {
      id: Date.now(),
      title: newTaskTitle,
      completed: false,
      priority: 'medium',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      category: 'General'
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setShowAddTask(false);
  };

  // Delete task
  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (selectedFilter === 'completed' && !task.completed) return false;
    if (selectedFilter === 'active' && task.completed) return false;
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Group tasks by category
  const tasksByCategory = filteredTasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    acc[task.category].push(task);
    return acc;
  }, {});

  // Get days remaining until due date
  const getDaysRemaining = (dueDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `${diffDays} days`;
  };

  return (
    <>
      <Sidebar />
      <div className="tasks-container">
        <div className="tasks-header">
          <h1>Tasks</h1>
          <div className="tasks-actions">
            <div className="search-container">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-container">
              <FiFilter className="filter-icon" />
              <select 
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Tasks</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <button 
              className="add-task-btn"
              onClick={() => setShowAddTask(true)}
            >
              <FiPlus className="add-icon" />
              <span>Add Task</span>
            </button>
          </div>
        </div>
        
        {showAddTask && (
          <div className="add-task-form">
            <input
              type="text"
              placeholder="Enter task title..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="task-input"
            />
            <div className="form-actions">
              <button onClick={addNewTask} className="save-btn">Save</button>
              <button onClick={() => setShowAddTask(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        )}
        
        <div className="tasks-content">
          {Object.keys(tasksByCategory).length === 0 ? (
            <div className="no-tasks">
              <p>No tasks found. Add a new task to get started!</p>
            </div>
          ) : (
            Object.entries(tasksByCategory).map(([category, categoryTasks]) => (
              <div key={category} className="task-category">
                <h2>{category}</h2>
                <div className="task-list">
                  {categoryTasks.map(task => (
                    <div 
                      key={task.id} 
                      className={`task-item ${task.completed ? 'completed' : ''} priority-${task.priority}`}
                    >
                      <div className="task-status" onClick={() => toggleTaskCompletion(task.id)}>
                        {task.completed ? 
                          <FaCheckCircle className="status-icon" /> : 
                          <FaRegCircle className="status-icon" />
                        }
                      </div>
                      
                      <div className="task-info">
                        <h3 className="task-title">{task.title}</h3>
                        <div className="task-meta">
                          <span className={`due-date ${getDaysRemaining(task.dueDate) === 'Overdue' ? 'overdue' : ''}`}>
                            {getDaysRemaining(task.dueDate)}
                          </span>
                          <span className={`priority priority-${task.priority}`}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="task-actions">
                        <div className="task-menu">
                          <FiMoreVertical className="more-icon" />
                          <div className="task-menu-dropdown">
                            <button onClick={() => deleteTask(task.id)}>Delete</button>
                            <button>Edit</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="tasks-summary">
          <div className="summary-item">
            <span className="summary-label">Total:</span>
            <span className="summary-value">{tasks.length}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Completed:</span>
            <span className="summary-value">{tasks.filter(task => task.completed).length}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Remaining:</span>
            <span className="summary-value">{tasks.filter(task => !task.completed).length}</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default TaskPage;