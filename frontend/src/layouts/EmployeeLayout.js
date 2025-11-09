// src/employee/layouts/EmployeeLayout.jsx (أو نفس مسارك)
import React from "react";
import Sidebar from "../employee/Pages/Dashboard/components/Sidebar/Sidebar";
import "./Layout.css";

export default function EmployeeLayout({ children }) {
  return (
    <div className="employee-layout">
      <Sidebar />
      <div className="content-area">{children}</div>
    </div>
  );
}
