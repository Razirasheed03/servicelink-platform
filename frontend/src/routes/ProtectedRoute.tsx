import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const token = localStorage.getItem("auth_token");
  const user = JSON.parse(localStorage.getItem("auth_user") || "null");

  // Not logged in → redirect to auth
  if (!token || !user) {
    return <Navigate to="/auth" replace />;
  }

  // Role mismatch → redirect to correct home
  if (!allowedRoles.includes(user.role)) {
    if (user.role === "service_provider") return <Navigate to="/provider/home" replace />;
    if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/user/home" replace />;
  }

  return <>{children}</>;
}
