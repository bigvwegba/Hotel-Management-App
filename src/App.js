// src/App.jsx
import React, { useState, useEffect } from "react";
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
import './styles/product.css'; // Create and style this file accordingly

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
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="main-content">
        <Topbar />
        {renderPage()}
      </div>
    </div>
  ) : (
    <Auth onLogin={() => setIsAuthenticated(true)} />
  );
}