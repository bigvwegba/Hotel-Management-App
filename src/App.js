// src/App.jsx
import React, { useState, useEffect } from "react";
import { Toaster } from 'react-hot-toast';


import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";
import Staff from "./pages/Staff";
import Bookings from "./pages/Bookings";
import Orders from "./pages/Orders";
import Guests from "./pages/Guests";
import Products from "./pages/Products";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Auth from "./pages/Auth";
import Payments from "./pages/Payments"
import "./styles/globals.css";
import "./styles/dashboard.css";
import "./styles/layout.css";
import './styles/product.css';
import './styles/modal.css';
import './styles/booking.css';
import './styles/guest.css';
import './styles/room.css';
import './styles/order.css';
import './styles/orderModal.css';
import './styles/auth.css';



export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  



  const renderPage = () => {
    switch (currentPage) {
      case "dashboard": return <Dashboard />;
      case "rooms": return <Rooms />;
      case "staff": return <Staff />;
      case "bookings": return <Bookings />;
      case "orders": return <Orders />;
      case "guests": return <Guests />;
      case "products": return <Products />;
      case "payments": return <Payments />;
      default: return <Dashboard />;
    }
  };

  return isAuthenticated ? (
    <div className="app-container">
      <Toaster position="top-right" />
      <Topbar /> {/* Comes before everything */}
      <div className="content-wrapper">
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <div className="main-content">{renderPage()}</div>
      </div>
    </div>

  ) : (
    <Auth onLogin={() => setIsAuthenticated(true)} />
  );
}