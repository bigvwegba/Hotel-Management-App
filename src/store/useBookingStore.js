import {create} from 'zustand';
const useBookingStore = create((set) => {
  let initialState = [];
  try {
    const saved = localStorage.getItem('bookings');
    if (saved) {
      const parsed = JSON.parse(saved);
      initialState = Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.error("Error loading bookings from localStorage:", error);
    initialState = [];
  }

  return {
    bookings: initialState,
    addBooking: (booking) =>
      set((state) => {
        const updatedBookings = [...state.bookings, booking];
        localStorage.setItem("bookings", JSON.stringify(updatedBookings));
        return { bookings: updatedBookings };
      }),
    removeBooking: (bookingId) => {
      set((state) => {
        const updatedBookings = state.bookings.filter(booking => booking.id !== bookingId);
        localStorage.setItem('bookings', JSON.stringify(updatedBookings));
        return { bookings: updatedBookings };
      });
    },
    updateBooking: (updatedBooking) => {
      set((state) => {
        const updatedBookings = state.bookings.map(booking =>
          booking.id === updatedBooking.id ? updatedBooking : booking
        );
        localStorage.setItem('bookings', JSON.stringify(updatedBookings));
        return { bookings: updatedBookings };
      });
    }
  };
})
export default useBookingStore;