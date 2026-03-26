import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Header = () => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                
                <Link to="/" className="text-2xl font-bold text-primary-500">
                    Wellbeing Tracker
                </Link>

                <nav>
                    <ul className="flex space-x-6 items-center">
                        
                        <li>
                            <Link to="/" className="text-gray-700 hover:text-blue-600">
                                Home
                            </Link>
                        </li>

                        {isAuthenticated ? (
                            <li className="flex items-center space-x-4">

                                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
                                    Dashboard
                                </Link>

                                <Link to="/todo" className="text-gray-700 hover:text-blue-600">
                                    To-Do List
                                </Link>

                                <Link to="/reminders" className="text-gray-700 hover:text-blue-600">
                                    Reminders
                                </Link>

                                <Link to="/sleep-tracker" className="text-gray-700 hover:text-indigo-600">
                                    Sleep Tracker
                                </Link>

                                {/* 🔥 ADD THIS */}
                                <Link to="/therapists" className="text-gray-700 hover:text-blue-600">
                                    Therapists
                                </Link>

                                {/* 🔥 MOST IMPORTANT */}
                                <Link to="/book-appointment" className="text-blue-600 font-semibold">
                                    Book Appointment
                                </Link>

                                <Link to="/my-appointments" className="text-gray-700 hover:text-blue-600">
                                    My Appointments
                                </Link>

                                <button 
                                    onClick={handleLogout} 
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 text-sm"
                                >
                                    Logout
                                </button>
                            </li>
                        ) : (
                            <li className="flex items-center space-x-4">
                                <Link to="/login" className="text-gray-700 hover:text-blue-600">
                                    Login
                                </Link>

                                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm">
                                    Sign Up
                                </Link>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;