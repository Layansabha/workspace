import React from 'react';
import './Overview.css';

const Overview = () => {
  // Stats data
  const statsData = [
    { 
      icon: '📚', 
      iconColor: '#e53e3e', 
      label: 'Courses in progress', 
      value: '3' 
    },
    { 
      icon: '⏱️', 
      iconColor: '#e53e3e', 
      label: 'Hours Learning', 
      value: '3h 15m' 
    },
    { 
      icon: '👥', 
      iconColor: '#e53e3e', 
      label: 'Community score', 
      value: '240' 
    },
    { 
      icon: '🔍', 
      iconColor: '#e53e3e', 
      label: 'Active Prototypes', 
      value: '7' 
    }
  ];

  return (
    <div className="overview-container">
      <h2 className="overview-title">Overview</h2>
      <div className="stats-grid">
        {statsData.map((stat, index) => (
          <div className="stat-card" key={index}>
            <div className="stat-header">
              <div className="icon-container" style={{ backgroundColor: '#fee2e2' }}>
                <span className="stat-icon" style={{ color: stat.iconColor }}>{stat.icon}</span>
              </div>
              <span className="stat-label">{stat.label}</span>
            </div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Overview;