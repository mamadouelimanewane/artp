import type { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";
import { Prisma } from "../generated/client";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  logger.error(`${req.method} ${req.path} — ${err.message}`, { stack: err.stack });

  // Prisma unique constraint
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({
        success: false,
        error: "Cette ressource existe déjà",
        code: "CONFLICT",
      });
    }
    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        error: "Ressource introuvable",
        code: "NOT_FOUND",
      });
    }
  }

  // Zod validation errors
  if (err.name === "ZodError") {
    return res.status(400).json({
      success: false,
      error: "Données invalides",
      code: "VALIDATION_ERROR",
      details: (err as any).errors,
    });
  }

  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === "production"
      ? "Erreur interne du serveur"
      : err.message,
    code: "INTERNAL_ERROR",
  });
}
