import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
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

// Online session feature pages
import TherapistAppointments from './pages/TherapistAppointments';
import OnlineSession from './pages/OnlineSession';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />

        <main className="flex-grow">
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
            <Route path="/review/:appointmentId" element={<ReviewTherapist />} />

            <Route
              path="/therapist-appointments"
              element={<TherapistAppointments />}
            />
            <Route path="/session/:roomId" element={<OnlineSession />} />

            <Route path="/reminders" element={<MedicineReminder />} />
            <Route path="/sleep-tracker" element={<SleepTracker />} />
            <Route path="/todo" element={<Todo />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;