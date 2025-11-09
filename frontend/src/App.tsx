// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import HRApp from "./hr/App";
import EmployeeApp from "./employee/App";
import Login from "./Login";

export default function App() {
  const role = localStorage.getItem("role"); // 'hr manager' أو 'employee'

  return (
    <Routes>
      <Route
        path="/"
        element={
          role === "hr manager" ? (
            <Navigate to="/hr/dashboard" replace />
          ) : role === "employee" ? (
            <Navigate to="/employee" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/hr/*" element={<HRApp />} />
      <Route path="/employee/*" element={<EmployeeApp />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
