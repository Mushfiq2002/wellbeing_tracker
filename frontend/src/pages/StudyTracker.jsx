import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudySessions, fetchAcademicResults } from '../store/slices/studySlice';
import StudySessionForm from '../components/StudySessionForm';
import AcademicResultForm from '../components/AcademicResultForm';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

const StudyTracker = () => {
    const dispatch = useDispatch();
    const { sessions, results, isLoading } = useSelector((state) => state.study);

    useEffect(() => {
        dispatch(fetchStudySessions());
        dispatch(fetchAcademicResults());
    }, [dispatch]);

    // Compute stats for study sessions this week
    const { totalHours, totalSessions } = useMemo(() => {
        const now = new Date();
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const recentSessions = sessions.filter(
            (session) => new Date(session.date) >= sevenDaysAgo
        );

        const totalMinutes = recentSessions.reduce((sum, session) => sum + session.durationMinutes, 0);

        return {
            totalHours: parseFloat((totalMinutes / 60).toFixed(1)),
            totalSessions: recentSessions.length,
        };
    }, [sessions]);

    // Compute average grade
    const averageGrade = useMemo(() => {
        if (results.length === 0) return 0;
        
        const totalPercentage = results.reduce((sum, result) => {
            return sum + (result.score / result.totalScore) * 100;
        }, 0);

        return parseFloat((totalPercentage / results.length).toFixed(1));
    }, [results]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    Study Tracker
                </h1>
                <p className="text-gray-500 mt-2">
                    Log your study sessions and track your academic progress.
                </p>
            </div>

            {/* Loading Banner */}
            {isLoading && (
                <div className="mb-6 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-4 flex items-center gap-3 animate-pulse">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-blue-700 font-medium text-sm">
                        Loading your academic data...
                    </span>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                <Card className="shadow-md border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-6 text-center">
                        <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">
                            Weekly Study Time
                        </p>
                        <p className="text-4xl font-bold mt-2">{totalHours}</p>
                        <p className="text-blue-200 text-sm mt-1">hours</p>
                    </CardContent>
                </Card>
                <Card className="shadow-md border-0 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                    <CardContent className="p-6 text-center">
                        <p className="text-indigo-100 text-sm font-medium uppercase tracking-wider">
                            Weekly Sessions
                        </p>
                        <p className="text-4xl font-bold mt-2">{totalSessions}</p>
                        <p className="text-indigo-200 text-sm mt-1">sessions</p>
                    </CardContent>
                </Card>
                <Card className="shadow-md border-0 bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <CardContent className="p-6 text-center">
                        <p className="text-green-100 text-sm font-medium uppercase tracking-wider">
                            Average Grade
                        </p>
                        <p className="text-4xl font-bold mt-2">{averageGrade}%</p>
                        <p className="text-green-200 text-sm mt-1">across all exams</p>
                    </CardContent>
                </Card>
            </div>

            {/* Forms & Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <StudySessionForm />
                    <AcademicResultForm />
                </div>
                
                <div className="lg:col-span-2 space-y-6">
                    {/* Recent Sessions */}
                    <Card className="shadow-md border-0 bg-white">
                        <CardHeader className="border-b border-gray-100">
                            <CardTitle className="text-lg font-bold text-gray-800">Recent Study Sessions</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {sessions.length === 0 ? (
                                <p className="p-6 text-gray-500 text-center">No study sessions logged yet.</p>
                            ) : (
                                <ul className="divide-y divide-gray-100">
                                    {sessions.slice(0, 5).map((session) => (
                                        <li key={session._id} className="p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-semibold text-gray-800">{session.course}</p>
                                                    <p className="text-sm text-gray-500">{new Date(session.date).toLocaleDateString()}</p>
                                                    {session.notes && <p className="text-sm text-gray-600 italic mt-1">"{session.notes}"</p>}
                                                </div>
                                                <div className="text-right">
                                                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                                        {session.durationMinutes} mins
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Results */}
                    <Card className="shadow-md border-0 bg-white">
                        <CardHeader className="border-b border-gray-100">
                            <CardTitle className="text-lg font-bold text-gray-800">Recent Exam Results</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {results.length === 0 ? (
                                <p className="p-6 text-gray-500 text-center">No exam results logged yet.</p>
                            ) : (
                                <ul className="divide-y divide-gray-100">
                                    {results.slice(0, 5).map((result) => (
                                        <li key={result._id} className="p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-semibold text-gray-800">{result.course} - <span className="text-gray-600 font-normal">{result.type}</span></p>
                                                    <p className="text-sm text-gray-500">{new Date(result.date).toLocaleDateString()}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                                        (result.score / result.totalScore) >= 0.8 ? 'bg-green-100 text-green-800' :
                                                        (result.score / result.totalScore) >= 0.6 ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {result.score} / {result.totalScore}
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default StudyTracker;
