// src/pages/Payments.jsx
import React from "react";

export default function Payments() {
  return (
    <div className="dashboard">
      <h1 className="page-title">Payments</h1>

      <div className="card payment-summary">
        <h2>Recent Transactions</h2>
        <ul className="payment-list">
          <li>
            <div className="payment-row">
              <span className="payment-label">#INV-00123</span>
              <span className="payment-amount">₦45,000</span>
              <span className="payment-status paid">Paid</span>
            </div>
          </li>
          <li>
            <div className="payment-row">
              <span className="payment-label">#INV-00124</span>
              <span className="payment-amount">₦12,000</span>
              <span className="payment-status failed">Failed</span>
            </div>
          </li>
          <li>
            <div className="payment-row">
              <span className="payment-label">#INV-00125</span>
              <span className="payment-amount">₦30,500</span>
              <span className="payment-status pending">Pending</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
