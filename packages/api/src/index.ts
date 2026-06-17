import "express-async-errors";
import dotenv from "dotenv";
dotenv.config();

import app from "./app";

export default app;

if (process.env.NODE_ENV !== "production") {
  const { prisma } = require("./db/prisma");
  const PORT = process.env.PORT ?? process.env.API_PORT ?? 3001;
  prisma.$connect().then(() => {
    app.listen(PORT, () => {
      console.log(`ARTP API sur http://localhost:${PORT}`);
    });
  });
}
