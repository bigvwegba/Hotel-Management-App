import React from "react";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <h1 className="page-title">Admin Dashboard</h1>
      <div className="grid">
        <div className="card primary">Revenue Today: ₦135,000</div>
        <div className="card">Available Rooms: 12</div>
        <div className="card">Check-ins Today: 5</div>
        <div className="card warning">Pending Orders: 3</div>
      </div>

      <div className="section-header">
        <h2>Recent Rooms</h2>
        <button className="btn-link">Manage Rooms</button>
      </div>

      <div className="room-preview-grid">
        <div className="room-preview">
          <h3>Room 101</h3>
          <p>Status: <span className="status available">Available</span></p>
        </div>
        <div className="room-preview">
          <h3>Room 102</h3>
          <p>Status: <span className="status booked">Booked</span></p>
        </div>
        <div className="room-preview">
          <h3>Room 103</h3>
          <p>Status: <span className="status maintenance">Maintenance</span></p>
        </div>
      </div>
    </div>
  );
}
