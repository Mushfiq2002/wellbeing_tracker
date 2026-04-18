import { useEffect, useState } from "react";
import { getTherapists } from "../services/therapistService";
import TherapistCard from "../components/TherapistCard";

const Therapists = () => {
  const [therapists, setTherapists] = useState([]);
  
  useEffect(() => {
    const fetchTherapists = async () => {
      const data = await getTherapists();
      setTherapists(data);
    };

    fetchTherapists();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        Available Therapists
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {therapists.map((therapist) => (
          <TherapistCard
            key={therapist._id}
            therapist={therapist}
          />
        ))}
      </div>
    </div>
  );
};

export default Therapists;