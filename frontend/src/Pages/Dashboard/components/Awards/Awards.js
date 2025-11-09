import React from 'react';
import './Awards.css';

const Awards = () => {
  return (
    <div className="awards-container">
      <div className="awards-content">
        <div className="awards-header">
          <span className="awards-title">Awards </span>
          <span className="awards-count">🏆 You have 3 awards to see</span>
          <span className="awards-details">Details</span>
        </div>
        <div className="awards-body">
          <p>You have promotion starting in 1</p>
          <span className="awards-date">Jan 2024</span>
        </div>
      </div>
    </div>
  );
};

export default Awards;