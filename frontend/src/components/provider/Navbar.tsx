import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import { ChevronDown, LogOut, ExternalLink, User } from "lucide-react";

export default function ProviderNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full h-14 bg-white border-b border-[#EEF2F7] flex items-center justify-between px-6">
      
      {/* Left: Brand */}
      <div className="flex items-center gap-2">
        <div className="text-xl font-extrabold">
          <span className="text-blue-600">Service</span>
          <span className="text-indigo-600">Link</span>
        </div>
        <span className="hidden sm:inline text-xs text-gray-500 ml-2">
          Provider Portal
        </span>
      </div>

      {/* Right: User Menu */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition"
        >
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600">
            {user?.username?.[0]?.toUpperCase() || "U"}
          </div>

          <div className="hidden md:flex flex-col items-start leading-tight">
            <span className="text-sm font-medium text-gray-800">
              {user?.username}
            </span>
            <span className="text-xs text-gray-500">Service Provider</span>
          </div>

          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
            <button
              onClick={() => navigate("/provider/profile")}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-t-xl"
            >
              <User className="w-4 h-4" />
              Profile
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
            >
              <ExternalLink className="w-4 h-4" />
              Home
            </button>

            <button
              onClick={async () => {
                await logout();
                navigate("/auth", { replace: true });
              }}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-b-xl"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
