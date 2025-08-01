const Topbar = ({ onMenuClick, mobileSidebarOpen }) => {
  // Debugging button clicks
  const handleClick = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    console.log('Menu button clicked');
    onMenuClick();
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button 
          className="mobile-menu-button"
          onClick={handleClick}
          aria-label={mobileSidebarOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileSidebarOpen}
        >
          {mobileSidebarOpen ? (
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" />
              <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path d="M3 12H21" stroke="currentColor" strokeWidth="2" />
              <path d="M3 6H21" stroke="currentColor" strokeWidth="2" />
              <path d="M3 18H21" stroke="currentColor" strokeWidth="2" />
            </svg>
          )}
        </button>
        <h1 className="dashboard-title">Dashboard</h1>
      </div>
      <nav className="topbar-right">
        <button className="admin-button">
          Welcome, Admin
        </button>
      </nav>
    </header>
  );
};

export default Topbar;