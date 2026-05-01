import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OnlineSession = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [accessMessage, setAccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState('');

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

  useEffect(() => {
    if (!userInfo?.token) {
      navigate('/login');
      return;
    }

    const checkSessionAccess = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/appointments/session/${roomId}`,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        setAccessMessage(data.message || 'Access granted');
        setAppointment(data.appointment);
      } catch (error) {
        setAccessMessage(
          error?.response?.data?.message ||
            'You are not allowed to access this session'
        );
      } finally {
        setLoading(false);
      }
    };

    checkSessionAccess();
  }, [roomId, navigate]);

  useEffect(() => {
    if (!appointment?.appointmentDate || !appointment?.timeSlot) return;

    const interval = setInterval(() => {
      const start = new Date(appointment.appointmentDate);
      const [hour, minute] = appointment.timeSlot.split(':');

      start.setHours(parseInt(hour, 10));
      start.setMinutes(parseInt(minute, 10));
      start.setSeconds(0);

      const end = new Date(start.getTime() + 10 * 60 * 1000); // ✅ FIXED

      const now = new Date();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft('Session ended');
        clearInterval(interval);
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${minutes}m ${seconds}s remaining`);
    }, 1000);

    return () => clearInterval(interval);
  }, [appointment]);

  if (loading) {
    return <div className="p-6 text-center">Checking session access...</div>;
  }

  if (!appointment) {
    return (
      <div className="p-6 text-center text-red-600">{accessMessage}</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">

      <div className="bg-white border rounded-lg shadow p-6 mb-6">
        <h1 className="text-2xl font-bold text-center mb-2">
          Secure Online Session
        </h1>

        <p className="text-center text-blue-600 mb-3">{timeLeft}</p>

        <p><b>Therapist:</b> {appointment.therapist?.name}</p>
        <p><b>Date:</b> {appointment.appointmentDate.substring(0, 10)}</p>
        <p><b>Time:</b> {formatTime(appointment.timeSlot)}</p>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden mb-6">
        <iframe
          title="Online Session"
          src={`https://meet.jit.si/wellbeing-${roomId}`}
          allow="camera; microphone; fullscreen"
          className="w-full h-[500px]"
        ></iframe>
      </div>

      <div className="text-center text-gray-600">
        After session ends, go to <b>My Appointments</b> to submit review.
      </div>
    </div>
  );
};

export default OnlineSession;