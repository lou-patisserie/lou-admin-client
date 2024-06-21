"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../UI/Form";
import { Input } from "../../UI/Input";
import { useToast } from "../../UI/Toast/use-toast";
import { useState } from "react";
import { LoadingButton } from "@/components/UI/LoadingButton";
import { addProductType } from "@/api/product-type-api";
import { Button } from "@/components/UI/Button";
import { formSchema } from "./schemas";

interface AddTypeProps {
  setOpen: (open: boolean) => void;
  refetch: () => void;
}

const AddProductTypeForm = ({ setOpen, refetch }: AddTypeProps) => {
  const [isLoading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      desc: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const response = await addProductType(values);
      if (response.success) {
        setLoading(false);
        toast({
          description: "Product type added successfully!",
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
                    <Input {...field} />
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
          <div className="flex gap-2 justify-end">
            <Button
              onClick={() => setOpen(false)}
              variant="outline"
              className="border-luoDarkBiege text-luoDarkBiege"
              type="button"
            >
              Cancel
            </Button>
            <LoadingButton loading={isLoading} className="bg-luoDarkBiege" type="submit">
              Add Type
            </LoadingButton>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddProductTypeForm;
