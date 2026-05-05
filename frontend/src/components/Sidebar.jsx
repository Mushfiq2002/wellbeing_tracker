import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
  Activity,
  ShieldAlert,
  BookOpen,
  Star,
  CreditCard,
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const role = user?.role;

  const sections = [
    {
      title: 'Daily Tracking',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'To-Do List', path: '/todo', icon: ListTodo },
        { name: 'Medicine Reminders', path: '/reminders', icon: BellRing },
        { name: 'Sleep Tracker', path: '/sleep-tracker', icon: Moon },
        { name: 'Daily Mood', path: '/mood-tracker', icon: Smile },
        { name: 'Study Tracker', path: '/study-tracker', icon: BookOpen },
      ],
    },
    {
      title: 'Health & Therapy',
      items: [
        { name: 'Therapists', path: '/therapists', icon: Stethoscope },
        { name: 'Book Appointment', path: '/book-appointment', icon: CalendarPlus },
        { name: 'My Appointments', path: '/my-appointments', icon: CalendarDays },
        { name: 'Payment', path: '/payments', icon: CreditCard },
        { name: 'Review & Ratings', path: '/review-rating', icon: Star },

        ...(role === 'therapist'
          ? [
              {
                name: 'Therapist Dashboard',
                path: '/therapist-appointments',
                icon: Activity,
              },
            ]
          : []),
      ],
    },
    {
      title: 'Social',
      items: [{ name: 'Friends', path: '/friends', icon: Users }],
    },
    {
      title: 'Safety',
      items: [
        {
          name: 'Emergency Contacts',
          path: '/emergency-contacts',
          icon: ShieldAlert,
        },
      ],
    },
  ];

  const linkClass = (path) =>
    `flex items-center gap-2 px-3 py-2 rounded-md transition ${
      location.pathname === path || location.pathname.startsWith(`${path}/`)
        ? 'bg-blue-100 text-blue-600'
        : 'text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <div className="w-64 bg-white border-r h-full p-4 overflow-y-auto">
      {sections.map((section, idx) => (
        <div key={idx} className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 mb-2">
            {section.title}
          </h3>

          <div className="space-y-1">
            {section.items.map((item, index) => {
              const Icon = item.icon;

              return (
                <Link key={index} to={item.path} className={linkClass(item.path)}>
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;