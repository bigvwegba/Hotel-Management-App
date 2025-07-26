import React, { useState } from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CSVLink } from "react-csv";
import BookingModal from "../components/BookingModal";
import useBookingStore from "../store/useBookingStore";
import useRoomStore from "../store/useRoomStore";


const localizer = momentLocalizer(moment);

export default function Bookings() {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [editBooking, setEditBooking] = useState(null);
  const [view, setView] = useState('list');
  const [filters, setFilters] = useState({
    guestName: "",
    bookingStatus: "",
    roomType: ""
  });

  const { bookings, removeBooking } = useBookingStore();
  const { rooms } = useRoomStore();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesGuest = booking.guestName?.toLowerCase().includes(filters.guestName.toLowerCase());
    const matchesStatus = filters.bookingStatus ? booking.bookingStatus === filters.bookingStatus : true;
    const matchesRoomType = filters.roomType 
      ? rooms.find(r => r.roomNumber === booking.roomNumber)?.type === filters.roomType
      : true;
    
    return matchesGuest && matchesStatus && matchesRoomType;
  });

  const calendarEvents = filteredBookings.map(booking => ({
    id: booking.id,
    title: `${booking.guestName} - Room ${booking.roomNumber}`,
    start: new Date(booking.checkIn),
    end: new Date(booking.checkOut),
    status: booking.bookingStatus
  }));

  const eventStyleGetter = (event) => {
    let backgroundColor = '#3174ad';
    if (event.status === 'Checked-in') backgroundColor = '#5cb85c';
    if (event.status === 'Cancelled') backgroundColor = '#d9534f';
    if (event.status === 'Completed') backgroundColor = '#5bc0de';
    
    return {
      style: {
        backgroundColor,
        borderRadius: '3px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  const handleSelectEvent = (event) => {
    const booking = bookings.find(b => b.id === event.id);
    if (booking) {
      setEditBooking(booking);
      setShowBookingModal(true);
    }
  };

  const calculateBookingTotal = (booking) => {
    const room = rooms.find(r => r.roomNumber === booking.roomNumber);
    const nights = moment(booking.checkOut).diff(moment(booking.checkIn), 'days');
    const roomCost = room?.price ? room.price * nights : 0;
    const servicesCost = booking.services?.reduce((sum, s) => sum + (s.price || 0), 0) || 0;
    return roomCost + servicesCost;
  };

  const csvData = filteredBookings.map(booking => {
    const room = rooms.find(r => r.roomNumber === booking.roomNumber);
    return {
      'Booking ID': booking.id,
      'Guest Name': booking.guestName,
      'Room Number': booking.roomNumber,
      'Room Type': room?.type || 'N/A',
      'Check-in': moment(booking.checkIn).format('YYYY-MM-DD'),
      'Check-out': moment(booking.checkOut).format('YYYY-MM-DD'),
      'Status': booking.bookingStatus,
      'Total Amount': `₦${calculateBookingTotal(booking).toLocaleString()}`
    };
  });

  return (
    <div className="bookings-page">
      <div className="page-header">
        <h1>Bookings Management</h1>
        <div className="header-actions">
          <button 
            className={`view-toggle ${view === 'list' ? 'active' : ''}`}
            onClick={() => setView('list')}
          >
            List View
          </button>
          <button 
            className={`view-toggle ${view === 'calendar' ? 'active' : ''}`}
            onClick={() => setView('calendar')}
          >
            Calendar View
          </button>
          <CSVLink 
            data={csvData} 
            filename={"bookings-export.csv"}
            className="btn-outline"
          >
            Export to CSV
          </CSVLink>
          <button 
            className="btn-primary"
            onClick={() => {
              setEditBooking(null);
              setShowBookingModal(true);
            }}
          >
            New Booking
          </button>
        </div>
      </div>

      <div className="filters-container">
        <input
          type="text"
          name="guestName"
          placeholder="Search Guest"
          value={filters.guestName}
          onChange={handleFilterChange}
        />
        <select
          name="bookingStatus"
          value={filters.bookingStatus}
          onChange={handleFilterChange}
        >
          <option value="">All Statuses</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Checked-in">Checked-in</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <select
          name="roomType"
          value={filters.roomType}
          onChange={handleFilterChange}
        >
          <option value="">All Room Types</option>
          {[...new Set(rooms.map(r => r.type))].map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {view === 'list' ? (
        <div className="bookings-table">
          <div className="table-header">
            <div>Guest</div>
            <div>Room</div>
            <div>Dates</div>
            <div>Status</div>
            <div>Total</div>
            <div>Actions</div>
          </div>
          
          {filteredBookings.length === 0 ? (
            <div className="empty-state">No bookings found</div>
          ) : (
            filteredBookings.map(booking => (
              <div className="table-row" key={booking.id}>
                <div>
                  <strong>{booking.guestName}</strong>
                  <div className="text-muted">{booking.email || 'No email'}</div>
                </div>
                <div>
                  <div>Room {booking.roomNumber}</div>
                  <div className="text-muted">
                    {rooms.find(r => r.roomNumber === booking.roomNumber)?.type || 'N/A'}
                  </div>
                </div>
                <div>
                  <div>{moment(booking.checkIn).format('MMM D, YYYY')}</div>
                  <div className="text-muted">
                    to {moment(booking.checkOut).format('MMM D, YYYY')}
                  </div>
                </div>
                <div>
                  <span className={`status-badge ${booking.bookingStatus.toLowerCase()}`}>
                    {booking.bookingStatus}
                  </span>
                </div>
                <div>₦{calculateBookingTotal(booking).toLocaleString()}</div>
                <div className="actions">
                  <button 
                    className="btn-icon"
                    onClick={() => {
                      setEditBooking(booking);
                      setShowBookingModal(true);
                    }}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button 
                    className="btn-icon danger"
                    onClick={() => {
                      if (window.confirm("Cancel this booking?")) {
                        removeBooking(booking.id);
                      }
                    }}
                    title="Cancel"
                  >
                    ❌
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="calendar-container">
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 700 }}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
            views={['month', 'week', 'day', 'agenda']}
            defaultView="month"
          />
        </div>
      )}

      {showBookingModal && (
        <BookingModal
          isVisible={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          onEdit={editBooking}
        />
      )}
    </div>
  );
}