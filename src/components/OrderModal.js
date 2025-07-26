import React, { useState, useEffect } from "react";
import useOrderStore from "../store/useOrderStore";

export default function OrderModal({ isOpen, onClose, editOrder }) {
  const { addOrder, updateOrder } = useOrderStore();
  const [form, setForm] = useState({
    guestName: "",
    roomNumber: "",
    items: "",
    totalAmount: "",
    status: "Pending",
  });

  useEffect(() => {
    if (editOrder) {
      setForm(editOrder);
    } else {
      setForm({
        guestName: "",
        roomNumber: "",
        items: "",
        totalAmount: "",
        status: "Pending",
      });
    }
  }, [editOrder]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editOrder) {
      updateOrder(form);
    } else {
      addOrder(form);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
<div className="modal-overlay">
  <div className="modal">
    <h2>{editOrder ? "Edit Order" : "New Order"}</h2>
    <form onSubmit={handleSubmit} className="modal-form">
      <input
        type="text"
        name="guestName"
        value={form.guestName}
        onChange={handleChange}
        placeholder="Guest Name"
        required
      />
      <input
        type="text"
        name="roomNumber"
        value={form.roomNumber}
        onChange={handleChange}
        placeholder="Room Number"
        required
      />
      <textarea
        name="items"
        value={form.items}
        onChange={handleChange}
        placeholder="Items ordered (comma-separated)"
        required
      />
      <input
        type="number"
        name="totalAmount"
        value={form.totalAmount}
        onChange={handleChange}
        placeholder="Total Amount"
        required
      />
      <select name="status" value={form.status} onChange={handleChange}>
        <option value="Pending">Pending</option>
        <option value="Delivered">Delivered</option>
        <option value="Cancelled">Cancelled</option>
      </select>

      <div className="modal-actions">
        <button type="submit" className="btn-primary">
          {editOrder ? "Update" : "Save"}
        </button>
        <button type="button" onClick={onClose} className="btn-outline">
          Cancel
        </button>
      </div>
    </form>
  </div>
</div>

  );
}
