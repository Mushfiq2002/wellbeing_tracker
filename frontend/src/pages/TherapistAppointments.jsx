import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';

const TherapistAppointments = () => {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [markingId, setMarkingId] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));

  const fetchData = async () => {
    try {
      const res = await axiosInstance.get('/appointments/therapist/week');
      setData(res.data);
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.token) {
      navigate('/login');
      return;
    }

    if (user.role !== 'therapist') {
      navigate('/dashboard');
      return;
    }

    fetchData();
  }, []);

  const handleMark = async (id, mark) => {
    try {
      setMarkingId(id);

      await axiosInstance.put(`/appointments/${id}/mark`, { mark });

      fetchData();
    } catch (err) {
      alert(err?.response?.data?.message || 'Mark failed');
    } finally {
      setMarkingId('');
    }
  };

  const handleStartSession = async (appointment) => {
    try {
      await axiosInstance.put(`/appointments/start/${appointment._id}`, {});
      navigate(appointment.meetingLink || `/session/${appointment.sessionRoomId}`);
    } catch (err) {
      alert(err?.response?.data?.message || 'Session cannot start now');
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (!data) return null;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Therapist Dashboard (Next 7 Days)
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card title="Total" value={data.total} />
        <Card title="Online" value={data.onlineCount} />
        <Card title="Offline" value={data.offlineCount} />
        <Card title="Done" value={data.doneCount} />
        <Card title="Missed" value={data.missedCount} />
      </div>

      <div className="grid gap-4">
        {data.appointments?.length === 0 ? (
          <p className="text-center text-gray-600">
            No appointments in the next 7 days.
          </p>
        ) : (
          data.appointments.map((a) => (
            <div key={a._id} className="border p-4 rounded bg-white shadow-sm">
              <p>
                <b>Patient:</b> {a.user?.name || 'N/A'}
              </p>
              <p>
                <b>Date:</b>{' '}
                {a.appointmentDate ? a.appointmentDate.substring(0, 10) : 'N/A'}
              </p>
              <p>
                <b>Time:</b> {a.timeSlot}
              </p>
              <p>
                <b>Mode:</b> {a.modeOfSession}
              </p>
              <p>
                <b>Status:</b> {a.status}
              </p>

              {a.status === 'pending' && (
                <div className="mt-3 flex gap-2 flex-wrap">
                  {a.modeOfSession === 'online' ? (
                    <>
                      <button
                        onClick={() => handleStartSession(a)}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                      >
                        Start Session
                      </button>

                      <button
                        onClick={() =>
                          navigate(a.meetingLink || `/session/${a.sessionRoomId}`)
                        }
                        className="bg-green-600 text-white px-4 py-2 rounded"
                      >
                        Join Session
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleMark(a._id, 'done')}
                        disabled={markingId === a._id}
                        className="bg-green-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
                      >
                        Mark Done
                      </button>

                      <button
                        onClick={() => handleMark(a._id, 'missed')}
                        disabled={markingId === a._id}
                        className="bg-red-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
                      >
                        Mark Missed
                      </button>
                    </>
                  )}
                </div>
              )}

              {a.status === 'review_pending' && (
                <div className="mt-3 text-green-700 font-medium">
                  Session Done — Waiting for user review
                </div>
              )}

              {a.status === 'completed' && (
                <div className="mt-3 text-green-700 font-medium">
                  Completed
                </div>
              )}

              {a.status === 'missed' && (
                <div className="mt-3 text-red-700 font-medium">
                  Missed
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="bg-white border p-5 text-center rounded shadow">
    <h2 className="text-2xl font-bold">{value}</h2>
    <p>{title}</p>
  </div>
);

export default TherapistAppointments;