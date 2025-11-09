import React from "react";
import { FaBell, FaSearch } from "react-icons/fa";
import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="logo">
        <h1>Workspace HR</h1>
      </div>

      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input type="text" placeholder="Search..." />
      </div>

      <button className="notification-icon" aria-label="Notifications">
        <FaBell className="bell-icon" />
        <span className="notification-dot" />
      </button>
    </header>
  );
}
