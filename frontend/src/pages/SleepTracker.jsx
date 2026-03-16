import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSleepLogs } from '../store/slices/sleepSlice';
import SleepForm from '../components/SleepForm';
import SleepChart from '../components/SleepChart';
import { Card, CardContent } from '../components/ui/Card';

const SleepTracker = () => {
    const dispatch = useDispatch();
    const { logs, isLoading } = useSelector((state) => state.sleep);

    useEffect(() => {
        dispatch(fetchSleepLogs());
    }, [dispatch]);

    // Compute stats for the last 7 days
    const { totalHours, averageHours, nightsLogged } = useMemo(() => {
        const now = new Date();
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const recentLogs = logs.filter(
            (log) => new Date(log.endTime) >= sevenDaysAgo
        );

        const total = recentLogs.reduce((sum, log) => {
            const duration =
                (new Date(log.endTime) - new Date(log.startTime)) / 3600000;
            return sum + Math.max(0, duration);
        }, 0);

        const avg = recentLogs.length > 0 ? total / recentLogs.length : 0;

        return {
            totalHours: parseFloat(total.toFixed(1)),
            averageHours: parseFloat(avg.toFixed(1)),
            nightsLogged: recentLogs.length,
        };
    }, [logs]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    Sleep Tracker
                </h1>
                <p className="text-gray-500 mt-2">
                    Monitor your sleep patterns and build healthier habits.
                </p>
            </div>

            {/* Loading Banner */}
            {isLoading && (
                <div className="mb-6 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 p-4 flex items-center gap-3 animate-pulse">
                    <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-indigo-700 font-medium text-sm">
                        Calculating insights...
                    </span>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                <Card className="shadow-md border-0 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                    <CardContent className="p-6 text-center">
                        <p className="text-indigo-100 text-sm font-medium uppercase tracking-wider">
                            Weekly Total
                        </p>
                        <p className="text-4xl font-bold mt-2">{totalHours}</p>
                        <p className="text-indigo-200 text-sm mt-1">hours</p>
                    </CardContent>
                </Card>
                <Card className="shadow-md border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <CardContent className="p-6 text-center">
                        <p className="text-purple-100 text-sm font-medium uppercase tracking-wider">
                            Avg Per Night
                        </p>
                        <p className="text-4xl font-bold mt-2">{averageHours}</p>
                        <p className="text-purple-200 text-sm mt-1">hours</p>
                    </CardContent>
                </Card>
                <Card className="shadow-md border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-6 text-center">
                        <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">
                            Nights Logged
                        </p>
                        <p className="text-4xl font-bold mt-2">{nightsLogged}</p>
                        <p className="text-blue-200 text-sm mt-1">this week</p>
                    </CardContent>
                </Card>
            </div>

            {/* Chart & Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <SleepChart logs={logs} />
                </div>
                <div>
                    <SleepForm />
                </div>
            </div>
        </div>
    );
};

export default SleepTracker;
