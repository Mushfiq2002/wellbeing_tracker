import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';

const Payments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const user =
    JSON.parse(localStorage.getItem('user')) ||
    JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axiosInstance.get('/appointments/my', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        setAppointments(Array.isArray(data) ? data : []);
      } catch (error) {
        alert(error?.response?.data?.message || 'Failed to load payments');
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) fetchAppointments();
    else setLoading(false);
  }, []);

  if (!user?.token) {
    return <div className="p-6 text-center">Please login first.</div>;
  }

  if (loading) {
    return <div className="p-6 text-center">Loading payments...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Payments</h1>

      {appointments.length === 0 ? (
        <p className="text-center">No appointments found.</p>
      ) : (
        <div className="grid gap-4">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="bg-white shadow rounded-lg p-5 border">
              <h2 className="text-xl font-semibold">
                {appointment.therapist?.name || 'Therapist'}
              </h2>

              <p>
                <b>Date:</b> {appointment.appointmentDate?.substring(0, 10) || 'N/A'}
              </p>

              <p>
                <b>Fee:</b> ৳
                {appointment.therapist?.consultationFee || appointment.finalFee || 0}
              </p>

              <p>
                <b>Payment Status:</b>{' '}
                {appointment.paymentStatus === 'paid' ? (
                  <span className="text-green-600 font-semibold">Paid</span>
                ) : (
                  <span className="text-red-600 font-semibold">Unpaid</span>
                )}
              </p>

              {appointment.paymentStatus !== 'paid' ? (
                <button
                  onClick={() => navigate(`/payment/${appointment._id}`)}
                  className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Pay Now
                </button>
              ) : (
                <span className="inline-block mt-4 bg-green-100 text-green-700 px-4 py-2 rounded">
                  Payment Completed
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Payments;