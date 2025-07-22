import React, { useState } from "react";
import AddRoomModal from "../components/AddRoomModal";
import useRoomStore  from "../store/useRoomStore";

export default function Rooms() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {rooms, removeRoom} = useRoomStore();
  const [roomToUpdate, setRoomToUpdate] = useState(null);

  const handleAddRoom = () => {
    setIsModalVisible(true);
    setRoomToUpdate(null);
  };

  const handleUpdateRoom = (room) => {
    // Logic to handle room update
    setIsModalVisible(true);
    setRoomToUpdate(room);
  };

  return (
    <div className="rooms-page">
      <div className="rooms-header">
        <h1 className="page-title">Rooms</h1>
        <button className="btn-primary" onClick={handleAddRoom}>
          Add Room
        </button>
      </div>

      <div className="room-grid">
        {rooms.length === 0 ? (
          <p>No rooms added yet.</p>
        ) : (
          rooms.map((room) => (
            <div key={room.id} className="room-card">
              <h2>Room {room.id}</h2>
              <p>Type: {room.roomType}</p>
              <p>Price: ₦{room.price.toLocaleString()}</p>
              <p>
                Status:{" "}
                <span className={`status ${room.status.toLowerCase()}`}>
                  {room.status}
                </span>
              </p>
              <div className="room-actions">
                <button onClick={()=>handleUpdateRoom(room)} className="btn-outline">Edit</button>
                <button onClick={()=>removeRoom(room.id)} className="btn-outline warning">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Modal is rendered here */}
      <AddRoomModal updatedRoom={roomToUpdate}
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
    </div>
  );
}
