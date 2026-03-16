const TherapistCard = ({ therapist }) => {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 border hover:shadow-lg">
      <h2 className="text-xl font-bold mb-2">{therapist.name}</h2>

      <p><b>Specialization:</b> {therapist.specialization}</p>
      <p><b>Location:</b> {therapist.location}</p>
      <p><b>Consultation Fee:</b> ৳{therapist.consultationFee}</p>
      <p><b>Availability:</b> {therapist.availability}</p>
      <p><b>Session Mode:</b> {therapist.modeOfSession}</p>
    </div>
  );
};

export default TherapistCard;