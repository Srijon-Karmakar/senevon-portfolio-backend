// backend/utils/sendMail.js
import nodemailer from "nodemailer";

/**
 * Uses SMTP_* and MAIL_FROM from .env
 *  SMTP_HOST=smtp.gmail.com
 *  SMTP_PORT=465            # 465 -> secure true, 587 -> secure false
 *  SMTP_SECURE=true
 *  SMTP_USER=your@gmail.com
 *  SMTP_PASS=your_app_password
 *  MAIL_FROM=senevontech@gmail.com
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: String(process.env.SMTP_SECURE) === "true", // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send an email
 * @param {{to:string,subject:string,text?:string,html?:string}} opts
 */
export default async function sendMail({ to, subject, text, html }) {
  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text: text ?? (html ? undefined : " "),
      html,
    });
    console.log(`📧 Email sent: ${info.messageId} -> ${to}`);
    return info;
  } catch (err) {
    console.error("❌ Email error:", err?.message || err);
    throw err;
  }
}
