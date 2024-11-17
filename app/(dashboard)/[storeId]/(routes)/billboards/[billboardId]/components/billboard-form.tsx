"use client";


import * as z from "zod";
import axios from "axios";

import { Billboard } from "@prisma/client";
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

const formSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().min(1)
});

interface BillBoardFormProps {
    initialData: Billboard | null;
}

type BillboardFormValues = z.infer<typeof formSchema>;



export const BillBoardForm: React.FC<BillBoardFormProps> = ({
    initialData
}) => {

    const params = useParams();
    const router = useRouter();
    //const for api url from use-origin
    const origin = useOrigin();


    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)


    const title = initialData ? "Edit billboard" : "create billboard";
    const description = initialData ? "Edit a billboard" : "A a new billboard";
    const toastMessage = initialData ? "Billboard updated" : "Billboard created.";
    const  action = initialData ? "Save changes" : "create";


    const form = useForm<BillboardFormValues> ({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: '',
            imageUrl: ''
        }
    })


    const onSubmit = async(data: B) => {
        try {
            
            await axios.patch(`/api/stores/${params.storeId}`, data);
            router.refresh();
            toast.success("Store updated")

        } catch (error) {
            toast.error("sonmething went wrong")
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
            toast.error("Make sure you removed all prodyucts and categories first")
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
        <div className="flex first-letter:items-center justify-between">
            <Heading 

                title ="Settings"
                description ="Manage Stores"  
            />
            <Button 
                disabled = {loading}
                variant = "destructive"
                size ="icon"
                onClick = {() => setOpen(true)}  
            >
                <Trash className = "h-4 w-4" />
            </Button>
        </div>
        <Separator/>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                <div className="grid grid-cols-3 gap-8">
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
                <Button disabled = {loading} className="ml-auto" type="submit">
                    Save changes
                </Button>
            </form>
        </Form>
        <Separator/>
        <ApiAlert 
            title="NEXT_PUBLIC_API_URL" description= {`${origin}/api/${params.storeId}`} variant="public" />
        </>
    )
}