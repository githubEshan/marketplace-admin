import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: {params: {storeId : string}}
){
    try {

        const { userId } = auth();
        const body = await req.json();
        const { label, imageUrl } = body;
    
    
    
        if(!userId){
            return new NextResponse("Unauthorised", { status: 401 })
        }
    
        if(!label){
            return new NextResponse("Label is required", { status: 400 })
        }
    
        if(!imageUrl){
            return new NextResponse("ImageUrl is required", { status: 400 })
        }

        if(params.storeId) {
            return new NextResponse("Store id is required", { status: 400 })
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id : params.storeId,
                userId
            }
        }
        )
    
        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId
            }
        });
    
        return NextResponse.json(billboard);
    } catch (error) {
        console.log('[BILLBOARDS_POST]', error);
        return new NextResponse("Internal erorr", {status : 500});
    }
}
