import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Therapists from './pages/Therapists';
import Todo from './pages/Todo';
import MedicineReminder from './pages/MedicineReminder';
import SleepTracker from './pages/SleepTracker';
import BookAppointment from './pages/BookAppointment';
import MyAppointments from './pages/MyAppointments';
import MoodTracker from './pages/MoodTracker';
import Friends from './pages/Friends';
import EmergencyContacts from './pages/EmergencyContacts';
import StudyTracker from './pages/StudyTracker';
import Calendar from './pages/Calendar';
import StreakTracker from './pages/StreakTracker';
import DailyCheckin from './pages/DailyCheckin';
import CustomReminder from './pages/CustomReminder';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/therapists" element={<Therapists />} />
          <Route path="/reminders" element={<MedicineReminder />} />
          <Route path="/sleep-tracker" element={<SleepTracker />} />
          <Route path="/mood-tracker" element={<MoodTracker />} />
          <Route path="/todo" element={<Todo />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/book/:id" element={<BookAppointment />} />
          <Route path="/my-appointments" element={<MyAppointments />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/emergency-contacts" element={<EmergencyContacts />} />
          <Route path="/study-tracker" element={<StudyTracker />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/streak-tracker" element={<StreakTracker />} />
          <Route path="/daily-checkin" element={<DailyCheckin />} />
          <Route path="/custom-reminders" element={<CustomReminder />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;