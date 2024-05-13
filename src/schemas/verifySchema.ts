import { z } from "zod";

export const verifytokenSchema = z.object({
  code: z.string().length(6, { message: "Code cannot be more than 6 digts" }),
});
