import { Router } from "express";
import { prisma } from "../db/prisma";
import { authenticate, requireRole } from "../middleware/auth";
import { ok } from "../utils/response";

const router = Router();

// GET /api/stats/dashboard — Dashboard ARTP (agents/admin)
router.get("/dashboard", authenticate, requireRole("agent_artp","admin"), async (req, res) => {
  const days = Number(req.query.days ?? 30);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    totalMeasures,
    totalComplaints,
    complaintsByStatus,
    complaintsByOperator,
    measuresByOperator,
    recentComplaints,
    blindSpotCount,
  ] = await prisma.$transaction([
    prisma.user.count({ where: { role: "citizen" } }),
    prisma.qosMeasure.count({ where: { createdAt: { gte: since } } }),
    prisma.complaint.count({ where: { createdAt: { gte: since } } }),
    prisma.complaint.groupBy({
      by: ["status"],
      where: { createdAt: { gte: since } },
      orderBy: { _count: { status: "desc" } },
      _count: { _all: true },
    }),
    prisma.complaint.groupBy({
      by: ["operator"],
      where: { createdAt: { gte: since } },
      orderBy: { _count: { operator: "desc" } },
      _count: { _all: true },
    }),
    prisma.qosMeasure.groupBy({
      by: ["operator"],
      where: { createdAt: { gte: since } },
      orderBy: { _count: { operator: "desc" } },
      _avg: { downloadSpeed: true, latency: true },
      _count: { _all: true },
    }),
    prisma.complaint.findMany({
      where: { createdAt: { gte: since } },
      include: { user: { select: { phone: true, name: true } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.qosMeasure.count({ where: { isBlindSpot: true, createdAt: { gte: since } } }),
  ]);

  ok(res, {
    period: `${days} derniers jours`,
    kpis: {
      totalUsers,
      totalMeasures,
      totalComplaints,
      blindSpotCount,
    },
    complaintsByStatus: Object.fromEntries(complaintsByStatus.map((s) => [s.status, (s._count as any)._all ?? 0])),
    complaintsByOperator: Object.fromEntries(complaintsByOperator.map((s) => [s.operator, (s._count as any)._all ?? 0])),
    qosByOperator: measuresByOperator.map((s) => ({
      operator: s.operator,
      avgDownload: Math.round((s._avg?.downloadSpeed ?? 0) * 10) / 10,
      avgLatency: Math.round(s._avg?.latency ?? 0),
      measureCount: (s._count as any)._all ?? 0,
    })),
    recentComplaints,
  });
});

// GET /api/stats/public — Stats publiques (sans auth)
router.get("/public", async (_req, res) => {
  const [totalMeasures, totalComplaints, blindSpots] = await prisma.$transaction([
    prisma.qosMeasure.count(),
    prisma.complaint.count({ where: { status: "resolved" } }),
    prisma.qosMeasure.count({ where: { isBlindSpot: true } }),
  ]);

  ok(res, {
    totalMeasures,
    resolvedComplaints: totalComplaints,
    blindSpotsReported: blindSpots,
    message: "Données publiques Mon Réseau SN — ARTP Sénégal",
  });
});

export default router;
