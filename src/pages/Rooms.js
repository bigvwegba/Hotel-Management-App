import React, { useState, useEffect } from "react";
import AddRoomModal from "../components/AddRoomModal";
import useRoomStore from "../store/useRoomStore";
import useBookingStore from "../store/useBookingStore";

export default function Rooms() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { rooms, removeRoom } = useRoomStore();
  const bookings = useBookingStore((state) => state.bookings);
  const [roomToUpdate, setRoomToUpdate] = useState(null);
  const [roomStatuses, setRoomStatuses] = useState({});

  const handleAddRoom = () => {
    setIsModalVisible(true);
    setRoomToUpdate(null);
  };

  const handleUpdateRoom = (room) => {
    setIsModalVisible(true);
    setRoomToUpdate(room);
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const updatedStatuses = rooms.reduce((acc, room) => {
      const activeBooking = bookings.find(
        (b) =>
          b.roomNumber === room.id &&
          b.bookingStatus !== "Cancelled" &&
          b.checkIn <= today &&
          b.checkOut >= today
      );
      acc[room.id] = activeBooking ? "Occupied" : room.status || "Available";
      return acc;
    }, {});
    setRoomStatuses(updatedStatuses);
  }, [rooms, bookings]);

  return (
    <div className="rooms-page">
      <div className="rooms-header">
        <h1 className="page-title">Rooms</h1>
        <button className="btn-primary" onClick={handleAddRoom}>
          Add Room
        </button>
      </div>

      {rooms.length === 0 ? (
        <p>No rooms added yet.</p>
      ) : (
        <div className="rooms-table">
          <div className="table-header">
            <div>Room</div>
            <div>Type</div>
            <div>Price</div>
            <div>Status</div>
            <div>Actions</div>
          </div>
          {rooms.map((room) => (
            <div className="table-row" key={room.id}>
              <div>Room {room.id}</div>
              <div>{room.roomType}</div>
              <div>₦{room.price.toLocaleString()}</div>
              <div>
                <span className={`status ${roomStatuses[room.id]?.toLowerCase()}`}>
                  {roomStatuses[room.id]}
                </span>
              </div>
              <div className="room-actions">
                <button onClick={() => handleUpdateRoom(room)} className="btn-outline">
                  Edit
                </button>
                <button
                  onClick={() => removeRoom(room.id)}
                  className="btn-outline warning"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddRoomModal
        updatedRoom={roomToUpdate}
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </div>
  );
}
