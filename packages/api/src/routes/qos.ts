import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db/prisma";
import { authenticate } from "../middleware/auth";
import { qosLimiter } from "../middleware/rateLimit";
import { ok, created, paginated } from "../utils/response";

const router = Router();

const operatorSchema = z.enum(["orange", "free", "expresso"]);
const networkTypeSchema = z.enum(["G2", "G3", "G4", "G4_PLUS", "G5", "wifi"]);
const regionSchema = z.enum(["dakar","thies","saint_louis","ziguinchor","tambacounda","kaolack","louga","fatick","kolda","matam","kaffrine","kedougou","sedhiou"]);

const measureSchema = z.object({
  operator: operatorSchema,
  networkType: networkTypeSchema,
  downloadSpeed: z.number().min(0).max(10000),
  uploadSpeed: z.number().min(0).max(10000),
  latency: z.number().min(0).max(10000),
  jitter: z.number().min(0).max(1000),
  packetLoss: z.number().min(0).max(100),
  signalStrength: z.number().min(-150).max(0),
  mosScore: z.number().min(1).max(5).optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  region: regionSchema,
  address: z.string().max(500).optional(),
  isBlindSpot: z.boolean().default(false),
  deviceModel: z.string().max(100).optional(),
  appVersion: z.string().default("1.0.0"),
});

// POST /api/qos — Soumettre une mesure
router.post("/", authenticate, qosLimiter, async (req, res) => {
  const data = measureSchema.parse(req.body);
  const measure = await prisma.qosMeasure.create({
    data: { ...data, userId: req.user!.userId },
  });
  created(res, measure, "Mesure enregistrée avec succès");
});

// GET /api/qos/me — Mes mesures
router.get("/me", authenticate, async (req, res) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const skip = (page - 1) * limit;

  const [measures, total] = await prisma.$transaction([
    prisma.qosMeasure.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.qosMeasure.count({ where: { userId: req.user!.userId } }),
  ]);

  paginated(res, measures, total, page, limit);
});

// GET /api/qos/map — Points de couverture pour la carte
router.get("/map", async (req, res) => {
  const operator = req.query.operator as string | undefined;
  const region = req.query.region as string | undefined;

  const where: any = {};
  if (operator) where.operator = operator;
  if (region) where.region = region;

  // Agréger par zone géographique (grille 0.01 degré)
  const measures = await prisma.qosMeasure.findMany({
    where,
    select: {
      latitude: true,
      longitude: true,
      operator: true,
      networkType: true,
      downloadSpeed: true,
      signalStrength: true,
    },
    orderBy: { createdAt: "desc" },
    take: 5000,
  });

  ok(res, measures);
});

// GET /api/qos/stats — Statistiques par opérateur
router.get("/stats", async (req, res) => {
  const region = req.query.region as string | undefined;
  const days = Number(req.query.days ?? 30);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const where: any = { createdAt: { gte: since } };
  if (region) where.region = region;

  const stats = await prisma.qosMeasure.groupBy({
    by: ["operator"],
    where,
    _avg: {
      downloadSpeed: true,
      uploadSpeed: true,
      latency: true,
      mosScore: true,
    },
    _count: { id: true },
    _sum: { isBlindSpot: true },
  });

  const formatted = stats.map((s) => ({
    operator: s.operator,
    avgDownload: Math.round((s._avg.downloadSpeed ?? 0) * 10) / 10,
    avgUpload: Math.round((s._avg.uploadSpeed ?? 0) * 10) / 10,
    avgLatency: Math.round(s._avg.latency ?? 0),
    avgMos: Math.round((s._avg.mosScore ?? 0) * 10) / 10,
    measureCount: s._count.id,
    blindSpotCount: Number(s._sum.isBlindSpot ?? 0),
  }));

  ok(res, formatted);
});

// GET /api/qos/ranking — Classement des opérateurs
router.get("/ranking", async (req, res) => {
  const days = Number(req.query.days ?? 30);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const stats = await prisma.qosMeasure.groupBy({
    by: ["operator"],
    where: { createdAt: { gte: since } },
    _avg: { downloadSpeed: true, latency: true, mosScore: true },
    _count: { id: true },
    orderBy: { _avg: { downloadSpeed: "desc" } },
  });

  const ranked = stats.map((s, i) => {
    const dl = s._avg.downloadSpeed ?? 0;
    const lat = s._avg.latency ?? 999;
    const mos = s._avg.mosScore ?? 1;
    // Score composite: 40% débit + 30% latence + 30% MOS
    const score = Math.round(
      (Math.min(dl / 50, 1) * 40) +
      (Math.max(0, 1 - lat / 200) * 30) +
      ((mos - 1) / 3.5 * 30)
    );
    return {
      rank: i + 1,
      operator: s.operator,
      score,
      avgDownload: Math.round(dl * 10) / 10,
      avgLatency: Math.round(lat),
      avgMos: Math.round(mos * 10) / 10,
      measureCount: s._count.id,
    };
  });

  ok(res, ranked);
});

// GET /api/qos/blind-spots — Zones blanches signalées
router.get("/blind-spots", async (req, res) => {
  const region = req.query.region as string | undefined;

  const where: any = { isBlindSpot: true };
  if (region) where.region = region;

  const blindSpots = await prisma.qosMeasure.findMany({
    where,
    select: { latitude: true, longitude: true, operator: true, region: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 1000,
  });

  ok(res, blindSpots);
});

export default router;
