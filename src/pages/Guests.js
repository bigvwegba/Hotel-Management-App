import useBookingStore from "../store/useBookingStore";

export default function Guests() {
  const bookings = useBookingStore((state) => state.bookings);

  // Map guests using unique email or name
  const guestMap = new Map();

  bookings.forEach((booking) => {
    const key = booking.email?.toLowerCase() || booking.guestName?.toLowerCase();

    if (!key) return;

    const existing = guestMap.get(key) || {
      guestName: booking.guestName,
      email: booking.email || "N/A",
      phone: booking.phone || "N/A",
      address: booking.address || "N/A",
      bookings: [],
    };

    existing.bookings.push({
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      roomNumber: booking.roomNumber,
      bookingStatus: booking.bookingStatus,
    });
    guestMap.set(key, existing);
  });

  // Get final guests array, sorted by number of bookings (desc)
  const guests = Array.from(guestMap.values()).sort(
    (a, b) => b.bookings.length - a.bookings.length
  );

  return (
<div className="guest-table-wrapper">
  <div className="guest-table-header">
    <div>Name</div>
    <div>Email</div>
    <div>Phone</div>
    <div>Address</div>
    <div>Bookings</div>
    <div>Check-ins</div>
  </div>

  {guests.map((guest, index) => {
    const bookingStatusCounts = guest.bookings.reduce((acc, b) => {
      const status = b.bookingStatus || "Unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const recentCheckIns = guest.bookings
      .map((b) => b.checkIn)
      .filter(Boolean)
      .sort((a, b) => new Date(b) - new Date(a))
      .slice(0, 3);

    return (
      <div className="guest-table-row" key={index}>
        <div className="guest-name">
          <strong>{guest.guestName}</strong>
        </div>
        <div>{guest.email}</div>
        <div>{guest.phone}</div>
        <div>{guest.address}</div>
        <div>
          {Object.entries(bookingStatusCounts).map(([status, count]) => (
            <div key={status} className={`status-badge ${status.toLowerCase()}`}>
              {status}: {count}
            </div>
          ))}
        </div>
        <div className="recent-checkins">
          {recentCheckIns.length > 0 ? (
            <span>{recentCheckIns.join(", ")}</span>
          ) : (
            <span>N/A</span>
          )}
        </div>
      </div>
    );
  })}
</div>
  );
}
