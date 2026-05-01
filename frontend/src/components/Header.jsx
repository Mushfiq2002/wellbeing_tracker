<<<<<<< HEAD
import { Link, useLocation } from 'react-router-dom';
=======
import { Link, useNavigate } from 'react-router-dom';
>>>>>>> cd956fb85002168a01eb2e6a976b7d4a1ab5a50c
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { Menu, PanelLeftClose, PanelLeftOpen, LogOut } from 'lucide-react';

<<<<<<< HEAD
const Header = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const localUser =
    JSON.parse(localStorage.getItem('user')) ||
    JSON.parse(localStorage.getItem('userInfo'));

  const currentUser = user || localUser;

  const handleLogout = () => {
    dispatch(logout());
  };

  const linkClass = (path) =>
    `font-medium transition duration-200 ${
      location.pathname === path
        ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
        : 'text-gray-600 hover:text-blue-600'
    }`;

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Wellbeing Tracker
        </Link>

        <nav>
          <ul className="flex items-center space-x-6 text-sm md:text-base">
            <li>
              <Link to="/" className={linkClass('/')}>
                Home
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/dashboard" className={linkClass('/dashboard')}>
                    Dashboard
                  </Link>
                </li>

                <li>
                  <Link to="/todo" className={linkClass('/todo')}>
                    To-Do List
                  </Link>
                </li>

                <li>
                  <Link to="/reminders" className={linkClass('/reminders')}>
                    Reminders
                  </Link>
                </li>

                <li>
                  <Link
                    to="/sleep-tracker"
                    className={linkClass('/sleep-tracker')}
                  >
                    Sleep Tracker
                  </Link>
                </li>

                {currentUser?.role === 'therapist' ? (
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
                    <li>
                      <Link
                        to="/therapists"
                        className={linkClass('/therapists')}
                      >
                        Therapists
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="/book-appointment"
                        className={linkClass('/book-appointment')}
                      >
                        Book Appointment
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="/my-appointments"
                        className={linkClass('/my-appointments')}
                      >
                        My Appointments
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="/review-rating"
                        className={linkClass('/review-rating')}
                      >
                        Review & Rating
                      </Link>
                    </li>
                  </>
                )}

                <li>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-medium text-sm"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className={linkClass('/login')}>
                    Login
                  </Link>
                </li>

                <li>
                  <Link
                    to="/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium text-sm"
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
=======
const Header = ({ toggleSidebar, toggleCollapse, isSidebarCollapsed }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 z-10 sticky top-0">
            <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">

                {/* Left side: Logo & Toggles */}
                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <>
                            {/* Mobile Sidebar Toggle */}
                            <button
                                onClick={toggleSidebar}
                                className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                            >
                                <Menu className="h-6 w-6" />
                            </button>

                            {/* Desktop Collapse Toggle */}
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

                            {/* Only show logo in header if sidebar is collapsed, or hide on desktop and show on mobile */}
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

                {/* Right side: Navigation / User */}
                <nav>
                    <ul className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <li className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                                    {user?.name || 'User'}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-md hover:bg-red-100 transition text-sm font-medium"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </li>
                        ) : (
                            <li className="flex items-center space-x-4">
                                <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">
                                    Login
                                </Link>

                                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition font-medium text-sm shadow-sm">
                                    Sign Up
                                </Link>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
>>>>>>> cd956fb85002168a01eb2e6a976b7d4a1ab5a50c
};

export default Header;