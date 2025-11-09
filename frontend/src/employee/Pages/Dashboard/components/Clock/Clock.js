import React, { useState, useEffect } from 'react';
import './Clock.css';

const Clock = () => {
  const [date, setDate] = useState(new Date());
  const [firstIn, setFirstIn] = useState(null);
  const [lastOut, setLastOut] = useState(null);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [timeWorked, setTimeWorked] = useState('0h 0m 0s');

  // Update the current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format date as "Mar 26, 2025"
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Handle clock in/out action
  const handleClockAction = () => {
    const now = new Date();
    if (!isClockedIn) {
      // Clocking in
      if (!firstIn) {
        setFirstIn(now);
      }
      setIsClockedIn(true);
    } else {
      // Clocking out
      setLastOut(now);
      setIsClockedIn(false);
    }
  };

  // Calculate time worked when clocked in
  useEffect(() => {
    if (isClockedIn && firstIn) {
      const timer = setInterval(() => {
        const now = new Date();
        const diff = now - firstIn;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeWorked(`${hours}h ${minutes}m ${seconds}s`);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isClockedIn, firstIn]);

  return (
    <div className="clock-container">
      <div className="clock-header">
        <span>Clock IN/Out</span>
        <span className="date">{formatDate(date)}</span>
      </div>
      <div className="clock-details">
        <div className="clock-times">
          <div className="first-in">
            FIRST IN {firstIn ? firstIn.toLocaleTimeString() : '---'}
          </div>
          <div className="last-out">
            Last Out {lastOut ? lastOut.toLocaleTimeString() : '---'}
          </div>
        </div>
        <button 
          className={`clock-btn ${isClockedIn ? 'clocked-in' : ''}`}
          onClick={handleClockAction}
        >
          {isClockedIn ? `Clocked In (${timeWorked})` : 'Clock In 0h 0m 0s'}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="arrow-icon"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Clock;