import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const StreakTracker = () => {
  const [streaks, setStreaks] = useState([]);
  const [activityType, setActivityType] = useState('mood');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchStreaks();
  }, []);

  const fetchStreaks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get('/streaks');
      setStreaks(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch streaks');
    } finally {
      setLoading(false);
    }
  };

  const handleLog = async () => {
    setError(null);
    setSuccess(null);
    try {
      await axiosInstance.post('/streaks', { activityType });
      setSuccess('Activity logged successfully!');
      fetchStreaks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log activity');
    }
  };

  const getStreak = (type) => {
    const s = streaks.find(s => s.activityType === type);
    return s ? s.currentStreak : 0;
  };

  const activityLabel = (type) => {
    if (type === 'mood') return 'Mood Logging';
    if (type === 'sleep') return 'Sleep Tracking';
    return 'Study Session';
  };

  const badgeVariants = { mood: 'warning', sleep: 'success', study: 'default' };

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-8">
      <h1 className="text-3xl font-bold mb-6">Streak Tracker</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{success}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-gray-500 text-sm mb-1">Mood Streak</p>
            <p className="text-3xl font-bold text-orange-500">{getStreak('mood')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-gray-500 text-sm mb-1">Sleep Streak</p>
            <p className="text-3xl font-bold text-green-600">{getStreak('sleep')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-gray-500 text-sm mb-1">Study Streak</p>
            <p className="text-3xl font-bold text-blue-600">{getStreak('study')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Log Activity */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Log Today's Activity</h2>
        <Card>
          <CardContent className="p-4 flex gap-3 items-center">
            <select value={activityType} onChange={e => setActivityType(e.target.value)} className="flex-1 border border-gray-300 rounded px-3 py-2">
              <option value="mood">Mood Logging</option>
              <option value="sleep">Sleep Tracking</option>
              <option value="study">Study Session</option>
            </select>
            <Button onClick={handleLog}>Log</Button>
          </CardContent>
        </Card>
      </section>

      {/* Streak History */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Streak History</h2>
        {loading && <p>Loading streaks...</p>}
        {!loading && streaks.length === 0 && (
          <p className="text-gray-500 italic">No activity logged yet. Log your first activity above!</p>
        )}
        <div className="space-y-3">
          {streaks.map(streak => (
            <Card key={streak._id}>
              <CardContent className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Badge variant={badgeVariants[streak.activityType]}>{activityLabel(streak.activityType)}</Badge>
                  <div>
                    <p className="font-medium">Current Streak</p>
                    <p className="text-sm text-gray-500">Last logged: {new Date(streak.lastLoggedDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-blue-600">{streak.currentStreak} <span className="text-sm text-gray-400 font-normal">days</span></p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default StreakTracker;
