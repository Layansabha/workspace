import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from "./assets/login.png";
import rightImage from "./assets/back.png"; 

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.role) {
        localStorage.setItem('role', data.role);
        localStorage.setItem('token', data.token);

        if (data.role === 'hr manager') {
          navigate('/hr/dashboard');
        } else if (data.role === 'employee') {
          navigate('/employee');
        } else {
          setErrorMsg('Invalid role.');
        }
      } else {
        setErrorMsg(data.message || 'Invalid credentials.');
      }
    } catch (err) {
      setErrorMsg('Something went wrong. Try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="left-section">
        <img src={logo} alt="Logo" className="logo" />
        <h2>Welcome Back <span>!</span></h2>
        {errorMsg && <div className="error-msg">{errorMsg}</div>}
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
          <div className="help-links">
            <span>Forgot your password?</span>
            <span>Need help? <strong>Contact support</strong></span>
          </div>
        </form>
        <div className="new-employee">
          New Employee? <span>Click Here</span>
        </div>
        <footer>
          <span>About Workspace HR</span> | 
          <span>Features</span> | 
          <span>Pricing</span> | 
          <span>Blog</span> | 
          <span>Contact us</span>
          <div className="social-icons">
            <i className="fab fa-facebook"></i>
            <i className="fab fa-x-twitter"></i>
            <i className="fab fa-instagram"></i>
            <i className="fab fa-linkedin"></i>
          </div>
        </footer>
      </div>

      <div className="right-section">
        <img src={rightImage} alt="Visual" />
      </div>
    </div>
  );
}

export default Login;
