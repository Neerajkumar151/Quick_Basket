import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid business email").regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|org|net|edu|ac\.in|co\.in|gov|mil|io|co|us|uk)$/i, "Please enter a genuine email address (e.g. .com, .in, .ac.in)"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
