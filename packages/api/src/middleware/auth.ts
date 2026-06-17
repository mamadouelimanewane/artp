import type { Request, Response, NextFunction } from "express";
import { verifyToken, type JwtPayload } from "../utils/jwt";
import { unauthorized, forbidden } from "../utils/response";
import type { UserRole } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return unauthorized(res);
  }
  try {
    req.user = verifyToken(header.slice(7));
    next();
  } catch {
    unauthorized(res, "Token invalide ou expiré");
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role as UserRole)) {
      return forbidden(res);
    }
    next();
  };
}
