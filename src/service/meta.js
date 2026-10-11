export async function getMetaLead(leadId) {
  const version = process.env.META_API_VERSION;
  const token = process.env.META_ACCESS_TOKEN;

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

  return {
    meta_lead_id: result.id,
    name: fields.full_name || fields.name || null,
    email: fields.email || null,
    phone: fields.phone_number || fields.phone || null,
    source: "Meta Lead Ads",
  };
}