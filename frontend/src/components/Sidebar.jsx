import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    ListTodo,
    BellRing,
    Moon,
    Smile,
    Stethoscope,
    CalendarPlus,
    CalendarDays,
    Users,
    Activity
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for conditional tailwind classes
function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const Sidebar = ({ isOpen, setIsOpen, isCollapsed }) => {

    const sections = [
        {
            title: 'Daily Tracking',
            items: [
                { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
                { name: 'To-Do List', path: '/todo', icon: ListTodo },
                { name: 'Medicine Reminders', path: '/reminders', icon: BellRing },
                { name: 'Sleep Tracker', path: '/sleep-tracker', icon: Moon },
                { name: 'Daily Mood', path: '/mood-tracker', icon: Smile },
            ]
        },
        {
            title: 'Health & Therapy',
            items: [
                { name: 'Therapists', path: '/therapists', icon: Stethoscope },
                { name: 'Book Appointment', path: '/book-appointment', icon: CalendarPlus },
                { name: 'My Appointments', path: '/my-appointments', icon: CalendarDays },
            ]
        },
        {
            title: 'Social',
            items: [
                { name: 'Friends', path: '/friends', icon: Users },
            ]
        }
    ];

    const closeSidebarMobile = () => {
        if (window.innerWidth < 768) { // md breakpoint in tailwind
            setIsOpen(false);
        }
    };

    return (
        <aside
            className={cn(
                "fixed inset-y-0 left-0 z-30 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col",
                "md:relative md:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full",
                isCollapsed ? "md:w-20" : "md:w-64 w-64"
            )}
        >
            <div className="flex h-16 shrink-0 items-center justify-center border-b border-gray-200 px-4">
                <Activity className="h-8 w-8 text-primary-500 text-blue-600" />
                {!isCollapsed && (
                    <span className="ml-3 text-xl font-bold text-gray-900 truncate">Wellbeing</span>
                )}
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {sections.map((section, idx) => (
                    <div key={idx}>
                        {!isCollapsed && (
                            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                {section.title}
                            </h3>
                        )}
                        <ul className="space-y-1">
                            {section.items.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <li key={item.name}>
                                        <NavLink
                                            to={item.path}
                                            onClick={closeSidebarMobile}
                                            className={({ isActive }) => cn(
                                                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group",
                                                isActive
                                                    ? "bg-blue-50 text-blue-700 font-medium"
                                                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                            )}
                                            title={isCollapsed ? item.name : undefined}
                                        >
                                            <Icon className={cn(
                                                "h-5 w-5 shrink-0 transition-colors",
                                                "group-hover:text-blue-600",
                                                isCollapsed && "mx-auto"
                                            )} />
                                            {!isCollapsed && (
                                                <span className="truncate">{item.name}</span>
                                            )}
                                        </NavLink>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
