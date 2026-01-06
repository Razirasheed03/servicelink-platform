import ProviderSidebar from "../../components/provider/Sidebar";
import ProviderNavbar from "../../components/provider/Navbar";
import { useEffect, useState } from "react";
import userService, { type ProviderDashboardResponse } from "@/services/userService";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";
import {
  ClipboardList,
  DollarSign,
  UserCog,
  Briefcase,
  Star,
} from "lucide-react";

export default function ProviderHome() {
	const { user, token, login } = useAuth();
	const [dashboard, setDashboard] = useState<ProviderDashboardResponse>({
		avgRating: 0,
		totalReviews: 0,
		recentReviews: [],
		completedJobs: 42,
	});
	const [loading, setLoading] = useState(false);
	const [profileLoading, setProfileLoading] = useState(false);

	const refreshProfile = async () => {
		setProfileLoading(true);
		try {
			const res = await userService.getProfile();
			if (res?.success && res.data?.user && token) {
				login(token, res.data.user);
			}
		} finally {
			setProfileLoading(false);
		}
	};

	useEffect(() => {
		let active = true;
		refreshProfile();
		const load = async () => {
			setLoading(true);
			try {
				const res = await userService.getProviderDashboard();
				if (!active) return;
				if (res?.success && res.data) {
					setDashboard(res.data);
				}
			} finally {
				if (active) setLoading(false);
			}
		};
		load();
		return () => {
			active = false;
		};
	}, []);

	const handleReapply = async () => {
		const res = await userService.reapplyProviderVerification();
		if (!res?.success) {
			toast.error(res?.message || "Failed to reapply");
			return;
		}
		toast.success("Re-applied for verification");
		await refreshProfile();
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
        <div className="p-6 bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 flex-1">
          <div className="max-w-6xl mx-auto">
            {user?.verificationStatus && user.verificationStatus !== "approved" ? (
              <div
                className={`p-4 rounded-2xl mb-6 border ${
                  user.verificationStatus === "rejected"
                    ? "bg-rose-50 border-rose-200"
                    : "bg-amber-50 border-amber-200"
                }`}
              >
                <div className="font-semibold text-gray-900 capitalize">
                  Verification Status: {user.verificationStatus}
                  {profileLoading ? "" : ""}
                </div>
                {user.verificationStatus === "pending" ? (
                  <div className="text-sm text-gray-700 mt-1">
                    Your profile is under review. You won’t appear in user listings until approved.
                  </div>
                ) : null}
                {user.verificationStatus === "rejected" ? (
                  <div className="text-sm text-gray-700 mt-1">
                    Reason: {user.verificationReason || "Not provided"}
                  </div>
                ) : null}
                {user.verificationStatus === "rejected" ? (
                  <div className="mt-3">
                    <button
                      onClick={handleReapply}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:opacity-90"
                    >
                      Reapply for verification
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}

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
							<StatCard title="Completed Jobs" count={String(dashboard.completedJobs)} icon={Briefcase} color="text-blue-600" />
							<StatCard title="Total Reviews" count={String(dashboard.totalReviews)} icon={ClipboardList} color="text-indigo-600" />
							<StatCard title="Avg Rating" count={String(dashboard.avgRating.toFixed(1))} icon={Star} color="text-yellow-500" />
							<StatCard title="Earnings" count={"₹12,450"} icon={DollarSign} color="text-emerald-600" />
            </div>

            {/* Recent Jobs + Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Recent Jobs */}
              <div className="p-6 bg-white/80 rounded-3xl shadow-md border border-white/40">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
									Recent Reviews
                </h2>

									{loading ? (
										<div className="text-gray-600">Loading...</div>
									) : dashboard.recentReviews.length === 0 ? (
										<div className="text-gray-600">No reviews yet.</div>
									) : (
										<div className="space-y-4">
											{dashboard.recentReviews.map((r) => (
												<div key={r.id} className="p-4 bg-white rounded-2xl shadow border border-gray-100">
													<h3 className="font-semibold text-gray-800">{r.userName}</h3>
													<p className="text-gray-600 text-sm mt-1">Rating: {r.rating}</p>
													{r.comment ? <p className="text-gray-600 text-sm mt-2">{r.comment}</p> : null}
													<p className="text-gray-500 text-xs mt-2">{r.date}</p>
												</div>
											))}
										</div>
									)}
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
