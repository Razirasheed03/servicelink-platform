import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex min-h-screen">
			<AdminSidebar />
			<div className="flex-1 flex flex-col">
				<div className="p-6 bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 flex-1">
					<div className="max-w-7xl mx-auto">{children}</div>
				</div>
			</div>
		</div>
	);
}
