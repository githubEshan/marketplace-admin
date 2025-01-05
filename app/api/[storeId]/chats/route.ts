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
        const { fromUserId, toUserId, productId } = body;
    
    
    
        if(!userId){
            return new NextResponse("Unauthenticated", { status: 401 })
        }
    
        if(!fromUserId){
            return new NextResponse("From UserId is required", { status: 400 })
        }

        if(!productId){
            return new NextResponse("Product id is required", { status: 400 })
        }
    
        if(!toUserId){
            return new NextResponse("To whichUserId is required", { status: 400 })
        }

        if(!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 })
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id : params.storeId,
                userId
            }
        });

        if(!storeByUserId) {
            return new NextResponse("Unauthorized", {status: 403})
        }

        const chat = await prismadb.chat.create({
            data: {
                fromUserId,
                toUserId,
                productId,
                storeId: params.storeId
            }
        });
    
        return NextResponse.json(chat);
    } catch (error) {
        console.log('[CHAT_POST]', error);
        return new NextResponse("Internal erorr", {status : 500});
    }
}


export async function GET(
    _req: Request,
    { params }: {params: {storeId : string}}
){
    try {

        if(!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 })
        }


        const chat = await prismadb.chat.findMany({
            where: {
                storeId: params.storeId
            }
            
        });
    
        return NextResponse.json(chat);
    } catch (error) {
        console.log('[CHAT_GET]', error);
        return new NextResponse("Internal erorr", {status : 500});
    }
}
