import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TherapistAppointments = () => {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState({
    total: 0,
    onlineCount: 0,
    offlineCount: 0,
    doneCount: 0,
    missedCount: 0,
    pendingCount: 0,
    appointments: [],
  });

  const [loading, setLoading] = useState(true);
  const [startingId, setStartingId] = useState('');
  const [markingId, setMarkingId] = useState('');

  const userInfo =
    JSON.parse(localStorage.getItem('user')) ||
    JSON.parse(localStorage.getItem('userInfo'));

  const formatTime = (time) => {
    if (!time) return 'N/A';

    const [hour, minute] = time.split(':');
    let h = parseInt(hour, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';

    h = h % 12;
    if (h === 0) h = 12;

    return `${h}:${minute} ${ampm}`;
  };

  const getTherapistStatusText = (status) => {
    if (status === 'review_pending' || status === 'completed') return 'Done';
    if (status === 'missed') return 'Missed';
    if (status === 'pending') return 'Pending';
    if (status === 'cancelled') return 'Cancelled';
    return 'Pending';
  };

  const getTherapistStatusClass = (status) => {
    if (status === 'review_pending' || status === 'completed') {
      return 'bg-green-100 text-green-700';
    }

    if (status === 'missed') {
      return 'bg-red-100 text-red-700';
    }

    if (status === 'pending') {
      return 'bg-yellow-100 text-yellow-700';
    }

    return 'bg-gray-100 text-gray-700';
  };

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get(
        'http://localhost:5000/api/appointments/therapist/today',
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      setDashboardData({
        total: data.total || 0,
        onlineCount: data.onlineCount || 0,
        offlineCount: data.offlineCount || 0,
        doneCount: data.doneCount || 0,
        missedCount: data.missedCount || 0,
        pendingCount: data.pendingCount || 0,
        appointments: data.appointments || [],
      });
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          'Failed to load therapist appointments'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userInfo?.token) {
      navigate('/login');
      return;
    }

    if (userInfo?.role !== 'therapist') {
      navigate('/dashboard');
      return;
    }

    fetchAppointments();
  }, [navigate]);

  const startSession = async (appointmentId) => {
    try {
      setStartingId(appointmentId);

      await axios.put(
        `http://localhost:5000/api/appointments/start/${appointmentId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      alert('Session started successfully');
      fetchAppointments();
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to start session');
    } finally {
      setStartingId('');
    }
  };

  const markStatus = async (id, mark) => {
    try {
      setMarkingId(id);

      await axios.put(
        `http://localhost:5000/api/appointments/${id}/mark`,
        { mark },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      fetchAppointments();
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to update session status');
    } finally {
      setMarkingId('');
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        Loading therapist appointments...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-2">
        Therapist Appointment Dashboard
      </h1>

      <p className="text-center text-gray-600 mb-8">
        View next 7 days appointments and manage online/offline session status.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-8">
        <div className="bg-white border rounded-lg shadow p-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            {dashboardData.total}
          </h2>
          <p className="text-gray-600 mt-2">Next 7 Days</p>
        </div>

        <div className="bg-white border rounded-lg shadow p-6 text-center">
          <h2 className="text-3xl font-bold text-blue-600">
            {dashboardData.onlineCount}
          </h2>
          <p className="text-gray-600 mt-2">Online</p>
        </div>

        <div className="bg-white border rounded-lg shadow p-6 text-center">
          <h2 className="text-3xl font-bold text-green-600">
            {dashboardData.offlineCount}
          </h2>
          <p className="text-gray-600 mt-2">Offline</p>
        </div>

        <div className="bg-white border rounded-lg shadow p-6 text-center">
          <h2 className="text-3xl font-bold text-emerald-600">
            {dashboardData.doneCount}
          </h2>
          <p className="text-gray-600 mt-2">Done</p>
        </div>

        <div className="bg-white border rounded-lg shadow p-6 text-center">
          <h2 className="text-3xl font-bold text-red-600">
            {dashboardData.missedCount}
          </h2>
          <p className="text-gray-600 mt-2">Missed</p>
        </div>
      </div>

      {dashboardData.appointments.length === 0 ? (
        <div className="bg-white border rounded-lg shadow p-8 text-center">
          <p className="text-gray-700 text-lg">
            You have no appointments in the next 7 days.
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {dashboardData.appointments.map((appointment) => {
            const statusText = getTherapistStatusText(appointment.status);
            const isFinalStatus =
              appointment.status === 'review_pending' ||
              appointment.status === 'completed' ||
              appointment.status === 'missed';

            return (
              <div
                key={appointment._id}
                className="bg-white border rounded-lg shadow p-5"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      Patient: {appointment.user?.name || 'Patient'}
                    </h2>

                    <p>
                      <strong>Email:</strong>{' '}
                      {appointment.user?.email || 'N/A'}
                    </p>

                    <p>
                      <strong>Date:</strong>{' '}
                      {appointment.appointmentDate
                        ? appointment.appointmentDate.substring(0, 10)
                        : 'N/A'}
                    </p>

                    <p>
                      <strong>Time:</strong> {formatTime(appointment.timeSlot)}
                    </p>

                    <p>
                      <strong>Mode:</strong>{' '}
                      <span className="capitalize">
                        {appointment.modeOfSession || 'N/A'}
                      </span>
                    </p>

                    <p className="mt-2">
                      <strong>Status:</strong>{' '}
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getTherapistStatusClass(
                          appointment.status
                        )}`}
                      >
                        {statusText}
                      </span>
                    </p>

                    {appointment.therapistMarked && (
                      <p className="text-sm text-gray-600 mt-2">
                        Therapist marked as:{' '}
                        <b className="capitalize">
                          {appointment.therapistMarkedStatus}
                        </b>
                      </p>
                    )}

                    {appointment.sessionStarted && (
                      <p className="text-green-600 font-semibold mt-2">
                        Session Started
                      </p>
                    )}

                    {appointment.notes && (
                      <p>
                        <strong>Notes:</strong> {appointment.notes}
                      </p>
                    )}
                  </div>

                  <div className="md:text-right space-y-2 min-w-[190px]">
                    {appointment.modeOfSession === 'online' &&
                    appointment.meetingLink ? (
                      <>
                        <button
                          onClick={() => startSession(appointment._id)}
                          disabled={
                            appointment.sessionStarted ||
                            startingId === appointment._id ||
                            appointment.status === 'missed'
                          }
                          className={`block w-full px-4 py-2 rounded text-white ${
                            appointment.sessionStarted ||
                            appointment.status === 'missed'
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-green-600 hover:bg-green-700'
                          }`}
                        >
                          {appointment.sessionStarted
                            ? 'Session Started'
                            : startingId === appointment._id
                            ? 'Starting...'
                            : 'Start Session'}
                        </button>

                        <Link
                          to={appointment.meetingLink}
                          className="block w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center"
                        >
                          Join Online Session
                        </Link>
                      </>
                    ) : (
                      <div className="block w-full bg-green-100 text-green-700 px-4 py-2 rounded font-medium text-center">
                        Offline Session
                      </div>
                    )}

                    {!isFinalStatus && (
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => markStatus(appointment._id, 'done')}
                          disabled={markingId === appointment._id}
                          className="w-1/2 bg-emerald-600 text-white px-3 py-2 rounded hover:bg-emerald-700 disabled:bg-gray-400"
                        >
                          Done
                        </button>

                        <button
                          onClick={() => markStatus(appointment._id, 'missed')}
                          disabled={markingId === appointment._id}
                          className="w-1/2 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 disabled:bg-gray-400"
                        >
                          Missed
                        </button>
                      </div>
                    )}

                    {isFinalStatus && (
                      <div className="text-sm text-gray-500 pt-2">
                        Status already updated
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TherapistAppointments;