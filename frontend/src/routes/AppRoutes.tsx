import AuthPage from "@/pages/auth/Auth";
import HomePage from "@/pages/user/Home";
import VerifyOtpPage from "@/pages/auth/VerifyOtp";
import { createBrowserRouter } from "react-router-dom";
import ProviderHome from "@/pages/provider/HomePage";
import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoute";
import ServiceProviderProfilePage from "@/pages/provider/Profile";
import ServiceProviderDetailPage from "@/pages/user/DetailPage";
import ProviderReviewsPage from "@/pages/provider/Reviews";
import ProvidersPage from "@/pages/user/Providers";
import AboutPage from "@/pages/user/AboutPage";

export const router = createBrowserRouter([
  {
    path: "/auth",
    element: <PublicRoute> <AuthPage /> </PublicRoute>
  },

  {
    path: "/auth/verify-otp",
    element: <VerifyOtpPage />,
  },

  {
    path: "/",
    element: <ProtectedRoute allowedRoles={["user"]}> <HomePage /> </ProtectedRoute>
  },

  {
    path: "/user/home",
    element: <ProtectedRoute allowedRoles={["user"]}> <HomePage /> </ProtectedRoute>
  },

  {
    path: "/detail/:id",
    element: <ProtectedRoute allowedRoles={["user"]}> <ServiceProviderDetailPage /> </ProtectedRoute>
  },

	{
		path: "/user/providers",
		element: <ProtectedRoute allowedRoles={["user"]}> <ProvidersPage /> </ProtectedRoute>
	},
	{
		path: "/user/about",
		element: <ProtectedRoute allowedRoles={["user"]}> <AboutPage /> </ProtectedRoute>
	},

  {
    path: "/provider/home",
    element: <ProtectedRoute allowedRoles={["service_provider"]}> <ProviderHome /> </ProtectedRoute>
  },

  {
    path: "/provider/profile",
    element: <ProtectedRoute allowedRoles={["service_provider"]}> <ServiceProviderProfilePage /> </ProtectedRoute>
  },

	{
		path: "/provider/reviews",
		element: <ProtectedRoute allowedRoles={["service_provider"]}> <ProviderReviewsPage /> </ProtectedRoute>
	},
]);