

import React from 'react';
import './Leaderboard.css';

function Leaderboard() {
  const leaders = [
    {
      id: 1,
      name: 'John Doe',
      points: 21987,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
      trend: 'up'
    },
    {
      id: 2,
      name: 'Jenny andr',
      points: 19657,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
      trend: 'down'
    },
    {
      id: 3,
      name: 'Justen doe',
      points: 21987,
      avatar: 'https://images.pexels.com/photos/775358/pexels-photo-775358.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
      trend: 'up'
    },
    {
      id: 4,
      name: 'Jude bille',
      points: 21987,
      avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&h=200&fit=crop',
      trend: 'up'
    }
  ];

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h2 className="leaderboard-title">Leaderboard</h2>
      </div>
      
      <div>
        {leaders.map((leader) => (
          <div key={leader.id} className="leaderboard-item">
            <div className="leaderboard-rank">
              {leader.id < 10 ? `0${leader.id}` : leader.id}
              <div className={`trend-indicator trend-${leader.trend}`}></div>
            </div>
            
            <img 
              src={leader.avatar}
              alt={leader.name}
              className="leaderboard-avatar"
            />
            
            <div className="leaderboard-name">{leader.name}</div>
            
            <div className="point-indicator"></div>
            <div className="leaderboard-points">{leader.points.toLocaleString()}</div>
            
            <button className="view-btn">View</button>
          </div>
        ))}
      </div>
      
      <button className="view-all-btn">View All</button>
    </div>
  );
}

export default Leaderboard;