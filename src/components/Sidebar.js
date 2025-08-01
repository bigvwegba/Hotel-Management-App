const Sidebar = ({ currentPage, setCurrentPage, mobileSidebarOpen }) => {
  // Debugging props
  console.log('Sidebar received props:', { mobileSidebarOpen, currentPage });

  return (
    <aside 
      className={`sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`}
      aria-hidden={!mobileSidebarOpen}
    >
      <h2 className="logo">🏨 Hotel Admin</h2>
      <nav>
        <ul>
          {['dashboard', 'rooms', 'bookings', 'guests', 'orders', 'products', 'payments', 'staff'].map((page) => (
            <li 
              key={page}
              className={currentPage === page ? 'is-active' : ''}
            >
              <button 
                onClick={() => {
                  console.log('Navigating to:', page);
                  setCurrentPage(page);
                }} 
                className="unstyled-button"
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page.charAt(0).toUpperCase() + page.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;