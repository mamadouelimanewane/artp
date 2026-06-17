import jwt from "jsonwebtoken";
import type { User } from "@prisma/client";

const SECRET = process.env.JWT_SECRET ?? "changeme";
const EXPIRES = process.env.JWT_EXPIRES_IN ?? "7d";

export interface JwtPayload {
  userId: string;
  phone: string;
  role: string;
}

export function signToken(user: Pick<User, "id" | "phone" | "role">): string {
  return jwt.sign(
    { userId: user.id, phone: user.phone, role: user.role } satisfies JwtPayload,
    SECRET,
    { expiresIn: EXPIRES as any }
  );
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, SECRET) as JwtPayload;
}
