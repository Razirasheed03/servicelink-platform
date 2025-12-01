//routes/AppRoutes.tsx
import AuthPage from "@/pages/auth/Auth";
import HomePage from "@/pages/user/Home";
import VerifyOtpPage from "@/pages/auth/VerifyOtp";
import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/provider/homePage";

export const router = createBrowserRouter([
    {
        path: '/auth', element: <AuthPage />
    },
    {
        path: '/auth/verify-otp', element: <VerifyOtpPage />
    },
    {
        path: '/user/home', element: <HomePage />
    },
    {
        path: '/provider/home', element:<Home/>
    },
    {
        path: '/', element: <HomePage />
    },
]);