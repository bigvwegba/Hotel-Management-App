// store/usePaymentStore.js
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import LZString from 'lz-string';

const PAYMENT_STORAGE_KEY = 'hotel-payments';
const PAYMENT_METHODS = [
  { id: 'card', name: 'Credit Card', icon: '/icons/card.png' },
  { id: 'transfer', name: 'Bank Transfer', icon: '/icons/transfer.png' },
  { id: 'cash', name: 'Cash', icon: '/icons/cash.png' },
  { id: 'mobile', name: 'Mobile Money', icon: '/icons/mobile.png' },
];

const loadPayments = () => {
  try {
    const data = localStorage.getItem(PAYMENT_STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(LZString.decompress(data)) || [];
  } catch (error) {
    console.error('Failed to load payments:', error);
    return [];
  }
};

const savePayments = (payments) => {
  try {
    localStorage.setItem(PAYMENT_STORAGE_KEY, LZString.compress(JSON.stringify(payments)));
  } catch (error) {
    console.error('Failed to save payments:', error);
  }
};

const usePaymentStore = create((set, get) => ({
  payments: loadPayments(),
  paymentMethods: PAYMENT_METHODS,
  currentPayment: null,
  paymentFilters: {
    status: 'all',
    dateRange: null,
    method: 'all'
  },

  // Actions
  initializePayment: (booking) => {
    set({ 
      currentPayment: {
        id: `PAY-${uuidv4().slice(0, 8)}`,
        bookingId: booking.id,
        guestName: booking.guestName,
        roomType: booking.roomType,
        amount: booking.totalAmount,
        date: new Date().toISOString(),
        method: null,
        status: 'pending',
        notes: ''
      }
    });
  },

  processPayment: (method) => {
    const { currentPayment } = get();
    if (!currentPayment) return;

    const newPayment = {
      ...currentPayment,
      method,
      status: 'paid',
      date: new Date().toISOString()
    };

    set(state => {
      const payments = [...state.payments, newPayment];
      savePayments(payments);
      return { 
        payments,
        currentPayment: null 
      };
    });

    return newPayment;
  },

  failPayment: (reason) => {
    const { currentPayment } = get();
    if (!currentPayment) return;

    const failedPayment = {
      ...currentPayment,
      status: 'failed',
      notes: reason,
      date: new Date().toISOString()
    };

    set(state => {
      const payments = [...state.payments, failedPayment];
      savePayments(payments);
      return { 
        payments,
        currentPayment: null 
      };
    });
  },

  refundPayment: (paymentId, amount, reason) => {
    set(state => {
      const original = state.payments.find(p => p.id === paymentId);
      if (!original) return state;

      const refund = {
        id: `RFND-${uuidv4().slice(0, 8)}`,
        bookingId: original.bookingId,
        guestName: original.guestName,
        amount: -Math.abs(amount),
        date: new Date().toISOString(),
        method: original.method,
        status: 'refunded',
        notes: reason,
        originalPaymentId: paymentId
      };

      const payments = [...state.payments, refund];
      savePayments(payments);
      return { payments };
    });
  },

  updateFilters: (filters) => {
    set({ paymentFilters: { ...get().paymentFilters, ...filters } });
  },

  getFilteredPayments: () => {
    const { payments, paymentFilters } = get();
    return payments.filter(payment => {
      const matchesStatus = paymentFilters.status === 'all' || payment.status === paymentFilters.status;
      const matchesMethod = paymentFilters.method === 'all' || payment.method === paymentFilters.method;
      const matchesDate = !paymentFilters.dateRange || (
        new Date(payment.date) >= new Date(paymentFilters.dateRange.start) &&
        new Date(payment.date) <= new Date(paymentFilters.dateRange.end)
      );
      return matchesStatus && matchesMethod && matchesDate;
    });
  },

  getPaymentSummary: () => {
    const payments = get().payments;
    const today = new Date().toISOString().split('T')[0];
    
    return {
      totalRevenue: payments
        .filter(p => p.status === 'paid')
        .reduce((sum, p) => sum + p.amount, 0),
      pendingPayments: payments
        .filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + p.amount, 0),
      todaysRevenue: payments
        .filter(p => p.status === 'paid' && p.date.split('T')[0] === today)
        .reduce((sum, p) => sum + p.amount, 0),
      refundsIssued: payments
        .filter(p => p.status === 'refunded')
        .reduce((sum, p) => sum + Math.abs(p.amount), 0)
    };
  }
}));

export default usePaymentStore;