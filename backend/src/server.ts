import express from "express";

const app = express();
import { env } from "./config/env";

app.listen(env.PORT, () => {
  console.log(`Server running on ${env.PORT}`);
  console.log("Stripe webhook path: POST /api/payments/webhook");
  console.log("Socket.IO server running!");
});