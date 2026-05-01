import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

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
};

export default Header;