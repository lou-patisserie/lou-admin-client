"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../UI/Form";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Input } from "../../UI/Input";
import { useToast } from "../../UI/Toast/use-toast";
import { useCallback, useEffect, useState } from "react";
import { addCake, editCake, getCakebyId } from "@/api/cakes-api";
import { LoadingButton } from "@/components/UI/LoadingButton";
import { useRecoilState } from "recoil";
import { ImagePlus } from "lucide-react";
import Image from "next/image";
import userState from "@/recoils/userState";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/UI/Select";
import { CakeById, ProductTypes } from "@/types/data-types";
import { getAllProductTypes } from "@/api/product-type-api";
import { app } from "@/lib/firebase";
import { Button } from "@/components/UI/Button";
import { formSchema } from "./schemas";

interface EditCakeProps {
  setOpen: (open: boolean) => void;
  cakeId: string;
  refetch: () => void;
}

interface FormErrors {
  main_image?: string;
  sub_image1?: string;
  sub_image2?: string;
}

const EditCakeForm = ({ setOpen, cakeId, refetch }: EditCakeProps) => {
  const [types, setTypes] = useState<ProductTypes[]>([]);
  const [cake, setCake] = useState<CakeById | null>(null);
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isLoading, setLoading] = useState(false);
  const [user] = useRecoilState(userState);
  const { toast } = useToast();

  const fetchCake = useCallback(async () => {
    try {
      const response = await getCakebyId(cakeId);
      if (response.success) {
        setCake(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  }, [cakeId]);

  useEffect(() => {
    fetchCake();
  }, [fetchCake]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_type_id: cake?.cake.ProductType.ID,
      name: cake?.cake.name,
      is_best_seller: cake?.cake.is_best_seller ? "Yes" : "No",
      is_new_arrival: cake?.cake.is_new_arrival ? "Yes" : "No",
      is_fruit_based: cake?.cake.is_fruit_based ? "Yes" : "No",
      is_nut_free: cake?.cake.is_nut_free ? "Yes" : "No",
      is_chocolate_based: cake?.cake.is_chocolate_based ? "Yes" : "No",
      main_image: cake?.cake.main_image,
      sub_image1: cake?.cake.sub_image1,
      sub_image2: cake?.cake.sub_image2,
      variant_name_1: cake?.variants[0].name,
      variant_desc_1: cake?.variants[0].desc,
      variant_price_1: cake?.variants[0].price,
      variant_name_2: cake?.variants[1].name,
      variant_desc_2: cake?.variants[1].desc,
      variant_price_2: cake?.variants[1].price,
      about_cake_desc: cake?.aboutCake.desc,
      allergen_desc: cake?.aboutCake.allergen,
      ingredients_desc: cake?.aboutCake.ingredients,
      storage_serving_desc: cake?.aboutCake.storage_serving,
    },
  });

  useEffect(() => {
    if (cake) {
      form.reset({
        product_type_id: cake.cake.ProductType.ID,
        name: cake.cake.name,
        is_best_seller: cake.cake.is_best_seller ? "true" : "false",
        is_new_arrival: cake.cake.is_new_arrival ? "true" : "false",
        is_fruit_based: cake.cake.is_fruit_based ? "true" : "false",
        is_nut_free: cake.cake.is_nut_free ? "true" : "false",
        is_chocolate_based: cake.cake.is_chocolate_based ? "true" : "false",
        main_image: cake.cake.main_image,
        sub_image1: cake.cake.sub_image1,
        sub_image2: cake.cake.sub_image2,
        variant_name_1: cake.variants[0].name,
        variant_desc_1: cake.variants[0].desc,
        variant_price_1: cake.variants[0].price,
        variant_name_2: cake.variants[1].name,
        variant_desc_2: cake.variants[1].desc,
        variant_price_2: cake.variants[1].price,
        about_cake_desc: cake.aboutCake.desc,
        allergen_desc: cake.aboutCake.allergen,
        ingredients_desc: cake.aboutCake.ingredients,
        storage_serving_desc: cake.aboutCake.storage_serving,
      });
    }
  }, [cake, form]);

  const adminTokenString =
    typeof window !== "undefined" ? sessionStorage.getItem("admin-token") : null;
  const adminToken = adminTokenString ? JSON.parse(adminTokenString) : null;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const newValues = {
      ...values,
      is_best_seller: values.is_best_seller === "true" ? true : false,
      is_new_arrival: values.is_new_arrival === "true" ? true : false,
      is_fruit_based: values.is_fruit_based === "true" ? true : false,
      is_nut_free: values.is_nut_free === "true" ? true : false,
      is_chocolate_based: values.is_chocolate_based === "true" ? true : false,
      main_image: image1 || values.main_image,
      sub_image1: image2 || values.sub_image1,
      sub_image2: image3 || values.sub_image2,
    };
    try {
      const response = await editCake(adminToken.token, user.ID, cakeId, newValues);
      if (response.success) {
        setLoading(false);
        toast({
          description: "Cake updated successfully!",
          className: "bg-green-600 text-white border-none",
          duration: 2000,
        });
        setOpen(false);
        refetch();
      }
    } catch (error: any) {
      console.error(error);
      toast({
        description: error.response.data.message.toString(),
        className: "bg-red-600 text-white border-none",
        duration: 2000,
      });
      setLoading(false);
    }
  };

  const fetchType = useCallback(async () => {
    try {
      const response = await getAllProductTypes();
      if (response.success) {
        setTypes(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchType();
  }, [fetchType]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const maxFileSize = 1024 * 1024 * 2;

    if (!file || file.size > maxFileSize) {
      setFormErrors((prevErrors: {}) => ({
        ...prevErrors,
        [e.target.name]: "The image size should not exceed 2MB",
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = event => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);
        canvas.toBlob(async blob => {
          const storage = getStorage(app);
          const storageRef = ref(storage, `cake_images/${Date.now()}.webp`);

          try {
            const snapshot = await uploadBytes(storageRef, blob as Blob);
            const downloadURL = await getDownloadURL(snapshot.ref);
            if (e.target.name === "main_image") setImage1(downloadURL);
            if (e.target.name === "sub_image1") setImage2(downloadURL);
            if (e.target.name === "sub_image2") setImage3(downloadURL);
            form.setValue(e.target.name as keyof z.infer<typeof formSchema>, downloadURL);
            setFormErrors((prevErrors: FormErrors) => ({
              ...prevErrors,
              [e.target.name]: undefined,
            }));
          } catch (error) {
            console.error("Error uploading file:", error);
          }
        }, "image/webp");
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <div className="max-w-fit">
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Name</FormLabel>
                <FormControl>
                  <Input
                    defaultValue={cake?.cake.name}
                    {...field}
                    className="max-w-[70%] sm:max-w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col justify-between md:flex-row">
            <FormField
              control={form.control}
              name="product_type_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Product Type</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={cake?.cake.ProductType.name}>
                          {cake?.cake.ProductType.name || "Select a type"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Types</SelectLabel>
                          {types.map(type => (
                            <SelectItem key={type.ID} value={type.ID}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_best_seller"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Best Seller</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue>{cake?.cake.is_best_seller ? "Yes" : "No"}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select one</SelectLabel>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col justify-between md:flex-row">
            <FormField
              control={form.control}
              name="is_new_arrival"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">New Arrival</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue>{cake?.cake.is_new_arrival ? "Yes" : "No"}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select one</SelectLabel>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_fruit_based"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Fruit Based</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue>{cake?.cake.is_fruit_based ? "Yes" : "No"}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select one</SelectLabel>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col justify-between md:flex-row">
            <FormField
              control={form.control}
              name="is_nut_free"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Nut Free</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue>{cake?.cake.is_nut_free ? "Yes" : "No"}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select one</SelectLabel>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_chocolate_based"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Chocolate Based</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue>{cake?.cake.is_chocolate_based ? "Yes" : "No"}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select one</SelectLabel>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="variant_name_1"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Variant name 1</FormLabel>
                <FormControl>
                  <Input
                    defaultValue={cake?.variants[0].name}
                    {...field}
                    className="max-w-[70%] sm:max-w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="variant_desc_1"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Variant desc 1</FormLabel>
                <FormControl>
                  <Input
                    defaultValue={cake?.variants[0].desc}
                    {...field}
                    className="max-w-[70%] sm:max-w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="variant_price_1"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Variant price 1</FormLabel>
                <FormControl>
                  <Input
                    defaultValue={cake?.variants[0].price}
                    {...field}
                    className="max-w-[70%] sm:max-w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="variant_name_2"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Variant name 2</FormLabel>
                <FormControl>
                  <Input
                    defaultValue={cake?.variants[1].name}
                    {...field}
                    className="max-w-[70%] sm:max-w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="variant_desc_2"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Variant desc 2</FormLabel>
                <FormControl>
                  <Input
                    defaultValue={cake?.variants[1].desc}
                    {...field}
                    className="max-w-[70%] sm:max-w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="variant_price_2"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Variant price 2</FormLabel>
                <FormControl>
                  <Input
                    defaultValue={cake?.variants[0].price}
                    {...field}
                    className="max-w-[70%] sm:max-w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="about_cake_desc"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">About cake description</FormLabel>
                <FormControl>
                  <Input
                    defaultValue={cake?.aboutCake.desc}
                    {...field}
                    className="max-w-[70%] sm:max-w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="allergen_desc"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Allergen description</FormLabel>
                <FormControl>
                  <Input
                    defaultValue={cake?.aboutCake.allergen}
                    {...field}
                    className="max-w-[70%] sm:max-w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ingredients_desc"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Ingredients Desc</FormLabel>
                <FormControl>
                  <Input
                    defaultValue={cake?.aboutCake.ingredients}
                    {...field}
                    className="max-w-[70%] sm:max-w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="storage_serving_desc"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Storage serving description</FormLabel>
                <FormControl>
                  <Input
                    defaultValue={cake?.aboutCake.storage_serving}
                    {...field}
                    className="max-w-[70%] sm:max-w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="main_image"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Main Image</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4 w-full">
                    {field.value && cake ? (
                      <Image
                        src={image1 || cake.cake.main_image}
                        className="aspect-square object-cover rounded-lg bg-gray-300"
                        alt="Uploaded"
                        width={120}
                        height={120}
                      />
                    ) : (
                      <ImagePlus width={100} height={100} />
                    )}
                    <div>
                      <label htmlFor="main_image"></label>
                      <div className="flex flex-col">
                        <input
                          id="main_image"
                          name="main_image"
                          type="file"
                          onChange={handleFileChange}
                        />
                        {formErrors.main_image && (
                          <p className="text-red-500">{formErrors.main_image}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sub_image1"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Sub Image 1</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4 w-full">
                    {field.value && cake ? (
                      <Image
                        src={image2 || cake.cake.sub_image1}
                        className="aspect-square object-cover rounded-lg bg-gray-300"
                        alt="cake image 2"
                        width={120}
                        height={120}
                      />
                    ) : (
                      <ImagePlus width={100} height={100} />
                    )}
                    <div>
                      <label htmlFor="sub_image1"></label>
                      <input
                        id="sub_image1"
                        name="sub_image1"
                        type="file"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sub_image2"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">Sub Image 2</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4 w-full">
                    {field.value && cake ? (
                      <>
                        <Image
                          src={image3 || cake.cake.sub_image2}
                          className="aspect-square object-cover rounded-lg bg-gray-300"
                          alt="cake image 3"
                          width={120}
                          height={120}
                        />
                      </>
                    ) : (
                      <ImagePlus width={100} height={100} />
                    )}
                    <div>
                      <label htmlFor="sub_image2"></label>
                      <input
                        id="sub_image2"
                        name="sub_image2"
                        type="file"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2 min-w-fit justify-center sm:justify-end">
            <Button
              className="text-luoDarkBiege border border-luoDarkBiege"
              variant="outline"
              onClick={() => setOpen(false)}
              type="button"
            >
              Cancel
            </Button>
            <LoadingButton type="submit" className="bg-luoDarkBiege" loading={isLoading}>
              Add Cake
            </LoadingButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditCakeForm;
