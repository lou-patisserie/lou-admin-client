"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../UI/Form";
import { Input } from "../../UI/Input";
import { useToast } from "../../UI/Toast/use-toast";
import { useCallback, useEffect, useState } from "react";
import { LoadingButton } from "@/components/UI/LoadingButton";
import { Button } from "@/components/UI/Button";
import SpinnerWithText from "@/components/UI/Spinner";
import { formSchema } from "./schemas";
import { ProfileType } from "@/types/data-types";
import { adminProfileById, editProfile } from "@/api/auth-api";
import { Eye, EyeOff } from "lucide-react";

interface EditTypesProps {
  setOpen: (open: boolean) => void;
  profileId: string;
  refetch: () => void;
}

const EditProductTypeForm = ({ setOpen, profileId, refetch }: EditTypesProps) => {
  const [show, setShow] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [isLoading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const adminTokenString =
    typeof window !== "undefined" ? sessionStorage.getItem("admin-token") : null;
  const adminToken = adminTokenString ? JSON.parse(adminTokenString) : null;

  const fetchType = useCallback(async () => {
    setFetching(true);
    try {
      const response = await adminProfileById(adminToken.token, profileId);
      if (response.success) {
        setFetching(false);
        setProfile(response.data);
      }
    } catch (error) {
      setFetching(false);
      console.error(error);
    }
  }, [adminToken.token, profileId]);

  useEffect(() => {
    fetchType();
  }, [fetchType]);

  useEffect(() => {
    if (profile) {
      form.reset({
        username: profile.username || "",
        email: profile.email || "",
        password: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const newValue = {
      ...values,
      avatar: "",
    };
    try {
      const response = await editProfile(adminToken.token, profileId, newValue);
      if (response.success) {
        setLoading(false);
        toast({
          description: "Profile updated successfully!",
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

  const toggleShow = () => {
    setShow(prev => !prev);
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
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Password / New password</FormLabel>
                  <FormControl>
                    <div className="flex gap-2 items-center relative">
                      <Input type={show ? "text" : "password"} {...field} />
                      {show ? (
                        <Eye onClick={toggleShow} className="absolute right-4" />
                      ) : (
                        <EyeOff onClick={toggleShow} className="absolute right-4" />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
