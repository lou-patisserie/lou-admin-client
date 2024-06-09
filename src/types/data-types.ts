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
