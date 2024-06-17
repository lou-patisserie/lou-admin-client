"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../UI/Form";
import { Input } from "../../UI/Input";
import { authLogin } from "@/api/auth-api";
import { useToast } from "../../UI/Toast/use-toast";
import { useRecoilState } from "recoil";
import authState from "@/recoils/authState";
import { useState } from "react";
import { LoadingButton } from "../../UI/LoadingButton";
import { Router } from "lucide-react";
import { redirect } from "next/navigation";

const formSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const LoginForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [isAuthenticated, setAuthenticated] = useRecoilState(authState);
  const [isLoading, setLoading] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const response = await authLogin(values);
      if (response.success) {
        const token = response.data.token;
        const expirationTime = Date.now() + 60 * 60 * 1000;
        console.log("exp", expirationTime);

        const tokenData = {
          token: token,
          expirationTime: expirationTime,
        };

        sessionStorage.setItem("admin-token", JSON.stringify(tokenData));
        setAuthenticated(true);
        setLoading(false);
        toast({
          description: "login success!",
          className: "bg-green-600 text-white border-none",
          duration: 2000,
        });
        setTimeout(() => {
          window.location.replace("/dashboard");
        }, 2000);
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

  return (
    <div className="bg-white p-10 h-full w-full flex flex-col justify-center items-center sm:w-[80%] md:w-[60%] lg:w-[40%]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <LoadingButton
            loading={isLoading}
            disabled={!form.formState.isDirty || !form.formState.isValid}
          >
            Submit
          </LoadingButton>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
