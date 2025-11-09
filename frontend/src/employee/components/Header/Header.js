// Header.js
import React from 'react';
import { FaBell, FaSearch } from 'react-icons/fa'; // أيقونة الجرس والبحث
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <h1>Workspace HR</h1>
      </div>
      <div className="search-bar">
        <FaSearch className="search-icon" /> {/* أيقونة البحث */}
        <input type="text" placeholder="Search..." />
      </div>
      <div className="notification-icon">
        <FaBell className="bell-icon" />
        <span className="notification-dot"></span> {/* النقطة الحمراء */}
      </div>
    </header>
  );
}

export default Header;