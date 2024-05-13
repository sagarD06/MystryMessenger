import { z } from "zod";

export const usernamevalidation = z
  .string()
  .min(3, "Username must be atleat 3 characters")
  .max(20, "Username must not be nore than 20 charaters")
  .regex(/^[a-zA-Z0-9_@]+$/, "Username cannot have special characters");

export const signupSchema = z.object({
    username: usernamevalidation,
    email: z.string().email(),
    password: z.string().min(8, {message:"Password must be atleat 8 characters"}),
});
