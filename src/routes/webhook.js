import { Router } from "express";
import {
  verifyWebhook,
  createWebhookHandler,
} from "../controllers/metaController.js";

export default function webhookRoutes(io) {
  const router = Router();

  router.get("/", verifyWebhook);
  router.post("/", createWebhookHandler(io));
  return router;
}
