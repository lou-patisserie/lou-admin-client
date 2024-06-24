export interface FormDataCake {
  product_type_id?: string;
  name?: string;
  is_best_seller?: string;
  is_new_arrival?: string;
  is_fruit_based?: string;
  is_nut_free?: string;
  is_chocolate_based?: string;
  main_image?: string;
  sub_image1?: string;
  sub_image2?: string;
  variant_name_1?: string;
  variant_desc_1?: string;
  variant_price_1?: string;
  variant_name_2?: string;
  variant_desc_2?: string;
  variant_price_2?: string;
  about_cake_desc?: string;
  allergen_desc?: string;
  ingredients_desc?: string;
  storage_serving_desc?: string;
}

export type Cakes = {
  ID: string;
  user_id: string;
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
  created_date: string;
  ProductType: {
    ID: string;
    name: string;
    desc: string;
    created_date: string;
  };
  Users: {
    ID: string;
    role_id: number;
    username: string;
    password: string;
    email: string;
    avatar: string;
    created_date: string;
  };
};

export type CakeById = {
  cake: {
    ID: string;
    user_id: string;
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
    created_date: string;
    ProductType: {
      ID: string;
      name: string;
      desc: string;
      created_date: string;
    };
    Users: {
      ID: string;
      role_id: number;
      username: string;
      password: string;
      email: string;
      avatar: string;
      created_date: string;
    };
  };
  variants: [
    {
      ID: string;
      cake_id: string;
      desc: string;
      name: string;
      price: string;
      created_date: string;
    },
    {
      ID: string;
      cake_id: string;
      desc: string;
      name: string;
      price: string;
      created_date: string;
    }
  ];
  aboutCake: {
    ID: string;
    cake_id: string;
    desc: string;
    allergen: string;
    ingredients: string;
    storage_serving: string;
    created_date: string;
  };
};

export type ProductTypes = {
  ID: string;
  name: string;
  desc: string;
  order: number;
};

export type TypeById = {
  ID: string;
  name: string;
  desc: string;
  order: number;
};

export type AddOnsType = {
  ID: string;
  user_id: string;
  name: string;
  desc: string;
  price: string;
  main_image: string;
  sub_image1: string;
  sub_image2: string;
};

export type ProfileType = {
  ID: string;
  role_id: number;
  username: string;
  email: string;
  avatar?: string;
  password?: string;
};
