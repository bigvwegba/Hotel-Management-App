import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

const validStatuses = ['Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'];

const useOrderStore = create(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: (orderData) => {
        try {
          if (!orderData?.bookingId) {
            console.error('Booking ID is required');
            return false;
          }

          if (!Array.isArray(orderData?.items) || orderData.items.length === 0) {
            console.error('Order must contain at least one item');
            return false;
          }

          const calculatedTotal = orderData.items.reduce(
            (sum, item) => sum + ((Number(item.price) || 0) * (Number(item.quantity) || 1)),
            0
          );

          const newOrder = {
            id: orderData.id || uuidv4(),
            bookingId: orderData.bookingId,
            items: orderData.items.map((item) => ({
              id: item.id || uuidv4(),
              name: item.name || 'Unnamed Item',
              price: Number(item.price) || 0,
              quantity: Number(item.quantity) || 1,
              productId: item.productId || null,
              notes: item.notes || '',
            })),
            total: Number(orderData.totalAmount) || calculatedTotal,
            status: validStatuses.includes(orderData.status) ? orderData.status : 'Pending',
            createdAt: orderData.createdAt || new Date().toISOString(),
            updatedAt: orderData.updatedAt || null,
            deliveredAt: orderData.deliveredAt || null,
            orderType: orderData.orderType || 'Room Service',
            notes: orderData.notes || '',
            preparedBy: orderData.preparedBy || '',
            deliveredBy: orderData.deliveredBy || '',
          };

          set((state) => ({
            orders: [...state.orders, newOrder].sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            )
          }));

          return true;
        } catch (error) {
          console.error('Error adding order:', error);
          return false;
        }
      },

      updateOrder: (updatedData) => {
        try {
          const data = JSON.parse(JSON.stringify(updatedData));
          
          if (!data?.id) {
            console.error('Order ID is required for update');
            return false;
          }

          const updatedItems = data.items
            ? data.items.map((item) => ({
                id: item.id || uuidv4(),
                name: item.name || get().orders
                  .find((o) => o.id === data.id)
                  ?.items.find((i) => i.id === item.id)?.name || 'Unnamed Item',
                price: Number(item.price) || get().orders
                  .find((o) => o.id === data.id)
                  ?.items.find((i) => i.id === item.id)?.price || 0,
                quantity: Number(item.quantity) || get().orders
                  .find((o) => o.id === data.id)
                  ?.items.find((i) => i.id === item.id)?.quantity || 1,
                productId: item.productId || get().orders
                  .find((o) => o.id === data.id)
                  ?.items.find((i) => i.id === item.id)?.productId || null,
                notes: item.notes || get().orders
                  .find((o) => o.id === data.id)
                  ?.items.find((i) => i.id === item.id)?.notes || '',
              }))
            : get().orders.find((o) => o.id === data.id)?.items || [];

          const calculatedTotal = data.items
            ? updatedItems.reduce(
                (sum, item) => sum + ((Number(item.price) || 0) * (Number(item.quantity) || 1)),
                0
              )
            : get().orders.find((o) => o.id === data.id)?.total || 0;

          set((state) => ({
            orders: state.orders.map((order) =>
              order.id === data.id
                ? {
                    ...order,
                    bookingId: data.bookingId || order.bookingId,
                    items: updatedItems,
                    total: Number(data.totalAmount) || calculatedTotal,
                    status: validStatuses.includes(data.status) 
                      ? data.status 
                      : order.status,
                    updatedAt: new Date().toISOString(),
                    deliveredAt: data.deliveredAt || order.deliveredAt,
                    orderType: data.orderType || order.orderType,
                    notes: data.notes || order.notes,
                    preparedBy: data.preparedBy || order.preparedBy,
                    deliveredBy: data.deliveredBy || order.deliveredBy,
                  }
                : order
            )
          }));
          return true;
        } catch (error) {
          console.error('Error updating order:', error);
          return false;
        }
      },

      updateOrderStatus: (orderId, newStatus) => {
        try {
          if (!orderId || !newStatus) {
            console.error('Order ID and new status are required');
            return false;
          }

          if (!validStatuses.includes(newStatus)) {
            console.error('Invalid order status');
            return false;
          }

          set((state) => ({
            orders: state.orders.map((order) =>
              order.id === orderId
                ? {
                    ...order,
                    status: newStatus,
                    updatedAt: new Date().toISOString(),
                    ...(newStatus === 'Delivered' && !order.deliveredAt
                      ? { deliveredAt: new Date().toISOString() }
                      : {}),
                  }
                : order
            )
          }));
          return true;
        } catch (error) {
          console.error('Error updating order status:', error);
          return false;
        }
      },

      removeOrder: (orderId) => {
        try {
          if (!orderId) {
            console.error('Order ID is required');
            return false;
          }

          set((state) => ({
            orders: state.orders.filter((order) => order.id !== orderId)
          }));
          return true;
        } catch (error) {
          console.error('Error removing order:', error);
          return false;
        }
      },

      getOrderById: (orderId) => {
        if (!orderId) {
          console.error('Order ID is required');
          return null;
        }
        return get().orders.find((order) => order.id === orderId);
      },

      getOrdersByBooking: (bookingId) => {
        if (!bookingId) {
          console.error('Booking ID is required');
          return [];
        }
        return get().orders
          .filter((order) => order.bookingId === bookingId)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      },

      getOrdersByStatus: (status) => {
        if (!status) return [...get().orders];
        if (!validStatuses.includes(status)) {
          console.error('Invalid status filter');
          return [];
        }
        return get().orders
          .filter((order) => order.status === status)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      },

      getOrdersByDateRange: (startDate, endDate) => {
        try {
          if (!startDate || !endDate) {
            console.error('Both start and end dates are required');
            return [];
          }
          
          const start = new Date(startDate);
          const end = new Date(endDate);

          if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
            console.error('Invalid date range');
            return [];
          }

          return get().orders
            .filter((order) => {
              const orderDate = new Date(order.createdAt);
              return orderDate >= start && orderDate <= end;
            })
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } catch (error) {
          console.error('Error filtering orders by date range:', error);
          return [];
        }
      },

      getTotalSales: (startDate, endDate) => {
        const orders = startDate && endDate
          ? get().getOrdersByDateRange(startDate, endDate)
          : [...get().orders];

        return orders.reduce((total, order) =>
          order.status !== 'Cancelled' ? total + order.total : total
        , 0);
      },

      getMostOrderedProducts: (limit = 5) => {
        const productMap = {};

        get().orders.forEach((order) => {
          order.items.forEach((item) => {
            const key = item.productId || item.name;
            if (!productMap[key]) {
              productMap[key] = {
                name: item.name,
                productId: item.productId,
                quantity: 0,
                totalRevenue: 0,
              };
            }
            productMap[key].quantity += item.quantity;
            productMap[key].totalRevenue += item.price * item.quantity;
          });
        });

        return Object.values(productMap)
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, limit);
      },

      clearOrders: () => {
        set({ orders: [] });
        return true;
      },

      reset: () => {
        set({ orders: [] });
        return true;
      }
    }),
    {
      name: 'hotel-order-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ orders: state.orders }),
      version: 2,
      migrate: (persistedState, version) => {
        if (!persistedState) return { orders: [] };
        
        if (version === 1) {
          return {
            ...persistedState,
            orders: persistedState.orders.map((order) => ({
              ...order,
              items: order.items.map((item) => ({
                ...item,
                productId: item.productId || null,
                notes: item.notes || '',
              })),
              deliveredAt: order.deliveredAt || null,
              orderType: order.orderType || 'Room Service',
              notes: order.notes || '',
              preparedBy: order.preparedBy || '',
              deliveredBy: order.deliveredBy || '',
            })),
          };
        }
        return persistedState;
      }
    }
  )
);

export default useOrderStore;