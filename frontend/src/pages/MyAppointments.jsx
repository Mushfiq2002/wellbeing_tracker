import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const MyAppointments = () => {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const userInfo =
    JSON.parse(localStorage.getItem('user')) ||
    JSON.parse(localStorage.getItem('userInfo'));

 HEAD
  const formatTime = (time) => {
    if (!time) return 'N/A';

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          'http://localhost:8000/api/appointments/my',
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
 cd956fb85002168a01eb2e6a976b7d4a1ab5a50c

    const [hour, minute] = time.split(':');
    let h = parseInt(hour, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';

    h = h % 12;
    if (h === 0) h = 12;

    return `${h}:${minute} ${ampm}`;
  };

  const getStatusStyle = (status) => {
    if (status === 'pending') return 'text-yellow-600 bg-yellow-100';
    if (status === 'missed') return 'text-red-600 bg-red-100';
    if (status === 'review_pending') return 'text-blue-600 bg-blue-100';
    if (status === 'completed') return 'text-green-600 bg-green-100';
    if (status === 'cancelled') return 'text-gray-600 bg-gray-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getStatusText = (status) => {
    if (status === 'pending') return 'Pending';
    if (status === 'missed') return 'Missed';
    if (status === 'review_pending') return 'Review Pending';
    if (status === 'completed') return 'Completed';
    if (status === 'cancelled') return 'Cancelled';
    return status || 'Pending';
  };

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
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.token) fetchAppointments();
    else setLoading(false);
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;

    try {
      await axios.put(
        `http://localhost:8000/api/appointments/${id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      fetchAppointments();
    } catch (error) {
      alert(error?.response?.data?.message || 'Cancel failed');
    }
  };

  const handleJoin = (link) => {
    navigate(link);
  };

  const handleReview = (appointment) => {
    navigate(`/review/${appointment._id}`, {
      state: {
        appointment,
        therapistId: appointment.therapist?._id,
      },
    });
  };

  if (!userInfo?.token) {
    return <div className="p-6 text-center">Please login first.</div>;
  }

  if (loading) {
    return <div className="p-6 text-center">Loading appointments...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        My Appointments
      </h1>

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
                <b>Date:</b>{' '}
                {appointment.appointmentDate
                  ? appointment.appointmentDate.substring(0, 10)
                  : 'N/A'}
              </p>

              <p>
                <b>Time:</b> {formatTime(appointment.timeSlot)}
              </p>

              <p>
                <b>Mode:</b>{' '}
                <span className="capitalize">
                  {appointment.modeOfSession}
                </span>
              </p>

              <p className="mt-2">
                <b>Status:</b>{' '}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusStyle(
                    appointment.status
                  )}`}
                >
                  {getStatusText(appointment.status)}
                </span>
              </p>

              {appointment.status === 'missed' && (
                <p className="text-red-600 font-semibold mt-2">
                  You missed this session.
                </p>
              )}

              {appointment.status === 'review_pending' && (
                <p className="text-blue-600 font-semibold mt-2">
                  Session done. Please give a review to unlock 5% discount on
                  your next appointment.
                </p>
              )}

              {appointment.status === 'completed' && (
                <p className="text-green-600 font-semibold mt-2">
                  Session completed successfully.
                </p>
              )}

              {appointment.discountApplied && (
                <p className="text-green-600 font-semibold mt-2">
                  5% discount applied. Saved: ৳{appointment.discountAmount}
                </p>
              )}

              {appointment.finalFee > 0 && (
                <p>
                  <b>Final Fee:</b> ৳{appointment.finalFee}
                </p>
              )}

              {appointment.notes && (
                <p>
                  <b>Notes:</b> {appointment.notes}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {appointment.modeOfSession === 'online' &&
                  appointment.meetingLink &&
                  appointment.status === 'pending' &&
                  !appointment.sessionEndedAt && (
                    <button
                      onClick={() => handleJoin(appointment.meetingLink)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Join Session
                    </button>
                  )}

                {appointment.status === 'review_pending' && (
                  <button
                    onClick={() => handleReview(appointment)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Give Review
                  </button>
                )}

                {appointment.status === 'pending' && (
                  <button
                    onClick={() => handleCancel(appointment._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;