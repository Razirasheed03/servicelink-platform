import dotenv from "dotenv";
dotenv.config();

const requireEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const env = {
  /* Server */
  PORT: requireEnvVar("PORT"),
  BACKEND_URL: requireEnvVar("BACKEND_URL"),
  FRONTEND_URL: requireEnvVar("FRONTEND_URL"),

  /* Database */
  MONGO_URI: requireEnvVar("MONGO_URI"),

  /* Auth */
  JWT_SECRET: requireEnvVar("JWT_SECRET"),
  REFRESH_SECRET: requireEnvVar("REFRESH_SECRET"),
  REFRESH_TOKEN_COOKIE_NAME: requireEnvVar("REFRESH_TOKEN_COOKIE_NAME"),
  REFRESH_TOKEN_EXPIRY: requireEnvVar("REFRESH_TOKEN_EXPIRY"),
  COOKIE_SAME_SITE: requireEnvVar("COOKIE_SAME_SITE"),

  /* Email */
  EMAIL_USER: requireEnvVar("EMAIL_USER"),
  EMAIL_PASS: requireEnvVar("EMAIL_PASS"),

  /* Google OAuth */
  GOOGLE_CLIENT_ID: requireEnvVar("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: requireEnvVar("GOOGLE_CLIENT_SECRET"),
  GOOGLE_REDIRECT_URI: requireEnvVar("GOOGLE_REDIRECT_URI"),

  /* Cloudinary */
  CLOUDINARY_CLOUD_NAME: requireEnvVar("CLOUDINARY_CLOUD_NAME"),
  CLOUDINARY_API_KEY: requireEnvVar("CLOUDINARY_API_KEY"),
  CLOUDINARY_API_SECRET: requireEnvVar("CLOUDINARY_API_SECRET"),

  /* Stripe – Subscriptions */
  STRIPE_SECRET_KEY: requireEnvVar("STRIPE_SECRET_KEY"),
  STRIPE_WEBHOOK_SECRET: requireEnvVar("STRIPE_WEBHOOK_SECRET"),
  STRIPE_PROVIDER_PRICE_ID: requireEnvVar("STRIPE_PROVIDER_PRICE_ID"),
};
