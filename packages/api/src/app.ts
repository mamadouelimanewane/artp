import "express-async-errors";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";

import { router } from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import { logger } from "./utils/logger";

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(",") ?? ["http://localhost:5173"],
  credentials: true,
}));
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined", { stream: { write: (msg) => logger.http(msg.trim()) } }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "artp-api", version: "1.0.0", timestamp: new Date().toISOString() });
});

app.use("/api", router);

app.use((_req, res) => {
  res.status(404).json({ success: false, error: "Route introuvable", code: "NOT_FOUND" });
});

app.use(errorHandler);

export default app;
