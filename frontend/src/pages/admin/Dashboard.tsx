import { useEffect, useMemo, useState } from "react";
import {
	ClipboardList,
	UserCheck,
	UserPlus,
	Hourglass,
	IndianRupee,
	TrendingUp,
	PieChart,
} from "lucide-react";
import { Chart } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	Tooltip,
	Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import AdminLayout from "@/components/admin/AdminLayout";
import userService, {
	type AdminDashboardStats,
	type AdminRevenueSummary,
	type AdminIncomePoint,
} from "@/services/userService";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend);

const formatCurrency = (value: number) =>
	new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

type RangePreset = "7d" | "30d" | "12m" | "custom";

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
	const [revenue, setRevenue] = useState<AdminRevenueSummary | null>(null);
	const [incomeSeries, setIncomeSeries] = useState<AdminIncomePoint[]>([]);
	const [loadingStats, setLoadingStats] = useState(false);
	const [loadingIncome, setLoadingIncome] = useState(false);
	const [range, setRange] = useState<RangePreset>("30d");
	const [from, setFrom] = useState<string>("");
	const [to, setTo] = useState<string>("");
	const [groupBy, setGroupBy] = useState<"day" | "month">("day");

	useEffect(() => {
		let active = true;
		const loadStats = async () => {
			setLoadingStats(true);
			try {
				const res = await userService.getAdminDashboard();
				if (!active) return;
				if (res?.success && res.data) setStats(res.data);
			} finally {
				if (active) setLoadingStats(false);
			}
		};
		loadStats();
		return () => {
			active = false;
		};
	}, []);

	useEffect(() => {
		let active = true;
		const loadRevenue = async () => {
			setLoadingIncome(true);
			try {
				const summaryRes = await userService.getAdminRevenueSummary();
				if (active && summaryRes?.success && summaryRes.data) setRevenue(summaryRes.data);

				const incomeRes = await userService.getAdminIncome({ range, from, to, groupBy });
				if (active && incomeRes?.success && incomeRes.data) setIncomeSeries(incomeRes.data);
			} finally {
				if (active) setLoadingIncome(false);
			}
		};

		// custom requires both dates
		if (range === "custom" && (!from || !to)) return;
		loadRevenue();
		return () => {
			active = false;
		};
	}, [range, from, to, groupBy]);

	type MixedChartType = "bar" | "line";
	const mixedType: MixedChartType = "bar";

	const incomeChartData = useMemo<ChartData<MixedChartType>>(() => {
		const labels = incomeSeries.map((p) => p.period);
		return {
			labels,
			datasets: [
				{
					label: "Revenue",
					type: "bar",
					data: incomeSeries.map((p) => p.totalIncome),
					backgroundColor: "rgba(79, 70, 229, 0.5)",
					borderRadius: 10,
				},
				{
					label: "Subscriptions",
					type: "line",
					data: incomeSeries.map((p) => p.totalSubscriptions),
					borderColor: "#10B981",
					backgroundColor: "#10B981",
					tension: 0.35,
					pointRadius: 4,
				},
			],
		};
	}, [incomeSeries]);

	const incomeChartOptions = useMemo<ChartOptions<MixedChartType>>(
		() => ({
			responsive: true,
			plugins: {
				legend: { position: "bottom" },
				tooltip: {
					callbacks: {
						label: (ctx) =>
							ctx.dataset.label === "Revenue"
								? `${ctx.dataset.label}: ${formatCurrency(ctx.parsed.y as number)}`
								: `${ctx.dataset.label}: ${ctx.parsed.y}`,
					},
				},
			},
			scales: {
				y: {
					type: "linear",
					beginAtZero: true,
					border: { display: false },
					grid: {},
					ticks: {
						callback: (val) => formatCurrency(Number(val)).replace("₹", "₹ "),
					},
				},
				x: {
					type: "category",
					border: { display: false },
					grid: { display: false },
				},
			},
		}),
		[]
	);

	const handlePreset = (preset: RangePreset) => {
		setRange(preset);
		if (preset !== "custom") {
			setFrom("");
			setTo("");
			setGroupBy(preset === "12m" ? "month" : "day");
		}
	};

	return (
		<AdminLayout>
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
				<StatCard title="Total Providers" value={stats.totalProviders} icon={ClipboardList} />
				<StatCard title="Pending Approvals" value={stats.pendingVerifications} icon={Hourglass} />
				<StatCard title="Active Providers" value={stats.activeProviders} icon={UserCheck} />
				<StatCard title="New Providers (This Month)" value={stats.newProvidersThisMonth} icon={UserPlus} />
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
					<div className="flex items-center justify-between mb-4">
						<div>
							<div className="text-sm font-semibold text-gray-900">Revenue & Subscriptions</div>
							<div className="text-sm text-gray-600">Filters apply to both chart and KPIs</div>
						</div>
						<DateFilters
							selectedRange={range}
							from={from}
							to={to}
							groupBy={groupBy}
							onPreset={handlePreset}
							onCustom={(nextFrom, nextTo) => {
								setRange("custom");
								setFrom(nextFrom);
								setTo(nextTo);
								setGroupBy("day");
							}}
							onGroupChange={setGroupBy}
						/>
					</div>

					{loadingIncome ? (
						<div className="text-gray-600 text-sm">Loading revenue...</div>
					) : incomeSeries.length === 0 ? (
						<div className="text-gray-600 text-sm">No paid subscriptions in this range.</div>
					) : (
						<Chart<MixedChartType> type={mixedType} data={incomeChartData} options={incomeChartOptions} />
					)}
				</div>

				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
					<div className="flex items-center justify-between">
						<div>
							<div className="text-sm font-semibold text-gray-900">KPI Snapshot</div>
							<div className="text-sm text-gray-600">Derived from paid subscriptions only</div>
						</div>
						<PieChart className="w-5 h-5 text-indigo-600" />
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<KpiCard
							title="Total Revenue"
							value={formatCurrency(revenue?.totalIncome || 0)}
							icon={IndianRupee}
						/>
						<KpiCard
							title="Active Subscriptions"
							value={(revenue?.activeSubscriptions ?? 0).toString()}
							icon={TrendingUp}
						/>
						<KpiCard
							title="Revenue This Month"
							value={formatCurrency(revenue?.revenueThisMonth || 0)}
							icon={IndianRupee}
						/>
						<KpiCard
							title="Revenue Last Month"
							value={formatCurrency(revenue?.revenueLastMonth || 0)}
							icon={IndianRupee}
						/>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
					{loadingStats ? <div className="mt-4 text-gray-600">Loading...</div> : null}
				</div>

				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
					<div className="text-sm font-semibold text-gray-900">Notes</div>
					<div className="text-sm text-gray-600 mt-2">
						Revenue is derived solely from successful provider subscriptions (₹199). Provider listings remain gated by active subscriptions.
					</div>
				</div>
			</div>
		</AdminLayout>
	);
}

function DateFilters({
	selectedRange,
	from,
	to,
	groupBy,
	onPreset,
	onCustom,
	onGroupChange,
}: {
	selectedRange: RangePreset;
	from: string;
	to: string;
	groupBy: "day" | "month";
	onPreset: (preset: RangePreset) => void;
	onCustom: (from: string, to: string) => void;
	onGroupChange: (g: "day" | "month") => void;
}) {
	return (
		<div className="flex flex-col gap-2 items-start">
			<div className="flex flex-wrap gap-2">
				{([
					{ key: "7d", label: "7d" },
					{ key: "30d", label: "30d" },
					{ key: "12m", label: "12m" },
					{ key: "custom", label: "Custom" },
				] as Array<{ key: RangePreset; label: string }>).map((btn) => (
					<button
						key={btn.key}
						onClick={() => onPreset(btn.key)}
						className={`px-3 py-1.5 rounded-lg border text-sm transition ${
							selectedRange === btn.key
								? "bg-indigo-600 text-white border-indigo-600"
								: "border-gray-300 text-gray-700 hover:border-indigo-400"
						}`}
					>
						{btn.label}
					</button>
				))}
			</div>
			{selectedRange === "custom" ? (
				<div className="flex flex-wrap items-center gap-2 text-sm text-gray-700">
					<label className="flex items-center gap-2">
						<span>From</span>
						<input
							type="date"
							value={from}
							onChange={(e) => onCustom(e.target.value, to)}
							className="border rounded-lg px-2 py-1"
						/>
					</label>
					<label className="flex items-center gap-2">
						<span>To</span>
						<input
							type="date"
							value={to}
							onChange={(e) => onCustom(from, e.target.value)}
							className="border rounded-lg px-2 py-1"
						/>
					</label>
					<select
						value={groupBy}
						onChange={(e) => onGroupChange(e.target.value as "day" | "month")}
						className="border rounded-lg px-2 py-1"
					>
						<option value="day">Group by day</option>
						<option value="month">Group by month</option>
					</select>
				</div>
			) : null}
		</div>
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

function StatCard({ title, value, icon: Icon }: { title: string; value: number; icon: any }) {
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

function KpiCard({ title, value, icon: Icon }: { title: string; value: string; icon: any }) {
	return (
		<div className="border border-gray-100 rounded-xl p-4 shadow-sm flex items-center gap-3">
			<div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
				<Icon className="w-5 h-5" />
			</div>
			<div>
				<div className="text-sm text-gray-600">{title}</div>
				<div className="text-lg font-semibold text-gray-900">{value}</div>
			</div>
		</div>
	);
}
