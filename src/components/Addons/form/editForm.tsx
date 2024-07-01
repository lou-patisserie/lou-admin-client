"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../UI/Form";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Input } from "../../UI/Input";
import { useToast } from "../../UI/Toast/use-toast";
import { useCallback, useEffect, useState } from "react";
import { LoadingButton } from "@/components/UI/LoadingButton";
import { useRecoilState } from "recoil";
import { ImagePlus } from "lucide-react";
import Image from "next/image";
import userState from "@/recoils/userState";
import { AddOnsType } from "@/types/data-types";
import { app } from "@/lib/firebase";
import { Button } from "@/components/UI/Button";
import { formSchema } from "./schemas";
import SpinnerWithText from "@/components/UI/Spinner";
import { editAddOns, getAddOnsbyName } from "@/api/add-ons-api";

interface EditCakeProps {
  setOpen: (open: boolean) => void;
  addOnsId: string;
  addOnsName: string;
  refetch: () => void;
}

interface FormErrors {
  main_image?: string;
  sub_image1?: string;
  sub_image2?: string;
}

const EditCakeForm = ({
  setOpen,
  addOnsId,
  addOnsName,
  refetch,
}: EditCakeProps) => {
  const [addons, setAddons] = useState<AddOnsType | null>(null);
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [uploading1, setUploading1] = useState(false);
  const [uploading2, setUploading2] = useState(false);
  const [uploading3, setUploading3] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isLoading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [user] = useRecoilState(userState);
  const { toast } = useToast();

  const fetchCake = useCallback(async () => {
    setFetching(true);
    try {
      const response = await getAddOnsbyName(addOnsName);
      if (response.success) {
        setFetching(false);
        setAddons(response.data);
      }
    } catch (error) {
      setFetching(false);
      console.error(error);
    }
  }, [addOnsName]);

  useEffect(() => {
    fetchCake();
  }, [fetchCake]);

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

  const handleInputChange =
    (field: any) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const formattedValue = formatCurrency(value);
      field.onChange(value.replace(/[^\d]/g, ""));
      setFormData(prev => ({ ...prev, [field.name]: formattedValue }));
    };

  const [formData, setFormData] = useState({
    name: addons?.name,
    desc: addons?.desc,
    price: addons?.price,
    main_image: addons?.main_image,
    sub_image1: addons?.sub_image1,
    sub_image2: addons?.sub_image2,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formData,
  });

  useEffect(() => {
    if (addons) {
      form.reset({
        name: addons?.name,
        desc: addons?.desc,
        price: formatCurrency(addons?.price),
        main_image: addons?.main_image,
        sub_image1: addons?.sub_image1,
        sub_image2: addons?.sub_image2,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addons, form]);

  const adminTokenString =
    typeof window !== "undefined"
      ? sessionStorage.getItem("admin-token")
      : null;
  const adminToken = adminTokenString ? JSON.parse(adminTokenString) : null;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const newValues = {
      ...values,
      main_image: image1 || values.main_image,
      sub_image1: image2 || values.sub_image1,
      sub_image2: image3 || values.sub_image2,
    };
    try {
      const response = await editAddOns(
        adminToken.token,
        user.ID,
        addOnsId,
        newValues
      );
      if (response.success) {
        setLoading(false);
        toast({
          description: "Add-Ons updated successfully!",
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
            form.setValue(
              e.target.name as keyof z.infer<typeof formSchema>,
              downloadURL
            );
            setFormErrors((prevErrors: {}) => ({
              ...prevErrors,
              [e.target.name]: undefined,
            }));
            if (e.target.name === "main_image") {
              setImage1(downloadURL);
              setFormData(prevData => ({
                ...prevData,
                main_image: downloadURL,
              }));
            }
            if (e.target.name === "sub_image1") {
              setImage2(downloadURL);
              setFormData(prevData => ({
                ...prevData,
                sub_image1: downloadURL,
              }));
            }
            if (e.target.name === "sub_image2") {
              setImage3(downloadURL);
              setFormData(prevData => ({
                ...prevData,
                sub_image2: downloadURL,
              }));
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

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <div className="max-w-md">
      {fetching ? (
        <div className="min-w-[325px] min-h-[600px] flex justify-center items-center">
          <SpinnerWithText text="Loading..." />
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">
                    Name&nbsp;<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input defaultValue={addons?.name} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">
                    Description&nbsp;<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input defaultValue={addons?.desc} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">
                    Price&nbsp;<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      defaultValue={field.value}
                      value={formData.price}
                      onChange={handleInputChange(field)}
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
                  <FormLabel className="font-bold">
                    Main Image&nbsp;<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-6 w-full relative">
                      {uploading1 ? (
                        <div className="relative w-[120px] h-[120px] rounded-lg bg-gray-300 flex items-center justify-center">
                          <SpinnerWithText text="Uploading" />
                        </div>
                      ) : field.value && addons ? (
                        <Image
                          src={image1 || addons.main_image}
                          className="aspect-square object-cover rounded-lg bg-gray-300"
                          alt="add ons image 1"
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
                        />
                        {formErrors.main_image && (
                          <p className="text-red-500">
                            {formErrors.main_image}
                          </p>
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
                  <FormLabel className="font-bold">
                    Sub Image 1&nbsp;<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-6 w-full relative">
                      {uploading2 ? (
                        <div className="relative w-[120px] h-[120px] rounded-lg bg-gray-300 flex items-center justify-center">
                          <SpinnerWithText text="Uploading" />
                        </div>
                      ) : field.value && addons ? (
                        <Image
                          src={image2 || addons.sub_image1}
                          className="aspect-square object-cover rounded-lg bg-gray-300"
                          alt="add ons image 2"
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
                        {formErrors.sub_image1 && (
                          <p className="text-red-500">
                            {formErrors.sub_image1}
                          </p>
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
                  <FormLabel className="font-bold">
                    Sub Image 2&nbsp;<span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-6 w-full relative">
                      {uploading3 ? (
                        <div className="relative w-[120px] h-[120px] rounded-lg bg-gray-300 flex items-center justify-center">
                          <SpinnerWithText text="Uploading" />
                        </div>
                      ) : field.value && addons ? (
                        <Image
                          src={image3 || addons.sub_image2}
                          className="aspect-square object-cover rounded-lg bg-gray-300"
                          alt="add ons image 3"
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
                        />
                        {formErrors.sub_image2 && (
                          <p className="text-red-500">
                            {formErrors.sub_image2}
                          </p>
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2 justify-end">
              <Button
                onClick={() => setOpen(false)}
                variant="outline"
                className="border-luoDarkBiege text-luoDarkBiege"
                type="button"
              >
                Cancel
              </Button>
              <LoadingButton
                loading={isLoading}
                className="bg-luoDarkBiege"
                type="submit"
              >
                Add Add-Ons
              </LoadingButton>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default EditCakeForm;
