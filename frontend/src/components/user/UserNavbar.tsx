import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Wrench,
  User,
  Menu,
  X,
  LogOut,
} from "lucide-react";

interface UserNavbarProps {
  user?: {
    username?: string;
  };
}

export default function UserNavbar({ user }: UserNavbarProps) {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-linear-to-br from-blue-600 to-indigo-600 p-2 rounded-xl">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <h1
              onClick={() => navigate("/user/home")}
              className="cursor-pointer text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            >
              ServiceLink
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => navigate("/user/home")}
              className="nav-btn"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/user/providers")}
              className="nav-btn"
            >
              Services
            </button>
            <button
            onClick={()=>navigate("/user/about")}
            className="nav-btn">About</button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
              <User className="w-5 h-5 text-gray-700" />
              <span className="font-medium text-gray-700">
                {user?.username || "Profile"}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-2">
              <button onClick={() => navigate("/user/home")} className="mobile-nav-btn">Home</button>
              <button onClick={() => navigate("/user/providers")} className="mobile-nav-btn">Services</button>
              <button className="mobile-nav-btn">About</button>
              <button onClick={handleLogout} className="mobile-nav-btn text-red-600">Logout</button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
