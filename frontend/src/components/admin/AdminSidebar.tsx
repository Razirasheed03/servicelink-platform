import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Home, Users, ClipboardList, LogOut } from "lucide-react";
import { useAuth } from "@/context/authContext";

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const items = [
    { key: "dashboard", label: "Dashboard", icon: Home, to: "/admin/dashboard" },
    { key: "providers", label: "Providers", icon: ClipboardList, to: "/admin/providers" },
    { key: "users", label: "Users", icon: Users, to: "/admin/users" },
  ];

  return (
    <aside className="hidden md:flex md:w-64 min-h-screen border-r border-[#EEF2F7] bg-white/90 backdrop-blur">
      <div className="w-full p-4 flex flex-col h-full">
        
        {/* Brand */}
        <div className="px-2 py-3 mb-3">
          <div className="text-2xl font-extrabold">
            <span className="text-blue-600">Service</span>
            <span className="text-indigo-600">Link</span>
          </div>
          <div className="text-xs text-gray-500 mt-0.5">
            Admin Portal
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-2 space-y-1 flex-1">
          {items.map(({ key, label, icon: Icon, to }) => {
            const isActive =
              location.pathname === to ||
              location.pathname.startsWith(`${to}/`);

            return (
              <NavLink key={key} to={to}>
                <div
                  className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                    isActive
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </div>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={async () => {
            await logout();
            navigate("/auth", { replace: true });
          }}
          className="mt-auto w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
