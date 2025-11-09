import React from 'react';
import './LiveEvents.css';

const LiveEvents = () => {
  const events = [
    {
      id: 1,
      title: 'IEEE Live Event 2024',
      presenter: 'Shams Tabrez',
      logo: '12OLP', // This is displayed in the logo square
      isLive: true
    }
    // You can add more events here as needed
  ];

  return (
    <div className="live-events-container">
      <h2 className="events-title">Live Events</h2>
      <div className="events-list">
        {events.map(event => (
          <div className="event-card" key={event.id}>
            <div className="event-logo">
              <div className="logo-box">
                <span className="logo-text">{event.logo}</span>
              </div>
            </div>
            <div className="event-info">
              <h3 className="event-title">{event.title}</h3>
              <div className="presenter">
                <span className="presenter-icon">👤</span>
                <span className="presenter-name">{event.presenter}</span>
              </div>
            </div>
            {event.isLive && (
              <div className="live-indicator">
                <div className="live-dot"></div>
                <span className="live-text">Live</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveEvents;