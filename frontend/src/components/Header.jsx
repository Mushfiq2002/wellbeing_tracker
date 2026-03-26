import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const Header = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-primary-500">Wellbeing Tracker</Link>
                <nav>
                    <ul className="flex space-x-6 items-center">
                        <li><Link to="/" className="text-gray-700 hover:text-blue-600 transition">Home</Link></li>

                        {isAuthenticated ? (
                            <li className="flex items-center space-x-4">

                                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition">Dashboard</Link>
                                <Link to="/todo" className="text-gray-700 hover:text-blue-600 transition">To-Do List</Link>
                                <Link to="/reminders" className="text-gray-700 hover:text-blue-600 transition">Reminders</Link>
                                <Link to="/sleep-tracker" className="text-gray-700 hover:text-indigo-600 transition">Sleep Tracker</Link>
                                <Link to="/friends" className="text-gray-700 hover:text-blue-600 transition">Friends</Link>
                                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition text-sm">Logout</button>
                            </li>
                        ) : (
                            <li className="flex items-center space-x-4">
                                <Link to="/login" className="text-gray-700 hover:text-blue-600 transition">Login</Link>
                                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm">Sign Up</Link>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

<Link to="/therapists">Therapists</Link>
export default Header;
