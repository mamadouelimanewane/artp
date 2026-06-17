import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db/prisma";
import { signToken } from "../utils/jwt";
import { ok, created, badRequest, unauthorized } from "../utils/response";
import { authLimiter } from "../middleware/rateLimit";
import { authenticate } from "../middleware/auth";
import { logger } from "../utils/logger";

const router = Router();

const phoneSchema = z.string().regex(/^\+221[0-9]{9}$/, "Numéro de téléphone sénégalais invalide (+221XXXXXXXXX)");
const regionSchema = z.enum(["dakar","thies","saint_louis","ziguinchor","tambacounda","kaolack","louga","fatick","kolda","matam","kaffrine","kedougou","sedhiou"]);

// POST /api/auth/request-otp
router.post("/request-otp", authLimiter, async (req, res) => {
  const { phone } = z.object({ phone: phoneSchema }).parse(req.body);

  const otp = process.env.NODE_ENV === "development"
    ? "123456"
    : String(Math.floor(100000 + Math.random() * 900000));

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  // Upsert user + create OTP
  const user = await prisma.user.upsert({
    where: { phone },
    update: {},
    create: { phone, region: "dakar" },
  });

  await prisma.otpCode.create({ data: { userId: user.id, code: otp, expiresAt } });

  // En production: envoyer via Orange SMS API
  logger.info(`OTP pour ${phone}: ${otp}`);

  ok(res, { message: "Code OTP envoyé par SMS" });
});

// POST /api/auth/verify-otp
router.post("/verify-otp", authLimiter, async (req, res) => {
  const schema = z.object({
    phone: phoneSchema,
    otp: z.string().length(6),
    name: z.string().min(2).max(100).optional(),
    region: regionSchema.optional(),
    operator: z.enum(["orange","free","expresso"]).optional(),
  });
  const body = schema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { phone: body.phone } });
  if (!user) return unauthorized(res, "Utilisateur introuvable");

  const otpRecord = await prisma.otpCode.findFirst({
    where: {
      userId: user.id,
      code: body.otp,
      used: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!otpRecord) return unauthorized(res, "Code OTP invalide ou expiré");

  // Marquer OTP comme utilisé
  await prisma.otpCode.update({ where: { id: otpRecord.id }, data: { used: true } });

  // Mettre à jour le profil si c'est la première connexion
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      ...(body.name && { name: body.name }),
      ...(body.region && { region: body.region }),
      ...(body.operator && { operator: body.operator }),
    },
  });

  const token = signToken(updatedUser);
  ok(res, { token, user: { id: updatedUser.id, phone: updatedUser.phone, name: updatedUser.name, role: updatedUser.role, region: updatedUser.region, operator: updatedUser.operator } });
});

// GET /api/auth/me
router.get("/me", authenticate, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: { id: true, phone: true, email: true, name: true, role: true, region: true, operator: true, isVerified: true, createdAt: true },
  });
  if (!user) return unauthorized(res);
  ok(res, user);
});

// PATCH /api/auth/profile
router.patch("/profile", authenticate, async (req, res) => {
  const schema = z.object({
    name: z.string().min(2).max(100).optional(),
    email: z.string().email().optional(),
    region: regionSchema.optional(),
    operator: z.enum(["orange","free","expresso"]).optional(),
    fcmToken: z.string().optional(),
  });
  const data = schema.parse(req.body);

  const user = await prisma.user.update({
    where: { id: req.user!.userId },
    data,
    select: { id: true, phone: true, email: true, name: true, role: true, region: true, operator: true },
  });
  ok(res, user);
});

export default router;
