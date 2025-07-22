// src/components/AddRoomModal.jsx
import {useEffect, useState} from "react";
import useRoomStore from "../store/useRoomStore";

export default function AddRoomModal({ isVisible, onClose, updatedRoom }) {
  const {addRoom, updateRoom} = useRoomStore();
  const [formData, setFormData] = useState({
    roomNumber: '',
    roomType:  '',
    status:  '',
    price:  ''
  })
  
  const isEditMode = !!updatedRoom?.id;

  useEffect(() => {
    if (isEditMode && updatedRoom) {
      setFormData({
        roomNumber: updatedRoom.id?.toString() || '',
        roomType: updatedRoom.roomType || '',
        status: updatedRoom.status || '',
        price: updatedRoom.price?.toString() || ''
      });
    } else {
      setFormData({
        roomNumber: '',
        roomType: '',
        status: '',
        price: ''
      });
    }
  }, [updatedRoom, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  const handleRoomSubmit = (e) => {
    e.preventDefault();
  const { roomNumber, roomType, status, price } = formData;

  if (
    !roomNumber.trim() ||
    !roomType.trim() ||
    !status.trim() ||
    price === "" ||
    isNaN(price) ||
    parseFloat(price) <= 0
  ) {
    alert("Please fill in all fields correctly.");
    return;
  }
    const roomValues = {
      id: formData.roomNumber.trim(),
      roomType: formData.roomType,
      status: formData.status,
      price: formData.price ? parseFloat(formData.price) : 0,
    }
    if(isEditMode) {
      updateRoom(roomValues);
    console.log("Room updated:", roomValues);
      
    } else{
      addRoom(roomValues);
    }
  
    setFormData({
        roomNumber: '',
      roomType: '',
      status: '',
      price: '',
    })
    onClose();
  }
  if (!isVisible) return null;

  return (
    <div className={`modal-overlay ${isVisible ? "show" : "hide"}`}>
      <div className="modal-content">
        <h2 className="modal-title">{(isEditMode)? 'Edit Room': 'Add New Room'}</h2>
        <form className="modal-form" onSubmit={handleRoomSubmit}>
          <label>Room Number</label>
          <input type="text" name="roomNumber" disabled={isEditMode} 
          value={formData.roomNumber} onChange={handleInputChange} placeholder="e.g. 101" />

          <label>Room Type</label>
          <select name="roomType" value={formData.roomType}  onChange={handleInputChange}>
            <option value=""disabled>Select Room type</option>
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="Deluxe">Deluxe</option>
          </select>

          <label>Price per Night</label>
          <input type="number" name="price" onChange={handleInputChange} value={formData.price} placeholder="₦" />

          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleInputChange}>
            <option value="" disabled>Select Status</option>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Maintenance">Maintenance</option>
          </select>

          <div className="modal-actions">
            <button type="submit" className="btn-submit">Save</button>
            <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}