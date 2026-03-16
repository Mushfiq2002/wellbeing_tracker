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
          <p className="mt-2 text-blue-100">Welcome to your wellbeing tracker.</p>
        </CardHeader>
        <CardContent className="p-8">
          <div className="bg-blue-50 rounded-lg p-6 mb-6 border border-blue-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Hello, {user?.name}!</h2>
            <p className="text-gray-600">You are logged in as a <strong>{user?.role}</strong>.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <Card className="shadow hover:shadow-md transition-shadow">
               <CardContent className="p-6 text-center">
                 <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 mx-auto flex items-center justify-center mb-4 text-xl">
                   📊
                 </div>
                 <h3 className="font-semibold text-gray-800">My Stats</h3>
                 <p className="text-sm text-gray-500 mt-2">View your wellbeing progress.</p>
               </CardContent>
             </Card>
             <Card className="shadow hover:shadow-md transition-shadow">
               <CardContent className="p-6 text-center">
                 <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 mx-auto flex items-center justify-center mb-4 text-xl">
                   📝
                 </div>
                 <h3 className="font-semibold text-gray-800">Daily Entry</h3>
                 <p className="text-sm text-gray-500 mt-2">Log your daily feelings.</p>
               </CardContent>
             </Card>
             <Card className="shadow hover:shadow-md transition-shadow">
               <CardContent className="p-6 text-center">
                 <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 mx-auto flex items-center justify-center mb-4 text-xl">
                   📅
                 </div>
                 <h3 className="font-semibold text-gray-800">Appointments</h3>
                 <p className="text-sm text-gray-500 mt-2">Manage your sessions.</p>
               </CardContent>
             </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
