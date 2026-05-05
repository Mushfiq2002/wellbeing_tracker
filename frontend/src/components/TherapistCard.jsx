import { useNavigate } from "react-router-dom";

const TherapistCard = ({ therapist }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow-md rounded-xl p-6 border hover:shadow-lg">
      <h2 className="text-xl font-bold mb-2">{therapist.name}</h2>

      <p><b>Specialization:</b> {therapist.specialization}</p>
      <p><b>Location:</b> {therapist.location}</p>
      <p><b>Consultation Fee:</b> ৳{therapist.consultationFee}</p>
      <p><b>Availability:</b> {therapist.availability}</p>
      <p><b>Session Mode:</b> {therapist.modeOfSession}</p>

      {/* 🔥 NEW BUTTON */}
      <button
        onClick={() => navigate(`/book/${therapist._id}`)}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Book Appointment
      </button>
    </div>
  );
};

export default TherapistCard;