import type { Response } from "express";

export const ok = <T>(res: Response, data: T, message?: string) =>
  res.json({ success: true, data, ...(message && { message }) });

export const created = <T>(res: Response, data: T, message?: string) =>
  res.status(201).json({ success: true, data, ...(message && { message }) });

export const paginated = <T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number
) =>
  res.json({
    success: true,
    data,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });

export const notFound = (res: Response, message = "Ressource introuvable") =>
  res.status(404).json({ success: false, error: message, code: "NOT_FOUND" });

export const badRequest = (res: Response, error: string, details?: object) =>
  res.status(400).json({ success: false, error, code: "BAD_REQUEST", details });

export const unauthorized = (res: Response, error = "Non autorisé") =>
  res.status(401).json({ success: false, error, code: "UNAUTHORIZED" });

export const forbidden = (res: Response, error = "Accès refusé") =>
  res.status(403).json({ success: false, error, code: "FORBIDDEN" });
