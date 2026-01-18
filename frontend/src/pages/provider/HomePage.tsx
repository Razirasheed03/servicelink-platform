import ProviderSidebar from "../../components/provider/Sidebar";
import ProviderNavbar from "../../components/provider/Navbar";
import { useEffect, useMemo, useState } from "react";
import userService, {
  type ProviderDashboardResponse,
  type SubscriptionStatusResponse,
  type SubscriptionStatus,
} from "@/services/userService";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";
import {
  ClipboardList,
  DollarSign,
  UserCog,
  Briefcase,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProviderHome() {
	const { user, token, login } = useAuth();
	  const navigate = useNavigate();
	const [dashboard, setDashboard] = useState<ProviderDashboardResponse>({
		avgRating: 0,
		totalReviews: 0,
		recentReviews: [],
		completedJobs: 42,
	});
	const [loading, setLoading] = useState(false);
	const [profileLoading, setProfileLoading] = useState(false);
	const [subscription, setSubscription] = useState<SubscriptionStatusResponse | null>(null);
	const [subscriptionLoading, setSubscriptionLoading] = useState(false);

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
	interface ActionButtonProps {
  label: string;
  icon: any;
  color: string;
  onClick?: () => void;
}


	useEffect(() => {
		let active = true;
		refreshProfile();

		const searchParams = new URLSearchParams(window.location.search);
		const paymentStatus = searchParams.get("payment");
		if (paymentStatus === "success") {
			toast.success("Payment successful. Activating subscription...");
		}
		if (paymentStatus === "cancelled") {
			toast.info("Payment cancelled");
		}
		if (paymentStatus) {
			window.history.replaceState({}, "", window.location.pathname);
		}

		const loadSubscription = async () => {
			setSubscriptionLoading(true);
			try {
				const res = await userService.getProviderSubscriptionStatus();
				if (!active) return;
				if (res?.success && res.data) {
					setSubscription(res.data);
				} else if (res?.message) {
					toast.error(res.message);
				}
			} finally {
				if (active) setSubscriptionLoading(false);
			}
		};

		loadSubscription();

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

	const handleSubscribe = async () => {
		const res = await userService.startProviderSubscription();
		if (!res?.success || !res.data?.checkoutUrl) {
			toast.error(res?.message || "Failed to start subscription");
			return;
		}
		window.location.href = res.data.checkoutUrl;
	};

	const subscriptionBanner = useMemo(() => {
		if (subscriptionLoading) {
			return (
				<div className="p-4 rounded-2xl mb-6 border bg-blue-50 border-blue-200 text-blue-800">
					Checking subscription status...
				</div>
			);
		}
		if (!subscription) return null;

		const formattedEnd = subscription.endDate ? new Date(subscription.endDate).toLocaleDateString() : null;

		switch (subscription.status as SubscriptionStatus) {
			case "APPROVED_BUT_UNSUBSCRIBED":
				return (
					<div className="p-4 rounded-2xl mb-6 border bg-indigo-50 border-indigo-200 text-indigo-900 flex items-center justify-between gap-4">
						<div>
							<div className="font-semibold">Subscribe to go live</div>
							<div className="text-sm text-indigo-800">Pay ₹199 to be listed for 30 days.</div>
						</div>
						<button onClick={handleSubscribe} className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:opacity-90">
							Subscribe ₹199
						</button>
					</div>
				);
			case "EXPIRED":
				return (
					<div className="p-4 rounded-2xl mb-6 border bg-amber-50 border-amber-200 text-amber-900 flex items-center justify-between gap-4">
						<div>
							<div className="font-semibold">Subscription expired</div>
							<div className="text-sm text-amber-800">Please renew to appear in listings.</div>
						</div>
						<button onClick={handleSubscribe} className="px-4 py-2 bg-amber-600 text-white rounded-xl hover:opacity-90">
							Renew now
						</button>
					</div>
				);
			case "ACTIVE":
				return (
					<div className="p-4 rounded-2xl mb-6 border bg-emerald-50 border-emerald-200 text-emerald-900 flex items-center justify-between gap-4">
						<div>
							<div className="font-semibold">Subscription active</div>
							<div className="text-sm text-emerald-800">Expires on {formattedEnd || "N/A"}</div>
						</div>
						<button onClick={handleSubscribe} className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:opacity-90">
							Renew
						</button>
					</div>
				);
			default:
				return null;
		}
	}, [subscription, subscriptionLoading]);

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
            {subscriptionBanner}
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
  <StatCard
    title="Verification Status"
    count={user?.verificationStatus === "approved" ? "Approved" : "Pending"}
    icon={Briefcase}
    color="text-blue-600"
  />

  <StatCard
    title="Subscription"
    count={subscription?.status === "ACTIVE" ? "Active" : "Inactive"}
    icon={DollarSign}
    color="text-emerald-600"
  />

  <StatCard
    title="Total Reviews"
    count={String(dashboard.totalReviews)}
    icon={ClipboardList}
    color="text-indigo-600"
  />

  <StatCard
    title="Average Rating"
    count={dashboard.avgRating ? dashboard.avgRating.toFixed(1) : "—"}
    icon={Star}
    color="text-yellow-500"
  />
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
  <ActionButton
    label="View Reviews"
    icon={ClipboardList}
    color="bg-blue-600"
    onClick={() => navigate("/provider/reviews")}
  />
  <ActionButton
    label="Edit Profile"
    icon={UserCog}
    color="bg-indigo-600"
    onClick={() => navigate("/provider/profile")}
  />
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
    <p className="text-2xl font-bold mt-3 text-indigo-700">{count}</p>
    <p className="text-gray-500 text-sm mt-1">
      Current status
    </p>
  </div>
);


const ActionButton = ({ label, icon: Icon, color, onClick }: any) => (
  <button
    onClick={onClick}
    className={`${color} text-white p-5 rounded-2xl shadow hover:opacity-90 transition flex flex-col items-center gap-2`}
  >
    <Icon className="w-5 h-5" />
    {label}
  </button>
);

