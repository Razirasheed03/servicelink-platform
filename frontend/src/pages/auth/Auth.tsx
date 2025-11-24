import React, { useState } from 'react';
import { Wrench, Mail, Lock, User, Phone, CheckCircle2 } from 'lucide-react';
import type { UserType } from '@/types/auth.types';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [userType, setUserType] = useState<UserType>('user');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    serviceType: ''
  });

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { ...formData, userType, isSignUp });
    alert(`${isSignUp ? 'Account created' : 'Signed in'} successfully!`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-6xl relative">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left side - Branding */}
          <div className="hidden md:block text-center md:text-left space-y-6 p-8">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="bg-linear-to-br from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-lg transform hover:scale-110 transition-transform duration-300">
                <Wrench className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ServiceLink
              </h1>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
              Connect with Trusted Local Professionals
            </h2>
            
            <p className="text-lg text-gray-600">
              Find reliable plumbers, electricians, carpenters, and more. Quality service at your fingertips.
            </p>

            <div className="space-y-4 pt-4">
              {[
                'Verified Service Providers',
                'Instant Communication',
                'Transparent Pricing',
                'Trusted Reviews'
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 group">
                  <div className="bg-green-100 p-2 rounded-full group-hover:bg-green-200 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-gray-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Auth Form */}
          <div className="backdrop-blur-lg bg-white/80 rounded-3xl shadow-2xl p-8 md:p-10 border border-white/20 max-h-[90vh] flex flex-col">
            {/* Mobile logo */}
            <div className="md:hidden flex items-center gap-3 justify-center mb-6 shrink-0">
              <div className="bg-linear-to-br from-blue-600 to-indigo-600 p-2 rounded-xl">
                <Wrench className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ServiceLink
              </h1>
            </div>

            {/* Toggle Sign In / Sign Up */}
            <div className="flex gap-2 mb-6 bg-gray-100 p-1.5 rounded-xl shrink-0">
              <button
                onClick={() => setIsSignUp(false)}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                  !isSignUp
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsSignUp(true)}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                  isSignUp
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* User Type Selection (only for Sign Up) */}
            {isSignUp && (
              <div className="mb-6 space-y-3 shrink-0">
                <label className="block text-sm font-semibold text-gray-700">
                  I am a:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUserType('user')}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      userType === 'user'
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <User className={`w-6 h-6 mx-auto mb-2 ${
                      userType === 'user' ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <p className={`font-semibold ${
                      userType === 'user' ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      User
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('provider')}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                      userType === 'provider'
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Wrench className={`w-6 h-6 mx-auto mb-2 ${
                      userType === 'provider' ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <p className={`font-semibold ${
                      userType === 'provider' ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      Provider
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* Form */}
            <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
              {isSignUp && (
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  {userType === 'provider' && (
                    <>
                      <div className="relative">
                        <Wrench className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                          name="serviceType"
                          value={formData.serviceType}
                          onChange={handleInputChange}
                          className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors appearance-none bg-white"
                          required
                        >
                          <option value="">Select Service Type</option>
                          <option value="plumber">Plumber</option>
                          <option value="electrician">Electrician</option>
                          <option value="carpenter">Carpenter</option>
                          <option value="painter">Painter</option>
                          <option value="cleaner">Cleaner</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </>
                  )}

                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              {isSignUp && (
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                    required
                  />
                </div>
              )}

              {!isSignUp && (
                <div className="flex items-center justify-end text-sm">
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                    Forgot password?
                  </a>
                </div>
              )}

              <button
                onClick={handleSubmit}
                className="w-full bg-linear-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl shrink-0"
              >
                {isSignUp ? 'Create Account' : 'Sign In'}
              </button>

              {isSignUp && (
                <p className="text-xs text-center text-gray-500 shrink-0">
                  By signing up, you agree to our Terms of Service and Privacy Policy
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}