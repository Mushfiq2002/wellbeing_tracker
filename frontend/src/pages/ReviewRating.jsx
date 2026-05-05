import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';

const ReviewRating = () => {
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const { data } = await axiosInstance.get('/therapists');

      const allReviews = [];

      data.forEach((therapist) => {
        therapist.reviews?.forEach((review) => {
          allReviews.push({
            therapistName: therapist.name,
            therapistId: therapist._id,
            rating: review.rating,
            comment: review.comment,
            userName: review.userName,
            createdAt: review.createdAt,
          });
        });
      });

      allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setReviews(allReviews);
    } catch (error) {
      console.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading reviews...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-xl border p-8 text-center mb-8">
        <h1 className="text-3xl font-bold mb-3">Review & Rating</h1>

        <p className="text-gray-600 mb-5">
          After completing a therapy session, you can rate your therapist and
          share your experience.
        </p>

        <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-lg p-4 mb-6">
          Give a review and rating to unlock <b>5% discount</b> on your next
          appointment with <b>any therapist</b>.
        </div>

        <div className="text-left bg-gray-50 rounded-lg p-5 mb-6">
          <h2 className="text-xl font-semibold mb-3">How it works</h2>

          <ul className="space-y-2 text-gray-700">
            <li>1. Book an appointment with a therapist.</li>
            <li>2. Complete your online/offline session.</li>
            <li>3. Go to My Appointments.</li>
            <li>4. Click Give Review beside a Review Pending session.</li>
            <li>5. Submit your rating and review.</li>
            <li>6. Get 5% discount on your next appointment.</li>
          </ul>
        </div>

        <button
          onClick={() => navigate('/my-appointments')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Go to My Appointments
        </button>
      </div>

      <h2 className="text-2xl font-bold text-center mb-4">
        Review History
      </h2>

      {reviews.length === 0 ? (
        <p className="text-center text-gray-600">No reviews yet.</p>
      ) : (
        <div className="grid gap-4">
          {reviews.map((r, index) => (
            <div key={index} className="bg-white border rounded-lg p-5 shadow">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg">
                  {r.userName || 'User'} reviewed {r.therapistName}
                </h3>

                <span className="text-yellow-500 font-bold">
                  ⭐ {r.rating}/5
                </span>
              </div>

              <p className="text-gray-700 mb-2">
                {r.comment || 'No comment provided'}
              </p>

              <p className="text-sm text-gray-500">
                {r.createdAt ? new Date(r.createdAt).toLocaleString() : 'N/A'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewRating;