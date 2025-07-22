// src/store/useGuestStore.js
import { create } from 'zustand';

const useGuestStore = create((set, get) => ({
  guests: [],
  addGuestIfNotExists: (guestName) => {
    const { guests } = get();
    const exists = guests.some(g => g.name.toLowerCase() === guestName.toLowerCase());
    if (!exists) {
      const newGuest = {
        id: Date.now(),
        name: guestName,
        createdAt: new Date().toISOString()
      };
      set({ guests: [...guests, newGuest] });
    }
  }
}));

export default useGuestStore;
