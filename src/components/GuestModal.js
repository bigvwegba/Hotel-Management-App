import React, { useState, useEffect } from 'react';


export default function GuestModal({ isVisible, onClose }) {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: ''
    })
  if (!isVisible) return null;
    const handleChange = (e)=> {
        const {name, value} = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        // Add guest logic here
        console.log("Guest added:", formData);
        onClose();
    };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Add Guest</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />

          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />

          <label>Phone</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />

          <label>Address</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} />

          <div className="modal-actions">
            <button type="submit" className="btn-submit">Save</button>
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
