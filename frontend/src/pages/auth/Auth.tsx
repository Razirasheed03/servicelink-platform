import React, { useState } from 'react';
import { Wrench, Mail, Lock, User, Phone, CheckCircle2 } from 'lucide-react';
import userService from "@/services/userService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { AUTH_ROUTES } from "@/constants/apiRoutes";
import { useAuth } from '@/context/authContext';

type Role = "user" | "service_provider";

export default function ServiceLinkAuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [userType, setUserType] = useState<Role>("user");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    serviceType: ""
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // -----------------------------------
  // LOGIN
  // -----------------------------------
 const handleLogin = async (e: React.MouseEvent) => {
  e.preventDefault();

  if (!formData.email.trim() || !formData.password.trim()) {
    toast.error("Please enter your email and password");
    return;
  }

  setLoading(true);

  try {
    const response = await userService.login(formData.email, formData.password);

    if (!response?.success) {
      toast.error(response?.message || "Login failed");
      return;
    }

    const { accessToken, user } = response.data;

    if (!accessToken || !user) {
      toast.error("Unexpected server response");
      return;
    }

    // 🔥 IMPORTANT FIX
    login(accessToken, user);

    toast.success("Login successful!");

    if (user.role === "admin") navigate("/admin/dashboard");
    else if (user.role === "service_provider") navigate("/provider/home");
    else navigate("/user/home");

  } catch (error: any) {
    const message = error?.response?.data?.message || error?.message || "Login failed";
    toast.error(message);
  } finally {
    setLoading(false);
  }
};



  // -----------------------------------
  // SIGNUP → OTP
  // -----------------------------------
  const handleSignup = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: userType,
        serviceType:
          userType === "service_provider" ? formData.serviceType : undefined
      };

      const response = await userService.signup(payload);

      if (!response.success) {
        toast.error(response.message || "Signup failed");
        return;
      }

      toast.success("OTP sent!");
      navigate(`/auth/verify-otp?email=${formData.email}`);

    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        "Signup failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () =>
    (window.location.href = AUTH_ROUTES.GOOGLE);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-6xl relative">
        <div className="grid md:grid-cols-2 gap-8 items-center">

          {/* LEFT SIDE */}
          <div className="hidden md:block text-center md:text-left space-y-6 p-8">
            <div className="flex items-center gap-3">
              <div className="bg-linear-to-br from-blue-600 to-indigo-600 p-3 rounded-2xl shadow-lg">
                <Wrench className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ServiceLink
              </h1>
            </div>

            <h2 className="text-3xl font-bold text-gray-800">Book Trusted Home Services</h2>
            <p className="text-lg text-gray-600">
              Connect instantly with verified professionals.
            </p>

            <div className="space-y-4 pt-4">
              {[
                'Verified Service Providers',
                'Instant Communication',
                'Transparent Pricing',
                'Trusted Reviews'
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-gray-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE (Auth Form) */}
          <div className="backdrop-blur-lg bg-white/80 rounded-3xl shadow-2xl p-8 md:p-10">

            {/* Toggle Buttons */}
            <div className="flex gap-2 mb-6 bg-gray-100 p-1.5 rounded-xl">
              <button
                onClick={() => setIsSignUp(false)}
                className={`flex-1 py-3 rounded-lg font-semibold 
                ${!isSignUp ? "bg-white text-blue-600 shadow-md" : "text-gray-600"}`}>
                Sign In
              </button>
              <button
                onClick={() => setIsSignUp(true)}
                className={`flex-1 py-3 rounded-lg font-semibold 
                ${isSignUp ? "bg-white text-blue-600 shadow-md" : "text-gray-600"}`}>
                Sign Up
              </button>
            </div>

            {/* SIGNUP OPTIONS */}
            {isSignUp && (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    I am a:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setUserType('user')}
                      className={`p-4 rounded-xl border-2 
                        ${userType === 'user' ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}>
                      User
                    </button>

                    <button
                      type="button"
                      onClick={() => setUserType('service_provider')}
                      className={`p-4 rounded-xl border-2 
                        ${userType === 'service_provider' ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}>
                      Service Provider
                    </button>
                  </div>
                </div>

                {/* Name */}
                <div className="relative mb-3">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 border-2 rounded-xl"
                  />
                </div>

                {/* Service Type */}
                {userType === "service_provider" && (
                  <div className="relative mb-3">
                    <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 border-2 rounded-xl bg-white"
                    >
                      <option value="">Select Service Type</option>
                      <option value="plumber">Plumber</option>
                      <option value="electrician">Electrician</option>
                      <option value="carpenter">Carpenter</option>
                      <option value="cleaner">Cleaner</option>
                    </select>
                  </div>
                )}

                {/* Phone */}
                <div className="relative mb-3">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 border-2 rounded-xl"
                  />
                </div>
              </>
            )}

            {/* Email */}
            <div className="relative mb-3">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-11 pr-4 py-3 border-2 rounded-xl"
              />
            </div>

            {/* Password */}
            <div className="relative mb-3">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-11 pr-4 py-3 border-2 rounded-xl"
              />
            </div>

            {/* Confirm Password */}
            {isSignUp && (
              <div className="relative mb-3">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-11 pr-4 py-3 border-2 rounded-xl"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={isSignUp ? handleSignup : handleLogin}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:bg-blue-700"
            >
              {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
            </button>

            {/* Google */}
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-white border rounded-xl py-3 mt-2 shadow-sm"
            >
              Continue with Google
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
