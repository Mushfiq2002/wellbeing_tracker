import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const BookAppointment = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    therapist: '',
    appointmentDate: '',
    timeSlot: '',
    modeOfSession: 'online',
    notes: '',
  });

  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(false);

  const userInfo =
    JSON.parse(localStorage.getItem('user')) ||
    JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!userInfo?.token) {
      navigate('/login');
      return;
    }

    if (userInfo?.role === 'therapist') {
      alert('Therapists cannot book appointments as patients.');
      navigate('/therapist-appointments');
      return;
    }

    const fetchTherapists = async () => {
      try {
        const { data } = await axios.get('http://localhost:8000/api/therapists');
        setTherapists(data || []);
      } catch (error) {
        console.error('Error fetching therapists:', error);
      }
    };

    fetchTherapists();

    if (id) {
      setFormData((prev) => ({
        ...prev,
        therapist: id,
      }));
    }
  }, [id, navigate]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!formData.therapist || !formData.appointmentDate || !formData.timeSlot) {
      alert('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);

<<<<<<< HEAD
      await axios.post('http://localhost:5000/api/appointments', formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
=======
      await axios.post(
        'http://localhost:8000/api/appointments',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
>>>>>>> cd956fb85002168a01eb2e6a976b7d4a1ab5a50c

      alert('Appointment booked successfully');
      navigate('/my-appointments');
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Book Appointment
      </h1>

      <form
        onSubmit={submitHandler}
        className="bg-white shadow-md rounded-lg p-6 space-y-4"
      >
        <div>
          <label className="block mb-2 font-medium">Select Therapist</label>
          <select
            name="therapist"
            value={formData.therapist}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Choose a therapist</option>
            {therapists.map((therapist) => (
              <option key={therapist._id} value={therapist._id}>
                {therapist.name} - {therapist.specialization}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">Appointment Date</label>
          <input
            type="date"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Time Slot</label>
          <input
            type="time"
            name="timeSlot"
            value={formData.timeSlot}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Mode of Session</label>
          <select
            name="modeOfSession"
            value={formData.modeOfSession}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        {formData.modeOfSession === 'online' && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 p-3 rounded">
            A secure online session link will be generated after booking. Only
            the patient and assigned therapist can access it.
          </div>
        )}

        <div>
          <label className="block mb-2 font-medium">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
            rows="4"
            placeholder="Write anything important..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Booking...' : 'Book Appointment'}
        </button>
      </form>
    </div>
  );
};

export default BookAppointment;