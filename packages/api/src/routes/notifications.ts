import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db/prisma";
import { authenticate, requireRole } from "../middleware/auth";
import { ok, created } from "../utils/response";

const router = Router();

// GET /api/notifications — Mes notifications
router.get("/", authenticate, async (req, res) => {
  const notifications = await prisma.notification.findMany({
    where: {
      OR: [
        { userId: req.user!.userId },
        { userId: null }, // broadcasts
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  ok(res, notifications);
});

// PATCH /api/notifications/read-all — Marquer tout comme lu
router.patch("/read-all", authenticate, async (req, res) => {
  await prisma.notification.updateMany({
    where: { userId: req.user!.userId, isRead: false },
    data: { isRead: true },
  });
  ok(res, null, "Toutes les notifications marquées comme lues");
});

// PATCH /api/notifications/:id/read
router.patch("/:id/read", authenticate, async (req, res) => {
  await prisma.notification.update({
    where: { id: req.params.id },
    data: { isRead: true },
  });
  ok(res, null, "Notification lue");
});

// POST /api/notifications/broadcast — Envoyer une notification (admin)
router.post("/broadcast", authenticate, requireRole("admin","agent_artp"), async (req, res) => {
  const schema = z.object({
    type: z.enum(["complaint_update","maintenance","regulation_news","fraud_alert","qos_alert","system"]),
    title: z.string().min(3).max(100),
    body: z.string().min(5).max(500),
    userId: z.string().uuid().optional(),
    data: z.record(z.string()).optional(),
  });
  const { userId, ...data } = schema.parse(req.body);

  const notif = await prisma.notification.create({
    data: { ...data, ...(userId ? { userId } : {}) },
  });

  created(res, notif, "Notification envoyée");
});

export default router;
