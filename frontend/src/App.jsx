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

import ReviewTherapist from './pages/ReviewTherapist';
import ReviewRating from './pages/ReviewRating';

import TherapistAppointments from './pages/TherapistAppointments';
import OnlineSession from './pages/OnlineSession';

import MoodTracker from './pages/MoodTracker';
import Friends from './pages/Friends';
import EmergencyContacts from './pages/EmergencyContacts';
import StudyTracker from './pages/StudyTracker';

// 🔥 Payment imports
import Payment from './pages/Payment';
import Payments from './pages/Payments';

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
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/book/:id" element={<BookAppointment />} />
          <Route path="/my-appointments" element={<MyAppointments />} />

          <Route path="/review-rating" element={<ReviewRating />} />
          <Route path="/review/:therapistId" element={<ReviewTherapist />} />

          <Route path="/therapist-appointments" element={<TherapistAppointments />} />
          <Route path="/session/:roomId" element={<OnlineSession />} />

          <Route path="/reminders" element={<MedicineReminder />} />
          <Route path="/sleep-tracker" element={<SleepTracker />} />
          <Route path="/mood-tracker" element={<MoodTracker />} />
          <Route path="/todo" element={<Todo />} />

          <Route path="/friends" element={<Friends />} />
          <Route path="/emergency-contacts" element={<EmergencyContacts />} />
          <Route path="/study-tracker" element={<StudyTracker />} />

          {/* 🔥 Payment routes */}
          <Route path="/payments" element={<Payments />} />
          <Route path="/payment/:id" element={<Payment />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;