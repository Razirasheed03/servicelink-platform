import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import userService, {
	type AdminProviderView,
	type AdminProvidersResponse,
} from "@/services/userService";

export default function AdminProvidersPage() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [providers, setProviders] = useState<AdminProviderView[]>([]);

	const load = async (nextPage: number) => {
		setLoading(true);
		try {
			const res = await userService.getAdminProviders({ page: nextPage, limit: 12 });
			if (!res?.success || !res.data) {
				setProviders([]);
				setPage(1);
				setTotalPages(1);
				return;
			}
			const data = res.data as AdminProvidersResponse;
			setProviders(data.providers || []);
			setPage(data.page || nextPage);
			setTotalPages(data.totalPages || 1);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		load(1);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleApprove = async (providerId: string) => {
		const res = await userService.approveProvider(providerId);
		if (!res?.success) {
			toast.error(res?.message || "Failed to approve");
			return;
		}
		toast.success("Provider approved");
		await load(page);
	};

	const handleReject = async (providerId: string) => {
		const reason = window.prompt("Rejection reason (required):");
		if (!reason || !reason.trim()) {
			toast.error("Rejection reason is required");
			return;
		}
		const res = await userService.rejectProvider(providerId, reason.trim());
		if (!res?.success) {
			toast.error(res?.message || "Failed to reject");
			return;
		}
		toast.success("Provider rejected");
		await load(page);
	};

	const handleToggleBlock = async (providerId: string, nextBlocked: boolean) => {
		const res = await userService.setProviderBlocked(providerId, nextBlocked);
		if (!res?.success) {
			toast.error(res?.message || "Failed to update block status");
			return;
		}
		toast.success(nextBlocked ? "Provider blocked" : "Provider unblocked");
		await load(page);
	};

	const canPrev = page > 1;
	const canNext = page < totalPages;

	return (
		<div className="min-h-screen bg-gray-50">
			<AdminHeader />

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-2xl font-bold text-gray-900">Provider Management</h2>
					<div className="flex items-center gap-2">
						<button className="nav-btn" onClick={() => navigate("/admin/dashboard")}>Dashboard</button>
						<button className="nav-btn" onClick={() => navigate("/admin/users")}>Users</button>
					</div>
				</div>

				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
					<div className="p-4 border-b border-gray-100 flex items-center justify-between">
						<div className="text-sm text-gray-600">Page {page} / {totalPages}</div>
						{loading ? <div className="text-sm text-gray-600">Loading...</div> : null}
					</div>

					<div className="overflow-x-auto">
						<table className="min-w-full text-sm">
							<thead className="bg-gray-50">
								<tr>
									<th className="text-left px-4 py-3 font-semibold text-gray-700">Name</th>
									<th className="text-left px-4 py-3 font-semibold text-gray-700">Email</th>
									<th className="text-left px-4 py-3 font-semibold text-gray-700">Service</th>
									<th className="text-left px-4 py-3 font-semibold text-gray-700">Verification</th>
									<th className="text-left px-4 py-3 font-semibold text-gray-700">Blocked</th>
									<th className="text-left px-4 py-3 font-semibold text-gray-700">Actions</th>
								</tr>
							</thead>
							<tbody>
								{providers.map((p) => (
									<tr key={p._id} className="border-t border-gray-100">
										<td className="px-4 py-3 font-medium text-gray-900">{p.username}</td>
										<td className="px-4 py-3 text-gray-700">{p.email}</td>
										<td className="px-4 py-3 text-gray-700">{p.serviceType || "-"}</td>
										<td className="px-4 py-3 text-gray-700">
											<div className="capitalize">{p.verificationStatus || "pending"}</div>
											{p.verificationStatus === "rejected" && p.verificationReason ? (
												<div className="text-xs text-gray-500 mt-1">{p.verificationReason}</div>
											) : null}
										</td>
										<td className="px-4 py-3 text-gray-700">{p.isBlocked ? "Yes" : "No"}</td>
										<td className="px-4 py-3">
											<div className="flex items-center gap-2">
												<button
													className="px-3 py-1 rounded-lg border border-green-300 text-green-700 hover:bg-green-50"
													onClick={() => handleApprove(p._id)}
												>
													Approve
												</button>
												<button
													className="px-3 py-1 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50"
													onClick={() => handleReject(p._id)}
												>
													Reject
												</button>
												<button
													className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
													onClick={() => handleToggleBlock(p._id, !p.isBlocked)}
												>
													{p.isBlocked ? "Unblock" : "Block"}
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<div className="p-4 border-t border-gray-100 flex items-center justify-between">
						<button
							disabled={!canPrev}
							onClick={() => load(page - 1)}
							className="px-4 py-2 rounded-xl border border-gray-300 bg-white disabled:opacity-50"
						>
							Previous
						</button>
						<button
							disabled={!canNext}
							onClick={() => load(page + 1)}
							className="px-4 py-2 rounded-xl border border-gray-300 bg-white disabled:opacity-50"
						>
							Next
						</button>
					</div>
				</div>
			</main>
		</div>
	);
}

function AdminHeader() {
	return (
		<header className="bg-white shadow-sm sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					<h1 className="text-xl font-bold text-gray-900">Admin</h1>
				</div>
			</div>
		</header>
	);
}
