import { Router } from "express";
import { defaultLimiter } from "../middleware/rateLimit";
import authRouter from "./auth";
import qosRouter from "./qos";
import complaintsRouter from "./complaints";
import notificationsRouter from "./notifications";
import statsRouter from "./stats";
import chatbotRouter from "./chatbot";
import usersRouter from "./users";

export const router = Router();

router.use(defaultLimiter);

router.use("/auth", authRouter);
router.use("/qos", qosRouter);
router.use("/complaints", complaintsRouter);
router.use("/notifications", notificationsRouter);
router.use("/stats", statsRouter);
router.use("/chatbot", chatbotRouter);
router.use("/users", usersRouter);
