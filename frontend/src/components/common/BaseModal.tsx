import { useEffect, useRef } from "react";

type BaseModalProps = {
	isOpen: boolean;
	title: string;
	onClose: () => void;
	children: React.ReactNode;
	footer?: React.ReactNode;
};

export default function BaseModal({
	isOpen,
	title,
	onClose,
	children,
	footer,
}: BaseModalProps) {
	const panelRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!isOpen) return;
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [isOpen, onClose]);

	useEffect(() => {
		if (!isOpen) return;
		const t = window.setTimeout(() => {
			panelRef.current?.focus();
		}, 0);
		return () => window.clearTimeout(t);
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center"
			aria-hidden={!isOpen}
		>
			<div
				className="absolute inset-0 bg-black/40"
				onClick={onClose}
			/>
			<div
				ref={panelRef}
				tabIndex={-1}
				role="dialog"
				aria-modal="true"
				aria-label={title}
				className="relative w-[92vw] max-w-lg bg-white rounded-2xl shadow-lg border border-gray-100 outline-none"
			>
				<div className="p-5 border-b border-gray-100 flex items-center justify-between">
					<h3 className="text-lg font-semibold text-gray-900">{title}</h3>
					<button
						onClick={onClose}
						className="px-3 py-1 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
					>
						Close
					</button>
				</div>
				<div className="p-5">{children}</div>
				{footer ? <div className="p-5 border-t border-gray-100">{footer}</div> : null}
			</div>
		</div>
	);
}
