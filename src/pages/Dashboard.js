import React from "react";
import { useState } from "react";


export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`dashboard ${darkMode ? 'dark' : ''}`}>
      <header className="dashboard-header">
        <h1 className="page-title">Hotel Dashboard</h1>
        <div className="header-actions">
          <button 
            onClick={() => setDarkMode(!darkMode)} 
            className="dark-mode-toggle"
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <span className="date">{new Date().toLocaleDateString()}</span>
        </div>
      </header>

      <div className="metrics-grid">
        <div className="metric-card revenue">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <h3>Today's Revenue</h3>
            <p className="metric-value">₦235,800</p>
            <p className="metric-change positive">↑ 12% from yesterday</p>
          </div>
        </div>

        <div className="metric-card occupancy">
          <div className="metric-icon">🛏️</div>
          <div className="metric-content">
            <h3>Room Occupancy</h3>
            <p className="metric-value">78%</p>
            <p className="metric-detail">12/15 rooms occupied</p>
          </div>
        </div>

        <div className="metric-card guests">
          <div className="metric-icon">👥</div>
          <div className="metric-content">
            <h3>Current Guests</h3>
            <p className="metric-value">24</p>
            <p className="metric-detail">5 check-ins today</p>
          </div>
        </div>

        <div className="metric-card alerts">
          <div className="metric-icon">⚠️</div>
          <div className="metric-content">
            <h3>Attention Needed</h3>
            <p className="metric-value">3 items</p>
            <p className="metric-detail">2 maintenance, 1 reservation</p>
          </div>
        </div>
       </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Room Status Overview</h2>
          <div className="section-actions">
            <button className="btn btn-secondary">View All Rooms</button>
            <button className="btn btn-primary">+ Add Reservation</button>
          </div>
        </div>

      <div className="room-status-grid">
        <div className="room-card available">
        <h3>Deluxe Suite #201</h3>
        <div className="room-meta">
          <span className="room-type">King Bed</span>
          <span className="room-price">₦45,000/night</span>
      </div>
      <div className="room-status">
        <span className="status-badge available">Available</span>
        <span className="status-detail">Ready for check-in</span>
      </div>
      </div>

      <div className="room-card occupied">
        <h3>Executive Suite #102</h3>
        <div className="room-meta">
          <span className="room-type">Double Queen</span>
          <span className="room-price">₦38,000/night</span>
        </div>
        <div className="room-status">
          <span className="status-badge occupied">Occupied</span>
          <span className="status-detail">Check-out: Tomorrow</span>
        </div>
      </div>

      <div className="room-card maintenance">
        <h3>Standard Room #305</h3>
        <div className="room-meta">
          <span className="room-type">Single Bed</span>
          <span className="room-price">₦25,000/night</span>
        </div>
        <div className="room-status">
          <span className="status-badge maintenance">Maintenance</span>
          <span className="status-detail">Plumbing repair</span>
        </div>
      </div>

      <div className="room-card reserved">
        <h3>Presidential Suite #401</h3>
        <div className="room-meta">
          <span className="room-type">King Suite</span>
          <span className="room-price">₦85,000/night</span>
        </div>
        <div className="room-status">
          <span className="status-badge reserved">Reserved</span>
          <span className="status-detail">Arrival: Today 3PM</span>
        </div>
      </div>
    </div>
  </div>

  <div className="dashboard-section">
    <div className="section-header">
      <h2>Recent Activities</h2>
      <button className="btn btn-text">View All Logs</button>
    </div>
    
    <div className="activity-feed">
      <div className="activity-item">
        <div className="activity-icon">🔔</div>
        <div className="activity-content">
          <p>New reservation for Room #102 by Johnson Family</p>
          <span className="activity-time">10 minutes ago</span>
        </div>
      </div>
      <div className="activity-item">
        <div className="activity-icon">🧹</div>
        <div className="activity-content">
          <p>Room #305 marked for maintenance by Housekeeping</p>
          <span className="activity-time">1 hour ago</span>
        </div>
      </div>
      <div className="activity-item">
        <div className="activity-icon">💳</div>
        <div className="activity-content">
          <p>Payment received for Room #201 (₦45,000)</p>
          <span className="activity-time">2 hours ago</span>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}