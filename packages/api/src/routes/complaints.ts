import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db/prisma";
import { authenticate, requireRole } from "../middleware/auth";
import { ok, created, paginated, notFound, forbidden } from "../utils/response";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

const router = Router();

const uploadDir = process.env.UPLOAD_DIR ?? "./uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg","image/png","image/webp","application/pdf","audio/mpeg","audio/wav"];
    cb(null, allowed.includes(file.mimetype));
  },
});

const createSchema = z.object({
  operator: z.enum(["orange","free","expresso"]),
  category: z.enum(["network_outage","poor_quality","billing_error","unauthorized_charge","fraudulent_sva","contract_issue","number_portability","customer_service","other"]),
  subject: z.string().min(5).max(200),
  description: z.string().min(20).max(5000),
  region: z.enum(["dakar","thies","saint_louis","ziguinchor","tambacounda","kaolack","louga","fatick","kolda","matam","kaffrine","kedougou","sedhiou"]),
  attachmentIds: z.array(z.string().uuid()).optional(),
});

function generateReference(): string {
  const year = new Date().getFullYear();
  const num = String(Math.floor(Math.random() * 99999)).padStart(5, "0");
  return `ARTP-${year}-${num}`;
}

// POST /api/complaints — Déposer une plainte
router.post("/", authenticate, async (req, res) => {
  const body = createSchema.parse(req.body);

  const complaint = await prisma.complaint.create({
    data: {
      reference: generateReference(),
      userId: req.user!.userId,
      ...body,
      attachmentIds: undefined,
      events: {
        create: [{
          status: "submitted",
          message: `Votre plainte a été enregistrée avec succès. Un agent ARTP va l'examiner sous 48h ouvrables.`,
        }],
      },
      ...(body.attachmentIds?.length && {
        attachments: { connect: body.attachmentIds.map((id) => ({ id })) },
      }),
    },
    include: { events: true, attachments: true },
  });

  created(res, complaint, `Plainte enregistrée — Référence : ${complaint.reference}`);
});

// GET /api/complaints/me — Mes plaintes
router.get("/me", authenticate, async (req, res) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);
  const skip = (page - 1) * limit;

  const [complaints, total] = await prisma.$transaction([
    prisma.complaint.findMany({
      where: { userId: req.user!.userId },
      include: { events: { orderBy: { createdAt: "desc" } }, attachments: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.complaint.count({ where: { userId: req.user!.userId } }),
  ]);

  paginated(res, complaints, total, page, limit);
});

// GET /api/complaints/:id — Détail d'une plainte
router.get("/:id", authenticate, async (req, res) => {
  const complaint = await prisma.complaint.findUnique({
    where: { id: req.params.id },
    include: { events: { orderBy: { createdAt: "asc" } }, attachments: true },
  });

  if (!complaint) return notFound(res);

  // Seul le propriétaire ou un agent/admin peut voir
  const isOwner = complaint.userId === req.user!.userId;
  const isAgent = ["agent_artp","admin"].includes(req.user!.role);
  if (!isOwner && !isAgent) return forbidden(res);

  ok(res, complaint);
});

// GET /api/complaints — Liste pour agents ARTP (tous)
router.get("/", authenticate, requireRole("agent_artp","admin"), async (req, res) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const skip = (page - 1) * limit;
  const status = req.query.status as string | undefined;
  const operator = req.query.operator as string | undefined;

  const where: any = {};
  if (status) where.status = status;
  if (operator) where.operator = operator;

  const [complaints, total] = await prisma.$transaction([
    prisma.complaint.findMany({
      where,
      include: {
        events: { orderBy: { createdAt: "desc" }, take: 1 },
        attachments: true,
        user: { select: { phone: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.complaint.count({ where }),
  ]);

  paginated(res, complaints, total, page, limit);
});

// PATCH /api/complaints/:id/status — Mettre à jour le statut (agents)
router.patch("/:id/status", authenticate, requireRole("agent_artp","admin"), async (req, res) => {
  const schema = z.object({
    status: z.enum(["submitted","under_review","forwarded_to_operator","pending_response","resolved","closed","rejected"]),
    message: z.string().min(5).max(1000),
    resolution: z.string().max(2000).optional(),
  });
  const body = schema.parse(req.body);

  const complaint = await prisma.complaint.update({
    where: { id: req.params.id },
    data: {
      status: body.status,
      agentId: req.user!.userId,
      ...(body.resolution && { resolution: body.resolution }),
      ...(["resolved","closed"].includes(body.status) && { resolvedAt: new Date() }),
      events: {
        create: {
          status: body.status,
          message: body.message,
          agentId: req.user!.userId,
        },
      },
    },
    include: { events: { orderBy: { createdAt: "desc" } } },
  });

  ok(res, complaint, "Statut mis à jour");
});

// POST /api/complaints/upload — Upload de pièce jointe
router.post("/upload", authenticate, upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, error: "Fichier requis" });

  const attachment = await prisma.attachment.create({
    data: {
      filename: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
    },
  });

  created(res, attachment);
});

export default router;
