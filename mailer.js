import nodemailer from "nodemailer";

export function createTransporter() {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS
  } = process.env;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 465),
    secure: String(SMTP_SECURE) === "true",
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });
}

export async function sendClientConfirmation({ to, from, name }) {
  const transporter = createTransporter();

  const html = `
  <div style="font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.6">
    <h2 style="margin:0 0 8px">Thanks for reaching out, ${name || "there"} 👋</h2>
    <p>We received your request and will get back shortly.</p>
    <p style="color:#666">— Team Senevon</p>
  </div>`;

  await transporter.sendMail({
    from,
    to,
    subject: "We got your request — Senevon",
    html
  });
}

export async function notifyAdminNewLead(doc) {
  const transporter = createTransporter();
  const adminTo = process.env.SMTP_USER; // or a dedicated inbox
  const html = `
    <h3>New Contact Request</h3>
    <ul>
      <li><b>Name:</b> ${doc.name}</li>
      <li><b>Email:</b> ${doc.email}</li>
      <li><b>WhatsApp:</b> ${doc.whatsapp || "-"}</li>
      <li><b>Message:</b> ${doc.message || "-"}</li>
      <li><b>Time:</b> ${new Date(doc.createdAt).toLocaleString()}</li>
    </ul>
  `;
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: adminTo,
    subject: "New Contact Request - Senevon",
    html
  });
}
