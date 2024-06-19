"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../UI/Form";
import { Input } from "../../UI/Input";
import { useToast } from "../../UI/Toast/use-toast";
import { useCallback, useEffect, useState } from "react";
import { LoadingButton } from "@/components/UI/LoadingButton";
import { addProductType, editProductType, getProductTypeById } from "@/api/product-type-api";
import { Button } from "@/components/UI/Button";
import { formSchema } from "./schemas";
import { TypeById } from "@/types/data-types";
import SpinnerWithText from "@/components/UI/Spinner";

interface EditTypesProps {
  setOpen: (open: boolean) => void;
  typeId: string;
  refetch: () => void;
}

const EditProductTypeForm = ({ setOpen, typeId, refetch }: EditTypesProps) => {
  const [fetching, setFetching] = useState(false);
  const [type, setType] = useState<TypeById | null>(null);
  const [isLoading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: type?.name || "",
      desc: type?.desc || "",
    },
  });

  const fetchType = useCallback(async () => {
    setFetching(true);
    try {
      const response = await getProductTypeById(typeId);
      if (response.success) {
        setFetching(false);
        setType(response.data);
      }
    } catch (error) {
      setFetching(false);
      console.error(error);
    }
  }, [typeId]);

  useEffect(() => {
    fetchType();
  }, [fetchType]);

  useEffect(() => {
    if (type) {
      form.reset({
        name: type.name,
        desc: type.desc,
      });
    }
  }, [form, type]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const response = await editProductType(typeId, values);
      if (response.success) {
        setLoading(false);
        toast({
          description: "Product type updated successfully!",
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

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <div className="md:max-w-md">
      {fetching ? (
        <div className="min-w-[325px] min-h-[200px] flex justify-center items-center">
          <SpinnerWithText text="Loading..." />
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-2">
            <>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold">Name</FormLabel>
                    <FormControl>
                      <Input {...field} defaultValue={type?.name} />
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
                    <FormLabel className="font-bold">Description</FormLabel>
                    <FormControl>
                      <Input {...field} defaultValue={type?.name} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
            <div className="flex gap-2 min-w-fit justify-end">
              <Button
                onClick={() => setOpen(false)}
                variant="outline"
                className="border-luoDarkBiege text-luoDarkBiege"
                type="button"
              >
                Cancel
              </Button>
              <LoadingButton loading={isLoading} className="bg-luoDarkBiege" type="submit">
                Update
              </LoadingButton>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default EditProductTypeForm;
