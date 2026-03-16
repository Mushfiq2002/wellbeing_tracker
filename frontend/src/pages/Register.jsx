import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/authSlice';
import axiosInstance from '../services/axiosInstance';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Label } from '../components/ui/Label';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axiosInstance.post('/users', formData);
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        dispatch(login(response.data));
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    }
  };

  return (
    <div className="flex justify-center items-center py-16 bg-gray-50 flex-grow">
      <Card className="w-full max-w-md shadow-lg border-0 bg-white shadow-slate-200/50">
        <CardHeader className="text-center pb-8 border-b border-gray-100">
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Create an Account
          </CardTitle>
          <p className="text-sm text-gray-500 mt-2">Join us to start your wellbeing journey</p>
        </CardHeader>
        <CardContent className="pt-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm flex items-center">
              <span className="font-medium">{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required
                className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-gray-700">Account Type</Label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="flex h-11 w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <option value="user">User</option>
                <option value="therapist">Therapist</option>
              </select>
            </div>
            <Button type="submit" className="w-full h-11 text-base font-semibold bg-blue-600 hover:bg-blue-700 mt-4 transition-all">
              Sign Up
            </Button>
          </form>
          <div className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-blue-600 font-medium hover:underline focus:outline-none">
              Log in
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
