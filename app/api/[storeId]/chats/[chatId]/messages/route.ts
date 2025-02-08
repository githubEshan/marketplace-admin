import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: {params: {storeId : string}}
){
    try {

        const body = await req.json();
        const { userId, text, chatId, } = body;
    
    
    
        if(!userId){
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if(!chatId){
            return new NextResponse("No chatId", { status: 401 })
        }

        if(!text){
            return new NextResponse("Can't send an empty message", { status: 401 })
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

        const message = await prismadb.message.create({
            data: {
                text,
                userId,
                chatId,
            }
        });
    
        return NextResponse.json(message);
    } catch (error) {
        console.log('[MESSAGE_POST]', error);
        return new NextResponse("Internal erorr", {status : 500});
    }
}


export async function GET(
    _req: Request,
    { params }: {params: {storeId : string, chatId: string}}
){
    try {

        if(!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 })
        }
        if(!params.chatId) {
            return new NextResponse("Chat id is required", { status: 400 })
        }


        const message  = await prismadb.message.findMany({
            where: {
                chatId: params.chatId,
            }
            
        });
    
        return NextResponse.json(message);
    } catch (error) {
        console.log('[MESSAGES_GET]', error);
        return new NextResponse("Internal erorr", {status : 500});
    }
}
