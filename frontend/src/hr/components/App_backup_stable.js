import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard'; // تأكد من وجود هذا الملف في المسار الصحيح
import AddEmployee from './components/AddEmployee';
import Attendance from './components/Attendance';
import Header from './components/Header';
import Login from './components/Login';




function App() {
  const [activePage, setActivePage] = useState('Dashboard'); // الصفحة الافتراضية Dashboard

  const renderPage = () => {
    switch (activePage) {
      case 'Dashboard':
        return <Dashboard setActivePage={setActivePage} />;
      case 'Employees':
      case 'Manage Employees':
        return <AddEmployee />;
        case 'Attendance':
          return <Attendance />;    
      case 'Time-off':
        return <div style={{ padding: "20px" }}>Time-off page is under construction...</div>;
      case 'Finance':
        return <div style={{ padding: "20px" }}>Finance page is under construction...</div>;
      case 'Department':
        return <div style={{ padding: "20px" }}>Department page is under construction...</div>;
      case 'Settings':
        return <div style={{ padding: "20px" }}>Settings page is under construction...</div>;
      case 'Profile':
        return <div style={{ padding: "20px" }}>Profile page is under construction...</div>;
      default:
        return <Dashboard />;
    }
  };
  

  return (
    <div className="app">
      <Sidebar setActivePage={setActivePage} />
      <div className="main-content">
        <Header />
        {renderPage()}
      </div>
    </div>
  );
  
}

export default App;
