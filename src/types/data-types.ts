export type Variants = {
  ID: string;
  cake_id: string;
  desc: string;
  name: string;
  price: string;
};

export type Cake = {
  ID: string;
  name: string;
  main_image: string;
  sub_image1: string;
  sub_image2: string;
  variants: Variants[];
  aboutCake: any;
};

export type AddOns = {
  ID: string;
  name: string;
  desc: string;
  price: string;
  main_image: string;
};

export interface Cakes {
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
}

export interface CakeById {
  cake: {
    ID: string;
    user_id: string;
    product_type_id: string;
    name: string;
    is_best_seller: true;
    is_new_arrival: true;
    is_fruit_based: false;
    is_nut_free: true;
    is_chocolate_based: true;
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
}

export interface ProductTypes {
  ID: string;
  name: string;
  desc: string;
}

export interface TypeById {
  ID: string;
  name: string;
  desc: string;
}
