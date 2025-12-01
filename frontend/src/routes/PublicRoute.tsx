import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("auth_token");
  const user = JSON.parse(localStorage.getItem("auth_user") || "null");

  if (token && user) {
    if (user.role === "service_provider") return <Navigate to="/provider/home" replace />;
    if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/user/home" replace />;
  }

  return <>{children}</>;
}
