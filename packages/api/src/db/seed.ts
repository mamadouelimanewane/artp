import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const admin = await prisma.user.upsert({
    where: { phone: "+221700000000" },
    update: {},
    create: {
      phone: "+221700000000",
      email: "admin@artp.sn",
      name: "Administrateur ARTP",
      role: "admin",
      region: "dakar",
      isVerified: true,
    },
  });

  const agent = await prisma.user.upsert({
    where: { phone: "+221700000001" },
    update: {},
    create: {
      phone: "+221700000001",
      email: "agent@artp.sn",
      name: "Agent ARTP Dakar",
      role: "agent_artp",
      region: "dakar",
      isVerified: true,
    },
  });

  const citizens = await Promise.all([
    prisma.user.upsert({
      where: { phone: "+221771234567" },
      update: {},
      create: {
        phone: "+221771234567",
        name: "Mamadou Diallo",
        role: "citizen",
        region: "dakar",
        operator: "orange",
        isVerified: true,
      },
    }),
    prisma.user.upsert({
      where: { phone: "+221781234567" },
      update: {},
      create: {
        phone: "+221781234567",
        name: "Fatou Ndiaye",
        role: "citizen",
        region: "thies",
        operator: "free",
        isVerified: true,
      },
    }),
  ]);

  const qosSamples = [
    { lat: 14.7167, lng: -17.4677, op: "orange", dl: 45.2, ul: 12.1, lat_ms: 32 },
    { lat: 14.7200, lng: -17.4600, op: "free",   dl: 22.8, ul: 8.5,  lat_ms: 48 },
    { lat: 14.6900, lng: -17.4500, op: "expresso", dl: 18.5, ul: 6.2, lat_ms: 65 },
    { lat: 14.7500, lng: -17.4900, op: "orange", dl: 38.7, ul: 10.3, lat_ms: 38 },
    { lat: 14.6700, lng: -17.4300, op: "free",   dl: 15.2, ul: 5.8,  lat_ms: 72 },
    { lat: 14.6800, lng: -17.4800, op: "expresso", dl: 12.1, ul: 4.0, lat_ms: 90, blindSpot: true },
  ];

  for (const s of qosSamples) {
    await prisma.qosMeasure.create({
      data: {
        userId: citizens[0].id,
        operator: s.op,
        networkType: "G4",
        downloadSpeed: s.dl,
        uploadSpeed: s.ul,
        latency: s.lat_ms,
        jitter: 5.2,
        packetLoss: 0.5,
        signalStrength: -75,
        mosScore: 3.8,
        latitude: s.lat,
        longitude: s.lng,
        region: "dakar",
        isBlindSpot: (s as any).blindSpot ?? false,
        appVersion: "1.0.0",
      },
    });
  }

  const existingC1 = await prisma.complaint.findUnique({ where: { reference: "ARTP-2026-00001" } });
  if (!existingC1) {
    await prisma.complaint.create({
      data: {
        reference: "ARTP-2026-00001",
        userId: citizens[0].id,
        agentId: agent.id,
        operator: "orange",
        category: "billing_error",
        subject: "Facturation incorrecte sur mon forfait data",
        description: "J'ai été débité de 5000 FCFA supplémentaires sans avoir souscrit à un service SVA.",
        status: "under_review",
        priority: "medium",
        region: "dakar",
        events: {
          create: [
            { status: "submitted",    message: "Plainte reçue. Référence : ARTP-2026-00001" },
            { status: "under_review", message: "Votre plainte est en cours d'examen par nos agents.", agentId: agent.id },
          ],
        },
      },
    });
  }

  const existingC2 = await prisma.complaint.findUnique({ where: { reference: "ARTP-2026-00002" } });
  if (!existingC2) {
    await prisma.complaint.create({
      data: {
        reference: "ARTP-2026-00002",
        userId: citizens[1].id,
        operator: "free",
        category: "network_outage",
        subject: "Coupure réseau depuis 3 jours à Thiès",
        description: "Le réseau Free est totalement indisponible dans mon quartier depuis le 14/06/2026.",
        status: "submitted",
        priority: "high",
        region: "thies",
        events: {
          create: [{ status: "submitted", message: "Plainte enregistrée. Référence : ARTP-2026-00002" }],
        },
      },
    });
  }

  await prisma.notification.create({
    data: {
      type: "regulation_news",
      title: "Bienvenue sur Mon Réseau SN",
      body: "L'ARTP lance son application citoyenne de mesure de la qualité de service. Mesurez et signalez !",
    },
  });

  console.log("\n✅ Seed terminé !");
  console.log(`   Admin    : ${admin.phone} / admin@artp.sn`);
  console.log(`   Agent    : ${agent.phone} / agent@artp.sn`);
  console.log(`   Citoyens : ${citizens.length}`);
  console.log(`   Mesures  : ${qosSamples.length}`);
  console.log(`   Plaintes : ARTP-2026-00001, ARTP-2026-00002`);
  console.log("\n   OTP de test (dev) : 123456");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
