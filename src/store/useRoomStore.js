// src/store/useRoomStore.js
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import toast from "react-hot-toast";

const useRoomStore = create((set, get) => {
  let initialRooms = [];
  let initialHistory = [];

  try {
    const savedRooms = localStorage.getItem('rooms');
    if (savedRooms) {
      const parsed = JSON.parse(savedRooms);
      initialRooms = Array.isArray(parsed) ? parsed : [];
    }

    const savedHistory = localStorage.getItem('roomHistory');
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory);
      initialHistory = Array.isArray(parsedHistory) ? parsedHistory : [];
    }
  } catch (error) {
    toast.error("Error loading data from localStorage:", error);
  }

  return {
    rooms: initialRooms,
    history: initialHistory,

    // 🔸 Universal History Logger
    addToHistory: (action, details) => {
      const newEntry = {
        id: uuidv4().substring(0, 6),
        action,
        timestamp: new Date().toISOString(),
        details,
      };
      set((state) => {
        const updatedHistory = [...state.history, newEntry];
        localStorage.setItem('roomHistory', JSON.stringify(updatedHistory));
        return { history: updatedHistory };
      });
    },

    addRoom: (room) => {
      set((state) => {
        const isRoomExists = state.rooms.some(r => r.id === room.id);
        if (isRoomExists) {
          toast.error(`Room already exists: ${room.id}`);
          return state;
        }
        const updatedRooms = [...state.rooms, room];
        localStorage.setItem("rooms", JSON.stringify(updatedRooms));
        get().addToHistory("Added Room", {
          id: room.id,
          number: room.roomNumber,
          type: room.type,
          status: room.status,
        });
        return { rooms: updatedRooms };
      });
    },

    removeRoom: (roomId) => {
      set((state) => {
        const removed = state.rooms.find(r => r.id === roomId);
        const updatedRooms = state.rooms.filter(room => room.id !== roomId);
        localStorage.setItem('rooms', JSON.stringify(updatedRooms));
        get().addToHistory("Removed Room", {
          id: roomId,
          number: removed?.roomNumber || "Unknown",
        });
        return { rooms: updatedRooms };
      });
    },

    updateRoom: (updatedRoom) => {
      set((state) => {
        const updatedRooms = state.rooms.map(room =>
          room.id === updatedRoom.id ? updatedRoom : room
        );
        localStorage.setItem('rooms', JSON.stringify(updatedRooms));
        get().addToHistory("Updated Room", {
          id: updatedRoom.id,
          number: updatedRoom.roomNumber,
          newStatus: updatedRoom.status,
        });
        return { rooms: updatedRooms };
      });
    },

    markRoomAsOccupied: (id) => {
      const updatedRooms = get().rooms.map(room =>
        room.id === id ? { ...room, status: "Occupied" } : room
      );
      localStorage.setItem('rooms', JSON.stringify(updatedRooms));
      set({ rooms: updatedRooms });
      const room = get().getRoomById(id);
      get().addToHistory("Marked as Occupied", {
        id,
        number: room?.roomNumber || "Unknown",
      });
    },

    markRoomAsAvailable: (id) => {
      const updatedRooms = get().rooms.map(room =>
        room.id === id ? { ...room, status: "Available" } : room
      );
      localStorage.setItem('rooms', JSON.stringify(updatedRooms));
      set({ rooms: updatedRooms });
      const room = get().getRoomById(id);
      get().addToHistory("Marked as Available", {
        id,
        number: room?.roomNumber || "Unknown",
      });
    },

    getAvailableRooms: () => {
      return get().rooms.filter(room => room.status === "Available");
    },

    getRoomById: (id) => {
      return get().rooms.find(room => room.id === id);
    },
  };
});

export default useRoomStore;
