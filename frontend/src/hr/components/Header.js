import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css'; // تأكد عندك ملف css مناسب للتصميم

function Header() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // حذف التوكن
    navigate('/login'); // رجوع لصفحة تسجيل الدخول
  };

  return (
    <div className="header">
      <div className="header-left">
        {/* ممكن شعار أو اسم الشركة */}
        <h2>WorkSpace HR</h2>
      </div>

      <div className="header-right">
        <div className="profile" onClick={toggleDropdown}>
          <img
            src="https://via.placeholder.com/40" 
            alt="Profile"
            className="profile-img"
          />
          {dropdownOpen && (
            <div className="dropdown-menu">
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
