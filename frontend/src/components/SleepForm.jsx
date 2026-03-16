import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addSleepLog } from '../store/slices/sleepSlice';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Label } from './ui/Label';

const SleepForm = () => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({ startTime: '', endTime: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.startTime || !formData.endTime) {
            setError('Please fill in both fields.');
            return;
        }

        if (new Date(formData.endTime) <= new Date(formData.startTime)) {
            setError('End time must be after start time.');
            return;
        }

        try {
            await dispatch(addSleepLog(formData)).unwrap();
            setSuccess('Sleep log added successfully!');
            setFormData({ startTime: '', endTime: '' });
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err || 'Failed to add sleep log.');
        }
    };

    return (
        <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="text-2xl">🛏️</span> Log Your Sleep
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
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="startTime" className="text-gray-700">Bedtime (Start)</Label>
                        <Input
                            id="startTime"
                            name="startTime"
                            type="datetime-local"
                            value={formData.startTime}
                            onChange={handleChange}
                            required
                            className="h-11 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="endTime" className="text-gray-700">Wake-up (End)</Label>
                        <Input
                            id="endTime"
                            name="endTime"
                            type="datetime-local"
                            value={formData.endTime}
                            onChange={handleChange}
                            required
                            className="h-11 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full h-11 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 transition-all"
                    >
                        Add Sleep Log
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default SleepForm;
