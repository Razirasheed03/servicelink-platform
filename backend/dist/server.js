"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongodb_1 = require("./config/mongodb");
const env_1 = require("./config/env");
const user_repository_1 = require("./repositories/implements/user.repository");
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const review_route_1 = __importDefault(require("./routes/review.route"));
const admin_route_1 = __importDefault(require("./routes/admin.route"));
const provider_route_1 = __importDefault(require("./routes/provider.route"));
const stripe_route_1 = __importDefault(require("./routes/stripe.route"));
const app = (0, express_1.default)();
const corsOptions = {
    origin: [
        "http://localhost:5173", // Vite frontend default
        "http://localhost:5174", // Vite frontend (if port in use)
        "http://localhost:3000", // Alternative frontend port
        "http://localhost:4000", // Backend (for testing)
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
// Stripe webhook must receive raw body for signature verification
app.use("/api/stripe", express_1.default.raw({ type: "application/json" }), stripe_route_1.default);
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
(0, mongodb_1.connectDB)()
    .then(() => console.log("Mongo connected"))
    .catch((err) => {
    console.error("Mongo connect error:", err);
    process.exit(1);
});
// Periodic subscription expiry cleanup (optional cron)
const userRepoForCron = new user_repository_1.UserRepository();
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userRepoForCron.markProvidersExpired(new Date());
    }
    catch (err) {
        console.error("Failed to run expiry cleanup", err === null || err === void 0 ? void 0 : err.message);
    }
}), 6 * 60 * 60 * 1000); // every 6 hours
app.use("/api/auth", auth_route_1.default);
app.use("/api/user", user_route_1.default);
app.use("/api/reviews", review_route_1.default);
app.use("/api/admin", admin_route_1.default);
app.use("/api/provider", provider_route_1.default);
// Global Error Handler
app.use((err, _req, res, _next) => {
    console.error("Error handler:", err === null || err === void 0 ? void 0 : err.message);
    res.status(err.status || err.statusCode || 400).json({
        success: false,
        message: err.message || "Something went wrong.",
    });
});
app.listen(env_1.env.PORT, () => {
    console.log(`Server running on ${env_1.env.PORT}`);
});
