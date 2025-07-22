// src/store/useRoomStore.js
import { create } from 'zustand';

const useRoomStore = create((set) => {
  let initialState = [];
  try{
    const saved = localStorage.getItem('rooms');
    if (saved) {
      const parsed = JSON.parse(saved);
      initialState = Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.error("Error loading rooms from localStorage:", error);
    initialState = [];
  }
  return {
    rooms: initialState,
  addRoom: (room) =>
    set((state) => {
      const isRoomExists = state.rooms.some(r => r.id === room.id);
      if (isRoomExists) {
        console.warn("Room already exists:", room.id);
        return state;
      }
      const updatedRooms = [...state.rooms, room];
      localStorage.setItem("rooms", JSON.stringify(updatedRooms));
      return { rooms: updatedRooms };
    }),
  removeRoom: (roomId) => {
      set((state) => {
        const updatedRooms = state.rooms.filter(room => room.id !== roomId);
        localStorage.setItem('rooms', JSON.stringify(updatedRooms));
        return { rooms: updatedRooms };
      });
    },
    updateRoom: (updatedRoom) => {
      set((state) => {
        const updatedRooms = state.rooms.map(room =>
          room.id === updatedRoom.id ? updatedRoom : room
        );
        localStorage.setItem('rooms', JSON.stringify(updatedRooms));
        return { rooms: updatedRooms };
      });
    }
  };
})
export default useRoomStore;
