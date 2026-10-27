import LeadModel from "../../model.js";
export async function getMetaLead(leadId) {
  const version = process.env.META_API_VERSION;
  const token = process.env.META_ACCESS_TOKEN;
console.log("Token loaded:", Boolean(process.env.META_ACCESS_TOKEN));
console.log("Token length:", process.env.META_ACCESS_TOKEN?.length);
  const url = new URL(
    `https://graph.facebook.com/${version}/${leadId}`
  );

  url.searchParams.set("fields", "id,created_time,field_data");
  url.searchParams.set("access_token", token);

  const response = await fetch(url);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error?.message || "Meta API request failed");
  }

  const fields = Object.fromEntries(
    (result.field_data || []).map((field) => [
      field.name,
      field.values?.[0] ?? null,
    ])
  );
 const SaveLead=await LeadModel.create({
 name: fields.full_name || fields.name || null,
 email: fields.email || null,
 number: fields.phone_number || fields.phone || null,
 })
 console.log("MongoDb", SaveLead)
  return {
    meta_lead_id: result.id,
    name: fields.full_name || fields.name || null,
    email: fields.email || null,
    phone: fields.phone_number || fields.phone || null,
    source: "Meta Lead Ads",
  };
}