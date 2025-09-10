import express from "express";
import ContactRequest from "../models/ContactRequest.js";

const router = express.Router();

function requireAdmin(req, res, next) {
  const token = req.get("x-admin-token");
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ ok: false, error: "UNAUTHORIZED" });
  }
  next();
}

// list (paginated)
router.get("/requests", requireAdmin, async (req, res) => {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(100, Math.max(1, Number(req.query.limit || 20)));
  const skip = (page - 1) * limit;

  const [total, items] = await Promise.all([
    ContactRequest.countDocuments({}),
    ContactRequest.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean()
  ]);

  res.json({ ok: true, total, page, limit, items });
});

export default router;
