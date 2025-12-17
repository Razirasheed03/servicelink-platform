import { NavLink, useLocation } from "react-router-dom";
import {
    Home,
    UserCog,
    Star,
} from "lucide-react";

export default function ProviderSidebar() {
    const location = useLocation();

    const items = [
        { key: "home", label: "Dashboard", icon: Home, to: "/provider/home" },
        { key: "reviews", label: "Reviews", icon: Star, to: "/provider/reviews" },
        { key: "profile", label: "Profile", icon: UserCog, to: "/provider/profile" },
    ];

    return (
        <aside className="hidden md:flex md:w-64 min-h-screen border-r border-[#EEF2F7] bg-white/90 backdrop-blur">
            <div className="w-full p-4 flex flex-col">
                {/* Brand */}
                <div className="px-2 py-3 mb-3">
                    <div className="text-2xl font-extrabold">
                        <span className="text-blue-600">Service</span>
                        <span className="text-indigo-600">Link</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">Provider Portal</div>
                </div>

                {/* Navigation */}
                <nav className="mt-2 space-y-1">
                    {items.map(({ key, label, icon: Icon, to }) => {
                        const isActive = location.pathname === to;
                        return (
                            <NavLink key={key} to={to}>
                                <div
                                    className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition
                                    ${
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
            </div>
        </aside>
    );
}
