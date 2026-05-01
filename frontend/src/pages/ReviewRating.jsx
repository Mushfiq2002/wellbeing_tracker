import React from 'react';
import { useNavigate } from 'react-router-dom';

const ReviewRating = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-xl border p-8 text-center">
        <h1 className="text-3xl font-bold mb-3">
          Review & Rating
        </h1>

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
            <li>2. Join and complete the session.</li>
            <li>3. Go to My Appointments.</li>
            <li>4. Click Give Review beside a review pending session.</li>
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
    </div>
  );
};

export default ReviewRating;