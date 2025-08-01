import React, { useState } from 'react';
import './housekeeping.css'; // Create this file

const Housekeeping = ({ rooms }) => {
  const [housekeeping, setHousekeeping] = useState([
    { room: 101, status: 'clean', staff: 'Jane D.', time: '9:00 AM' },
    { room: 102, status: 'pending', staff: '', time: '' },
    { room: 103, status: 'in-progress', staff: 'Mike T.', time: '10:30 AM' },
  ]);

  const assignStaff = (roomId, staffName) => {
    setHousekeeping(prev => prev.map(item => 
      item.room === roomId 
        ? { ...item, staff: staffName, status: 'in-progress' } 
        : item
    ));
  };

  return (
    <div className="housekeeping-section">
      <h2>Housekeeping Schedule</h2>
      <div className="housekeeping-grid">
        {housekeeping.map((item) => (
          <div key={item.room} className="housekeeping-card">
            <h4>Room {item.room}</h4>
            <div className="hk-status">
              <span className={`status-badge ${item.status}`}>
                {item.status.replace('-', ' ')}
              </span>
              {item.staff && <span className="staff">{item.staff}</span>}
            </div>
            {item.time && <span className="time">{item.time}</span>}
            {!item.staff && (
              <button 
                onClick={() => assignStaff(item.room, 'Staff Name')}
                className="assign-btn"
              >
                Assign Staff
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Housekeeping;