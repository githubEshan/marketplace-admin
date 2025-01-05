"use client";

import * as z from "zod";
import axios from "axios";

import { Chat } from "@prisma/client";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { AlertModal } from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";

const formSchema = z.object({
  fromUserId: z.string().min(1),
  toUserId: z.string().min(1),
});

interface ChatFormProps {
  initialData: Chat | null;
}

type ChatFormValues = z.infer<typeof formSchema>;

export const ChatForm: React.FC<ChatFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit Chat" : "Create A Chat";
  const description = initialData ? "Edit a chat" : "Add a new Chat";
  const toastMessage = initialData ? "Chat updated" : "Chat Created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<ChatFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      fromUserId: "",
      toUserId: "",
    },
  });

  const onSubmit = async (data: ChatFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/chats/${params.chatId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/chats`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/chats`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error("something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      await axios.delete(`/api/${params.storeId}/billboards/${params.chatId}`);
      router.refresh();
      router.push("/");
      toast.success("Store deleted");
    } catch (error) {
      toast.error("Make sure you removed all prodyucts and categories first");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex first-letter:items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="fromUserId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From Which User</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="From User"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="toUserId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To Which User</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="To User"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
};
