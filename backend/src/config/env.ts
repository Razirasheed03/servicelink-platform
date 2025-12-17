import dotenv from "dotenv";
dotenv.config()

const requireEnvVar = (key: string) => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing the environment variable ${key}`)
    }
    return value
}

export const env = {
    PORT: requireEnvVar("PORT"),
    MONGO_URI: requireEnvVar("MONGO_URI"),
}