import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { Menu, PanelLeftClose, PanelLeftOpen, LogOut } from 'lucide-react';

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
};

export default Header;