import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/mongodb";
import { env } from "./config/env";
import { UserRepository } from "./repositories/implements/user.repository";

import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import reviewRoutes from "./routes/review.route";
import adminRoutes from "./routes/admin.route";
import providerRoutes from "./routes/provider.route";
import stripeWebhookRoutes from "./routes/stripe.route";

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

// Stripe webhook must receive raw body for signature verification
app.use("/api/stripe", express.raw({ type: "application/json" }), stripeWebhookRoutes);

app.use(express.json());
app.use(cookieParser());

connectDB()
  .then(() => console.log("Mongo connected"))
  .catch((err) => {
    console.error("Mongo connect error:", err);
    process.exit(1);
  });

// Periodic subscription expiry cleanup (optional cron)
const userRepoForCron = new UserRepository();
setInterval(async () => {
  try {
    await userRepoForCron.markProvidersExpired(new Date());
  } catch (err) {
    console.error("Failed to run expiry cleanup", (err as any)?.message);
  }
}, 6 * 60 * 60 * 1000); // every 6 hours

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/provider", providerRoutes);

// Global Error Handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("Error handler:", err?.message);
  res.status(err.status || err.statusCode || 400).json({
    success: false,
    message: err.message || "Something went wrong.",
  });
});

app.listen(env.PORT, () => {
  console.log(`Server running on ${env.PORT}`);
});
