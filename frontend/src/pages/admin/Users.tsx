import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import userService, { type AdminUserView, type AdminUsersResponse } from "@/services/userService";

export default function AdminUsersPage() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [users, setUsers] = useState<AdminUserView[]>([]);

	const load = async (nextPage: number) => {
		setLoading(true);
		try {
			const res = await userService.getAdminUsers({ page: nextPage, limit: 12 });
			if (!res?.success || !res.data) {
				setUsers([]);
				setPage(1);
				setTotalPages(1);
				return;
			}
			const data = res.data as AdminUsersResponse;
			setUsers(data.users || []);
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

	const handleToggleBlock = async (userId: string, nextBlocked: boolean) => {
		const res = await userService.setUserBlocked(userId, nextBlocked);
		if (!res?.success) {
			toast.error(res?.message || "Failed to update user block status");
			return;
		}
		toast.success(nextBlocked ? "User blocked" : "User unblocked");
		await load(page);
	};

	const canPrev = page > 1;
	const canNext = page < totalPages;

	return (
		<div className="min-h-screen bg-gray-50">
			<AdminHeader />

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-2xl font-bold text-gray-900">User Management</h2>
					<div className="flex items-center gap-2">
						<button className="nav-btn" onClick={() => navigate("/admin/dashboard")}>Dashboard</button>
						<button className="nav-btn" onClick={() => navigate("/admin/providers")}>Providers</button>
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
									<th className="text-left px-4 py-3 font-semibold text-gray-700">Blocked</th>
									<th className="text-left px-4 py-3 font-semibold text-gray-700">Actions</th>
								</tr>
							</thead>
							<tbody>
								{users.map((u) => (
									<tr key={u._id} className="border-t border-gray-100">
										<td className="px-4 py-3 font-medium text-gray-900">{u.username}</td>
										<td className="px-4 py-3 text-gray-700">{u.email}</td>
										<td className="px-4 py-3 text-gray-700">{u.isBlocked ? "Yes" : "No"}</td>
										<td className="px-4 py-3">
											<button
												className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
												onClick={() => handleToggleBlock(u._id, !u.isBlocked)}
											>
												{u.isBlocked ? "Unblock" : "Block"}
											</button>
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
