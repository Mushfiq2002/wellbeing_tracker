import { useEffect, useState } from "react";
import { getTherapists } from "../services/therapistService";
import TherapistCard from "../components/TherapistCard";

const Therapists = () => {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const data = await getTherapists();

        // Backend already removes therapists with rating below 3
        setTherapists(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch therapists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapists();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading therapists...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-3">
        Available Therapists
      </h1>

      <p className="text-center text-gray-500 mb-8">
      </p>

      {therapists.length === 0 ? (
        <p className="text-center text-gray-600">
          No therapists available right now.
        </p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {therapists.map((therapist) => (
            <TherapistCard key={therapist._id} therapist={therapist} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Therapists;