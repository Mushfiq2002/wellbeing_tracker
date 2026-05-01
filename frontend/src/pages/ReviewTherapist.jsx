import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ReviewTherapist = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { appointmentId } = useParams();

  const appointment = location.state?.appointment;
  const therapistId = location.state?.therapistId || appointment?.therapist?._id;

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const userInfo =
    JSON.parse(localStorage.getItem('user')) ||
    JSON.parse(localStorage.getItem('userInfo'));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!therapistId) {
      alert('Therapist information missing. Please go back to My Appointments.');
      return;
    }

    if (rating === 0) {
      alert('Please select a star rating.');
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `http://localhost:5000/api/therapists/${therapistId}/reviews`,
        {
          rating: Number(rating),
          comment,
          appointmentId,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      alert(
        'Review submitted successfully! You unlocked 5% discount for your next appointment with any therapist.'
      );

      navigate('/my-appointments');
    } catch (error) {
      alert(error?.response?.data?.message || 'Review submit failed');
    } finally {
      setLoading(false);
    }
  };

  if (!userInfo?.token) {
    return <div className="p-6 text-center">Please login first.</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-xl border p-6">
        <h1 className="text-3xl font-bold text-center mb-2">
          Review & Rating Feature
        </h1>

        <p className="text-center text-gray-600 mb-3">
          Rate your completed session and share your experience.
        </p>

        <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-lg p-3 mb-5 text-center">
          Submit a review and rating to get <b>5% discount</b> on your next
          appointment with <b>any therapist</b>.
        </div>

        {appointment?.therapist?.name && (
          <p className="mb-4 text-center">
            <b>Therapist:</b> {appointment.therapist.name}
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
                className={`text-3xl ${
                  star <= rating ? 'text-yellow-500' : 'text-gray-300'
                }`}
              >
                ★
              </button>
            ))}
          </div>

          <p className="mb-4 text-sm text-gray-600">
            Selected rating: {rating === 0 ? 'No rating selected' : `${rating} star${rating > 1 ? 's' : ''}`}
          </p>

          <label className="block font-semibold mb-2">Review</label>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="5"
            placeholder="Write your experience..."
            className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Submitting...' : 'Submit Review & Rating'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/my-appointments')}
            className="w-full mt-3 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300"
          >
            Back
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewTherapist;