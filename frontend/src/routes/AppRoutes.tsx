// routes/AppRoutes.tsx
import AuthPage from "@/pages/auth/Auth";
import HomePage from "@/pages/user/Home";
import VerifyOtpPage from "@/pages/auth/VerifyOtp";
import { createBrowserRouter } from "react-router-dom";
import ProviderHome from "@/pages/provider/HomePage";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";

export const router = createBrowserRouter([
  // PUBLIC AUTH PAGE
  {
    path: "/auth",
    element: (
      <PublicRoute>
        <AuthPage />
      </PublicRoute>
    ),
  },

  // PUBLIC OTP PAGE
  {
    path: "/auth/verify-otp",
    element: <VerifyOtpPage />,
  },

  // USER HOME (only user allowed)
  {
    path: "/user/home",
    element: (
      <ProtectedRoute allowedRoles={["user"]}>
        <HomePage />
      </ProtectedRoute>
    ),
  },

  // PROVIDER HOME (only service provider allowed)
  {
    path: "/provider/home",
    element: (
      <ProtectedRoute allowedRoles={["service_provider"]}>
        <ProviderHome />
      </ProtectedRoute>
    ),
  },

  // DEFAULT ROUTE → user home (protected)
  {
    path: "/",
    element: (
      <ProtectedRoute allowedRoles={["user"]}>
        <HomePage />
      </ProtectedRoute>
    ),
  },
]);
