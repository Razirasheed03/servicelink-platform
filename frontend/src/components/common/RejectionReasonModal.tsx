import { useEffect, useState } from "react";
import BaseModal from "./BaseModal";

type RejectionReasonModalProps = {
	isOpen: boolean;
	title?: string;
	initialReason?: string;
	loading?: boolean;
	onClose: () => void;
	onSubmit: (reason: string) => void;
};

export default function RejectionReasonModal({
	isOpen,
	title = "Reject Provider",
	initialReason = "",
	loading = false,
	onClose,
	onSubmit,
}: RejectionReasonModalProps) {
	const [reason, setReason] = useState(initialReason);

	useEffect(() => {
		if (!isOpen) return;
		setReason(initialReason);
	}, [isOpen, initialReason]);

	const trimmed = reason.trim();
	const canSubmit = trimmed.length > 0 && !loading;

	return (
		<BaseModal
			isOpen={isOpen}
			title={title}
			onClose={onClose}
			footer={
				<div className="flex items-center justify-end gap-2">
					<button
						onClick={onClose}
						disabled={loading}
						className="px-4 py-2 rounded-xl border border-gray-300 bg-white disabled:opacity-50"
					>
						Cancel
					</button>
					<button
						onClick={() => onSubmit(trimmed)}
						disabled={!canSubmit}
						className="px-4 py-2 rounded-xl bg-rose-600 text-white disabled:opacity-50"
					>
						{loading ? "Submitting..." : "Reject"}
					</button>
				</div>
			}
		>
			<label className="block text-sm font-medium text-gray-700">Rejection reason</label>
			<textarea
				value={reason}
				onChange={(e) => setReason(e.target.value)}
				rows={4}
				className="mt-2 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
				placeholder="Enter a short reason..."
			/>
			<div className="text-xs text-gray-500 mt-2">Reason is required.</div>
		</BaseModal>
	);
}
