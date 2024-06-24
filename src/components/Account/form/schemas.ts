import { z } from "zod";

export const formSchema = z.object({
  username: z.string().trim().min(1, { message: "username required" }),
  password: z.string().trim().min(1, { message: "password required" }),
  email: z.string().trim().min(1, { message: "email required" }),
});
