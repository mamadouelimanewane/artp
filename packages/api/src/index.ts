import "express-async-errors";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";

import { router } from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import { logger } from "./utils/logger";
import { prisma } from "./db/prisma";

const app = express();
const PORT = process.env.PORT ?? process.env.API_PORT ?? 3001;

// ── Security ────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  credentials: true,
}));

// ── Parsing & compression ───────────────────────────────────────
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Logging ─────────────────────────────────────────────────────
app.use(morgan("combined", { stream: { write: (msg) => logger.http(msg.trim()) } }));

// ── Health check ────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "artp-api", version: "1.0.0", timestamp: new Date().toISOString() });
});

// ── Routes ──────────────────────────────────────────────────────
app.use("/api", router);

// ── 404 ─────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: "Route introuvable", code: "NOT_FOUND" });
});

// ── Error handler ───────────────────────────────────────────────
app.use(errorHandler);

// ── Start ───────────────────────────────────────────────────────
async function main() {
  try {
    await prisma.$connect();
    logger.info("Base de données connectée");

    app.listen(PORT, () => {
      logger.info(`ARTP API démarrée sur http://localhost:${PORT}`);
      logger.info(`Health: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error("Erreur de démarrage", error);
    process.exit(1);
  }
}

main();

process.on("SIGTERM", async () => {
  logger.info("Arrêt gracieux...");
  await prisma.$disconnect();
  process.exit(0);
});
