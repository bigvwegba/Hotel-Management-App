import React, { useState } from 'react';
import usePaymentStore from '../store/usePaymentStore';
import useProductStore from '../store/useProductStore';
import '../styles/payments.css';

export default function Payments() {
  const { bookings } = useProductStore();
  const {
    paymentMethods,
    currentPayment,
    paymentFilters,
    initializePayment,
    processPayment,
    failPayment,
    updateFilters,
    getFilteredPayments,
    getPaymentSummary
  } = usePaymentStore();

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [refundData, setRefundData] = useState({ paymentId: '', amount: 0, reason: '' });
  const [activeTab, setActiveTab] = useState('all');

  const payments = getFilteredPayments();
  const summary = getPaymentSummary();

  const handleProcessPayment = (booking) => {
    initializePayment(booking);
  };

  const handleCompletePayment = (method) => {
    processPayment(method);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    updateFilters({ [name]: value });
  };

  const handleDateFilter = (range) => {
    updateFilters({ dateRange: range });
    setFilterModalOpen(false);
  };

  const initiateRefund = (payment) => {
    setRefundData({
      paymentId: payment.id,
      amount: payment.amount,
      reason: ''
    });
    setRefundModalOpen(true);
  };

  return (
    <div className="payments-page">
      <div className="payments-header">
        <h1 className="page-title">Payment Management</h1>
        <div className="payment-actions">
          <button 
            className="btn-filter"
            onClick={() => setFilterModalOpen(true)}
          >
            Advanced Filters
          </button>
        </div>
      </div>

      <div className="payment-tabs">
        {['all', 'paid', 'pending', 'failed', 'refunded'].map(tab => (
          <button
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => {
              setActiveTab(tab);
              updateFilters({ status: tab === 'all' ? 'all' : tab });
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="payment-cards">
        <div className="payment-card">
          <h3>Total Revenue</h3>
          <p className="amount">₦{summary.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="payment-card">
          <h3>Pending Payments</h3>
          <p className="amount">₦{summary.pendingPayments.toLocaleString()}</p>
        </div>
        <div className="payment-card">
          <h3>Today's Revenue</h3>
          <p className="amount">₦{summary.todaysRevenue.toLocaleString()}</p>
        </div>
        <div className="payment-card">
          <h3>Refunds Issued</h3>
          <p className="amount refund">-₦{summary.refundsIssued.toLocaleString()}</p>
        </div>
      </div>

      <div className="payments-table-container">
        <table className="payments-table">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Booking ID</th>
              <th>Guest</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Method</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map(payment => (
                <tr key={payment.id}>
                  <td>{payment.id}</td>
                  <td>{payment.bookingId}</td>
                  <td>{payment.guestName}</td>
                  <td className={payment.amount < 0 ? 'refund' : ''}>
                    {payment.amount < 0 ? '-' : ''}₦{Math.abs(payment.amount).toLocaleString()}
                  </td>
                  <td>{new Date(payment.date).toLocaleDateString()}</td>
                  <td>{payment.method || 'N/A'}</td>
                  <td>
                    <span className={`payment-status ${payment.status}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td>
                    {payment.status === 'paid' && (
                      <button 
                        className="btn-refund"
                        onClick={() => initiateRefund(payment)}
                      >
                        Refund
                      </button>
                    )}
                    {payment.status === 'pending' && (
                      <button 
                        className="btn-process"
                        onClick={() => handleProcessPayment(
                          bookings.find(b => b.id === payment.bookingId)
                        )}
                      >
                        Process
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-results">
                  No payments found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Payment Processing Modal */}
      {currentPayment && (
        <div className="payment-modal">
          <div className="modal-content">
            <h3>Process Payment</h3>
            <div className="payment-details">
              <p><strong>Booking ID:</strong> {currentPayment.bookingId}</p>
              <p><strong>Guest:</strong> {currentPayment.guestName}</p>
              <p><strong>Amount:</strong> ₦{currentPayment.amount.toLocaleString()}</p>
            </div>
            
            <div className="payment-methods">
              {paymentMethods.map(method => (
                <button 
                  key={method.id}
                  className="payment-method"
                  onClick={() => handleCompletePayment(method.id)}
                >
                  <img src={method.icon} alt={method.name} />
                  <span>{method.name}</span>
                </button>
              ))}
            </div>

            <div className="modal-actions">
              <button 
                className="btn-cancel"
                onClick={() => failPayment('Payment cancelled')}
              >
                Cancel Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {filterModalOpen && (
        <div className="filter-modal">
          <div className="modal-content">
            <h3>Advanced Filters</h3>
            <div className="filter-group">
              <label>Payment Method</label>
              <select 
                name="method"
                value={paymentFilters.method}
                onChange={handleFilterChange}
              >
                <option value="all">All Methods</option>
                {paymentMethods.map(method => (
                  <option key={method.id} value={method.id}>
                    {method.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Date Range</label>
              <div className="date-range-picker">
                <input 
                  type="date" 
                  onChange={(e) => handleDateFilter({ 
                    ...paymentFilters.dateRange, 
                    start: e.target.value 
                  })}
                />
                <span>to</span>
                <input 
                  type="date" 
                  onChange={(e) => handleDateFilter({ 
                    ...paymentFilters.dateRange, 
                    end: e.target.value 
                  })}
                />
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="btn-apply"
                onClick={() => setFilterModalOpen(false)}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {refundModalOpen && (
        <div className="refund-modal">
          <div className="modal-content">
            <h3>Process Refund</h3>
            <div className="form-group">
              <label>Amount</label>
              <input
                type="number"
                value={refundData.amount}
                onChange={(e) => setRefundData({
                  ...refundData,
                  amount: parseFloat(e.target.value)
                })}
                min="0"
                max={refundData.amount}
              />
            </div>
            <div className="form-group">
              <label>Reason</label>
              <textarea
                value={refundData.reason}
                onChange={(e) => setRefundData({
                  ...refundData,
                  reason: e.target.value
                })}
                placeholder="Enter refund reason..."
              />
            </div>
            <div className="modal-actions">
              <button 
                className="btn-cancel"
                onClick={() => setRefundModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-confirm"
                onClick={() => {
                  usePaymentStore.getState().refundPayment(
                    refundData.paymentId,
                    refundData.amount,
                    refundData.reason
                  );
                  setRefundModalOpen(false);
                }}
              >
                Process Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}