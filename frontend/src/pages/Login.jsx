import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../store/slices/authSlice';
import axiosInstance from '../services/axiosInstance';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Label } from '../components/ui/Label';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
      const response = await axiosInstance.post('/users/login', formData);
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        dispatch(login(response.data));
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <div className="flex justify-center items-center py-20 bg-gray-50 flex-grow">
      <Card className="w-full max-w-md shadow-lg border-0 bg-white shadow-slate-200/50">
        <CardHeader className="text-center pb-8 border-b border-gray-100">
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Welcome Back
          </CardTitle>
          <p className="text-sm text-gray-500 mt-2">Log in to your account to continue</p>
        </CardHeader>
        <CardContent className="pt-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm flex items-center">
              <span className="font-medium">{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
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
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <Button type="submit" className="w-full h-11 text-base font-semibold bg-blue-600 hover:bg-blue-700 mt-4 transition-all">
              Login
            </Button>
          </form>
          <div className="mt-8 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <button onClick={() => navigate('/register')} className="text-blue-600 font-medium hover:underline focus:outline-none">
              Sign up
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
