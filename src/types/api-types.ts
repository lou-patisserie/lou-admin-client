export type CakeQueryParams = {
  name?: string;
  typeID?: string;
  bestSeller?: boolean;
  newArrival?: boolean;
  fruitBased?: boolean;
  nutFree?: boolean;
  chocolateBased?: boolean;
  sort?: "asc" | "desc";
  limit?: string;
  page?: string;
};

export type LoginParams = {
  username: string;
  password: string;
};

export type ProfileParams = {
  token: string | null;
};

export type AddCakeParams = {
  product_type_id: string;
  name: string;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  is_fruit_based: boolean;
  is_nut_free: boolean;
  is_chocolate_based: boolean;
  main_image: string;
  sub_image1: string;
  sub_image2: string;
  variant_name_1: string;
  variant_desc_1: string;
  variant_price_1: string;
  variant_name_2: string;
  variant_desc_2: string;
  variant_price_2: string;
  about_cake_desc: string;
  allergen_desc: string;
  ingredients_desc: string;
  storage_serving_desc: string;
};

export type ProductTypesParams = {
  name: string;
  desc: string;
};
