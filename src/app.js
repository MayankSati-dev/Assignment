import express from "express";
import cors from "cors";
import webhookRoutes from "./routes/webhook.js";

export function createApp(io) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/webhook", webhookRoutes(io));

  return app;
}