import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { Menu, PanelLeftClose, PanelLeftOpen, LogOut, Activity } from 'lucide-react';

const Header = ({ toggleSidebar, toggleCollapse, isSidebarCollapsed }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const loggedIn = isAuthenticated && user?.token;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 z-10 sticky top-0">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
        <div className="flex items-center gap-4">
          {loggedIn ? (
            <>
              <button
                onClick={toggleSidebar}
                className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>

              <button
                onClick={toggleCollapse}
                className="hidden md:block p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                {isSidebarCollapsed ? (
                  <PanelLeftOpen className="h-5 w-5" />
                ) : (
                  <PanelLeftClose className="h-5 w-5" />
                )}
              </button>

              <Link to="/" className="flex items-center gap-2 text-primary-500">
                <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                  <Activity className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold md:hidden">WT</span>
                <span className="text-xl font-bold hidden md:block">Wellbeing Tracker</span>
              </Link>
            </>
          ) : (
            <Link to="/" className="flex items-center gap-2 text-primary-500">
              <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                <Activity className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold">Wellbeing Tracker</span>
            </Link>
          )}
        </div>

        <nav>
          <ul className="flex items-center space-x-4">
            {loggedIn ? (
              <>
                <li className="flex items-center gap-2">
                  <span className="text-sm hidden sm:block">
                    {user?.name || 'User'}
                  </span>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1 rounded-md hover:bg-red-100 text-sm"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="text-gray-700 hover:text-blue-600">
                    Login
                  </Link>
                </li>

                <li>
                  <Link
                    to="/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;