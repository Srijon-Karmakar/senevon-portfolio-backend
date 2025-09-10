import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email(),
  whatsapp: z.string().trim().max(32).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal(""))
});

export function validateBody(schema) {
  return (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        error: "VALIDATION_ERROR",
        details: parsed.error.issues
      });
    }
    req.validated = parsed.data;
    next();
  };
}
