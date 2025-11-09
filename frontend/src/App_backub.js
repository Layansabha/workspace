import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import './App.css';
import Sidebar from './components/Sidebar';
import Dashboard from './components/HRDashboard';
import AddEmployee from './components/AddEmployee';
import Attendance from './components/Attendance';
import Header from './components/Header';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import TimeOff from './components/TimeOff';
import ManageDepartment from './components/ManageDepartment';
import Finance from './components/Finance';




function App() {
  const [activePage, setActivePage] = useState('Dashboard');
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="app">
      {!isLoginPage && <Sidebar />}
      <div className="main-content">
        {!isLoginPage && <Header />}
        <Routes>
<Route
  path="/"
  element={
    localStorage.getItem('token')
      ? <Navigate to="/dashboard" />
      : <Navigate to="/login" />
  }
/>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <ProtectedRoute>
                <AddEmployee />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance"
            element={
              <ProtectedRoute>
                <Attendance />
              </ProtectedRoute>
            }
          />
          <Route
          path="/time-off"
          element={
             <ProtectedRoute>
                <TimeOff />
              </ProtectedRoute>
              
  }
/>
<Route
  path="/departments"
  element={
    <ProtectedRoute>
      <ManageDepartment />
    </ProtectedRoute>
  }
/>
<Route
  path="/finance"
  element={
    <ProtectedRoute>
      <Finance />
    </ProtectedRoute>
  }
/>



          
          {/* باقي التبويبات لاحقاً */}
        </Routes>
      </div>
    </div>
  );
}

export default App;