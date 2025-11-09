import React, { useState } from 'react';
import './STUDYSTATISTICS.css';





const StudyStatistics = () => {
  const [activeTab, setActiveTab] = useState('week');
  const [hoveredDay, setHoveredDay] = useState(null);
  
  // Sample data for the chart
  const weekData = [
    { day: 'SAT', value: 25, details: '2.5 hours of study' },
    { day: 'SUN', value: 75, details: '5.2 hours of study' },
    { day: 'MON', value: 40, details: '3.0 hours of study' },
    { day: 'TUE', value: 50, details: '3.8 hours of study' },
    { day: 'WED', value: 90, details: '6.5 hours of study' },
    { day: 'THU', value: 35, details: '2.7 hours of study' },
    { day: 'FRI', value: 35, details: '2.8 hours of study' }
  ];

  return (
    <div className="study-stats-container">
      <div className="study-stats-header">
        <h2>STUDY STATISTICS</h2>
        <div className="tab-controls">
          <button 
            className={activeTab === 'week' ? 'active' : ''} 
            onClick={() => setActiveTab('week')}
          >
            week
          </button>
          <button 
            className={activeTab === 'month' ? 'active' : ''} 
            onClick={() => setActiveTab('month')}
          >
            month
          </button>
        </div>
      </div>
      
      <div className="bar-chart-container">
        <div className="bar-chart">
          {weekData.map((item) => (
            <div 
              className="chart-column" 
              key={item.day}
              onMouseEnter={() => setHoveredDay(item.day)}
              onMouseLeave={() => setHoveredDay(null)}
            >
              <div className="bar-detail-container">
                {hoveredDay === item.day && (
                  <div className="bar-tooltip">{item.details}</div>
                )}
                <div 
                  className={`bar ${item.day === 'WED' ? 'highest' : ''} ${hoveredDay === item.day ? 'hovered' : ''}`}
                  style={{ height: `${item.value}px` }}
                >
                  <div className={`indicator-line ${hoveredDay === item.day ? 'visible' : ''}`}></div>
                </div>
              </div>
              <div className="day-label">{item.day}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudyStatistics;