// src/hr/App.jsx
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import "./App.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Dashboard from "./components/Dashboard";
import AddEmployee from "./components/AddEmployee";
import Attendance from "./components/Attendance";
import TimeOff from "./components/TimeOff";
import ManageDepartment from "./components/ManageDepartment";
import Finance from "./components/Finance";
import ProtectedRoute from "./components/ProtectedRoute";
import HRProfile from "./Pages/Profile/Profile";

const Layout = () => (
  <div className="app">
    <Sidebar />
    <div className="main-content">
      <Header />
      <div className="page-content">
        <Outlet />
      </div>
    </div>
  </div>
);

export default function HRApp() {
  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" replace />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="employees" element={<AddEmployee />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="time-off" element={<TimeOff />} />
        <Route path="departments" element={<ManageDepartment />} />
        <Route path="finance" element={<Finance />} />
        <Route path="profile" element={<HRProfile />} />
      </Route>

      <Route path="*" element={<Navigate to="dashboard" replace />} />
    </Routes>
  );
}
