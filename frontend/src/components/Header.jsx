import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { Menu, PanelLeftClose, PanelLeftOpen, LogOut } from 'lucide-react';

const Header = ({ toggleSidebar, toggleCollapse, isSidebarCollapsed }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const loggedIn = isAuthenticated && user?.token;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const linkClass = (path) =>
    `font-medium transition duration-200 ${
      location.pathname === path
        ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
        : 'text-gray-600 hover:text-blue-600'
    }`;

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

              <Link to="/" className="text-xl font-bold text-primary-500 md:hidden">
                WT
              </Link>
            </>
          ) : (
            <Link to="/" className="text-2xl font-bold text-primary-500">
              Wellbeing Tracker
            </Link>
          )}
        </div>

        <nav>
          <ul className="flex items-center space-x-4">
            {loggedIn ? (
              <>
                <li><Link to="/" className={linkClass('/')}>Home</Link></li>
                <li><Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link></li>
                <li><Link to="/todo" className={linkClass('/todo')}>To-Do</Link></li>
                <li><Link to="/reminders" className={linkClass('/reminders')}>Reminders</Link></li>
                <li><Link to="/sleep-tracker" className={linkClass('/sleep-tracker')}>Sleep</Link></li>

                {user?.role === 'therapist' ? (
                  <li>
                    <Link
                      to="/therapist-appointments"
                      className={linkClass('/therapist-appointments')}
                    >
                      Therapist Panel
                    </Link>
                  </li>
                ) : (
                  <>
                    <li><Link to="/therapists" className={linkClass('/therapists')}>Therapists</Link></li>
                    <li><Link to="/book-appointment" className={linkClass('/book-appointment')}>Book</Link></li>
                    <li><Link to="/my-appointments" className={linkClass('/my-appointments')}>My Appointments</Link></li>
                    <li><Link to="/review-rating" className={linkClass('/review-rating')}>Reviews</Link></li>
                  </>
                )}

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