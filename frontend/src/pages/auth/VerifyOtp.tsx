import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import userService from '@/services/userService';
import { Mail, Lock } from 'lucide-react';

export default function VerifyOtpPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const email = searchParams.get('email');

  // Redirect if no email in query params
  React.useEffect(() => {
    if (!email) {
      toast.error('Invalid verification link');
      navigate('/auth');
    }
  }, [email, navigate]);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      const res = await userService.verifyOtp(email!, otp);

      if (!res.success) {
        toast.error(res.message || 'OTP verification failed');
        return;
      }

      const { accessToken, user } = res.data;

      // Save to localStorage
      localStorage.setItem('auth_token', accessToken);
      localStorage.setItem('auth_user', JSON.stringify(user));

      toast.success('OTP verified! Welcome to ServiceLink');

      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'service_provider') {
        navigate('/provider/home');
      } else {
        navigate('/user/home');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);

    try {
      const res = await userService.resendOtp(email!);

      if (res.success) {
        toast.success('OTP resent to your email');
        setOtp('');
      } else {
        toast.error(res.message || 'Failed to resend OTP');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-linear-to-br from-blue-600 to-indigo-600 p-3 rounded-full">
                <Mail className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Verify Your Email</h1>
            <p className="text-gray-600 mt-2">
              We've sent a 6-digit OTP to <span className="font-semibold">{email}</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Enter OTP
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-blue-50 text-center text-2xl tracking-widest font-semibold transition"
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Enter the 6-digit code sent to your email</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>

          {/* Resend OTP */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Didn't receive the code?{' '}
              <button
                onClick={handleResendOtp}
                disabled={loading}
                className="text-blue-600 font-semibold hover:text-blue-700 transition disabled:opacity-50"
              >
                Resend OTP
              </button>
            </p>
          </div>

          {/* Back to Login */}
          <div className="mt-6 text-center border-t pt-6">
            <button
              onClick={() => navigate('/auth')}
              className="text-gray-600 hover:text-gray-800 transition"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
