"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongodb_1 = require("./config/mongodb");
const env_1 = require("./config/env");
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
(0, mongodb_1.connectDB)().then(() => {
    console.log("Mongo connected");
}).catch((err) => {
    console.error("Mongo connect error:", err);
    process.exit(1);
});
app.use("/api/auth", auth_route_1.default);
app.use((err, _req, res, _next) => {
    console.error("Error handler:", err === null || err === void 0 ? void 0 : err.message);
    res.status(err.status || 400).json({
        success: false,
        message: err.message || "Something went wrong.",
    });
});
app.listen(env_1.env.PORT, () => {
    console.log(`Server running on ${env_1.env.PORT}`);
    console.log("Stripe webhook path: POST /api/payments/webhook");
    console.log("Socket.IO server running!");
});
