import { Calendar, ClipboardList, DollarSign, UserCog, Briefcase, Star } from "lucide-react";

export default function ProviderHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      
      {/* Welcome Header */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/80 backdrop-blur-lg p-6 rounded-3xl shadow-md mb-8 border border-white/40">
          <h1 className="text-3xl font-bold text-indigo-700">Welcome, Service Provider 👋</h1>
          <p className="text-gray-600 mt-1">Here’s an overview of your service activity.</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          {/* Total Jobs */}
          <div className="p-6 bg-white/80 rounded-3xl shadow-md border border-white/40">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-700">Total Jobs</h3>
              <Briefcase className="text-blue-600" />
            </div>
            <p className="text-3xl font-bold mt-3 text-indigo-700">42</p>
            <p className="text-gray-500 text-sm mt-1">Completed jobs</p>
          </div>

          {/* Upcoming Jobs */}
          <div className="p-6 bg-white/80 rounded-3xl shadow-md border border-white/40">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-700">Upcoming</h3>
              <Calendar className="text-green-600" />
            </div>
            <p className="text-3xl font-bold mt-3 text-indigo-700">5</p>
            <p className="text-gray-500 text-sm mt-1">Scheduled jobs</p>
          </div>

          {/* Earnings */}
          <div className="p-6 bg-white/80 rounded-3xl shadow-md border border-white/40">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-700">Earnings</h3>
              <DollarSign className="text-emerald-600" />
            </div>
            <p className="text-3xl font-bold mt-3 text-indigo-700">₹12,450</p>
            <p className="text-gray-500 text-sm mt-1">This month</p>
          </div>

          {/* Rating */}
          <div className="p-6 bg-white/80 rounded-3xl shadow-md border border-white/40">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-700">Rating</h3>
              <Star className="text-yellow-500" />
            </div>
            <p className="text-3xl font-bold mt-3 text-indigo-700">4.8</p>
            <p className="text-gray-500 text-sm mt-1">Based on reviews</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Recent Jobs */}
          <div className="p-6 bg-white/80 rounded-3xl shadow-md border border-white/40 h-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Jobs</h2>

            <div className="space-y-4">
              {[
                { title: "AC Repair", customer: "Arun", time: "Today, 2:00 PM" },
                { title: "Pipe Leak Fix", customer: "Rahul", time: "Yesterday" },
                { title: "Deep Cleaning", customer: "Neha", time: "2 days ago" }
              ].map((job, i) => (
                <div key={i} className="p-4 bg-white rounded-2xl shadow border border-gray-100">
                  <h3 className="font-semibold text-gray-800">{job.title}</h3>
                  <p className="text-gray-600 text-sm">Customer: {job.customer}</p>
                  <p className="text-gray-500 text-sm">{job.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Profile + Actions */}
          <div className="p-6 bg-white/80 rounded-3xl shadow-md border border-white/40">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>

            <div className="grid grid-cols-2 gap-4">

              <button className="p-5 bg-blue-600 text-white rounded-2xl shadow hover:bg-blue-700 transition flex flex-col items-center gap-2">
                <ClipboardList />
                Manage Jobs
              </button>

              <button className="p-5 bg-indigo-600 text-white rounded-2xl shadow hover:bg-indigo-700 transition flex flex-col items-center gap-2">
                <UserCog />
                Edit Profile
              </button>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
