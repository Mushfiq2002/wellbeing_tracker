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
                <Link to="/" className="text-2xl font-bold text-primary-500">MERN Boilerplate</Link>
                <nav>
                    <ul className="flex space-x-6 items-center">
                        <li><Link to="/" className="text-gray-700 hover:text-blue-600 transition">Home</Link></li>
                        <li><Link to="/about" className="text-gray-700 hover:text-blue-600 transition">About</Link></li>
                        {isAuthenticated ? (
                            <li className="flex items-center space-x-4">
                                <span className="text-sm font-medium text-gray-600">Hi, {user?.name || 'User'}</span>
                                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition">Logout</button>
                            </li>
                        ) : (
                            <li><button onClick={() => dispatch({ type: 'auth/login', payload: { name: 'Demo User' } })} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">Login (Demo)</button></li>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
