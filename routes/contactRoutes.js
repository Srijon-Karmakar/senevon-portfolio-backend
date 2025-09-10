import express from "express";
import ContactRequest from "../models/ContactRequest.js";
import sendMail from "../utils/SendMail.js"; 

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, whatsapp = "", message = "" } = req.body || {};
    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({ ok: false, error: "Name and email required." });
    }

    // Save to DB
    const contact = await ContactRequest.create({
      name: name.trim(),
      email: email.trim(),
      whatsapp: whatsapp.trim(),
      message: message.trim(),
    });

    // Fire-and-forget emails so a mail error doesn't 500 your API
    sendMail({
      to: contact.email,
      subject: "We received your request",
      html: `<div style="font-family:Inter,system-ui,Segoe UI,Roboto,Arial,sans-serif;line-height:1.6">
               <h3>Hi ${contact.name},</h3>
               <p>Thanks for contacting <b>Senevon</b> — we’ll get back to you shortly.</p>
               <p style="color:#777">This is an automated confirmation.</p>
             </div>`,
      text: `Hi ${contact.name}, thanks for contacting Senevon — we’ll get back to you shortly.`,
    }).catch(e => console.error("client mail error:", e?.message));

    const adminTo = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
    if (adminTo) {
      sendMail({
        to: adminTo,
        subject: "New Contact Request",
        html: `<h3>New Contact</h3>
               <ul>
                 <li><b>Name:</b> ${contact.name}</li>
                 <li><b>Email:</b> ${contact.email}</li>
                 <li><b>WhatsApp:</b> ${contact.whatsapp || "-"}</li>
                 <li><b>Message:</b> ${contact.message || "-"}</li>
                 <li><b>Time:</b> ${new Date(contact.createdAt).toLocaleString()}</li>
               </ul>`,
        text: `Name: ${contact.name}\nEmail: ${contact.email}\nWhatsApp: ${contact.whatsapp}\nMessage: ${contact.message}`,
      }).catch(e => console.error("admin mail error:", e?.message));
    }

    // Success (DB write succeeded)
    return res.status(201).json({ ok: true, id: contact._id });
  } catch (err) {
    console.error("Contact error:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

export default router;
