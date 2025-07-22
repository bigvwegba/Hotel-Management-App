// src/pages/Bookings.jsx
import React, { useState } from "react";
import BookingModal from "../components/BookingModal";
import useBookingStore from "../store/useBookingStore";
import useRoomStore from "../store/useRoomStore";

export default function Bookings() {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const bookings = useBookingStore(state => state.bookings);
  const [editBooking, setEditBooking] = useState(null);
  const cancelBooking = useBookingStore(state => state.removeBooking);
   const updateBooking = useBookingStore(state => state.updateBooking);
   const [filters, setFilters] = useState({
    guestName: '',
    bookingStatus: '',
    checkIn: ''
   })

   const handleFilterChange = (e) => {
    const {name, value} = e.target;
      setFilters(prevFilters => ({
        ...prevFilters,
        [name]: value
    }));
   }

  const handleAddBooking = () => {
    setShowBookingModal(true);
    setEditBooking(null);
    
    
  };

  const handleUpdateBooking = (booking) => {
    setShowBookingModal(true);
    setEditBooking(booking);
    const confirm = window.confirm("Are you sure you want to edit this booking?");
    if (confirm) {
      updateBooking(booking);
    }
  }
  const handleCancelBooking = (booking) => {
    const confirm = window.confirm("Are you sure you want to cancel this booking?");
    if (confirm) {
      cancelBooking(booking.id);
    }
  };
  return (
    <div className="bookings-page">
      <div className="bookings-header">
        <h1 className="page-title">Bookings</h1>
        <button className="btn-primary" onClick={handleAddBooking}>
          Add Booking
        </button>
      </div>
    <div className="filter-bar">
      <input
        type="text"
        name="guestName"
        placeholder="Search Guest"
        value={filters.guestName}
        onChange={handleFilterChange}
        className="filter-input"
      />

      <select
        name="bookingStatus"
        value={filters.bookingStatus}
        onChange={handleFilterChange}
        className="filter-select"
      >
        <option value="">All Statuses</option>
        <option value="Confirmed">Confirmed</option>
        <option value="Checked-in">Checked-in</option>
        <option value="Completed">Completed</option>
        <option value="Cancelled">Cancelled</option>
      </select>

      <input
        type="date"
        name="checkIn"
        value={filters.checkIn}
        onChange={handleFilterChange}
        className="filter-date"
      />
    </div>

  <div className="booking-grid">
    {bookings.length === 0 ? (
      <p>No bookings available.</p>
    ) : (
      bookings
        .filter((booking) => {
          const guestMatch = booking.guestName
            .toLowerCase()
            .includes(filters.guestName.toLowerCase());

          const statusMatch = filters.bookingStatus
            ? booking.bookingStatus === filters.bookingStatus
            : true;

          const checkInMatch = filters.checkIn
            ? booking.checkIn === filters.checkIn
            : true;

          return guestMatch && statusMatch && checkInMatch;
        })
        .map((booking) => (
          <div className="booking-card" key={booking.id}>
            <h2>Room {booking.roomNumber || "N/A"}</h2>
            <p>Guest: {booking.guestName || "N/A"}</p>
            <p>Check-in: {booking.checkIn || "Not set"}</p>
            <p>Check-out: {booking.checkOut || "Not set"}</p>
            <p>
              Status:{" "}
              <span className={`status ${booking.bookingStatus?.toLowerCase() || ""}`}>
                {booking.bookingStatus || "Pending"}
              </span>
            </p>
            <div className="guest-actions">
      <button className="btn-outline" onClick={() => handleUpdateBooking(booking)}>
        Edit
      </button>
      <button className="btn-outline warning" onClick={() => handleCancelBooking(booking)}>
        Cancel
      </button>
    </div>
          </div>
        ))
    )}
  </div>

      
      {/* Booking modal */}
      <BookingModal 
        isVisible={showBookingModal} onEdit={editBooking} 
        onClose={() => setShowBookingModal(false)}
      />
    </div>
  );
}
