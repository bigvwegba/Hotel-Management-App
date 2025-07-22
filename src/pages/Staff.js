// src/pages/Staff.jsx
import React from "react";

export default function Staff() {
  return (
    <div className="dashboard">
      <h1 className="page-title">Staff Management</h1>

      <div className="table-container">
        <table className="styled-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Username</th>
              <th>Last Login</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Amaka Obi</td>
              <td>Receptionist</td>
              <td>amaka123</td>
              <td>2025-07-04</td>
              <td><span className="status active">Active</span></td>
              <td><button className="btn-link">Edit</button></td>
            </tr>
            <tr>
              <td>James Iroko</td>
              <td>Housekeeping</td>
              <td>james_hk</td>
              <td>2025-07-03</td>
              <td><span className="status inactive">Inactive</span></td>
              <td><button className="btn-link">Edit</button></td>
            </tr>
            <tr>
              <td>Sandra Yusuf</td>
              <td>Admin</td>
              <td>sandy_admin</td>
              <td>2025-07-05</td>
              <td><span className="status active">Active</span></td>
              <td><button className="btn-link">Edit</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}