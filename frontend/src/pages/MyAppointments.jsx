import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import { useSelector } from 'react-redux';

const MyAppointments = () => {
  const navigate = useNavigate();
  const { user: reduxUser } = useSelector((state) => state.auth);

  const user =
    reduxUser ||
    JSON.parse(localStorage.getItem('user')) ||
    JSON.parse(localStorage.getItem('userInfo'));

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatTime = (time) => {
    if (!time) return 'N/A';

    const [hour, minute = '00'] = time.split(':');
    let h = parseInt(hour, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';

    h = h % 12 || 12;

    return `${h}:${minute} ${ampm}`;
  };

  const statusText = (status) => {
    if (status === 'pending') return 'Pending';
    if (status === 'missed') return 'Missed';
    if (status === 'review_pending') return 'Review Pending';
    if (status === 'completed') return 'Completed';
    if (status === 'cancelled') return 'Cancelled';

    return status;
  };

  const canJoin = (appointment) => {
    if (!appointment?.appointmentDate || !appointment?.timeSlot) return false;

    const start = new Date(appointment.appointmentDate);
    const [h, m = '00'] = appointment.timeSlot.split(':');

    start.setHours(parseInt(h, 10));
    start.setMinutes(parseInt(m, 10));
    start.setSeconds(0);
    start.setMilliseconds(0);

    const now = new Date();

    return now >= start;
  };

  const fetchAppointments = async () => {
    try {
      const { data } = await axiosInstance.get('/appointments/my', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchAppointments();
    } else {
      setLoading(false);
    }
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;

    try {
      await axiosInstance.put(
        `/appointments/${id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      fetchAppointments();
    } catch (error) {
      alert(error?.response?.data?.message || 'Cancel failed');
    }
  };

  const handleGiveReview = (appointment) => {
    navigate(`/review/${appointment.therapist?._id}`, {
      state: {
        appointmentId: appointment._id,
        therapist: appointment.therapist,
      },
    });
  };

  if (!user?.token) {
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
              className="bg-white shadow rounded-lg p-5 border"
            >
              <h2 className="text-xl font-semibold mb-2">
                {appointment.therapist?.name || 'Therapist'}
              </h2>

              <p>
                <b>Date:</b>{' '}
                {appointment.appointmentDate?.substring(0, 10) || 'N/A'}
              </p>

              <p>
                <b>Time:</b> {formatTime(appointment.timeSlot)}
              </p>

              <p>
                <b>Mode:</b> {appointment.modeOfSession}
              </p>

              <p>
                <b>Status:</b> {statusText(appointment.status)}
              </p>

              <p>
                <b>Payment:</b>{' '}
                {appointment.paymentStatus === 'paid' ? (
                  <span className="text-green-600 font-semibold">Paid</span>
                ) : (
                  <span className="text-red-600 font-semibold">Unpaid</span>
                )}
              </p>

              {appointment.finalFee > 0 && (
                <p>
                  <b>Paid Amount:</b> ৳{appointment.finalFee}
                </p>
              )}

              {appointment.discountApplied && (
                <p className="text-green-600">
                  <b>Discount Applied:</b> 5% review discount
                </p>
              )}

              {appointment.status === 'review_pending' && (
                <p className="mt-3 text-sm text-yellow-600">
                  Please give a review to complete this session.
                </p>
              )}

              <div className="mt-4 flex gap-2 flex-wrap">
                {appointment.paymentStatus !== 'paid' &&
                  appointment.status !== 'cancelled' &&
                  appointment.status !== 'missed' && (
                    <button
                      onClick={() => navigate(`/payment/${appointment._id}`)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                      Pay Now
                    </button>
                  )}

                {appointment.modeOfSession === 'online' &&
                  appointment.status === 'pending' &&
                  appointment.meetingLink && (
                    <button
                      onClick={() => navigate(appointment.meetingLink)}
                      disabled={!canJoin(appointment)}
                      className={`px-4 py-2 rounded text-white ${
                        canJoin(appointment)
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Join Session
                    </button>
                  )}

                {appointment.status === 'review_pending' && (
                  <button
                    onClick={() => handleGiveReview(appointment)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Give Review
                  </button>
                )}

                {appointment.status === 'pending' && (
                  <button
                    onClick={() => handleCancel(appointment._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  >
                    Cancel
                  </button>
                )}

                {appointment.status === 'completed' && (
                  <span className="bg-green-100 text-green-700 px-4 py-2 rounded">
                    All Complete
                  </span>
                )}

                {appointment.status === 'missed' && (
                  <span className="bg-red-100 text-red-700 px-4 py-2 rounded">
                    Session Missed
                  </span>
                )}

                {appointment.status === 'cancelled' && (
                  <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded">
                    Cancelled
                  </span>
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