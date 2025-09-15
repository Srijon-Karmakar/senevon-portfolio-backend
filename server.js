import "dotenv/config.js";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";

import contactRoutes from "./routes/contactRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

// Allow requests from your frontend domain
app.use(cors({
  origin: "https://senevon-portfolio-o3xh.onrender.com",  // your frontend URL on Render
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.options("*", cors());

// Security + parsers
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json({ limit: "1mb" }));



// // CORS (single place)
// const allowed = process.env.CLIENT_ORIGIN?.split(",").map(s => s.trim()).filter(Boolean)
//   || ["http://localhost:5173"];
// app.use(cors({ origin: allowed, credentials: false }));


// // ---- CORS (single place) ----
// const allowedOrigins = (process.env.CLIENT_ORIGIN?.split(",") || [
//   "http://localhost:5173",
//   "https://senevon-portfolio-o3xh.onrender.com"
// ]);

// app.use(cors({
//   origin: allowedOrigins,
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true
// }));

// // Handle preflight
// // app.options("*", cors());
// app.options("*", cors());




app.use(morgan("tiny"));
app.set("trust proxy", 1);

// Rate-limit contact form
app.use("/api/contact", rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
}));

// Routes
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);

// Health
app.get("/health", (_req, res) => res.json({ ok: true }));

// Boot
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 API on http://localhost:${PORT}`));
  })
  .catch((e) => {
    console.error("DB connect failed:", e.message);
    process.exit(1);
  });
