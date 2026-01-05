import React, { useState } from 'react';
import { User, Mail, Phone, Briefcase, MapPin, Calendar } from 'lucide-react';
import ProviderSidebar from '../../components/provider/Sidebar';
import ProviderNavbar from '../../components/provider/Navbar';
import { useAuth } from "@/context/authContext";
import userService from "@/services/userService";
import { toast } from "sonner";

interface ServiceProviderProfile {
  username: string;
  email: string;
  phone: string;
  serviceType: string;
  experience: number | string;
  profileImg?: string;
  location?: string;
}

const ServiceProviderProfilePage: React.FC = () => {
  const { user, token, login } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
const [formData, setFormData] = useState({
  username: user?.username || "",
  phone: user?.phone || "",
  location: user?.location || "",
  serviceType: user?.serviceType || "",
  experience: user?.experience ? String(user.experience) : "",
});


  const profile: ServiceProviderProfile = {
    username: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
    serviceType: user?.serviceType || "",
    experience: user?.experience ?? 'Not Available',
    location: user?.location,
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = () => {
    setFormData({
      username: user?.username || "",
      phone: user?.phone || "",
      location: user?.location || "",
      serviceType: user?.serviceType || "",
      experience: user?.experience ? String(user.experience) : "",
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const payload = {
        username: formData.username || undefined,
        phone: formData.phone || undefined,
        location: formData.location || undefined,
        serviceType: formData.serviceType || undefined,
        experience: formData.experience
          ? Number(formData.experience)
          : undefined,
      };

      const response = await userService.updateProfile(payload);

      if (!response?.success) {
        toast.error(response?.message || "Failed to update profile");
        return;
      }

      const updatedUser =
        response.data?.user || { ...user, ...payload };

      if (token) {
        login(token, updatedUser);
      }

      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update profile";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <ProviderSidebar />

      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <ProviderNavbar />

        {/* Content */}
        <div className="p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex-1">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="bg-white/80 backdrop-blur-lg p-6 rounded-3xl shadow-md mb-8 border border-white/40">
              <h1 className="text-3xl font-bold text-indigo-700">My Profile</h1>
              <p className="text-gray-600 mt-1">
                Manage your service provider information
              </p>
            </div>

            {/* Profile Card */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-md overflow-hidden border border-white/40">
              {/* Cover Section */}
              <div className="h-32 md:h-40 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

              {/* Profile Content */}
              <div className="px-6 md:px-8 pb-8">
                {/* Profile Image and Name */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 md:-mt-20">
                  <div className="flex flex-col md:flex-row md:items-end gap-4">
                    {/* Profile Image */}
                    <div className="relative">
                      <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg">
                        <User className="w-16 h-16 md:w-20 md:h-20 text-white" />
                      </div>
                    </div>

                    {/* Name and Service Type */}
                    <div className="mb-4">
                    {isEditing ? (
  <input
    type="text"
    name="username"
    value={formData.username}
    onChange={handleChange}
    className="text-2xl md:text-3xl font-bold text-gray-800 bg-transparent border-b-2 border-indigo-300 focus:outline-none focus:border-indigo-600"
  />
) : (
  <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
    {profile.username}
  </h2>
)}

                      <p className="text-lg text-indigo-600 font-semibold capitalize">
                        {profile.serviceType}
                      </p>
                    </div>
                  </div>

                  {/* Edit / Save Buttons */}
                  {isEditing ? (
                    <div className="mt-4 md:mt-0 mb-4 flex gap-3">
                      <button
                        className="px-5 py-2 border border-gray-300 rounded-2xl bg-white hover:bg-gray-50 transition font-medium shadow-sm"
                        onClick={handleCancel}
                        disabled={saving}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-6 py-2 bg-indigo-600 text-white rounded-2xl hover:opacity-90 transition font-medium shadow-md disabled:opacity-70"
                        onClick={handleSave}
                        disabled={saving}
                      >
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  ) : (
                    <button
                      className="mt-4 md:mt-0 mb-4 px-6 py-2 bg-indigo-600 text-white rounded-2xl hover:opacity-90 transition font-medium shadow-md"
                      onClick={handleEditClick}
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                {/* Profile Details Grid */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact Information Card */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Contact Information
                    </h3>

                    {/* Email */}
                    <div className="flex items-start gap-3 p-4 bg-white rounded-2xl shadow border border-gray-100 hover:shadow-md transition">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-500 font-medium">
                          Email Address
                        </p>
                        <p className="text-gray-800 font-medium break-all">
                          {profile.email}
                        </p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-3 p-4 bg-white rounded-2xl shadow border border-gray-100 hover:shadow-md transition">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                        <Phone className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-500 font-medium">
                          Phone Number
                        </p>
                        {isEditing ? (
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        ) : (
                          <p className="text-gray-800 font-medium">
                            {profile.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-3 p-4 bg-white rounded-2xl shadow border border-gray-100 hover:shadow-md transition">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-500 font-medium">
                          Location
                        </p>
                        {isEditing ? (
                          <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        ) : (
                          <p className="text-gray-800 font-medium">
                            {profile.location || 'Not available'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Professional Information Card */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Professional Information
                    </h3>

                    {/* Service Type */}
                    <div className="flex items-start gap-3 p-4 bg-white rounded-2xl shadow border border-gray-100 hover:shadow-md transition">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                        <Briefcase className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-500 font-medium">
                          Service Type
                        </p>
                        {isEditing ? (
                          <select
                            name="serviceType"
                            value={formData.serviceType}
                            onChange={handleChange}
                            className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="">Select Service Type</option>
                            <option value="plumber">Plumber</option>
                            <option value="electrician">Electrician</option>
                            <option value="carpenter">Carpenter</option>
                            <option value="cleaner">Cleaner</option>
                          </select>
                        ) : (
                          <p className="text-gray-800 font-medium capitalize">
                            {profile.serviceType}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="flex items-start gap-3 p-4 bg-white rounded-2xl shadow border border-gray-100 hover:shadow-md transition">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                        <Calendar className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-500 font-medium">
                          Experience
                        </p>
                        {isEditing ? (
                          <input
                            type="number"
                            name="experience"
                            min={0}
                            value={formData.experience}
                            onChange={handleChange}
                            className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        ) : (
                          <p className="text-gray-800 font-medium">
                            {profile.experience}{' '}
                            {profile.experience === 1 ? 'Year' : profile.experience ? '' : 'Years'}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Stats Card */}
                    {/* <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-indigo-600">0</p>
                          <p className="text-sm text-gray-600">Completed Jobs</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-indigo-600">0</p>
                          <p className="text-sm text-gray-600">Reviews</p>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderProfilePage;