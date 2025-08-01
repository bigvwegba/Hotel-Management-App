import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Topbar from '../components/Topbar';
import Sidebar from '../components/Sidebar';

const Layout = ({ children, currentPage, setCurrentPage }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Close sidebar when window resizes above mobile breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Debugging effect
  useEffect(() => {
    console.log('Mobile Sidebar State:', mobileSidebarOpen);
  }, [mobileSidebarOpen]);

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(prev => {
      console.log('Toggling from:', prev, 'to:', !prev);
      return !prev;
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setMobileSidebarOpen(false);
    console.log('Page changed to:', page, '- closing sidebar');
  };

  return (
    <div className="app-container">
      <Toaster position="top-right" />
      <Topbar 
        onMenuClick={toggleMobileSidebar} 
        mobileSidebarOpen={mobileSidebarOpen}
      />
      <div className="content-wrapper">
        <Sidebar 
          currentPage={currentPage} 
          setCurrentPage={handlePageChange}
          mobileSidebarOpen={mobileSidebarOpen}
        />
        <div className="main-content">{children}</div>
      </div>
    </div>
  );
};

export default Layout;