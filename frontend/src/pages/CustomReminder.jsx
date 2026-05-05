import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Badge } from '../components/ui/Badge';

const CustomReminder = () => {
  const [reminders, setReminders] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('study');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get('/custom-reminders');
      setReminders(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch reminders');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setError('Please enter a title'); return; }
    if (!time) { setError('Please enter a time'); return; }
    try {
      await axiosInstance.post('/custom-reminders', { title, category, time });
      setTitle('');
      setTime('');
      setCategory('study');
      fetchReminders();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add reminder');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/custom-reminders/${id}`);
      fetchReminders();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete reminder');
    }
  };

  const badgeVariants = { study: 'default', sleep: 'success', medicine: 'destructive', other: 'secondary' };

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-8">
      <h1 className="text-3xl font-bold mb-6">Custom Reminder System</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* My Reminders */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">My Reminders</h2>
        {loading && <p>Loading reminders...</p>}
        {!loading && reminders.length === 0 && (
          <p className="text-gray-500 italic">No reminders yet. Add one below!</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reminders.map(r => (
            <Card key={r._id}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{r.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={badgeVariants[r.category]} className="capitalize">{r.category}</Badge>
                    <p className="text-gray-600 font-medium">⏰ {r.time}</p>
                  </div>
                </div>
                <Button variant="destructive" onClick={() => handleDelete(r._id)}>Delete</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <hr className="my-8 border-gray-200" />

      {/* Add Reminder Form */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle>Add New Reminder</CardTitle>
          <CardDescription>Set a personalized reminder for studying, sleeping, or taking medicine.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Reminder Title</Label>
              <Input
                id="title"
                placeholder="e.g. Study for exams"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="study">Studying</option>
                <option value="sleep">Sleeping</option>
                <option value="medicine">Medicine</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
              />
            </div>
            <div className="pt-4 border-t">
              <Button type="submit" className="w-full sm:w-auto">Save Reminder</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomReminder;
