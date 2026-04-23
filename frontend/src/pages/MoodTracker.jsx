import { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

const moodLevels = [
    { level: 1, emoji: '😡', label: 'Very Bad' },
    { level: 2, emoji: '☹️', label: 'Bad' },
    { level: 3, emoji: '😐', label: 'Neutral' },
    { level: 4, emoji: '🙂', label: 'Good' },
    { level: 5, emoji: '🤩', label: 'Very Good' },
];

const getMoodLabel = (level) => moodLevels.find((m) => m.level === level)?.label || '';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const value = payload[0].value;
        const moodObj = moodLevels.find((m) => m.level === value);
        return (
            <div className="bg-white p-3 border rounded shadow-md text-sm">
                <p className="font-semibold text-gray-700">{label}</p>
                <p className="text-gray-600 flex items-center gap-2">
                    <span className="text-lg">{moodObj?.emoji}</span>
                    <span>{moodObj?.label} - Level {value}</span>
                </p>
            </div>
        );
    }
    return null;
};

const MoodTracker = () => {
    const [moodHistory, setMoodHistory] = useState([]);
    const [currentMood, setCurrentMood] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const todayDateStr = new Date().toISOString().split('T')[0];

    useEffect(() => {
        fetchMoodHistory();
    }, []);

    const fetchMoodHistory = async () => {
        try {
            const { data } = await axiosInstance.get('/moods');
            
            // Format data for the chart: convert YYYY-MM-DD to short format
            const formattedData = data.map(item => {
                const parts = item.date.split('-'); 
                return {
                    ...item,
                    shortDate: `${parts[1]}-${parts[2]}`, 
                };
            });
            setMoodHistory(formattedData);

            // Check if user already logged mood today
            const todaysEntry = data.find(item => item.date === todayDateStr);
            if (todaysEntry) {
                setCurrentMood(todaysEntry.level);
            }
        } catch (err) {
            console.error('Error fetching mood history:', err);
            setError('Failed to load mood history.');
        }
    };

    const handleLogMood = async (level) => {
        setIsLoading(true);
        setError('');
        setSuccessMessage('');
        try {
            await axiosInstance.post('/moods', { level });
            setCurrentMood(level);
            setSuccessMessage('Your mood has been logged successfully!');
            fetchMoodHistory(); // Refresh the chart
        } catch (err) {
            console.error('Error saving mood:', err);
            setError(err.response?.data?.message || 'Failed to save your mood.');
        } finally {
            setIsLoading(false);
            setTimeout(() => setSuccessMessage(''), 3000);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Daily Mood Tracker</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            
            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
                    <span className="block sm:inline">{successMessage}</span>
                </div>
            )}

            {/* Daily Prompt Card */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8 text-center transition-all hover:shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">How was your day?</h2>
                
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                    {moodLevels.map(({ level, emoji, label }) => {
                        const isSelected = currentMood === level;
                        return (
                            <button
                                key={level}
                                onClick={() => handleLogMood(level)}
                                disabled={isLoading}
                                className={`flex flex-col items-center justify-center w-20 h-24 sm:w-24 sm:h-28 rounded-2xl border-2 transition-all duration-300 ease-in-out transform hover:scale-105 ${
                                    isSelected
                                        ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-300 ring-opacity-50'
                                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                <span className="text-4xl sm:text-5xl mb-2">{emoji}</span>
                                <span className={`text-sm sm:text-base font-medium ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>
                                    {label}
                                </span>
                            </button>
                        );
                    })}
                </div>
                {currentMood && (
                    <p className="mt-6 text-sm text-gray-500 italic">
                        You have logged your mood for today. Selecting a different option will update your entry.
                    </p>
                )}
            </div>

            {/* Emotional Trend Analysis Chart */}
            <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-6">Emotional Trend Analysis</h3>
                
                {moodHistory.length > 0 ? (
                    <div className="h-[300px] sm:h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={moodHistory}
                                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis 
                                    dataKey="shortDate" 
                                    tick={{ fill: '#6b7280', fontSize: 12 }} 
                                    tickMargin={10}
                                />
                                <YAxis 
                                    domain={[1, 5]} 
                                    ticks={[1, 2, 3, 4, 5]} 
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                    tickFormatter={getMoodLabel}
                                    width={80}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Line 
                                    type="monotone" 
                                    dataKey="level" 
                                    stroke="#3b82f6" 
                                    strokeWidth={3}
                                    activeDot={{ r: 8, fill: '#2563eb', stroke: '#fff', strokeWidth: 2 }} 
                                    dot={{ r: 5, fill: '#3b82f6', strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-48 bg-gray-50 rounded-lg border border-dashed border-gray-300 p-6 text-center">
                        <span className="text-4xl mb-3 text-gray-300">📊</span>
                        <p className="text-gray-500 font-medium text-lg mb-1">No Mood Data Yet</p>
                        <p className="text-gray-400 text-sm">Select an emoji above to log your first mood entry.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MoodTracker;
