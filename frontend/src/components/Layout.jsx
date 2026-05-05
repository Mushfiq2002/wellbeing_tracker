import { useState } from 'react';
import { useSelector } from 'react-redux';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const localUser = JSON.parse(localStorage.getItem('user'));
  const loggedIn = isAuthenticated || !!user?.token || !!localUser?.token;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleCollapse = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative">
      {/* Sidebar */}
      {loggedIn && (
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          isCollapsed={isSidebarCollapsed}
        />
      )}

      {/* Mobile Overlay */}
      {loggedIn && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 w-full min-h-screen overflow-hidden transition-all duration-300">
        <Header
          toggleSidebar={toggleSidebar}
          toggleCollapse={toggleCollapse}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;