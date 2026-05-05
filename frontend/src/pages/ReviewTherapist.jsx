import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';

const ReviewTherapist = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const therapist = location.state?.therapist || null;
  const therapistId = therapist?._id || params.therapistId;
  const appointmentId = location.state?.appointmentId || null;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const user =
    JSON.parse(localStorage.getItem('user')) ||
    JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!appointmentId) {
      alert('Review তথ্য missing. My Appointments থেকে আবার চেষ্টা করো।');
      navigate('/my-appointments');
    }
  }, [appointmentId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.token) {
      alert('Please login first.');
      return;
    }

    if (!therapistId || !appointmentId) {
      alert('Review তথ্য missing. My Appointments থেকে আবার চেষ্টা করো।');
      navigate('/my-appointments');
      return;
    }

    if (!rating) {
      alert('Please select a rating.');
      return;
    }

    try {
      setLoading(true);

      await axiosInstance.post(
        `/therapists/${therapistId}/reviews`,
        {
          rating: Number(rating),
          comment: comment.trim(),
          appointmentId,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      alert('Review submitted! 5% discount unlocked 🎉');
      navigate('/my-appointments');
    } catch (error) {
      alert(error?.response?.data?.message || 'Review failed');
    } finally {
      setLoading(false);
    }
  };

  if (!user?.token) {
    return <div className="p-6 text-center">Please login first.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white shadow rounded-xl border p-6">
        <h1 className="text-3xl font-bold text-center mb-3">
          Review & Rating
        </h1>

        {therapist?.name && (
          <p className="text-center mb-4">
            <b>Therapist:</b> {therapist.name}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <label className="block font-semibold mb-2">Rating</label>

          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                className={`text-4xl ${
                  star <= rating ? 'text-yellow-500' : 'text-gray-300'
                }`}
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="4"
            placeholder="Write your experience..."
            className="w-full border p-3 rounded mb-4"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-3 rounded ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewTherapist;