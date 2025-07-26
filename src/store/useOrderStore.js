// src/store/useOrderStore.js
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

const useOrderStore = create((set) => ({
  orders: [],

  addOrder: (order) =>
    set((state) => ({
      orders: [...state.orders, { ...order, id: uuidv4() }],
    })),

  updateOrder: (updatedOrder) =>
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === updatedOrder.id ? updatedOrder : order
      ),
    })),

  removeOrder: (orderId) =>
    set((state) => ({
      orders: state.orders.filter((order) => order.id !== orderId),
    })),
}));

export default useOrderStore;
