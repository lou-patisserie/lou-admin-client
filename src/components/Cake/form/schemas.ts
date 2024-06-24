import { z } from "zod";

export const firstStepSchema = z.object({
  product_type_id: z.string().min(1, { message: "product type required" }),
  name: z.string().trim().min(1, { message: "name required" }),
  is_best_seller: z.string().min(1, { message: "Best seller required" }),
  is_new_arrival: z.string().min(1, { message: "New arrival required" }),
  is_fruit_based: z.string().min(1, { message: "Fruit based required" }),
  is_nut_free: z.string().min(1, { message: "Nut free required" }),
  is_chocolate_based: z.string().min(1, { message: "Chocolate based required" }),
  variant_name_1: z.string().trim().min(1, { message: "variant name 1 required" }),
  variant_desc_1: z.string().trim().min(1, { message: "variant desc 1 required" }),
  variant_price_1: z.string().trim().min(1, { message: "variant price 1 required" }),
  variant_name_2: z.string().trim().optional(),
  variant_desc_2: z.string().trim().optional(),
  variant_price_2: z.string().trim().optional(),
});

export const secondStepSchema = z.object({
  about_cake_desc: z.string().min(1, { message: "about cake desc required" }),
  allergen_desc: z.string().trim().min(1, { message: "allergen desc required" }),
  ingredients_desc: z.string().trim().min(1, { message: "ingredients desc required" }),
  storage_serving_desc: z.string().min(1, { message: "storage serving desc required" }),
});

export const thirdStepSchema = z.object({
  main_image: z.string().min(1, { message: "main image required" }),
  sub_image1: z.string().min(1, { message: "sub image 1 required" }),
  sub_image2: z.string().min(1, { message: "sub image 2 required" }),
});

export const formSchema = firstStepSchema.merge(secondStepSchema).merge(thirdStepSchema);
