// Validate date range
export function isValidDateRange(checkIn, checkOut) {
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  return inDate < outDate;
}

// Check if room is available for the given date range
export function isRoomAvailable(bookings, roomNumber, checkIn, checkOut) {
  const start = new Date(checkIn);
  const end = new Date(checkOut);

  return !bookings.some((b) => {
    if (b.roomNumber !== Number(roomNumber)) return false;
    if (!["Confirmed", "Checked-in"].includes(b.bookingStatus)) return false;

    const existingStart = new Date(b.checkIn);
    const existingEnd = new Date(b.checkOut);

    return start <= existingEnd && end >= existingStart;
  });
}
