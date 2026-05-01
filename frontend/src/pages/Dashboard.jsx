import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const [therapistData, setTherapistData] = useState(null);

  useEffect(() => {
    const fetchTherapistData = async () => {
      try {
        if (user?.role === 'therapist') {
          const { data } = await axios.get('/api/therapists');

          // 🔍 find current therapist (by linked user id)
          const myData = data.find(
            (t) => t.user && t.user.toString() === user._id
          );

          setTherapistData(myData);
        }
      } catch (error) {
        console.error('Failed to load therapist data');
      }
    };

    fetchTherapistData();
  }, [user]);

  const getRatingColor = () => {
    if (!therapistData) return 'text-gray-600';
    if (therapistData.rating < 3) return 'text-red-600';
    if (therapistData.rating < 4) return 'text-yellow-500';
    return 'text-green-600';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="text-3xl font-bold">Dashboard</CardTitle>
          <p className="mt-2 text-blue-100">
            Welcome to your wellbeing tracker.
          </p>
        </CardHeader>

        <CardContent className="p-8">

          {/* 👤 User Info */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-100 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Hello, {user?.name}!
            </h2>
            <p className="text-gray-600">
              You are logged in as a <strong>{user?.role}</strong>.
            </p>
          </div>

          {/* ⭐ Therapist Panel */}
          {user?.role === 'therapist' && therapistData && (
            <>
              {/* My Rating */}
              <div className="bg-white border rounded-lg p-6 shadow mb-4">
                <h3 className="text-xl font-semibold mb-2">My Rating</h3>

                <p className={`text-2xl font-bold ${getRatingColor()}`}>
                  ⭐ {therapistData.rating?.toFixed(1) || 0}
                </p>

                <p className="text-gray-500">
                  ({therapistData.totalReviews || 0} Reviews)
                </p>
              </div>

              {/* ⚠️ Warning */}
              {therapistData.ratingWarning && (
                <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                  {therapistData.ratingWarning}
                </div>
              )}
            </>
          )}

        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;