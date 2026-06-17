import "express-async-errors";
import dotenv from "dotenv";
dotenv.config();

import express from "express";

let realApp: express.Express | null = null;
let startupError: Error | null = null;

try {
  realApp = require("./app").default;
} catch (err: any) {
  startupError = err;
}

const debugApp = express();
debugApp.use(express.json());
debugApp.use((req: express.Request, res: express.Response) => {
  if (startupError) {
    return res.status(500).json({
      error: startupError.message,
      stack: startupError.stack?.split("\n").slice(0, 8),
    });
  }
  return realApp!(req, res);
});

export default debugApp;
