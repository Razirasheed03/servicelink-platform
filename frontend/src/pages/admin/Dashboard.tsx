import { useEffect, useState } from "react";
import { ClipboardList, UserCheck, UserPlus, Hourglass } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import userService, { type AdminDashboardStats } from "@/services/userService";

export default function AdminDashboardPage() {
	const [stats, setStats] = useState<AdminDashboardStats>({
		totalProviders: 0,
		pendingVerifications: 0,
		activeProviders: 0,
		newProvidersThisMonth: 0,
		providerStatusCounts: { approved: 0, pending: 0, rejected: 0, blocked: 0 },
		verifiedProviders: 0,
		totalUsers: 0,
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
		<AdminLayout>
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatCard title="Total Providers" value={stats.totalProviders} icon={ClipboardList} />
				<StatCard title="Pending Approvals" value={stats.pendingVerifications} icon={Hourglass} />
				<StatCard title="Active Providers" value={stats.activeProviders} icon={UserCheck} />
				<StatCard title="New Providers (This Month)" value={stats.newProvidersThisMonth} icon={UserPlus} />
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
					<div className="text-sm font-semibold text-gray-900">Provider Status Breakdown</div>
					<div className="text-sm text-gray-600 mt-1">Approved vs pending vs rejected vs blocked</div>
					<div className="mt-6 flex items-center gap-8">
						<DonutChart counts={stats.providerStatusCounts} />
						<div className="space-y-2 text-sm">
							<LegendRow label="Approved" color="#10B981" value={stats.providerStatusCounts.approved} />
							<LegendRow label="Pending" color="#F59E0B" value={stats.providerStatusCounts.pending} />
							<LegendRow label="Rejected" color="#F43F5E" value={stats.providerStatusCounts.rejected} />
							<LegendRow label="Blocked" color="#6B7280" value={stats.providerStatusCounts.blocked} />
						</div>
					</div>
					{loading ? <div className="mt-4 text-gray-600">Loading...</div> : null}
				</div>

				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
					<div className="text-sm font-semibold text-gray-900">Quick Notes</div>
					<div className="text-sm text-gray-600 mt-2">
						This dashboard uses real provider verification data. Use the Providers page to approve/reject and block/unblock.
					</div>
				</div>
			</div>
		</AdminLayout>
	);
}

function LegendRow({ label, color, value }: { label: string; color: string; value: number }) {
	return (
		<div className="flex items-center justify-between gap-4">
			<div className="flex items-center gap-2">
				<span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
				<span className="text-gray-700">{label}</span>
			</div>
			<span className="font-semibold text-gray-900">{value}</span>
		</div>
	);
}

function DonutChart({
	counts,
}: {
	counts: { approved: number; pending: number; rejected: number; blocked: number };
}) {
	const total = counts.approved + counts.pending + counts.rejected + counts.blocked;
	const size = 120;
	const stroke = 14;
	const radius = (size - stroke) / 2;
	const circumference = 2 * Math.PI * radius;

	const seg = (value: number) => (total === 0 ? 0 : (value / total) * circumference);
	const approvedLen = seg(counts.approved);
	const pendingLen = seg(counts.pending);
	const rejectedLen = seg(counts.rejected);
	const blockedLen = seg(counts.blocked);

	const gaps = 0;
	let offset = 0;

	const ring = (len: number, color: string) => {
		const dash = `${Math.max(0, len - gaps)} ${circumference}`;
		const el = (
			<circle
				key={color + offset}
				cx={size / 2}
				cy={size / 2}
				r={radius}
				fill="transparent"
				stroke={color}
				strokeWidth={stroke}
				strokeDasharray={dash}
				strokeDashoffset={-offset}
				strokeLinecap="butt"
			/>
		);
		offset += len;
		return el;
	};

	return (
		<div className="relative" style={{ width: size, height: size }}>
			<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="transparent"
					stroke="#E5E7EB"
					strokeWidth={stroke}
				/>
				{ring(approvedLen, "#10B981")}
				{ring(pendingLen, "#F59E0B")}
				{ring(rejectedLen, "#F43F5E")}
				{ring(blockedLen, "#6B7280")}
			</svg>
			<div className="absolute inset-0 flex items-center justify-center">
				<div className="text-center">
					<div className="text-xl font-bold text-gray-900">{total}</div>
					<div className="text-xs text-gray-600">providers</div>
				</div>
			</div>
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
