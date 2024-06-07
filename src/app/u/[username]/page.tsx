"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { messageSchema } from "@/schemas/messageSchema";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ApiResponse } from "@/types/ApiRespose";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useCompletion } from "ai/react";

const specialChar = "||";

const initialMessages =
  "Hi! there am a mystery messenger stalking you!!||I'm not sure why i admire you!||I am thinking of meeting you...";

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const page = () => {
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const { toast } = useToast();
  const params = useParams();
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: "/api/suggest-messages",
    initialCompletion: initialMessages,
  });

  const messageContent = form.watch("content");

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  const handleSendMessage = async (data: z.infer<typeof messageSchema>) => {
    setIsSendingMessage(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username: params.username,
        content: data.content,
      });
      if (!response.data.success) {
        toast({
          title: "Error",
          description:
            response.data.message ||
            "Something went wrong while sending message!",
          variant: "destructive",
        });
      }
      toast({
        title: "Success",
        description: "Message sent successfully!",
        variant: "default",
      });
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message || "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    try {
      complete("");
    } catch (error) {
      console.error("Error fetching messages:", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message || "Failed to fetch message",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl text-center font-bold mb-4">
        Public Profile Link
      </h1>
      <div className="mb-7">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSendMessage)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Send Anonymous Message to @{params.username}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type a message..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="bg-orange-400 hover:bg-orange-600"
              disabled={isSendingMessage || !messageContent}
            >
              {isSendingMessage ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending..
                </>
              ) : (
                "Send Message"
              )}
            </Button>
          </form>
        </Form>
      </div>
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">
          Not sure what to ask? try the below AI suggested messages...
        </h2>
        <div className="flex flex-wrap gap-2">
          {error ? (
            <p className="text-red-500">{error.message}</p>
          ) : (
            parseStringMessages(completion).map((message, index) => (
              <Button
                key={index}
                className="bg-slate-400 hover:ease-in-out"
                onClick={() => handleMessageClick(message)}
              >
                {isSuggestLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating
                    messages..
                  </>
                ) : (
                  message
                )}
              </Button>
            ))
          )}
        </div>
        <Button className="mt-3 rounded-full" onClick={fetchSuggestedMessages}>
          Generate AI messages✨
        </Button>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col justify-center items-center mt-2">
        <h2 className="text-lg font-semibold mb-4">
          Want to create your own message board?
        </h2>
        <Link href="/sign-up">
          <Button className="bg-orange-400 hover:bg-orange-600 rounded-full">
            Get started
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default page;
