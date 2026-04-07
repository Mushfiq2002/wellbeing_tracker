import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const userInfo = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          'http://localhost:5000/api/appointments/my',
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        setAppointments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching appointments:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?.token) {
      fetchAppointments();
    } else {
      setLoading(false);
    }
  }, [userInfo]);

  if (!userInfo?.token) {
    return <div className="p-6 text-center">Please login first.</div>;
  }

  if (loading) {
    return <div className="p-6 text-center">Loading appointments...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">My Appointments</h1>

      {appointments.length === 0 ? (
        <p className="text-center">No appointments found.</p>
      ) : (
        <div className="grid gap-4">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white shadow rounded-lg p-4 border"
            >
              <h2 className="text-xl font-semibold mb-2">
                {appointment.therapist?.name || 'Therapist'}
              </h2>

              <p>
                <strong>Specialization:</strong>{' '}
                {appointment.therapist?.specialization || 'N/A'}
              </p>

              <p>
                <strong>Date:</strong>{' '}
                {appointment.appointmentDate
                  ? appointment.appointmentDate.substring(0, 10)
                  : 'N/A'}
              </p>

              <p><strong>Time:</strong> {appointment.timeSlot || 'N/A'}</p>
              <p><strong>Mode:</strong> {appointment.modeOfSession || 'N/A'}</p>
              <p><strong>Status:</strong> {appointment.status || 'pending'}</p>

              {appointment.notes && (
                <p><strong>Notes:</strong> {appointment.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;