import { z } from "zod";

export const formSchema = z.object({
  name: z.string().trim().min(1, { message: "name required" }),
  desc: z.string().trim().min(1, { message: "description required" }),
  order: z.number().min(1, { message: "order number required" }),
});
