import React, { useState } from "react";
import OrderModal from "../components/OrderModal";
import useOrderStore from "../store/useOrderStore";
import useBookingStore from "../store/useBookingStore";
import "../styles/order.css";

export default function Orders() {
  // Store hooks
  const { orders, getOrdersByBooking, updateOrderStatus } = useOrderStore();
  const { bookings } = useBookingStore();
  const getBookingFromStore = useBookingStore(state => state.getBookingById);
  
  // State management
  const [showModal, setShowModal] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Handler functions
  const handleAddOrder = (bookingId = "") => {
    setEditOrder(null);
    setSelectedBookingId(bookingId);
    setShowModal(true);
  };

  const handleEditOrder = (order) => {
    setEditOrder(order);
    setSelectedBookingId(order.bookingId);
    setShowModal(true);
  };

  const handleStatusChange = (id, newStatus) => {
    updateOrderStatus(id, newStatus);
  };

  // Data helpers
  const getBookingInfo = (bookingId) => {
    try {
      return getBookingFromStore(bookingId) || { 
        guestName: "N/A", 
        roomNumber: "N/A",
        checkInDate: "N/A",
        checkOutDate: "N/A" 
      };
    } catch (error) {
      console.error("Error getting booking:", error);
      return { 
        guestName: "N/A", 
        roomNumber: "N/A",
        checkInDate: "N/A",
        checkOutDate: "N/A" 
      };
    }
  };

  const formatDate = (dateString) => {
    if (dateString === "N/A") return "N/A";
    const options = { day: 'numeric', month: 'short' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter orders
  const filteredOrders = selectedBookingId 
    ? getOrdersByBooking(selectedBookingId)
    : orders;

  const statusFilteredOrders = filterStatus
    ? filteredOrders.filter(order => order.status === filterStatus)
    : filteredOrders;

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1 className="page-title">Hotel Orders</h1>
        <div className="orders-controls">
          <select
            value={selectedBookingId}
            onChange={(e) => setSelectedBookingId(e.target.value)}
            className="booking-select"
          >
            <option value="">All Bookings</option>
            {bookings
              .filter(booking => orders.some(o => o.bookingId === booking.id))
              .map(booking => (
                <option key={booking.id} value={booking.id}>
                  {booking.guestName} (Room {booking.roomNumber})
                </option>
              ))}
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="status-select"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          
          <button 
            className="btn btn-primary" 
            onClick={() => handleAddOrder()}
          >
            Add Order
          </button>
        </div>
      </div>

      {statusFilteredOrders.length === 0 ? (
        <p className="no-orders">No orders found matching your criteria.</p>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="orders-table">
            <div className="table-header">
              <div>Order ID</div>
              <div>Guest</div>
              <div>Room</div>
              <div>Items</div>
              <div>Total</div>
              <div>Status</div>
              <div>Actions</div>
            </div>
            <div className="table-body">
              {statusFilteredOrders.map((order) => {
                const booking = getBookingInfo(order.bookingId);
                return (
                  <div className="table-row" key={order.id}>
                    <div className="order-id">#{order.id.slice(0, 6)}</div>
                    <div className="guest-name">{booking.guestName}</div>
                    <div className="room-number">Room {booking.roomNumber}</div>
                    <div className="order-items">
                      {order.items.map((item, index) => (
                        <div key={index} className="item-row">
                          <span>{item.name} ×{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="order-total">₦{order.total.toLocaleString()}</div>
                    <div className="order-status">
                      <span className={`status-badge ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="order-actions">
                      <button 
                        className="btn btn-edit" 
                        onClick={() => handleEditOrder(order)}
                      >
                        Edit
                      </button>
                      {order.status !== "Cancelled" && (
                        <button
                          className="btn btn-cancel"
                          onClick={() => handleStatusChange(order.id, "Cancelled")}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="orders-cards">
            {statusFilteredOrders.map((order) => {
              const booking = getBookingInfo(order.bookingId);
              return (
                <div className="order-card" key={order.id}>
                  <div className="card-header">
                    <div className="order-id">#{order.id.slice(0, 6)}</div>
                    <div className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </div>
                    <div className="order-total">₦{order.total.toLocaleString()}</div>
                  </div>
                  <div className="card-body">
                    <div className="guest-info">
                      <h3>{booking.guestName}</h3>
                      <div className="room-dates">
                        <span>Room {booking.roomNumber}</span>
                        <span className="stay-dates">
                          {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                        </span>
                      </div>
                    </div>
                    <div className="order-items">
                      <h4>Items Ordered</h4>
                      {order.items.map((item, index) => (
                        <div key={index} className="item-row">
                          <span className="item-name">{item.name}</span>
                          <span className="item-quantity">×{item.quantity}</span>
                          <span className="item-price">₦{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="card-actions">
                    <button 
                      className="btn btn-edit" 
                      onClick={() => handleEditOrder(order)}
                    >
                      Edit Order
                    </button>
                    {order.status !== "Cancelled" && (
                      <button
                        className="btn btn-cancel"
                        onClick={() => handleStatusChange(order.id, "Cancelled")}
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {showModal && (
        <OrderModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          editOrder={editOrder}
          bookingId={selectedBookingId}
        />
      )}
    </div>
  );
}