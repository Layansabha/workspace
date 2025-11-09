import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import userImage from './Ellipse 31.png'; // صورة المستخدم
import chatBotImage from './AI.png'; // صورة الشات بوت
import dashboardIcon from './Ellipse 45.png'; // صورة Dashboard
import learnIcon from './Ellipse 47.png'; // صورة Learn
import tasksIcon from './task.png'; // صورة Tasks
import teamIcon from './Ellipse 46.png'; // صورة Team
import './Sidebar.css';

function Sidebar() {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState('dashboard');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const path = location.pathname;
    if (path === '/employee/dashboard') setActiveItem('dashboard');
    else if (path === '/employee/learn') setActiveItem('learn');
    else if (path === '/employee/tasks') setActiveItem('tasks');
    else if (path === '/employee/team') setActiveItem('team');
  }, [location]);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleSendMessage = async () => {
    if (message.trim() === '') return;
    setChatMessages([...chatMessages, { text: message, sender: 'user' }]);
    setMessage('');

    setIsLoading(true);

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: message }],
        },
        {
          headers: {
            'Authorization': `Bearer YOUR_OPENAI_API_KEY`,
            'Content-Type': 'application/json',
          },
        }
      );

      const aiResponse = response.data.choices[0].message.content;
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { text: aiResponse, sender: 'ai' },
      ]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { text: 'I am a robot chat. Ask me anything!', sender: 'ai' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const navigationItems = [
    { id: 'dashboard', icon: dashboardIcon, text: 'Dashboard', path: '/employee/dashboard' },
    { id: 'learn', icon: learnIcon, text: 'Learn', path: '/employee/learn' },
    { id: 'tasks', icon: tasksIcon, text: 'Tasks', path: '/employee/tasks' },
    { id: 'team', icon: teamIcon, text: 'Team', path: '/employee/team' },
  ];

  return (
    <div className="dashboard-sidebar">
      <div className="user-info">
        <img src={userImage} alt="User" className="user-image" />
        <div>
          <h2>John Doe</h2>
          <p>UI/UX Designer</p>
          <div className="role">UI/UX</div>
        </div>
        <div className="more-icon">...</div>
      </div>

      <nav className="dashboard-sidebar-nav">
        <ul>
          {navigationItems.map((item) => (
            <li
              key={item.id}
              className={activeItem === item.id ? 'active' : ''}
            >
              <Link 
                to={item.path} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  textDecoration: 'none', 
                  color: 'inherit',
                  padding: '10px'
                }}
              >
                <img src={item.icon} alt={item.text} className="list-icon" />
                <span>{item.text}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="divider"></div>

        <div className="chat-bot" onClick={toggleChat}>
          <img src={chatBotImage} alt="Chat Bot" className="chat-bot-image" />
          <span>Ask me!</span>
        </div>

        {isChatOpen && (
          <div className="chat-window">
            <div className="chat-header">
              <strong>How can I help you?</strong>
            </div>
            <div className="chat-messages">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender}`}>
                  {msg.text}
                </div>
              ))}
              {isLoading && (
                <div className="message ai">
                  <div className="typing-indicator">Typing...</div>
                </div>
              )}
            </div>
            <div className="chat-input">
              <input
                type="text"
                placeholder="Type Message Here!"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
            <div className="chat-arrow"></div>
          </div>
        )}
      </nav>
    </div>
  );
}

export default Sidebar;
