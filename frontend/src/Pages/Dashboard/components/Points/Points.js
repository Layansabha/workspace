import React from 'react';
import './Points.css';

const Points = () => {
  return (
    <div className="points-container">
      <div className="points-title">Your Points</div>
      <div className="points-header">
        <div className="points-hexagon"></div>
        <div className="points-value">6675</div>
      </div>
      <div className="points-list">
        <div className="points-item">
          <span>Completed a Courses</span>
          <span className="points-dot"></span>
        </div>
        <div className="points-item">
          <span>Completed a Task</span>
          <span className="points-dot"></span>
        </div>
        <div className="points-item">
          <span>Started New Course</span>
          <span className="points-dot"></span>
        </div>
        <div className="points-item">
          <span>Completed a Task</span>
          <span className="points-dot"></span>
        </div>
      </div>
      <button className="view-all-btn">View All</button>
    </div>
  );
};

export default Points;