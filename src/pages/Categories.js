// src/pages/Categories.jsx
import React from "react";

export default function Categories() {
  return (
    <div className="dashboard">
      <h1 className="page-title">Product Categories</h1>

      <div className="table-container">
        <table className="styled-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Drinks</td>
              <td>Bottled beverages, water, and soft drinks</td>
              <td><span className="status active">Active</span></td>
              <td><button className="btn-link">Edit</button></td>
            </tr>
            <tr>
              <td>Meals</td>
              <td>Main dishes including rice and soups</td>
              <td><span className="status active">Active</span></td>
              <td><button className="btn-link">Edit</button></td>
            </tr>
            <tr>
              <td>Snacks</td>
              <td>Small chops and light refreshments</td>
              <td><span className="status inactive">Inactive</span></td>
              <td><button className="btn-link">Edit</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
