import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const dailyQuestions = [
  'Did you drink enough water today?',
  'Did you exercise today?',
  'Did you get enough sleep last night?',
  'Did you eat healthy meals today?',
  'Did you take time to relax today?',
  'Did you feel productive today?',
  'Did you spend time with family or friends today?',
];

const DailyCheckin = () => {
  const [checkins, setCheckins] = useState([]);
  const [todayCheckin, setTodayCheckin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  const question = dailyQuestions[today.getDay() % dailyQuestions.length];

  useEffect(() => {
    fetchCheckins();
  }, []);

  const fetchCheckins = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get('/checkin');
      setCheckins(res.data);
      const todayData = res.data.find(c => c.date === todayStr);
      setTodayCheckin(todayData || null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch check-ins');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (answer) => {
    setError(null);
    setSuccess(null);
    try {
      await axiosInstance.post('/checkin', { date: todayStr, question, answer });
      setSuccess('Check-in saved!');
      fetchCheckins();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save check-in');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-8">
      <h1 className="text-3xl font-bold mb-6">Daily Check-in</h1>

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

      {/* Today's Question */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Today's Question</h2>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-2">{today.toDateString()}</p>
            <h3 className="text-xl font-medium mb-6">{question}</h3>
            {todayCheckin ? (
              <div className="bg-gray-50 rounded p-4">
                <p className="text-gray-600">You answered: <strong className={todayCheckin.answer === 'Yes' ? 'text-green-600' : 'text-red-600'}>{todayCheckin.answer}</strong></p>
                <p className="text-sm text-gray-400 mt-1">Already checked in today. See you tomorrow!</p>
              </div>
            ) : (
              <div className="flex gap-4">
                <Button onClick={() => handleAnswer('Yes')} className="flex-1 bg-green-600 hover:bg-green-700">Yes</Button>
                <Button onClick={() => handleAnswer('No')} variant="destructive" className="flex-1">No</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Weekly Summary */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Weekly Summary</h2>
        {loading && <p>Loading check-ins...</p>}
        {!loading && checkins.length === 0 && (
          <p className="text-gray-500 italic">No check-ins yet. Answer today's question above!</p>
        )}
        <div className="space-y-3">
          {checkins.slice(0, 7).map(c => (
            <Card key={c._id}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">{c.date}</p>
                  <p className="font-medium">{c.question}</p>
                </div>
                <Badge variant={c.answer === 'Yes' ? 'success' : 'destructive'}>{c.answer}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DailyCheckin;
