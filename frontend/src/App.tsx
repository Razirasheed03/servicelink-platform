import { RouterProvider } from "react-router-dom";
import { router } from "./routes/AppRoutes";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/authContext";

function App() {
  return (
    <AuthProvider>
      <Toaster />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
