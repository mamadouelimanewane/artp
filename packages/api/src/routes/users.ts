import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db/prisma";
import { authenticate, requireRole } from "../middleware/auth";
import { ok, paginated, notFound, badRequest } from "../utils/response";

const router = Router();

// GET /api/users — Liste des utilisateurs (admin uniquement)
router.get("/", authenticate, requireRole("admin"), async (req, res) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const skip = (page - 1) * limit;
  const role = req.query.role as string | undefined;
  const search = req.query.search as string | undefined;

  const where: any = {};
  if (role) where.role = role;
  if (search) {
    where.OR = [
      { phone: { contains: search } },
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        phone: true,
        email: true,
        name: true,
        role: true,
        region: true,
        operator: true,
        isVerified: true,
        createdAt: true,
        _count: { select: { qosMeasures: true, complaints: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  paginated(res, users, total, page, limit);
});

// GET /api/users/:id — Détail utilisateur (admin)
router.get("/:id", authenticate, requireRole("admin"), async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    select: {
      id: true,
      phone: true,
      email: true,
      name: true,
      role: true,
      region: true,
      operator: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { qosMeasures: true, complaints: true } },
    },
  });

  if (!user) return notFound(res, "Utilisateur introuvable");
  ok(res, user);
});

// PATCH /api/users/:id/role — Changer le rôle d'un utilisateur (admin)
router.patch("/:id/role", authenticate, requireRole("admin"), async (req, res) => {
  const schema = z.object({
    role: z.enum(["citizen", "agent_artp", "admin", "operator"]),
  });
  const { role } = schema.parse(req.body);

  // Empêcher l'admin de se rétrograder lui-même
  if (req.params.id === req.user!.userId && role !== "admin") {
    return badRequest(res, "Vous ne pouvez pas changer votre propre rôle");
  }

  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { role },
    select: { id: true, phone: true, name: true, role: true },
  });

  ok(res, user, `Rôle mis à jour : ${role}`);
});

// GET /api/users/agents — Liste des agents ARTP (pour assignation de plaintes)
router.get("/agents/list", authenticate, requireRole("admin", "agent_artp"), async (_req, res) => {
  const agents = await prisma.user.findMany({
    where: { role: { in: ["agent_artp", "admin"] } },
    select: { id: true, name: true, phone: true, email: true },
    orderBy: { name: "asc" },
  });
  ok(res, agents);
});

export default router;
