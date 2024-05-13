import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "Content must be atleat 10 characters." })
    .max(300, { message: "Content must be not loger than 300 characters" }),
});
