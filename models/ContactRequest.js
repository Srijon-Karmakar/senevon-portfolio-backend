import mongoose from "mongoose";

const ContactRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true },
    whatsapp: { type: String, trim: true, maxlength: 32 },
    message: { type: String, trim: true, maxlength: 2000 }
  },
  { timestamps: true }
);

export default mongoose.model("ContactRequest", ContactRequestSchema);
