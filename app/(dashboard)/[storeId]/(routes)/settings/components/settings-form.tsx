"use client";


import * as z from "zod";
import axios from "axios";

import { Store } from "@prisma/client";
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
    FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast }from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";

interface SettingsFormProps {
    initialData: Store;
}

type SettingsFormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
    name: z.string().min(1),
});


export const SettingsForm: React.FC<SettingsFormProps> = ({
    initialData
}) => {

    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    //const for api url from use-origin
    const origin = useOrigin();

    const form = useForm<SettingsFormValues> ({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    })


    const onSubmit = async(data: SettingsFormValues) => {
        try {
            
            await axios.patch(`/api/stores/${params.storeId}`, data);
            router.refresh();
            toast.success("Store updated")

        } catch (error) {
            toast.error("something went wrong")
        }
        finally{
            setLoading(false)
        }
    }


    const onDelete = async() => {
        try {
            await axios.delete(`/api/stores/${params.storeId}`);
            router.refresh()
            router.push("/")
            toast.success("Store deleted")
        } catch (error) {
            toast.error("Make sure you removed all products and categories first")
        }
        finally{
            setLoading(false)
            setOpen(false)
        }
    }

    return (
        <>
        <AlertModal
            isOpen = {open}
            onClose= {() => setOpen(false)}
            onConfirm={onDelete}
            loading= {loading}
        />
        <div className="flex items-center justify-between">
            <Heading 
                title ="Settings"
                description ="Manage Stores"  
            />
            <div className="mr-2 mt-2 space-y-4">
                <Button 
                    disabled = {loading}
                    variant = "destructive"
                    size ="icon"
                    onClick = {() => setOpen(true)}  
                >
                    <Trash className = "h-4 w-4" />
                </Button>
            </div>
        </div>
        <Separator/>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full ml-2">
                <div className="grid grid-cols-3 gap-8 ml-2">
                    <FormField 
                        control ={form.control}
                        name ="name"
                        render= {({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled = {loading} placeholder = "Store name"  {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <Button disabled = {loading} className="ml-2 mb-5" type="submit">
                    Save changes
                </Button>
            </form>
        </Form>
        <Separator className="space-y-4"/>
        <ApiAlert 
            title="NEXT_PUBLIC_API_URL" description= {`${origin}/api/${params.storeId}`} variant="public" />
        </>
    )
}