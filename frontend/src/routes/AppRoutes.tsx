import AuthPage from "@/pages/auth/Auth";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
    {
        path: '/auth', element: <AuthPage />
    },
]);