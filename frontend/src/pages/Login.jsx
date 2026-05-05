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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axiosInstance.post('/users/login', formData);

      // 🔥 DEBUG OUTPUT
      ;

      // 🔥 TOKEN CHECK
      if (!res.data || !res.data.token) {
        setError('Login failed: No token received');
        return;
      }

      // 🔥 SAVE USER
      localStorage.setItem('user', JSON.stringify(res.data));
      localStorage.removeItem('userInfo');

      // 🔥 UPDATE REDUX
      dispatch(login(res.data));

      // 🔥 FORCE RELOAD (FIX ALL STATE ISSUE)
      window.location.href = '/dashboard';

    } catch (err) {
      console.log('LOGIN ERROR:', err.response?.data);

      setError(
        err?.response?.data?.message || 'Login failed (server error)'
      );
    }
  };

  return (
    <div className="flex justify-center items-center py-20 bg-gray-50 flex-grow">
      <Card className="w-full max-w-md shadow-lg border-0 bg-white">
        <CardHeader className="text-center pb-8 border-b border-gray-100">
          <CardTitle className="text-3xl font-bold">
            Welcome Back
          </CardTitle>
          <p className="text-sm text-gray-500 mt-2">
            Log in to your account
          </p>
        </CardHeader>

        <CardContent className="pt-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label>Email</Label>
              <Input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Login
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            Don’t have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-blue-600 underline"
            >
              Sign up
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;