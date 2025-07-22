import { useEffect, useState } from 'react'; // You need to import useState from React
import useBookingStore from '../store/useBookingStore';
import { isRoomAvailable, isValidDateRange } from '../utils/bookingValidation'; // Import your validation function
import { Toaster, toast} from 'react-hot-toast';
import useGuestStore from '../store/useGuestStore'; // Import guest store

import useRoomStore from '../store/useRoomStore'; // Import room store

export default function BookingModal({ isVisible, onClose, onEdit }) {
  const [formData, setFormData] = useState({
    guestName: '',
    roomNumber: '',
    checkIn: '',
    email: '',
    phone: '',
    address: '',
    checkOut: '',
    bookingStatus: ''
  });
  const isEditMode = Boolean(onEdit);
  const addGuests = useGuestStore(state => state.addGuestIfNotExists);
  const addBooking = useBookingStore(state => state.addBooking);
 
  useEffect(()=> {
    if (isEditMode) {
      setFormData({
        guestName: onEdit.guestName,
        roomNumber: onEdit.roomNumber,
        email: onEdit.email,
        phone: onEdit.phone,
        address: onEdit.address,
        checkIn: onEdit.checkIn,
        checkOut: onEdit.checkOut,
        bookingStatus: onEdit.bookingStatus
      });
    }else{
      setFormData({
        guestName: '',
        roomNumber: '',
        email: '',
        phone: '',
        address: '',
        checkIn: '',
        checkOut: '',
        bookingStatus: ''
      });
    }
  }, [isEditMode, onEdit]);

 
  const bookings = useBookingStore(state => state.bookings); // Get bookings from store
  const rooms = useRoomStore(state => state.rooms);
  const addGuest = useGuestStore(state => state.addGuestIfNotExists);
  const closeModal = onClose;
   if (!isVisible) return null;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleBookingSubmit = (e) => {
    e.preventDefault();
  if (
    !formData.guestName || !formData.email || !formData.phone || !formData.address ||
    !formData.roomNumber || !formData.checkIn || !formData.checkOut || !formData.bookingStatus
  ) {
    toast.error("Please fill in all fields.");
    return;
  }

     const newBooking = {
    id: Date.now(),
    guestName: String(formData.guestName), // Ensure string
    roomNumber: Number(formData.roomNumber) || 0, // Ensure number (fallback to 0)
    email: String(formData.email), // Ensure string
    phone: String(formData.phone), // Ensure string
    address: String(formData.address), // Ensure string
    checkIn: String(formData.checkIn), // Ensure string
    checkOut: String(formData.checkOut), // Ensure string
    bookingStatus: String(formData.bookingStatus), // Ensure string
  };
  if(!isValidDateRange(newBooking.checkIn, newBooking.checkOut)) {
    toast.error("Invalid booking data. Please check your inputs.");
    return;
  }
  if(!isRoomAvailable(bookings, newBooking.roomNumber, newBooking.checkIn, newBooking.checkOut)) {
    toast.error("Room is not available for the selected dates.");
    return;
  }
  
  addBooking(newBooking);
  addGuest(newBooking.guestName); // Add guest if not exists
    toast.success("Booking added successfully!");
    // Reset form data
  setFormData({
    guestName: '',
    roomNumber: '',
    email: '',
    phone: '',
    address: '',
    checkIn: '',
      checkOut: '',
      bookingStatus: ''
    });
    closeModal();
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <Toaster position="top-right" />
        <h2 className="modal-title">{isEditMode ? 'Edit Booking' : 'New Booking'}</h2>

        <form className="modal-form" onSubmit={handleBookingSubmit}>
          <label>Guest Name</label>
          <input
            type="text"
            name="guestName"
            placeholder="John Doe"
            value={formData.guestName}
            onChange={handleChange}
          />

          <label>Room Number</label>
        <select name="roomNumber" value={formData.roomNumber} onChange={handleChange}>
          <option value="" disabled>Select Room</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id} disabled={isEditMode? true:false}>
              {room.id}
            </option>
          ))}
        </select>
        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="guest@example.com"
          value={formData.email}
          onChange={handleChange}
        />

        <label>Phone</label>
        <input
          type="tel"
          name="phone"
          placeholder="e.g. +2348012345678"
          value={formData.phone}
          onChange={handleChange}
        />

        <label>Address</label>
        <input
          type="text"
          name="address"
          placeholder="123 Main Street"
          value={formData.address}
          onChange={handleChange}
        />

          <label>Check-in Date</label>
          <input
            type="date"
            name="checkIn"
            value={formData.checkIn} // Fixed: should be formData.checkIn
            onChange={handleChange}
          />

          <label>Check-out Date</label>
          <input
            type="date"
            name="checkOut"
            value={formData.checkOut} // Fixed: should be formData.checkOut
            onChange={handleChange}
          />

          <label>Status</label>
          <select
            name="bookingStatus"
            value={formData.bookingStatus}
            onChange={handleChange}
          >
            <option value="" disabled>Select status</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Checked-in">Checked-in</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <div className="modal-actions">
            <button type="submit" className="btn-submit">
              Save
            </button>
             <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}