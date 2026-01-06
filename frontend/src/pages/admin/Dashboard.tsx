import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, ShieldCheck, Users } from "lucide-react";
import userService, { type AdminDashboardStats } from "@/services/userService";

export default function AdminDashboardPage() {
	const navigate = useNavigate();
	const [stats, setStats] = useState<AdminDashboardStats>({
		totalUsers: 0,
		totalProviders: 0,
		verifiedProviders: 0,
		pendingVerifications: 0,
	});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		let active = true;
		const load = async () => {
			setLoading(true);
			try {
				const res = await userService.getAdminDashboard();
				if (!active) return;
				if (res?.success && res.data) {
					setStats(res.data);
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

	return (
		<div className="min-h-screen bg-gray-50">
			<header className="bg-white shadow-sm sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						<h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
						<nav className="hidden md:flex items-center gap-4">
							<button className="nav-btn" onClick={() => navigate("/admin/dashboard")}>Home</button>
							<button className="nav-btn" onClick={() => navigate("/admin/providers")}>Providers</button>
							<button className="nav-btn" onClick={() => navigate("/admin/users")}>Users</button>
						</nav>
					</div>
				</div>
			</header>

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					<StatCard title="Total Users" value={stats.totalUsers} icon={Users} />
					<StatCard title="Total Providers" value={stats.totalProviders} icon={ClipboardList} />
					<StatCard title="Verified Providers" value={stats.verifiedProviders} icon={ShieldCheck} />
					<StatCard title="Pending Verifications" value={stats.pendingVerifications} icon={ClipboardList} />
				</div>

				{loading ? <div className="mt-6 text-gray-600">Loading...</div> : null}
			</main>
		</div>
	);
}

function StatCard({
	title,
	value,
	icon: Icon,
}: {
	title: string;
	value: number;
	icon: any;
}) {
	return (
		<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
			<div className="flex items-center justify-between">
				<div>
					<div className="text-sm text-gray-600">{title}</div>
					<div className="text-3xl font-bold text-gray-900 mt-2">{value}</div>
				</div>
				<Icon className="w-8 h-8 text-indigo-600" />
			</div>
		</div>
	);
}
