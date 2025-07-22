// src/components/Topbar.jsx
import React from "react";

export default function Topbar({onLogout}) {
  return (
    <header className="topbar">
      <div className="user-info">Welcome, Admin</div>
    <button className="logout-btn" onClick={onLogout}>Logout</button>
    </header>
  );
}
