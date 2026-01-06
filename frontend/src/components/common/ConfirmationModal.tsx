import BaseModal from "./BaseModal";

type ConfirmationModalProps = {
	isOpen: boolean;
	title: string;
	description?: string;
	confirmText?: string;
	cancelText?: string;
	confirmVariant?: "danger" | "primary";
	loading?: boolean;
	onConfirm: () => void;
	onClose: () => void;
};

export default function ConfirmationModal({
	isOpen,
	title,
	description,
	confirmText = "Confirm",
	cancelText = "Cancel",
	confirmVariant = "primary",
	loading = false,
	onConfirm,
	onClose,
}: ConfirmationModalProps) {
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
						{cancelText}
					</button>
					<button
						onClick={onConfirm}
						disabled={loading}
						className={`px-4 py-2 rounded-xl text-white disabled:opacity-50 ${
							confirmVariant === "danger" ? "bg-rose-600" : "bg-indigo-600"
						}`}
					>
						{loading ? "Please wait..." : confirmText}
					</button>
				</div>
			}
		>
			{description ? <div className="text-sm text-gray-700">{description}</div> : null}
		</BaseModal>
	);
}
