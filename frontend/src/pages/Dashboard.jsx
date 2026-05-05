import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import DailyMotivation from '../components/ui/DailyMotivation';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const [therapistData, setTherapistData] = useState(null);
  const [loadingTherapist, setLoadingTherapist] = useState(false);

  useEffect(() => {
    const fetchTherapistData = async () => {
      try {
        if (user?.role === 'therapist' && user?.token) {
          setLoadingTherapist(true);

          const { data } = await axiosInstance.get('/therapists/me/profile', {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });

          setTherapistData(data);
        }
      } catch (error) {
        console.error(
          error?.response?.data?.message || 'Failed to load therapist data'
        );
        setTherapistData(null);
      } finally {
        setLoadingTherapist(false);
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

  if (!user?.token) {
    return <p className="text-center mt-10">Please login first.</p>;
  }

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
          <DailyMotivation />
          <div className="bg-blue-50 rounded-lg p-6 mb-6 border border-blue-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Hello, {user.name}!
            </h2>

            <p className="text-gray-600">
              You are logged in as a <strong>{user.role}</strong>.
            </p>
          </div>

          {user.role === 'therapist' && (
            <>
              {loadingTherapist && (
                <p className="text-gray-500 mb-4">
                  Loading therapist rating...
                </p>
              )}

              {!loadingTherapist && therapistData && (
                <>
                  <div className="bg-white border rounded-lg p-6 shadow mb-4">
                    <h3 className="text-xl font-semibold mb-2">My Rating</h3>

                    <p className={`text-2xl font-bold ${getRatingColor()}`}>
                      ⭐ {Number(therapistData.rating || 5).toFixed(1)}
                    </p>

                    <p className="text-gray-500">
                      ({therapistData.totalReviews || 0} Reviews)
                    </p>

                    <p className="mt-2 text-sm text-gray-600">
                      Public Status:{' '}
                      <strong
                        className={
                          therapistData.isActive
                            ? 'text-green-600'
                            : 'text-red-600'
                        }
                      >
                        {therapistData.isActive
                          ? 'Visible in therapist list'
                          : 'Removed from therapist list'}
                      </strong>
                    </p>
                  </div>

                  {therapistData.ratingWarning && (
                    <div className="bg-red-100 text-red-700 p-4 rounded mb-4 border border-red-200">
                      {therapistData.ratingWarning}
                    </div>
                  )}

                  {therapistData.isRemovedDueToLowRating && (
                    <div className="bg-yellow-100 text-yellow-800 p-4 rounded mb-4 border border-yellow-200">
                      You have been removed from the public therapist list
                      because your average rating is below 3.
                    </div>
                  )}
                </>
              )}

              {!loadingTherapist && !therapistData && (
                <div className="bg-yellow-50 text-yellow-700 p-4 rounded border border-yellow-200">
                  Therapist profile not found for this account.
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