import React, { useState, useEffect } from "react";
import useOrderStore from "../store/useOrderStore";
import useBookingStore from "../store/useBookingStore";
import useProductStore from "../store/useProductStore";
import "../styles/orderModal.css";

export default function OrderModal({ isOpen, onClose, editOrder, bookingId }) {
  const { addOrder, updateOrder, getOrderById } = useOrderStore();
  const { bookings } = useBookingStore();
  const { products } = useProductStore();
  
  const [form, setForm] = useState({
    bookingId: bookingId || "",
    items: [],
    totalAmount: 0,
    status: "Pending",
  });
  const [error, setError] = useState("");
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productQuantities, setProductQuantities] = useState({});
  const [linkToBooking, setLinkToBooking] = useState(!!bookingId);

  const activeBookings = bookings.filter(
    booking => !["Cancelled", "Completed"].includes(booking.bookingStatus)
  );

  useEffect(() => {
    if (editOrder) {
      const fullOrder = getOrderById(editOrder.id) || editOrder;
      setForm({
        ...fullOrder,
        items: fullOrder.items,
        totalAmount: fullOrder.total
      });
      setSelectedProducts(fullOrder.items);
      setLinkToBooking(!!fullOrder.bookingId);
      const initialQuantities = {};
      fullOrder.items.forEach(item => {
        initialQuantities[item.id] = item.quantity;
      });
      setProductQuantities(initialQuantities);
    } else if (bookingId) {
      setForm(prev => ({
        ...prev,
        bookingId,
        items: [],
        totalAmount: 0,
        status: "Pending"
      }));
      setSelectedProducts([]);
      setProductQuantities({});
      setLinkToBooking(true);
    } else {
      resetForm();
    }
    setError("");
  }, [editOrder, bookingId, getOrderById]);

  const resetForm = () => {
    setForm({
      bookingId: "",
      items: [],
      totalAmount: 0,
      status: "Pending",
    });
    setSelectedProducts([]);
    setProductQuantities({});
    setLinkToBooking(false);
    setError("");
  };

  const toggleLinkToBooking = () => {
    setLinkToBooking(!linkToBooking);
    if (linkToBooking) {
      setForm(prev => ({ ...prev, bookingId: "" }));
    }
  };

  const handleBookingSelect = (bookingId) => {
    setForm(prev => ({ ...prev, bookingId }));
  };

  const handleQuantityChange = (productId, newQuantity) => {
    setProductQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, newQuantity)
    }));
  };

  const handleProductSelect = (product, quantity = 1, isNewAddition = false) => {
    const existingIndex = selectedProducts.findIndex(p => p.id === product.id);
    const newQuantity = isNewAddition ? quantity : 1;
    
    if (product.stock && newQuantity > product.stock) {
      setError(`Only ${product.stock} ${product.name} available in stock`);
      return;
    }

    if (existingIndex >= 0) {
      const updated = [...selectedProducts];
      updated[existingIndex].quantity = productQuantities[product.id] || updated[existingIndex].quantity + quantity;
      
      if (updated[existingIndex].quantity <= 0) {
        updated.splice(existingIndex, 1);
      }
      setSelectedProducts(updated);
    } else {
      setSelectedProducts([...selectedProducts, { 
        ...product, 
        quantity: productQuantities[product.id] || Math.max(newQuantity, 1)
      }]);
    }
    
    setError("");
  };

  const removeProduct = (productId) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== productId));
  };

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (linkToBooking && !form.bookingId) {
      setError("Please select a booking when linking to booking");
      return;
    }

    if (selectedProducts.length === 0) {
      setError("Please select at least one product");
      return;
    }

    const orderData = {
      ...form,
      bookingId: linkToBooking ? form.bookingId : "",
      items: selectedProducts,
      totalAmount: calculateTotal(selectedProducts)
    };

    const success = editOrder 
      ? updateOrder(orderData)
      : addOrder(orderData);

    if (success) {
      onClose();
      resetForm();
    } else {
      setError("Failed to save order");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="order-modal-overlay">
      <div className="order-modal">
        <h2>{editOrder ? "Edit Order" : "New Order"}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="order-modal-form">
          <div className="form-group">
            <div className="link-booking-toggle">
              <label>Link to Booking</label>
              <button
                type="button"
                className={`toggle-button ${linkToBooking ? 'active' : ''}`}
                onClick={toggleLinkToBooking}
                disabled={!!bookingId}
              >
                <span className="toggle-circle"></span>
              </button>
            </div>

            {linkToBooking && (
              <div className="booking-selector">
                <select
                  name="bookingId"
                  value={form.bookingId}
                  onChange={(e) => handleBookingSelect(e.target.value)}
                  required
                  disabled={!!bookingId}
                >
                  <option value="">Select Booking</option>
                  {activeBookings.map(booking => (
                    <option key={booking.id} value={booking.id}>
                      {booking.guestName} (Room {booking.roomNumber})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Products</label>
            <button 
              type="button" 
              className="btn-select-products"
              onClick={() => setShowProductSelector(true)}
            >
              {selectedProducts.length > 0 
                ? `Edit Products (${selectedProducts.length})` 
                : "Select Products"}
            </button>
            
            {selectedProducts.length > 0 && (
              <div className="selected-products-container">
                <table className="selected-products-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProducts.map((product) => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>₦{product.price.toFixed(2)}</td>
                        <td>
                          <div className="quantity-controls">
                            <button
                              type="button"
                              onClick={() => handleProductSelect(product, -1)}
                            >
                              −
                            </button>
                            <input
                              type="number"
                              min="1"
                              max={product.stock || 999}
                              value={productQuantities[product.id] || product.quantity}
                              onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                              onBlur={() => handleProductSelect(product, 0)}
                            />
                            <button
                              type="button"
                              onClick={() => handleProductSelect(product, 1)}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td>
                          ₦{(product.price * (productQuantities[product.id] || product.quantity)).toFixed(2)}
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn-remove"
                            onClick={() => removeProduct(product.id)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="order-total">
                  <strong>Total: ₦{calculateTotal(selectedProducts).toFixed(2)}</strong>
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Status</label>
            <select 
              name="status" 
              value={form.status} 
              onChange={(e) => setForm(prev => ({...prev, status: e.target.value}))}
            >
              <option value="Pending">Pending</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn-primary">
              {editOrder ? "Update" : "Save"}
            </button>
            <button type="button" onClick={onClose} className="btn-outline">
              Cancel
            </button>
          </div>
        </form>

        {showProductSelector && (
          <div className="product-selector-modal">
            <div className="product-selector-header">
              <h3>Select Products</h3>
              <button 
                type="button" 
                onClick={() => setShowProductSelector(false)}
                className="btn-close"
              >
                Close
              </button>
            </div>
            <div className="product-table-container">
              <table className="product-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>In Stock</th>
                    <th>Quantity</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>₦{product.price.toFixed(2)}</td>
                      <td>{product.stock || "N/A"}</td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          max={product.stock || 999}
                          value={productQuantities[product.id] || 1}
                          onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn-add"
                          onClick={() => handleProductSelect(product, productQuantities[product.id] || 1, true)}
                        >
                          Add to Order
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}