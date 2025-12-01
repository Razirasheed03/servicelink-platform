// src/config/redisClient.ts
import { createClient } from "redis";

const redisClient = createClient();

redisClient.on("error", (err) => console.error("❌ Redis Client Error", err));

(async () => {
  await redisClient.connect();
  console.log("✅ Redis connected");
})();

export default redisClient;