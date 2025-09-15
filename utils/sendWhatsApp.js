
import twilio from "twilio";


const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export default async function sendWhatsApp({ to, body }) {
  if (!to || !body) throw new Error("Missing to/body for WhatsApp");

  const from = process.env.TWILIO_WHATSAPP_FROM;
  if (!from) throw new Error("Missing TWILIO_WHATSAPP_FROM");

  
  const toWhatsApp = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;
  const fromWhatsApp = from.startsWith("whatsapp:") ? from : `whatsapp:${from}`;

  const msg = await client.messages.create({
    from: fromWhatsApp,
    to: toWhatsApp,
    body,
  });

  console.log("📨 WhatsApp sent:", msg.sid, "->", toWhatsApp);
  return msg;
}










// // backend/utils/sendWhatsApp.js
// import fetch from "node-fetch";

// const API_VERSION = "v19.0"; // adjust if Meta bumps versions

// /**
//  * Send a WhatsApp message via Cloud API.
//  * Two modes:
//  *  1) sendTemplate({ to, template, lang, components })
//  *  2) sendText({ to, body })  -> works only inside 24h user-initiated session
//  */

// const BASE_URL = (phoneId) =>
//   `https://graph.facebook.com/${API_VERSION}/${phoneId}/messages`;

// const auth = (token) => ({
//   Authorization: `Bearer ${token}`,
//   "Content-Type": "application/json",
// });

// export async function sendTemplate({ to, template, lang = "en_US", components = [] }) {
//   const token = process.env.META_WA_TOKEN;
//   const phoneId = process.env.META_WA_PHONE_ID;
//   if (!token || !phoneId) throw new Error("Missing META_WA_TOKEN / META_WA_PHONE_ID");

//   const res = await fetch(BASE_URL(phoneId), {
//     method: "POST",
//     headers: auth(token),
//     body: JSON.stringify({
//       messaging_product: "whatsapp",
//       to,
//       type: "template",
//       template: { name: template, language: { code: lang }, components },
//     }),
//   });
//   const data = await res.json();
//   if (!res.ok) {
//     console.error("WA template error:", data);
//     throw new Error(data?.error?.message || "WhatsApp template send failed");
//   }
//   return data;
// }

// export async function sendText({ to, body }) {
//   const token = process.env.META_WA_TOKEN;
//   const phoneId = process.env.META_WA_PHONE_ID;
//   if (!token || !phoneId) throw new Error("Missing META_WA_TOKEN / META_WA_PHONE_ID");

//   const res = await fetch(BASE_URL(phoneId), {
//     method: "POST",
//     headers: auth(token),
//     body: JSON.stringify({
//       messaging_product: "whatsapp",
//       to,
//       type: "text",
//       text: { body },
//     }),
//   });
//   const data = await res.json();
//   if (!res.ok) {
//     console.error("WA text error:", data);
//     throw new Error(data?.error?.message || "WhatsApp text send failed");
//   }
//   return data;
// }
