import dotenv from "dotenv";

dotenv.config();

export function getEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env: ${key}`);
  return val;
}

export const env = {
  JWT_SECRET: getEnv("JWT_SECRET"),
  DATABASE_URL: getEnv("DATABASE_URL"),
  PORT: process.env.PORT || "3001",
};
