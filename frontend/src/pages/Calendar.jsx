import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Badge } from '../components/ui/Badge';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [eventType, setEventType] = useState('todo');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get('/calendar');
      setEvents(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleDayClick = (dateStr) => {
    setSelectedDate(dateStr);
    setDescription('');
    setEventType('todo');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!description.trim()) return;
    try {
      await axiosInstance.post('/calendar', { date: selectedDate, type: eventType, description });
      setShowModal(false);
      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save event');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/calendar/${id}`);
      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete event');
    }
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const badgeVariants = { todo: 'default', mood: 'warning', sleep: 'success', note: 'secondary' };

  return (
    <div className="container mx-auto p-4 max-w-4xl space-y-8">
      <h1 className="text-3xl font-bold mb-6">Calendar</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Legend */}
      <div className="flex gap-4 flex-wrap">
        {['todo','mood','sleep','note'].map(type => (
          <Badge key={type} variant={badgeVariants[type]} className="capitalize">{type}</Badge>
        ))}
      </div>

      {/* Calendar Header */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <Button variant="outline" onClick={() => { const d = new Date(currentDate); d.setMonth(d.getMonth()-1); setCurrentDate(d); }}>← Prev</Button>
            <h2 className="text-xl font-bold">{MONTHS[month]} {year}</h2>
            <Button variant="outline" onClick={() => { const d = new Date(currentDate); d.setMonth(d.getMonth()+1); setCurrentDate(d); }}>Next →</Button>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 mb-2">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
              <div key={d} className="text-center text-sm font-bold text-gray-400 py-2">{d}</div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 border-l border-t">
            {Array(firstDay).fill(null).map((_, i) => (
              <div key={`e-${i}`} className="border-r border-b min-h-16 bg-gray-50" />
            ))}
            {Array(daysInMonth).fill(null).map((_, i) => {
              const d = i + 1;
              const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
              const dayEvents = events.filter(e => e.date === dateStr);
              const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              return (
                <div key={d} className="border-r border-b min-h-16 p-1 cursor-pointer hover:bg-gray-50" onClick={() => handleDayClick(dateStr)}>
                  <div className={`w-7 h-7 flex items-center justify-center text-sm font-bold mb-1 ${isToday ? 'bg-blue-500 text-white rounded-full' : ''}`}>{d}</div>
                  {dayEvents.slice(0,2).map((ev, idx) => (
                    <div key={idx} className="text-xs truncate mb-0.5">
                      <Badge variant={badgeVariants[ev.type]} className="text-xs truncate w-full">{ev.description}</Badge>
                    </div>
                  ))}
                  {dayEvents.length > 2 && <span className="text-xs text-gray-400">+{dayEvents.length - 2} more</span>}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">All Events</h2>
        {loading && <p>Loading events...</p>}
        {!loading && events.length === 0 && (
          <p className="text-gray-500 italic">No events yet. Click a day to add one!</p>
        )}
        <div className="space-y-3">
          {events.map(ev => (
            <Card key={ev._id}>
              <CardContent className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Badge variant={badgeVariants[ev.type]} className="capitalize">{ev.type}</Badge>
                  <span className="text-sm">{ev.date} — {ev.description}</span>
                </div>
                <Button variant="destructive" onClick={() => handleDelete(ev._id)}>Delete</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-bold mb-4">Add Event — {selectedDate}</h3>
            <div className="space-y-3">
              <div>
                <Label>Type</Label>
                <select value={eventType} onChange={e => setEventType(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 mt-1">
                  <option value="todo">Todo</option>
                  <option value="mood">Mood</option>
                  <option value="sleep">Sleep</option>
                  <option value="note">Note</option>
                </select>
              </div>
              <div>
                <Label>Description</Label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Enter details..." className="w-full border border-gray-300 rounded px-3 py-2 mt-1 min-h-20 resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
