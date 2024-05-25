"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { verifytokenSchema } from "@/schemas/verifySchema";
import { useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiRespose";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackgroundBeams } from "@/components/ui/background-beams";

const verifyAccount = () => {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();
  const params = useParams();
  const form = useForm<z.infer<typeof verifytokenSchema>>({
    resolver: zodResolver(verifytokenSchema),
  });

  const onSubmit = async (data: z.infer<typeof verifytokenSchema>) => {
    setIsVerifying(true);
    try {
      const response = await axios.post(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });
      if (response.data.success) {
        toast({
          title: "Success",
          description: response.data.message,
        });
        router.replace(`/sign-in`);
      } else {
        toast({
          title: "Request Failure",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Failed to verify code.",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <BackgroundBeams />
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md z-20">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OTP</FormLabel>
                  <FormControl>
                    <Input placeholder="Please enter your OTP" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isVerifying}>
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying..
                </>
              ) : (
                "Verify Code"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default verifyAccount;
