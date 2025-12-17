import ProviderSidebar from "./ProviderSidebar";
import ProviderNavbar from "./ProviderNavbar";
import {
  Calendar,
  ClipboardList,
  DollarSign,
  UserCog,
  Briefcase,
  Star,
} from "lucide-react";

export default function ProviderHome() {
  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <ProviderSidebar />

      {/* Main Section */}
      <div className="flex-1 flex flex-col">

        {/* Navbar */}
        <ProviderNavbar />

        {/* Content */}
        <div className="p-6 bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 flex-1">
          <div className="max-w-6xl mx-auto">

            {/* Welcome Header */}
            <div className="bg-white/80 backdrop-blur-lg p-6 rounded-3xl shadow-md mb-8 border border-white/40">
              <h1 className="text-3xl font-bold text-indigo-700">
                Welcome, Service Provider 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Here’s an overview of your service activity.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard title="Total Jobs" count="42" icon={Briefcase} color="text-blue-600" />
              <StatCard title="Upcoming" count="5" icon={Calendar} color="text-green-600" />
              <StatCard title="Earnings" count="₹12,450" icon={DollarSign} color="text-emerald-600" />
              <StatCard title="Rating" count="4.8" icon={Star} color="text-yellow-500" />
            </div>

            {/* Recent Jobs + Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Recent Jobs */}
              <div className="p-6 bg-white/80 rounded-3xl shadow-md border border-white/40">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Recent Jobs
                </h2>

                <div className="space-y-4">
                  {[
                    { title: "AC Repair", customer: "Arun", time: "Today, 2 PM" },
                    { title: "Pipe Leak Fix", customer: "Rahul", time: "Yesterday" },
                    { title: "Deep Cleaning", customer: "Neha", time: "2 days ago" },
                  ].map((job, i) => (
                    <div
                      key={i}
                      className="p-4 bg-white rounded-2xl shadow border border-gray-100"
                    >
                      <h3 className="font-semibold text-gray-800">{job.title}</h3>
                      <p className="text-gray-600 text-sm">
                        Customer: {job.customer}
                      </p>
                      <p className="text-gray-500 text-sm">{job.time}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-6 bg-white/80 rounded-3xl shadow-md border border-white/40">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Quick Actions
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <ActionButton label="Manage Jobs" icon={ClipboardList} color="bg-blue-600" />
                  <ActionButton label="Edit Profile" icon={UserCog} color="bg-indigo-600" />
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

// ---------------- COMPONENTS ----------------

const StatCard = ({ title, count, icon: Icon, color }: any) => (
  <div className="p-6 bg-white/80 rounded-3xl shadow-md border border-white/40">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <Icon className={color} />
    </div>
    <p className="text-3xl font-bold mt-3 text-indigo-700">{count}</p>
    <p className="text-gray-500 text-sm mt-1">Updated</p>
  </div>
);

const ActionButton = ({ label, icon: Icon, color }: any) => (
  <button
    className={`${color} text-white p-5 rounded-2xl shadow hover:opacity-90 transition flex flex-col items-center gap-2`}
  >
    <Icon className="w-5 h-5" />
    {label}
  </button>
);
