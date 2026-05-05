import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addAcademicResult } from '../store/slices/studySlice';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Label } from './ui/Label';

const AcademicResultForm = () => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        course: '',
        type: 'Quiz',
        score: '',
        totalScore: '',
        date: '',
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

        if (!formData.course || !formData.type || !formData.score || !formData.totalScore || !formData.date) {
            setError('Please fill in all required fields.');
            return;
        }

        try {
            await dispatch(addAcademicResult(formData)).unwrap();
            setSuccess('Result added successfully!');
            setFormData({ course: '', type: 'Quiz', score: '', totalScore: '', date: '' });
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err || 'Failed to add result.');
        }
    };

    return (
        <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="text-2xl">📝</span> Log Result
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
                        <Label htmlFor="result_course" className="text-gray-700">Course / Subject *</Label>
                        <Input
                            id="result_course"
                            name="course"
                            type="text"
                            placeholder="e.g. Physics"
                            value={formData.course}
                            onChange={handleChange}
                            required
                            className="h-11"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="type" className="text-gray-700">Type *</Label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                            className="w-full h-11 px-3 py-2 bg-transparent border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="Quiz">Quiz</option>
                            <option value="Midterm">Midterm</option>
                            <option value="Final">Final</option>
                            <option value="Assignment">Assignment</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="score" className="text-gray-700">Score *</Label>
                            <Input
                                id="score"
                                name="score"
                                type="number"
                                placeholder="e.g. 85"
                                value={formData.score}
                                onChange={handleChange}
                                required
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="totalScore" className="text-gray-700">Total Score *</Label>
                            <Input
                                id="totalScore"
                                name="totalScore"
                                type="number"
                                placeholder="e.g. 100"
                                value={formData.totalScore}
                                onChange={handleChange}
                                required
                                className="h-11"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="result_date" className="text-gray-700">Date *</Label>
                        <Input
                            id="result_date"
                            name="date"
                            type="datetime-local"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="h-11"
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full h-11 text-base font-semibold bg-green-600 hover:bg-green-700 transition-all"
                    >
                        Log Result
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default AcademicResultForm;
