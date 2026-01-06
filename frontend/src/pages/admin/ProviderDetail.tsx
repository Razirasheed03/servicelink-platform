import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import userService, { type AdminProviderView } from "@/services/userService";

export default function AdminProviderDetailPage() {
	const navigate = useNavigate();
	const { providerId } = useParams();
	const [loading, setLoading] = useState(false);
	const [provider, setProvider] = useState<AdminProviderView | null>(null);

	const [confirmState, setConfirmState] = useState<{
		open: boolean;
		nextBlocked: boolean;
	}>({ open: false, nextBlocked: false });

	const load = async () => {
		if (!providerId) return;
		setLoading(true);
		try {
			const res = await userService.getAdminProviderById(providerId);
			if (!res?.success || !res.data?.provider) {
				toast.error(res?.message || "Provider not found");
				setProvider(null);
				return;
			}
			setProvider(res.data.provider);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		load();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [providerId]);

	const statusLabel = useMemo(() => {
		if (!provider) return "";
		if (provider.isBlocked) return "blocked";
		return provider.verificationStatus || "pending";
	}, [provider]);

	const handleConfirmBlock = async () => {
		if (!providerId) return;
		const res = await userService.setProviderBlocked(providerId, confirmState.nextBlocked);
		if (!res?.success) {
			toast.error(res?.message || "Failed to update block status");
			return;
		}
		toast.success(confirmState.nextBlocked ? "Provider blocked" : "Provider unblocked");
		setConfirmState({ open: false, nextBlocked: confirmState.nextBlocked });
		await load();
	};

	return (
		<AdminLayout>
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-gray-900">Provider Profile</h1>
				<button
					onClick={() => navigate("/admin/providers")}
					className="px-4 py-2 rounded-xl border border-gray-300 bg-white"
				>
					Back
				</button>
			</div>

			{loading ? <div className="text-gray-700">Loading...</div> : null}

			{provider ? (
				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
					<div className="flex items-start justify-between gap-4">
						<div>
							<div className="text-xl font-semibold text-gray-900">{provider.username}</div>
							<div className="text-sm text-gray-600 mt-1">{provider.email}</div>
							<div className="text-sm text-gray-600 mt-1 capitalize">Status: {statusLabel}</div>
							{provider.verificationStatus === "rejected" && provider.verificationReason ? (
								<div className="text-sm text-gray-700 mt-2">
									Rejection Reason: {provider.verificationReason}
								</div>
							) : null}
						</div>

						<div className="flex items-center gap-2">
							<button
								onClick={() => setConfirmState({ open: true, nextBlocked: !provider.isBlocked })}
								className="px-4 py-2 rounded-xl border border-gray-300 bg-white"
							>
								{provider.isBlocked ? "Unblock" : "Block"}
							</button>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
						<Field label="Phone" value={provider.phone || "-"} />
						<Field label="Location" value={provider.location || "-"} />
						<Field label="Service Type" value={provider.serviceType || "-"} />
						<Field label="Experience" value={provider.experience != null ? String(provider.experience) : "-"} />
						<Field
							label="Consultation Fee"
							value={provider.consultationFee != null ? `₹${provider.consultationFee}` : "-"}
						/>
						<Field label="Verification Status" value={provider.verificationStatus || "pending"} />
					</div>
				</div>
			) : (
				<div className="text-gray-700">Provider not found.</div>
			)}

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
				onClose={() => setConfirmState({ open: false, nextBlocked: confirmState.nextBlocked })}
			/>
		</AdminLayout>
	);
}

function Field({ label, value }: { label: string; value: string }) {
	return (
		<div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
			<div className="text-xs text-gray-500 font-medium">{label}</div>
			<div className="text-sm text-gray-900 mt-1">{value}</div>
		</div>
	);
}
