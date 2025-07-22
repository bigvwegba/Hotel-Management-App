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
    <div className="guests-page">
      <div className="guests-header">
        <h1 className="page-title">Guests</h1>
      </div>

      {guests.length === 0 ? (
        <p>No guests available.</p>
      ) : (
        <div className="guest-grid">
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
              .slice(0, 3); // limit to 3 recent

            return (
              <div className="guest-card" key={index}>
                <h2>{guest.guestName}</h2>
                <p><strong>Email:</strong> {guest.email}</p>
                <p><strong>Phone:</strong> {guest.phone}</p>
                <p><strong>Address:</strong> {guest.address}</p>
                <p><strong>Total Bookings:</strong> {guest.bookings.length}</p>

                <div className="status-breakdown">
                  <strong>Status Count:</strong>
                  <ul>
                    {Object.entries(bookingStatusCounts).map(([status, count]) => (
                      <li key={status}>
                        {status}: {count}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="recent-checkins" title={recentCheckIns.join("\n")}>
                  <strong>Recent Check-ins:</strong>{" "}
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
      )}
    </div>
  );
}
