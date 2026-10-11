import { supabase } from "../config/db.js";
import { getMetaLead } from "../service/meta.js";

export function verifyWebhook(req, res) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (
    mode === "subscribe" &&       
    token === process.env.META_VERIFY_TOKEN &&
    challenge
  ) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
}

export function createWebhookHandler(io) {
  return async (req, res) => {
    try {
      const body = req.body;

      if (body.object !== "page") {
        return res.sendStatus(404);
      }

      // Acknowledge the webhook; process each lead event.
      res.status(200).send("EVENT_RECEIVED");

      for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
          if (change.field !== "leadgen") continue;

          const leadId = change.value?.leadgen_id;
          if (!leadId) continue;

          try {
            const lead = await getMetaLead(leadId);

            const { data, error } = await supabase
              .from("leads")
              .upsert(lead, { onConflict: "meta_lead_id" })
              .select()
              .single();

            if (error) throw error;

            io.emit("new_lead", data);
            console.log("Lead saved:", leadId);
          } catch (error) {
            console.error("Lead processing failed:", error.message);
          }
        }
      }
    } catch (error) {
      console.error("Webhook error:", error.message);

      if (!res.headersSent) {
        res.sendStatus(500);
      }
    }
  };
}