// src/pages/Orders.jsx
import React from "react";

export default function Orders() {
  return (
    <div className="dashboard">
      <h1 className="page-title">Orders</h1>

      <div className="table-container">
        <table className="styled-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Room</th>
              <th>Items</th>
              <th>Status</th>
              <th>Ordered At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#ORD-001</td>
              <td>101</td>
              <td>2x Coke, 1x Jollof Rice</td>
              <td><span className="status pending">Pending</span></td>
              <td>12:30 PM</td>
              <td><button className="btn-link">Manage</button></td>
            </tr>
            <tr>
              <td>#ORD-002</td>
              <td>203</td>
              <td>1x Water, 1x Chicken Suya</td>
              <td><span className="status delivered">Delivered</span></td>
              <td>1:15 PM</td>
              <td><button className="btn-link">Manage</button></td>
            </tr>
            <tr>
              <td>#ORD-003</td>
              <td>112</td>
              <td>1x Sprite</td>
              <td><span className="status cancelled">Cancelled</span></td>
              <td>2:00 PM</td>
              <td><button className="btn-link">Manage</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}