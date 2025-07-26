// src/store/useServiceStore.js
import { create } from 'zustand';

const useServiceStore = create((set) => ({
  services: [
    { id: 1, name: 'Breakfast', price: 1500 },
    { id: 2, name: 'Airport Transfer', price: 5000 },
    { id: 3, name: 'Laundry', price: 2500 },
    { id: 4, name: 'Spa Package', price: 10000 },
  ],
  
  // Optional methods for managing services
  addService: (service) => set((state) => ({ 
    services: [...state.services, service] 
  })),
  updateService: (id, updates) => set((state) => ({
    services: state.services.map(service => 
      service.id === id ? { ...service, ...updates } : service
    )
  })),
  removeService: (id) => set((state) => ({
    services: state.services.filter(service => service.id !== id)
  })),
}));

export default useServiceStore;