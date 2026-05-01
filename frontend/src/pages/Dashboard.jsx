import React from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="text-3xl font-bold">Dashboard</CardTitle>
          <p className="mt-2 text-blue-100">
            Welcome to your wellbeing tracker.
          </p>
        </CardHeader>

        <CardContent className="p-8">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Hello, {user?.name}!
            </h2>
            <p className="text-gray-600">
              You are logged in as a <strong>{user?.role}</strong>.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;