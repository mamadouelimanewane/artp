import "express-async-errors";
import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { logger } from "./utils/logger";
import { prisma } from "./db/prisma";

const PORT = process.env.PORT ?? process.env.API_PORT ?? 3001;

async function main() {
  try {
    await prisma.$connect();
    logger.info("Base de données connectée");
    app.listen(PORT, () => {
      logger.info(`ARTP API démarrée sur http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("Erreur de démarrage", error);
    process.exit(1);
  }
}

main();

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
