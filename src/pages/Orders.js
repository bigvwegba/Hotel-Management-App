// src/pages/Orders.jsx
import React, { useState } from "react";
import OrderModal from "../components/OrderModal";
import useOrderStore from "../store/useOrderStore";

export default function Orders() {
  const orders = useOrderStore((state) => state.orders);
  const [showModal, setShowModal] = useState(false);
  const [editOrder, setEditOrder] = useState(null);

  const handleAddOrder = () => {
    setEditOrder(null);
    setShowModal(true);
  };

  const handleEditOrder = (order) => {
    setEditOrder(order);
    setShowModal(true);
  };

  const handleStatusChange = (id, newStatus) => {
    useOrderStore.getState().updateOrderStatus(id, newStatus);
  };

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1 className="page-title">Hotel Orders</h1>
        <button className="btn-primary" onClick={handleAddOrder}>Add Order</button>
      </div>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="order-grid">
          <div className="order-row order-header">
            <div>Order ID</div>
            <div>Guest</div>
            <div>Items</div>
            <div>Total</div>
            <div>Type</div>
            <div>Status</div>
            <div>Actions</div>
          </div>
          {orders.map((order) => (
            <div className="order-row" key={order.id}>
              <div>{order.id}</div>
              <div>{order.guestName || "N/A"} (Room {order.roomNumber})</div>
              <div>{order.items.map(item => `${item.name} x${item.quantity}`).join(", ")}</div>
              <div>₦{order.total.toLocaleString()}</div>
              <div>{order.orderType}</div>
              <div>
                <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span>
              </div>
              <div className="order-actions">
                <button className="btn-outline" onClick={() => handleEditOrder(order)}>Edit</button>
                <button
                  className="btn-outline warning"
                  onClick={() => handleStatusChange(order.id, "Cancelled")}
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <OrderModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          editOrder={editOrder}
        />
      )}
    </div>
  );
}
