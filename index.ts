/**
 * Vercel entry - Express app as main handler (per Vercel Express docs).
 * Serves API + static frontend from a single deployment.
 */
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import app from "./backend/dist/app.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const staticDir = path.join(__dirname, "frontend", "dist");

// Serve static frontend (in production)
app.use(express.static(staticDir));

// SPA fallback - serve index.html for non-API routes
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(staticDir, "index.html"));
});

export default app;
