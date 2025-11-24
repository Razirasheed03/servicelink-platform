import AuthPage from "@/pages/auth/Auth";
import HomePage from "@/pages/user/Home";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
    {
        path: '/auth', element: <AuthPage />
    },
    {
        path: '/home', element: <HomePage />
    },
]);