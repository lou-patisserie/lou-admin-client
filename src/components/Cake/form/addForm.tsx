"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../UI/Form";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Input } from "../../UI/Input";
import { useToast } from "../../UI/Toast/use-toast";
import { useCallback, useEffect, useState } from "react";
import { addCake } from "@/api/cakes-api";
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
import { ProductTypes } from "@/types/data-types";
import { getAllProductTypes } from "@/api/product-type-api";
import { app } from "@/lib/firebase";
import { Button } from "@/components/UI/Button";
import { formSchema, firstStepSchema, secondStepSchema, thirdStepSchema } from "./schemas";
import RichText from "@/components/UI/RichText";
import SpinnerWithText from "@/components/UI/Spinner";
interface AddCakeProps {
  setOpen: (open: boolean) => void;
  refetch: () => void;
}

interface FormErrors {
  main_image?: string;
  sub_image1?: string;
  sub_image2?: string;
}

const AddCakeForm = ({ setOpen, refetch }: AddCakeProps) => {
  const [types, setTypes] = useState<ProductTypes[]>([]);
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isLoading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [uploading1, setUploading1] = useState(false);
  const [uploading2, setUploading2] = useState(false);
  const [uploading3, setUploading3] = useState(false);
  const [step, setStep] = useState(1);
  const [user] = useRecoilState(userState);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    product_type_id: "",
    name: "",
    is_best_seller: "",
    is_new_arrival: "",
    is_fruit_based: "",
    is_nut_free: "",
    is_chocolate_based: "",
    main_image: "",
    sub_image1: "",
    sub_image2: "",
    variant_name_1: "",
    variant_desc_1: "",
    variant_price_1: "",
    variant_name_2: "",
    variant_desc_2: "",
    variant_price_2: "",
    about_cake_desc: "",
    allergen_desc: "",
    ingredients_desc: "",
    storage_serving_desc: "",
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: formData,
  });

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
      main_image: image1,
      sub_image1: image2,
      sub_image2: image3,
    };
    try {
      const response = await addCake(adminToken.token, user.ID, newValues);
      if (response.success) {
        setLoading(false);
        toast({
          description: "Cake added successfully!",
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

  const currencyFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });

  const formatCurrency = (value: string) => {
    const number = parseFloat(value.replace(/[^\d]/g, ""));
    if (isNaN(number)) return "";
    return currencyFormatter.format(number).replace("IDR", "IDR ");
    // const formattedNumber = currencyFormatter.format(number);
    // return formattedNumber.replace("Rp", "IDR").replace(".", ",");
  };

  const handleInputChange = (field: any) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const formattedValue = formatCurrency(value);
    field.onChange(value.replace(/[^\d]/g, ""));
    setFormData(prev => ({ ...prev, [field.name]: formattedValue }));
  };

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

    const setUploading =
      e.target.name === "main_image"
        ? setUploading1
        : e.target.name === "sub_image1"
        ? setUploading2
        : setUploading3;
    setUploading(true);

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
            form.setValue(e.target.name as keyof z.infer<typeof formSchema>, downloadURL);
            setFormErrors((prevErrors: {}) => ({
              ...prevErrors,
              [e.target.name]: undefined,
            }));
            if (e.target.name === "main_image") {
              setImage1(downloadURL);
              setFormData(prevData => ({ ...prevData, main_image: downloadURL }));
            }
            if (e.target.name === "sub_image1") {
              setImage2(downloadURL);
              setFormData(prevData => ({ ...prevData, sub_image1: downloadURL }));
            }
            if (e.target.name === "sub_image2") {
              setImage3(downloadURL);
              setFormData(prevData => ({ ...prevData, sub_image2: downloadURL }));
            }
          } catch (error) {
            console.error("Error uploading file:", error);
          } finally {
            setUploading(false);
          }
        }, "image/webp");
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (step === 3) {
      setImage1(formData.main_image);
      setImage2(formData.sub_image1);
      setImage3(formData.sub_image2);
    }
  }, [step, formData]);

  const handleNext = async () => {
    let schema;
    switch (step) {
      case 1:
        schema = firstStepSchema;
        break;
      case 2:
        schema = secondStepSchema;
        break;
      case 3:
        schema = thirdStepSchema;
        break;
      default:
        schema = formSchema;
    }

    const isValid = await schema.safeParseAsync(form.getValues());
    if (isValid.success) {
      form.clearErrors();
      setFormData(form.getValues());
      setStep(step + 1);
    } else {
      isValid.error.errors.forEach(error => {
        form.setError(error.path[0] as keyof z.infer<typeof formSchema>, {
          type: "manual",
          message: error.message,
        });
      });
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "variant_name_2") {
        setIsDisabled(!value.variant_name_2);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <div className="md:max-w-md">
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-2">
          {step === 1 && (
            <>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col justify-between sm:flex-row">
                <FormField
                  control={form.control}
                  name="product_type_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Product Type</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="sm:w-[180px]">
                            <SelectValue placeholder="Select a type" />
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
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="sm:w-[180px]">
                            <SelectValue placeholder="Select" />
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
              <div className="flex flex-col justify-between sm:flex-row">
                <FormField
                  control={form.control}
                  name="is_new_arrival"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">New Arrival</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="sm:w-[180px]">
                            <SelectValue placeholder="Select" />
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
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="sm:w-[180px]">
                            <SelectValue placeholder="Select" />
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
              <div className="flex flex-col justify-between sm:flex-row">
                <FormField
                  control={form.control}
                  name="is_nut_free"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Nut Free</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="sm:w-[180px]">
                            <SelectValue placeholder="Select" />
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
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="sm:w-[180px]">
                            <SelectValue placeholder="Select" />
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
                      <Input {...field} />
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
                      <Input {...field} />
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
                        {...field}
                        value={formData.variant_price_1}
                        onChange={handleInputChange(field)}
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
                    <FormLabel className="font-bold">Variant name 2 (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel className="font-bold">Variant desc 2 (optional)</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isDisabled} />
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
                    <FormLabel className="font-bold">Variant price 2 (optional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isDisabled}
                        value={formData.variant_price_2}
                        onChange={handleInputChange(field)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          {step === 2 && (
            <>
              <FormField
                control={form.control}
                name="allergen_desc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Allergen description</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input {...field} />
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
                      <Controller
                        name="about_cake_desc"
                        control={form.control}
                        render={({ field }) => (
                          <RichText value={field.value} onChange={field.onChange} />
                        )}
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
                      <Controller
                        name="storage_serving_desc"
                        control={form.control}
                        render={({ field }) => (
                          <RichText value={field.value} onChange={field.onChange} />
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          {step === 3 && (
            <>
              <FormField
                control={form.control}
                name="main_image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Main Image</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-6 w-full relative">
                        {uploading1 ? (
                          <div className="relative w-[120px] h-[120px] rounded-lg bg-gray-300 flex items-center justify-center">
                            <SpinnerWithText text="Uploading" />
                          </div>
                        ) : image1 ? (
                          <Image
                            src={image1}
                            className="aspect-square object-cover rounded-lg bg-gray-300"
                            alt="cake image 1"
                            width={120}
                            height={120}
                          />
                        ) : (
                          <ImagePlus width={100} height={100} />
                        )}
                        <div>
                          <label htmlFor="main_image"></label>
                          <input
                            id="main_image"
                            name="main_image"
                            type="file"
                            onChange={handleFileChange}
                            className="max-w-[220px]"
                          />
                          {formErrors.main_image && (
                            <p className="text-red-500">{formErrors.main_image}</p>
                          )}
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
                      <div className="flex items-center gap-6 w-full relative">
                        {uploading2 ? (
                          <div className="relative w-[120px] h-[120px] rounded-lg bg-gray-300 flex items-center justify-center">
                            <SpinnerWithText text="Uploading" />
                          </div>
                        ) : image2 ? (
                          <Image
                            src={image2}
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
                            className="max-w-[220px]"
                          />
                          {formErrors.sub_image1 && (
                            <p className="text-red-500">{formErrors.sub_image1}</p>
                          )}
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
                      <div className="flex items-center gap-6 w-full relative">
                        {uploading3 ? (
                          <div className="relative w-[120px] h-[120px] rounded-lg bg-gray-300 flex items-center justify-center">
                            <SpinnerWithText text="Uploading" />
                          </div>
                        ) : image3 ? (
                          <Image
                            src={image3}
                            className="aspect-square object-cover rounded-lg bg-gray-300"
                            alt="cake image 3"
                            width={120}
                            height={120}
                          />
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
                            className="max-w-[220px]"
                          />
                          {formErrors.sub_image2 && (
                            <p className="text-red-500">{formErrors.sub_image2}</p>
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          <div className="flex gap-2 min-w-fit justify-end">
            {step > 1 && (
              <Button
                onClick={handleBack}
                variant="outline"
                className="border-luoDarkBiege text-luoDarkBiege"
                type="button"
              >
                Back
              </Button>
            )}
            {step < 3 && (
              <Button
                onClick={handleNext}
                variant="outline"
                className="border-luoDarkBiege text-luoDarkBiege"
                type="button"
              >
                Next
              </Button>
            )}
            {step === 3 && (
              <LoadingButton loading={isLoading} className="bg-luoDarkBiege" type="submit">
                Add Cake
              </LoadingButton>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddCakeForm;
