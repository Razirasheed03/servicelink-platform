import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import RejectionReasonModal from "@/components/common/RejectionReasonModal";
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
	const [confirmState, setConfirmState] = useState<{ open: boolean; providerId: string | null; nextBlocked: boolean }>({
		open: false,
		providerId: null,
		nextBlocked: false,
	});
	const [rejectState, setRejectState] = useState<{ open: boolean; providerId: string | null }>({
		open: false,
		providerId: null,
	});

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

	const handleRejectSubmit = async (reason: string) => {
		if (!rejectState.providerId) return;
		const res = await userService.rejectProvider(rejectState.providerId, reason);
		if (!res?.success) {
			toast.error(res?.message || "Failed to reject");
			return;
		}
		toast.success("Provider rejected");
		setRejectState({ open: false, providerId: null });
		await load(page);
	};

	const handleConfirmBlock = async () => {
		if (!confirmState.providerId) return;
		const res = await userService.setProviderBlocked(confirmState.providerId, confirmState.nextBlocked);
		if (!res?.success) {
			toast.error(res?.message || "Failed to update block status");
			return;
		}
		toast.success(confirmState.nextBlocked ? "Provider blocked" : "Provider unblocked");
		setConfirmState({ open: false, providerId: null, nextBlocked: confirmState.nextBlocked });
		await load(page);
	};

	const canPrev = page > 1;
	const canNext = page < totalPages;

	return (
		<AdminLayout>
			<div className="flex items-center justify-between mb-6">
				<h2 className="text-2xl font-bold text-gray-900">Provider Management</h2>
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
								{providers.map((p) => {
									const verificationStatus = p.verificationStatus || "pending";
									const isApproved = verificationStatus === "approved";
									const isRejected = verificationStatus === "rejected";
									return (
										<tr key={p._id} className="border-t border-gray-100">
										<td className="px-4 py-3 font-medium text-gray-900">
											<button
												onClick={() => navigate(`/admin/providers/${p._id}`)}
												className="text-left hover:underline"
											>
												{p.username}
											</button>
										</td>
										<td className="px-4 py-3 text-gray-700">{p.email}</td>
										<td className="px-4 py-3 text-gray-700">{p.serviceType || "-"}</td>
										<td className="px-4 py-3 text-gray-700">
											<div className="capitalize">{verificationStatus}</div>
											{p.verificationStatus === "rejected" && p.verificationReason ? (
												<div className="text-xs text-gray-500 mt-1">{p.verificationReason}</div>
											) : null}
										</td>
										<td className="px-4 py-3 text-gray-700">{p.isBlocked ? "Yes" : "No"}</td>
										<td className="px-4 py-3">
											<div className="flex items-center gap-2">
												<button
													disabled={isApproved}
													className="px-3 py-1 rounded-lg border border-green-300 text-green-700 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
													onClick={() => handleApprove(p._id)}
												>
													Approve
												</button>
												<button
													disabled={isRejected}
													className="px-3 py-1 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 disabled:opacity-50 disabled:cursor-not-allowed"
													onClick={() => setRejectState({ open: true, providerId: p._id })}
												>
													Reject
												</button>
												<button
													className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
													onClick={() => setConfirmState({ open: true, providerId: p._id, nextBlocked: !p.isBlocked })}
												>
													{p.isBlocked ? "Unblock" : "Block"}
												</button>
											</div>
										</td>
										</tr>
									);
								})}
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

				<ConfirmationModal
					isOpen={confirmState.open}
					title={confirmState.nextBlocked ? "Block Provider" : "Unblock Provider"}
					description={
						confirmState.nextBlocked
							? "Are you sure you want to block this provider?"
							: "Are you sure you want to unblock this provider?"
					}
					confirmText={confirmState.nextBlocked ? "Block" : "Unblock"}
					confirmVariant={confirmState.nextBlocked ? "danger" : "primary"}
					onConfirm={handleConfirmBlock}
					onClose={() => setConfirmState({ open: false, providerId: null, nextBlocked: confirmState.nextBlocked })}
				/>

				<RejectionReasonModal
					isOpen={rejectState.open}
					onClose={() => setRejectState({ open: false, providerId: null })}
					onSubmit={handleRejectSubmit}
				/>
		</AdminLayout>
	);
}
