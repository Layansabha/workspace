import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from './Pages/Dashboard/Dashboard';
import LearnPage from './Pages/Learn/learnpage';
import TaskPage from './Pages/Tasks/Tasks';
import Teame from './Pages/Teame/Teame';
import EmployeeLayout from '../layouts/EmployeeLayout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="dashboard" />} />
      <Route path="*" element={
        <EmployeeLayout>
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="learn" element={<LearnPage />} />
            <Route path="tasks" element={<TaskPage />} />
            <Route path="team" element={<Teame />} />
          </Routes>
        </EmployeeLayout>
      } />
    </Routes>
  );
}

export default App;
