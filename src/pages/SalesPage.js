import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useProductStore from '../store/useProductStore';
import useBookingStore from '../store/useBookingStore';
import '../styles/salesPage.css';

export default function SalesPage() {
  const { products } = useProductStore();
  const { activeBookings } = useBookingStore();
  const navigate = useNavigate();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (!selectedBooking || cart.length === 0) return;
    navigate('/checkout', {
      state: {
        bookingId: selectedBooking.id,
        items: cart,
        totalAmount: calculateTotal()
      }
    });
  };

  return (
    <div className="sales-page">
      <div className="sales-header">
        <h1>Point of Sale</h1>
        <div className="booking-selector">
          <select
            value={selectedBooking?.id || ''}
            onChange={(e) => {
              const booking = activeBookings.find(b => b.id === e.target.value);
              setSelectedBooking(booking || null);
            }}
          >
            <option value="">Select Booking</option>
            {activeBookings.map(booking => (
              <option key={booking.id} value={booking.id}>
                {booking.guestName} (Room {booking.roomNumber})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="sales-container">
        <div className="product-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                {/* Placeholder for product image */}
                <div className="image-placeholder"></div>
              </div>
              <div className="product-details">
                <h3>{product.name}</h3>
                <p className="price">₦{product.price.toFixed(2)}</p>
                {product.stock && <p className="stock">Stock: {product.stock}</p>}
              </div>
              <button
                className="add-to-cart"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        <div className="cart-container">
          <h2>Order Summary</h2>
          {selectedBooking && (
            <div className="booking-info">
              <h3>{selectedBooking.guestName}</h3>
              <p>Room {selectedBooking.roomNumber}</p>
            </div>
          )}
          
          <div className="cart-items">
            {cart.length === 0 ? (
              <p className="empty-cart">Your cart is empty</p>
            ) : (
              cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-price">₦{item.price.toFixed(2)}</span>
                  </div>
                  <div className="item-controls">
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span className="item-quantity">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="item-total">
                    ₦{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="cart-total">
            <span>Total:</span>
            <span>₦{calculateTotal().toFixed(2)}</span>
          </div>

          <button
            className="checkout-btn"
            onClick={handleCheckout}
            disabled={!selectedBooking || cart.length === 0}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}