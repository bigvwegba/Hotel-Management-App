import React, { useEffect, useState } from "react";
import useBookingStore from "../store/useBookingStore";
import useRoomStore from "../store/useRoomStore";
import useOrderStore from "../store/useOrderStore";
import useServiceStore from "../store/useServiceStore";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from 'uuid';


export default function BookingModal({ isVisible, onClose, onEdit }) {
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

  const handleSubmit = () => {
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
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{onEdit ? "Edit Booking" : "Add Booking"}</h2>
          <button onClick={onClose} className="close-button">&times;</button>
        </div>

        <div className="modal-body">
          <input
            type="text"
            name="guestName"
            placeholder="Guest Name"
            value={bookingData.guestName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={bookingData.email}
            onChange={handleChange}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={bookingData.phone}
            onChange={handleChange}
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={bookingData.address}
            onChange={handleChange}
          />

          <select
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

          <input
            type="date"
            name="checkIn"
            value={bookingData.checkIn}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
          />
          <input
            type="date"
            name="checkOut"
            value={bookingData.checkOut}
            onChange={handleChange}
            min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
          />

          <select
            name="bookingStatus"
            value={bookingData.bookingStatus}
            onChange={handleChange}
          >
            <option value="Confirmed">Confirmed</option>
            <option value="Checked-in">Checked-in</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <div className="services-section">
            <h3>Additional Services</h3>
            <div className="services-grid">
              {services.map(service => (
                <div
                  key={service.id}
                  className={`service-card ${
                    bookingData.services.some(s => s.id === service.id) ? 'selected' : ''
                  }`}
                  onClick={() => handleServiceToggle(service)}
                >
                  <h4>{service.name}</h4>
                  <p>₦{service.price}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="cost-display">
            <p>Total: ₦{calculateCost().toLocaleString()}</p>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-outline">
            Cancel
          </button>
          <button onClick={handleSubmit} className="btn-primary">
            {onEdit ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}