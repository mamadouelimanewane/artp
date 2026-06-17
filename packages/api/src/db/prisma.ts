import { PrismaClient } from "@prisma/client";
import { neon } from "@neondatabase/serverless";
import { PrismaNeonHTTP } from "@prisma/adapter-neon";

function createPrismaClient() {
  if (process.env.NODE_ENV === "production") {
    const sql = neon(process.env.POSTGRES_PRISMA_URL!);
    const adapter = new PrismaNeonHTTP(sql);
    return new PrismaClient({ adapter } as any);
  }
  return new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });
}

export const prisma = createPrismaClient();
