import React, { useState, useEffect } from 'react';
import './Sidebar.css';
import { useNavigate, useLocation } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [isEmployeesOpen, setIsEmployeesOpen] = useState(false);

  const toggleEmployeesMenu = () => {
    setIsEmployeesOpen(!isEmployeesOpen);
    if (!isEmployeesOpen) {
      setActiveItem('Manage Employees');
      navigate('/hr/employees');
    }
  };

  const handleItemClick = (item) => {
    setActiveItem(item);
    if (item === 'Manage Employees') {
      navigate('/hr/employees');
    } else if (item === 'Dashboard') {
      navigate('/hr/dashboard');
    } else if (item === 'Attendance') {
      navigate('/hr/attendance');
    } else if (item === 'Time-off') {
      navigate('/hr/time-off');
    } else if (item === 'Finance') {
      navigate('/hr/finance');
    } else if (item === 'Settings') {
      navigate('/hr/settings');
    } else if (item === 'Profile') {
      navigate('/hr/profile');
    } else if (item === 'Department') {
      navigate('/hr/departments');
    }
  };

  // ✅ Sync active item with current URL path
  useEffect(() => {
    if (location.pathname.includes('/hr/dashboard')) {
      setActiveItem('Dashboard');
    } else if (location.pathname.includes('/hr/employees')) {
      setActiveItem('Manage Employees');
      setIsEmployeesOpen(true);
    } else if (location.pathname.includes('/hr/departments')) {
      setActiveItem('Department');
      setIsEmployeesOpen(true);
    } else if (location.pathname.includes('/hr/attendance')) {
      setActiveItem('Attendance');
    } else if (location.pathname.includes('/hr/time-off')) {
      setActiveItem('Time-off');
    } else if (location.pathname.includes('/hr/finance')) {
      setActiveItem('Finance');
    } else if (location.pathname.includes('/hr/settings')) {
      setActiveItem('Settings');
    } else if (location.pathname.includes('/hr/profile')) {
      setActiveItem('Profile');
    }
  }, [location.pathname]);

  return (
    <div className="sidebar">
      <div className="main-menu">
        <ul>
          <li className={activeItem === 'Dashboard' ? 'active' : ''} onClick={() => handleItemClick('Dashboard')}>
            <span className="icon">📊</span>
            <span className="text">Dashboard</span>
          </li>
          <li className="menu-item">
            <div
              className={`menu-header ${activeItem === 'Manage Employees' || activeItem === 'Department' ? 'active' : ''}`}
              onClick={toggleEmployeesMenu}
            >
              <span className="icon">👥</span>
              <span className="text">Employees</span>
              <span className={`arrow ${isEmployeesOpen ? 'open' : ''}`}>▼</span>
            </div>
            {isEmployeesOpen && (
              <ul className="submenu">
                <li
                  className={activeItem === 'Manage Employees' ? 'active' : ''}
                  onClick={() => handleItemClick('Manage Employees')}
                >
                  Manage Employees
                </li>
                <li
                  className={activeItem === 'Department' ? 'active' : ''}
                  onClick={() => handleItemClick('Department')}
                >
                  Department
                </li>
              </ul>
            )}
          </li>
          <li className={activeItem === 'Attendance' ? 'active' : ''} onClick={() => handleItemClick('Attendance')}>
            <span className="icon">⏰</span>
            <span className="text">Attendance</span>
          </li>
          <li className={activeItem === 'Time-off' ? 'active' : ''} onClick={() => handleItemClick('Time-off')}>
            <span className="icon">🏖️</span>
            <span className="text">Time-off</span>
          </li>
          <li className={activeItem === 'Finance' ? 'active' : ''} onClick={() => handleItemClick('Finance')}>
            <span className="icon">💰</span>
            <span className="text">Finance</span>
          </li>
        </ul>
      </div>
      <div className="bottom-menu">
        <ul>
          <li className={activeItem === 'Settings' ? 'active' : ''} onClick={() => handleItemClick('Settings')}>
            <span className="icon">⚙️</span>
            <span className="text">Settings</span>
          </li>
          <li className={activeItem === 'Profile' ? 'active' : ''} onClick={() => handleItemClick('Profile')}>
            <span className="icon">👤</span>
            <span className="text">Profile</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
