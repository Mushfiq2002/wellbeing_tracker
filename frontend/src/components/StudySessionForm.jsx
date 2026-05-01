import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addStudySession } from '../store/slices/studySlice';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Label } from './ui/Label';

const StudySessionForm = () => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        course: '',
        durationMinutes: '',
        date: '',
        notes: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.course || !formData.durationMinutes || !formData.date) {
            setError('Please fill in all required fields.');
            return;
        }

        try {
            await dispatch(addStudySession(formData)).unwrap();
            setSuccess('Study session added successfully!');
            setFormData({ course: '', durationMinutes: '', date: '', notes: '' });
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err || 'Failed to add study session.');
        }
    };

    return (
        <Card className="shadow-lg border-0 bg-white mb-6">
            <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="text-2xl">📚</span> Log Study Session
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm font-medium">
                        {success}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="course" className="text-gray-700">Course / Subject *</Label>
                        <Input
                            id="course"
                            name="course"
                            type="text"
                            placeholder="e.g. Calculus"
                            value={formData.course}
                            onChange={handleChange}
                            required
                            className="h-11"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="durationMinutes" className="text-gray-700">Duration (Minutes) *</Label>
                        <Input
                            id="durationMinutes"
                            name="durationMinutes"
                            type="number"
                            placeholder="e.g. 60"
                            value={formData.durationMinutes}
                            onChange={handleChange}
                            required
                            min="1"
                            className="h-11"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="date" className="text-gray-700">Date *</Label>
                        <Input
                            id="date"
                            name="date"
                            type="datetime-local"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="h-11"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="notes" className="text-gray-700">Notes (Optional)</Label>
                        <Input
                            id="notes"
                            name="notes"
                            type="text"
                            placeholder="e.g. Chapter 4"
                            value={formData.notes}
                            onChange={handleChange}
                            className="h-11"
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full h-11 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 transition-all"
                    >
                        Log Session
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default StudySessionForm;
