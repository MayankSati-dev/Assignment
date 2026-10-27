import LeadModel from "../model.js";
import express from "express";
import cors from "cors";
import webhookRoutes from "./routes/webhook.js";
import { supabase } from "./config/db.js";

export function createApp(io) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Fetch existing leads from Supabase
  app.get("/api/leads", async (req, res) => {
    try {
        const mongooseLeads=await LeadModel.find()
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return res.status(200).json(data);
    } catch (error) {
      console.error("Failed to fetch leads:", error.message);
      return res.status(500).json({
        error: "Failed to fetch leads",
      });
    }
  });
app.post("/api/togglebtn",async(req,res)=>{
  await LeadModel.updateMany({}, { $set: { status:false } });
  res.status(200).json({
    message:"toggle change"
  })
})
  app.use("/webhook", webhookRoutes(io));

  return app;
}
