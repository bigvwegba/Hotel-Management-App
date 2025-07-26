// src/components/Topbar.jsx
import React from "react";

export default function Topbar({onLogout}) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1 className="dashboard-title">Dashboard</h1>
      </div>
      <nav className="topbar-right">
        <button className="admin-button" aria-label="Admin profile access">
          Welcome, Admin
        </button>
      </nav>
    </header>
  );
}
