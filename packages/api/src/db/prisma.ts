import { PrismaClient } from "@prisma/client";

function createPrismaClient() {
  if (process.env.NODE_ENV === "production") {
    // En production (Vercel serverless) : HTTP adapter Neon, aucun binaire natif requis
    const { neon } = require("@neondatabase/serverless");
    const { PrismaNeon } = require("@prisma/adapter-neon");
    const sql = neon(process.env.POSTGRES_PRISMA_URL!);
    const adapter = new PrismaNeon(sql);
    return new PrismaClient({ adapter } as any);
  }
  // Dev local : connexion SQLite standard
  return new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });
}

export const prisma = createPrismaClient();
