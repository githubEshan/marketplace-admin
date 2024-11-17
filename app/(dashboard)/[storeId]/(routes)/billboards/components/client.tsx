"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

export const BillboardClient = () => {

    const params = useParams();
    const router = useRouter();
    return (
        <>
            <div className="mr-2 flex items-center justify-between">
                <Heading  
                    title = "Billboards (0)"
                    description="manage billboards for your store"
                />
                <Button onClick={() => router.push(`/${params.storeId}/billboards/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add new
                </Button>
            </div>
            <Separator/>

        </>   
    )
}