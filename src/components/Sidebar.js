// src/components/Sidebar.jsx



export default function Sidebar({currentPage,setCurrentPage}) {
  return (
    <aside className="sidebar">
      <h2 className="logo">🏨 Hotel Admin</h2>
      <nav>
        <ul>
          <li className={currentPage === "dashboard" ? 'is-active' : ""}><button onClick={() => setCurrentPage("dashboard")} className="unstyled-button">Dashboard</button></li>
          <li className={currentPage === "rooms" ? 'is-active' : ""}><button onClick={() => setCurrentPage("rooms")} className="unstyled-button">Rooms</button></li>
          <li className={currentPage === "bookings" ? 'is-active' : ""}><button onClick={() => setCurrentPage("bookings")} className="unstyled-button">Bookings</button></li>
          <li className={currentPage === "guests" ? 'is-active' : ""}><button onClick={() => setCurrentPage("guests")} className="unstyled-button">Guests</button></li>
          <li className={currentPage === "orders" ? 'is-active' : ""}><button onClick={() => setCurrentPage("orders")} className="unstyled-button">Orders</button></li>
          <li className={currentPage === "products" ? 'is-active' : ""}><button onClick={() => setCurrentPage("products")} className="unstyled-button">Products</button></li>
          <li className={currentPage === "payments" ? 'is-active' : ""}><button onClick={() => setCurrentPage("payments")} className="unstyled-button">Payments</button></li>
          <li className={currentPage === "staff" ? 'is-active' : ""}><button onClick={() => setCurrentPage("staff")} className="unstyled-button">Staff</button></li>
        </ul>
      </nav>
    </aside>
  );
}