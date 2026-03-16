import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Badge } from '../components/ui/Badge';

const MedicineReminder = () => {
  // State for Today's Reminders
  const [todayReminders, setTodayReminders] = useState([]);
  
  // State for My Medicines list
  const [medicines, setMedicines] = useState([]);
  
  // State for New Medicine Form
  const [newMedicineName, setNewMedicineName] = useState('');
  const [newMedicineTimes, setNewMedicineTimes] = useState(['']); // Start with one empty time input
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch initial data on load
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch both medicines and today's reminders
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [medicinesRes, todayRes] = await Promise.all([
        axiosInstance.get('/medicines'),
        axiosInstance.get('/medicines/today')
      ]);
      setMedicines(medicinesRes.data);
      
      // Sort today's reminders by time (earliest first)
      const sortedReminders = todayRes.data.sort((a, b) => a.time.localeCompare(b.time));
      setTodayReminders(sortedReminders);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetching data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Mark a reminder as taken
  const handleMarkAsTaken = async (id) => {
    try {
      await axiosInstance.patch(`/medicines/${id}/taken`);
      // Update local state to show it's taken
      setTodayReminders(prev =>
        prev.map(reminder =>
          reminder._id === id ? { ...reminder, taken: true } : reminder
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark as taken');
    }
  };

  // Handle changing a specific time input in the form
  const handleTimeChange = (index, value) => {
    const updatedTimes = [...newMedicineTimes];
    updatedTimes[index] = value;
    setNewMedicineTimes(updatedTimes);
  };

  // Add a new empty time input to the form
  const handleAddTimeInput = () => {
    setNewMedicineTimes([...newMedicineTimes, '']);
  };

  // Remove a time input from the form
  const handleRemoveTimeInput = (index) => {
    const updatedTimes = newMedicineTimes.filter((_, i) => i !== index);
    setNewMedicineTimes(updatedTimes);
  };

  // Submit new medicine
  const handleAddMedicine = async (e) => {
    e.preventDefault();
    // Filter out empty times
    const validTimes = newMedicineTimes.filter(time => time.trim() !== '');
    
    if (!newMedicineName.trim()) {
      setError('Please enter a medicine name');
      return;
    }
    if (validTimes.length === 0) {
      setError('Please enter at least one time');
      return;
    }

    try {
      await axiosInstance.post('/medicines', {
        medicineName: newMedicineName,
        times: validTimes
      });
      // Clear form and refetch data
      setNewMedicineName('');
      setNewMedicineTimes(['']);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add medicine');
    }
  };

  // Delete a medicine
  const handleDeleteMedicine = async (id) => {
    try {
      await axiosInstance.delete(`/medicines/${id}`);
      // Refetch data after deletion
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete medicine');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-8">
      <h1 className="text-3xl font-bold mb-6">Medicine Reminder System</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Section 1 - Today's Reminders */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Today's Reminders</h2>
        {loading && <p>Loading reminders...</p>}
        {!loading && todayReminders.length === 0 && (
          <p className="text-gray-500 italic">No reminders for today. Add some medicines below!</p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {todayReminders.map(reminder => (
            <Card key={reminder._id} className={reminder.taken ? 'border-green-200 bg-green-50' : ''}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{reminder.medicine?.medicineName || 'Unknown Medicine'}</h3>
                  <p className="text-gray-600 font-medium">{reminder.time}</p>
                </div>
                <div>
                  {reminder.taken ? (
                    <Badge variant="success" className="text-sm py-1 px-3">Taken ✓</Badge>
                  ) : (
                    <Button onClick={() => handleMarkAsTaken(reminder._id)} variant="default">
                      Mark as Taken
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <hr className="my-8 border-gray-200" />

      {/* Section 2 - My Medicines */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">My Medicines</h2>
        <div className="space-y-4 mb-8">
          {medicines.length === 0 ? (
            <p className="text-gray-500 italic">You haven't added any medicines yet.</p>
          ) : (
            <div className="grid gap-4">
              {medicines.map(med => (
                <Card key={med._id}>
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">{med.medicineName}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {med.times.map((t, idx) => (
                          <Badge key={idx} variant="secondary">{t}</Badge>
                        ))}
                      </div>
                    </div>
                    <Button variant="destructive" onClick={() => handleDeleteMedicine(med._id)}>
                      Delete
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Add Medicine Form */}
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle>Add New Medicine</CardTitle>
            <CardDescription>Enter the name and daily reminder times.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddMedicine} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="medicineName">Medicine Name</Label>
                <Input
                  id="medicineName"
                  placeholder="e.g. Vitamin C"
                  value={newMedicineName}
                  onChange={(e) => setNewMedicineName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Reminder Times</Label>
                {newMedicineTimes.map((time, idx) => (
                  <div key={idx} className="flex gap-2 items-center mb-2">
                    <Input
                      type="time"
                      value={time}
                      onChange={(e) => handleTimeChange(idx, e.target.value)}
                      className="w-full sm:w-auto"
                    />
                    {newMedicineTimes.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleRemoveTimeInput(idx)}
                        className="text-red-500 border-red-200 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <div className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTimeInput}
                    className="w-full sm:w-auto mt-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    + Add Time
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button type="submit" className="w-full sm:w-auto">
                  Save Medicine
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default MedicineReminder;
