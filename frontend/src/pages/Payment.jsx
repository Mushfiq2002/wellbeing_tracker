import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const user =
    JSON.parse(localStorage.getItem('user')) ||
    JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const { data } = await axiosInstance.get(`/payments/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        setPayment(data);
      } catch (error) {
        alert(error?.response?.data?.message || 'Failed to load payment');
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [id]);

  const handlePayment = async () => {
    setPaying(true);

    try {
      await axiosInstance.put(
        `/payments/${id}/confirm`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      alert('Payment successful');
      navigate('/my-appointments');
    } catch (error) {
      alert(error?.response?.data?.message || 'Payment failed');
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading payment...</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4">Online Payment</h1>

        <div className="space-y-3">
          <p>
            <b>Therapist:</b> {payment.therapistName}
          </p>

          <p>
            <b>Therapist Fee:</b> ৳{payment.originalFee}
          </p>

          {payment.discountApplied ? (
            <p className="text-green-600">
              <b>Review Discount:</b> 5% discount applied - ৳
              {payment.discountAmount}
            </p>
          ) : (
            <p className="text-gray-600">No discount available</p>
          )}

          <hr />

          <h2 className="text-xl font-bold">
            Total Payable: ৳{payment.finalFee}
          </h2>

          <p>
            <b>Status:</b> {payment.paymentStatus}
          </p>
        </div>

        <button
          onClick={handlePayment}
          disabled={paying || payment.paymentStatus === 'paid'}
          className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
        >
          {payment.paymentStatus === 'paid'
            ? 'Already Paid'
            : paying
            ? 'Processing...'
            : 'Pay Now'}
        </button>
      </div>
    </div>
  );
};

export default Payment;
