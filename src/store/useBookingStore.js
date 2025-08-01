// src/store/useBookingStore.js
import { create } from 'zustand';
import useRoomStore from './useRoomStore';
import { v4 as uuidv4 } from 'uuid';

const useBookingStore = create((set, get) => {
  let initialBookings = [];
  let initialHistory = [];

  try {
    const saved = localStorage.getItem('bookings');
    if (saved) {
      const parsed = JSON.parse(saved);
      initialBookings = Array.isArray(parsed) ? parsed : [];
    }

    const savedHistory = localStorage.getItem('bookingHistory');
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory);
      initialHistory = Array.isArray(parsedHistory) ? parsedHistory : [];
    }
  } catch (error) {
    console.error("Error loading bookings or history from localStorage:", error);
  }

  return {
    bookings: initialBookings,
    history: initialHistory,

    // 🔹 History logger
    addToHistory: (action, details) => {
      const newEntry = {
        id: uuidv4().slice(0, 6),
        action,
        timestamp: new Date().toISOString(),
        details,
      };
      set((state) => {
        const updatedHistory = [...state.history, newEntry];
        localStorage.setItem('bookingHistory', JSON.stringify(updatedHistory));
        return { history: updatedHistory };
      });
    },

    addBooking: (booking) =>
      set((state) => {
        const updatedBookings = [...state.bookings, booking];
        localStorage.setItem("bookings", JSON.stringify(updatedBookings));
          // Update room status
          if (booking.bookingStatus !== "Cancelled") {
            useRoomStore.getState().markRoomAsOccupied(booking.roomNumber);
          }

        get().addToHistory("Added Booking", {
          id: booking.id,
          guest: booking.guestName,
          room: booking.roomNumber,
          checkIn: booking.checkInDate,
          checkOut: booking.checkOutDate,
        });
        return { bookings: updatedBookings };
      }),

    removeBooking: (bookingId) => {
      set((state) => {
        const removed = state.bookings.find(b => b.id === bookingId);
        const updatedBookings = state.bookings.filter(booking => booking.id !== bookingId);
        localStorage.setItem('bookings', JSON.stringify(updatedBookings));
        get().addToHistory("Removed Booking", {
          id: bookingId,
          guest: removed?.guestName || "Unknown",
          room: removed?.roomNumber || "Unknown",
        });
        return { bookings: updatedBookings };
      });
    },

      updateBooking: (updatedBooking) => {
        set((state) => {
          const updatedBookings = state.bookings.map(booking =>
            booking.id === updatedBooking.id ? updatedBooking : booking
          );
          localStorage.setItem('bookings', JSON.stringify(updatedBookings));
          get().addToHistory("Updated Booking", {
            id: updatedBooking.id,
            guest: updatedBooking.guestName,
            room: updatedBooking.roomNumber,
            status: updatedBooking.status,
          });
          return { bookings: updatedBookings };
        });
      },
      updateBookingStatus: (id, newStatus) => {
      const updatedBookings = get().bookings.map((b) =>
      b.id === id ? { ...b, bookingStatus: newStatus } : b
      );
      localStorage.setItem("bookings", JSON.stringify(updatedBookings));
      set({ bookings: updatedBookings });

      const booking = updatedBookings.find((b) => b.id === id);

      // Update room status depending on new booking status
      if (newStatus === "Checked-in" || newStatus === "Confirmed") {
        useRoomStore.getState().markRoomAsOccupied(booking.roomNumber);
      } else if (newStatus === "Completed" || newStatus === "Cancelled") {
        useRoomStore.getState().markRoomAsAvailable(booking.roomNumber);
      }

      get().addToHistory(`Booking ${newStatus}`, {
        guest: booking?.guestName,
        room: booking?.roomNumber,
      });
      },
      getBookingById: (id) => {
      const state = get();
      return state.bookings.find(booking => booking.id === id);
    },
  };
});

export default useBookingStore;
