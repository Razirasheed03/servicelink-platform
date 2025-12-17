import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/mongodb";
import { env } from "./config/env";

import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:5173",  // Vite frontend default
    "http://localhost:5174",  // Vite frontend (if port in use)
    "http://localhost:3000",  // Alternative frontend port
    "http://localhost:4000",  // Backend (for testing)
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

connectDB()
  .then(() => console.log("Mongo connected"))
  .catch((err) => {
    console.error("Mongo connect error:", err);
    process.exit(1);
  });

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Global Error Handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("Error handler:", err?.message);
  res.status(err.status || 400).json({
    success: false,
    message: err.message || "Something went wrong.",
  });
});

app.listen(env.PORT, () => {
  console.log(`Server running on ${env.PORT}`);
});
