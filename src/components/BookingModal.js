import React, { useEffect, useState } from "react";
import useBookingStore from "../store/useBookingStore";
import useRoomStore from "../store/useRoomStore";
import useOrderStore from "../store/useOrderStore";
import useServiceStore from "../store/useServiceStore";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from 'uuid';
import '../styles/modal.css';
import '../styles/bookingModal.css';

export default function BookingModal({ isVisible, onClose, onEdit }) {
  console.log(isVisible+ " BookingModal visibility");
  // Stores
  const { addBooking, updateBooking } = useBookingStore();
  const { rooms, getAvailableRooms, markRoomAsOccupied, markRoomAsAvailable } = useRoomStore();
  const addOrder = useOrderStore((state) => state.addOrder);
  const { services } = useServiceStore();

  // State
  const [bookingData, setBookingData] = useState({
    guestName: "",
    email: "",
    phone: "",
    address: "",
    roomNumber: "",
    checkIn: "",
    checkOut: "",
    bookingStatus: "Confirmed",
    services: [],
  });

  const availableRooms = getAvailableRooms();

  useEffect(() => {
    if (onEdit) {
      setBookingData(onEdit);
    }
  }, [onEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceToggle = (service) => {
    setBookingData(prev => {
      const existing = prev.services.some(s => s.id === service.id);
      return {
        ...prev,
        services: existing
          ? prev.services.filter(s => s.id !== service.id)
          : [...prev.services, service]
      };
    });
  };

  const calculateCost = () => {
    const room = rooms.find(r => r.roomNumber === bookingData.roomNumber);
    if (!room) return 0;
    
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)) || 1;
    
    const servicesCost = bookingData.services.reduce((sum, s) => sum + (s.price || 0), 0);
    return (room.price * nights) + servicesCost;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!bookingData.guestName || !bookingData.roomNumber) {
      toast.error("Guest name and room number are required");
      return;
    }

    const bookingId = onEdit?.id || uuidv4().substring(0, 6);
    const finalBooking = { ...bookingData, id: bookingId };

    if (onEdit) {
      updateBooking(finalBooking);
    } else {
      addBooking(finalBooking);
      addOrder({
        bookingId,
        guestName: finalBooking.guestName,
        roomNumber: finalBooking.roomNumber,
        date: finalBooking.checkIn,
        amount: calculateCost(),
        services: finalBooking.services,
      });
    }

    if (["Confirmed", "Checked-in"].includes(finalBooking.bookingStatus)) {
      markRoomAsOccupied(finalBooking.roomNumber);
    } else if (["Cancelled", "Completed"].includes(finalBooking.bookingStatus)) {
      markRoomAsAvailable(finalBooking.roomNumber);
    }

    onClose();
  };

  if (!isVisible) return null;

  return (
     <div className="booking-modal-overlay">
      <div className="booking-modal-main" onClick={(e) => e.stopPropagation()}>
        <div className="booking-modal-header">
          <h2 className="booking-modal-title">
            {onEdit ? "Edit Booking" : "New Booking"}
          </h2>
          <button className="booking-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="booking-modal-body">
            {/* Guest Information */}
            <div className="booking-modal-input-group">
              <label className="booking-modal-label">Guest Name</label>
              <input
                className="booking-modal-input"
                type="text"
                name="guestName"
                value={bookingData.guestName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="booking-modal-input-group">
              <label className="booking-modal-label">Email</label>
              <input
                className="booking-modal-input"
                type="email"
                name="email"
                value={bookingData.email}
                onChange={handleChange}
              />
            </div>

            {/* Room Selection */}
            <div className="booking-modal-input-group">
              <label className="booking-modal-label">Room</label>
              <select
                className="booking-modal-input"
                name="roomNumber"
                value={bookingData.roomNumber}
                onChange={handleChange}
                required
              >
                <option value="">Select Room</option>
                {availableRooms.map(room => (
                  <option key={room.id} value={room.roomNumber}>
                    {room.roomNumber} - {room.type} (₦{room.price})
                  </option>
                ))}
              </select>
            </div>

            <div className="booking-modal-input-group">
              <label className="booking-modal-label">Phone</label>
              <input
                className="booking-modal-input"
                type="tel"
                name="phone"
                value={bookingData.phone}
                onChange={handleChange}
              />
            </div>

            {/* Dates */}
            <div className="booking-modal-input-group">
              <label className="booking-modal-label">Check-in</label>
              <input
                className="booking-modal-input"
                type="date"
                name="checkIn"
                value={bookingData.checkIn}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="booking-modal-input-group">
              <label className="booking-modal-label">Check-out</label>
              <input
                className="booking-modal-input"
                type="date"
                name="checkOut"
                value={bookingData.checkOut}
                onChange={handleChange}
                min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Status */}
            <div className="booking-modal-input-group">
              <label className="booking-modal-label">Status</label>
              <select
                className="booking-modal-input"
                name="bookingStatus"
                value={bookingData.bookingStatus}
                onChange={handleChange}
              >
                <option value="Confirmed">Confirmed</option>
                <option value="Checked-in">Checked-in</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="booking-modal-input-group">
              <label className="booking-modal-label">Address</label>
              <input
                className="booking-modal-input"
                type="text"
                name="address"
                value={bookingData.address}
                onChange={handleChange}
              />
            </div>

            {/* Services Section */}
            <div className="booking-modal-services">
              <h3 className="booking-modal-services-title">Additional Services</h3>
              <div className="booking-modal-services-grid">
                {services.map(service => (
                  <div
                    key={service.id}
                    className={`booking-modal-service-card ${
                      bookingData.services.some(s => s.id === service.id) ? 'selected' : ''
                    }`}
                    onClick={() => handleServiceToggle(service)}
                  >
                    <div className="booking-modal-service-name">{service.name}</div>
                    <div className="booking-modal-service-price">₦{service.price}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="booking-modal-total">
              Total: ₦{calculateCost().toLocaleString()}
            </div>
          </div>

          <div className="booking-modal-footer">
            <button 
              type="button" 
              className="booking-modal-btn booking-modal-btn-outline"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="booking-modal-btn booking-modal-btn-primary"
            >
              {onEdit ? "Update Booking" : "Confirm Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}