import { z } from "zod";

export const formSchema = z.object({
  name: z.string().trim().min(1, { message: "name required" }),
  desc: z.string().trim().min(1, { message: "description required" }),
  price: z.string().trim().min(1, { message: "price required" }),
  main_image: z.string().min(1, { message: "main image required" }),
  sub_image1: z.string().min(1, { message: "sub image 1 required" }),
  sub_image2: z.string().min(1, { message: "sub image 2 required" }),
});
