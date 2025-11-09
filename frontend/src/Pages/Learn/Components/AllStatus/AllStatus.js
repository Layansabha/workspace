import React from 'react';
import './AllStatus.css';

const AllStatus = () => {
  const statusItems = [
    { icon: '📚', value: '3/7', label: 'courses' },
    { icon: '📝', value: '30/70', label: 'quizzes' },
    { icon: '🔍', value: '2', label: 'prototypes' },
    { icon: '⏱️', value: '2', label: 'hours learning' }
  ];

  return (
    <div className="all-status-container">
      <div className="status-card">
        <h2 className="status-header">All Status</h2>
        <div className="status-items-container">
          {statusItems.map((item, index) => (
            <div key={index} className="status-item">
              <div className="status-icon">{item.icon}</div>
              <div className="status-value">{item.value}</div>
              <div className="status-label">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllStatus;