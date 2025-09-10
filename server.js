import "dotenv/config.js";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { connectDB } from "./db.js";
import contactRoutes from "./routes/contactRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import mongoose from "mongoose";
import dotenv from "dotenv";






dotenv.config();
const app = express();

// security + utils
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// CORS only from your frontend
const allowed = process.env.CLIENT_ORIGIN?.split(",").map(s => s.trim()).filter(Boolean) || ["http://localhost:5173"];
app.use(cors({ origin: allowed, credentials: false }));

app.use(morgan("tiny"));
app.set("trust proxy", 1);

// rate limit contact form
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});
// app.use("/api/contact", limiter);

// routes
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);

// health
app.get("/health", (_req, res) => res.json({ ok: true }));

// boot
const PORT = process.env.PORT || 5000;
connectDB(process.env.MONGO_URI)
  .then(() => app.listen(PORT, () => console.log(`🚀 API on http://localhost:${PORT}`)))
  .catch((e) => {
    console.error("DB connect failed:", e.message);
    process.exit(1);
  });
