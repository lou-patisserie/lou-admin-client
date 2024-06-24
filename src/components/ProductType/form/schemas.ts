import { z } from "zod";

export const formSchema = z.object({
  name: z.string().trim().min(1, { message: "name required" }),
  desc: z.string().trim().min(1, { message: "description required" }),
  order: z.union([z.string().trim(), z.number()]).refine(val => val === "" || !isNaN(Number(val)), {
    message: "order must be a number or empty",
  }),
});
