import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HRLayout from "./layouts/HRLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./components/Dashboard";
import AddEmployee from "./components/AddEmployee";
import Attendance from "./components/Attendance";
import TimeOff from "./components/TimeOff";
import ManageDepartment from "./components/ManageDepartment";
import Finance from "./components/Finance";
import HRProfile from "./Pages/Profile/Profile";

export default function HRApp() {
  const wrap = (node) => (
    <ProtectedRoute>
      <HRLayout>{node}</HRLayout>
    </ProtectedRoute>
  );

  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={wrap(<Dashboard />)} />
      <Route path="employees" element={wrap(<AddEmployee />)} />
      <Route path="attendance" element={wrap(<Attendance />)} />
      <Route path="time-off" element={wrap(<TimeOff />)} />
      <Route path="departments" element={wrap(<ManageDepartment />)} />
      <Route path="finance" element={wrap(<Finance />)} />
      <Route path="profile" element={wrap(<HRProfile />)} />
      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
}
