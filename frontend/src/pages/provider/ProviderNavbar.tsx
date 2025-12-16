import { Bell } from "lucide-react";
import { useAuth } from "@/context/authContext";
import { useNavigate } from "react-router-dom";

export default function ProviderNavbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="w-full bg-white/80 backdrop-blur shadow-sm px-6 py-3 flex items-center justify-between border-b border-gray-200">

            {/* Brand (Mobile only) */}
            <div className="md:hidden text-xl font-bold text-blue-600">
                Service<span className="text-indigo-600">Link</span>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">

                <button className="px-2 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50">
                    <Bell className="w-5 h-5 text-gray-600" />
                </button>

                <span className="text-sm text-gray-600">{user?.username}</span>

                <button
                    className="px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
                    onClick={async () => {
                        await logout();
                        navigate("/auth", { replace: true });
                    }}
                >
                    Logout
                </button>

                <button
                    className="px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50"
                    onClick={() => navigate("/")}
                >
                    Go to Site
                </button>
            </div>
        </div>
    );
}
