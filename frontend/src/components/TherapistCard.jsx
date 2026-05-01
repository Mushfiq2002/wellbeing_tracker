import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TherapistCard = ({ therapist }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleBookAppointment = () => {
    setLoading(true);
    navigate(`/book/${therapist._id}`);
  };

  const latestReviews = therapist.reviews?.slice(-2).reverse() || [];

  return (
    <div className="bg-white shadow-md rounded-xl p-6 border hover:shadow-lg transition">
      <h2 className="text-xl font-bold mb-2">{therapist.name}</h2>

      <p><b>Specialization:</b> {therapist.specialization}</p>
      <p><b>Location:</b> {therapist.location}</p>
      <p><b>Consultation Fee:</b> ৳{therapist.consultationFee}</p>
      <p><b>Availability:</b> {therapist.availability}</p>
      <p><b>Session Mode:</b> {therapist.modeOfSession}</p>

      <div className="mt-3 border-t pt-3">
        <p>
          <b>Rating:</b> ⭐ {therapist.rating ?? 0} / 5
          {" "}({therapist.totalReviews || 0} reviews)
        </p>

        {latestReviews.length > 0 ? (
          <div className="mt-2 space-y-2">
            {latestReviews.map((review, index) => (
              <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                <p className="font-medium">
                  {review.userName || "User"} — ⭐ {review.rating}
                </p>
                {review.comment && (
                  <p className="text-gray-600 italic">"{review.comment}"</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600 italic mt-1">
            No reviews yet
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={handleBookAppointment}
        disabled={loading}
        className={`mt-4 w-full py-2 rounded-lg text-white font-medium transition duration-200 ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
        }`}
      >
        {loading ? "Opening..." : "Book Appointment"}
      </button>
    </div>
  );
};

export default TherapistCard;