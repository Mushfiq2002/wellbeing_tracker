import React, { useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';

const SleepChart = ({ logs }) => {
    const chartData = useMemo(() => {
        const now = new Date();
        const days = [];

        // Build last 7 days
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateStr = date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
            });
            const dateKey = date.toISOString().split('T')[0];
            days.push({ dateKey, label: dateStr, hours: 0 });
        }

        // Aggregate logs by the date of endTime (wake-up day)
        if (logs && logs.length > 0) {
            logs.forEach((log) => {
                const endDate = new Date(log.endTime);
                const logDateKey = endDate.toISOString().split('T')[0];
                const day = days.find((d) => d.dateKey === logDateKey);
                if (day) {
                    const duration =
                        (new Date(log.endTime) - new Date(log.startTime)) / 3600000;
                    day.hours += Math.max(0, parseFloat(duration.toFixed(1)));
                }
            });
        }

        return days.map((d) => ({
            name: d.label,
            hours: parseFloat(d.hours.toFixed(1)),
        }));
    }, [logs]);

    const maxHours = Math.max(...chartData.map((d) => d.hours), 10);

    const getBarColor = (hours) => {
        if (hours === 0) return '#e0e7ff';
        if (hours < 6) return '#f59e0b';
        if (hours <= 9) return '#6366f1';
        return '#ef4444';
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white shadow-lg rounded-lg p-3 border border-gray-100">
                    <p className="text-sm font-semibold text-gray-800">{label}</p>
                    <p className="text-sm text-indigo-600">
                        {payload[0].value} hrs slept
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="text-2xl">📊</span> Last 7 Days
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                {chartData.every((d) => d.hours === 0) ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                        <span className="text-5xl mb-4">😴</span>
                        <p className="text-lg font-medium">No sleep data yet</p>
                        <p className="text-sm">Log your first night to see the chart!</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                            data={chartData}
                            margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 12, fill: '#64748b' }}
                                axisLine={{ stroke: '#e2e8f0' }}
                                tickLine={false}
                            />
                            <YAxis
                                domain={[0, Math.ceil(maxHours)]}
                                tick={{ fontSize: 12, fill: '#64748b' }}
                                axisLine={{ stroke: '#e2e8f0' }}
                                tickLine={false}
                                label={{
                                    value: 'Hours',
                                    angle: -90,
                                    position: 'insideLeft',
                                    offset: 20,
                                    style: { fontSize: 12, fill: '#94a3b8' },
                                }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="hours" radius={[6, 6, 0, 0]} barSize={36}>
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={getBarColor(entry.hours)}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
                <div className="flex justify-center gap-6 mt-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: '#f59e0b' }}></span>
                        &lt; 6 hrs
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: '#6366f1' }}></span>
                        6–9 hrs
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: '#ef4444' }}></span>
                        &gt; 9 hrs
                    </span>
                </div>
            </CardContent>
        </Card>
    );
};

export default SleepChart;
