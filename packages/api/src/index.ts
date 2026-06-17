import "express-async-errors";
import dotenv from "dotenv";
dotenv.config();

import express from "express";

// App de debug temporaire pour capturer l'erreur de démarrage
let realApp: express.Express | null = null;
let startupError: Error | null = null;

try {
  realApp = require("./app").default;
} catch (err: any) {
  startupError = err;
  console.error("STARTUP ERROR:", err);
}

const debugApp = express();
debugApp.use(express.json());

debugApp.use((req: express.Request, res: express.Response) => {
  if (startupError) {
    return res.status(500).json({
      crashed: true,
      error: startupError.message,
      stack: startupError.stack,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        HAS_DB_URL: !!process.env.POSTGRES_PRISMA_URL,
      },
    });
  }
  return realApp!(req, res);
});

export default debugApp;
