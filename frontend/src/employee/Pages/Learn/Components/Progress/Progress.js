import React, { useEffect, useState } from 'react';
import './Progress.css';

const Progress = () => {
  const [animatedBlackProgress, setAnimatedBlackProgress] = useState(0);
  const [animatedRedProgress, setAnimatedRedProgress] = useState(0);
  
  const blackProgressTarget = 45;
  const redProgressTarget = 80;
  
  useEffect(() => {
    // Animate the progress values on component mount
    const blackAnimation = setTimeout(() => {
      let start = 0;
      const interval = setInterval(() => {
        if (start < blackProgressTarget) {
          start += 1;
          setAnimatedBlackProgress(start);
        } else {
          clearInterval(interval);
        }
      }, 20);
      
      return () => clearInterval(interval);
    }, 300);
    
    const redAnimation = setTimeout(() => {
      let start = 0;
      const interval = setInterval(() => {
        if (start < redProgressTarget) {
          start += 1;
          setAnimatedRedProgress(start);
        } else {
          clearInterval(interval);
        }
      }, 15);
      
      return () => clearInterval(interval);
    }, 500);
    
    return () => {
      clearTimeout(blackAnimation);
      clearTimeout(redAnimation);
    };
  }, []);
  
  // Calculate the SVG path for each progress circle
  const getCirclePath = (percentage) => {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    
    return {
      strokeDasharray: `${circumference} ${circumference}`,
      strokeDashoffset: offset
    };
  };
  
  const blackCircleStyle = getCirclePath(animatedBlackProgress);
  const redCircleStyle = getCirclePath(animatedRedProgress);

  return (
    <div className="progress-container">
      <div className="progress-header">
        <h2>PROGRESS</h2>
      </div>
      
      <div className="chart-container">
        <div className="progress-chart">
          {/* Background circle */}
          <svg width="180" height="180" viewBox="0 0 180 180">
            <circle 
              cx="90" 
              cy="90" 
              r="60" 
              fill="none" 
              stroke="#f0f0f0" 
              strokeWidth="8"
            />
            
            {/* Red progress circle */}
            <circle 
              cx="90" 
              cy="90" 
              r="60" 
              fill="none" 
              stroke="#FF5252" 
              strokeWidth="8"
              strokeDasharray={redCircleStyle.strokeDasharray}
              strokeDashoffset={redCircleStyle.strokeDashoffset}
              transform="rotate(-90 90 90)"
              className="progress-circle red-circle"
            />
            
            {/* Black progress circle */}
            <circle 
              cx="90" 
              cy="90" 
              r="60" 
              fill="none" 
              stroke="#333" 
              strokeWidth="10"
              strokeDasharray={blackCircleStyle.strokeDasharray}
              strokeDashoffset={blackCircleStyle.strokeDashoffset}
              transform="rotate(-90 90 90)"
              className="progress-circle black-circle"
            />
          </svg>
          
          <div className="progress-percentage">
            <span className="percentage-value">{animatedBlackProgress}%</span>
          </div>
        </div>
      </div>
      
      <div className="progress-legend">
        <div className="legend-item">
          <span className="legend-dot courses-dot"></span>
          <span className="legend-label">Courses</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot prototypes-dot"></span>
          <span className="legend-label">Prototypes</span>
        </div>
      </div>
    </div>
  );
};

export default Progress;