import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: {params: {storeId : string, productId: string}}
){
    try {

        
        const body = await req.json();
        const { fromUserId, toUserId, productId, chatName, messages } = body;
    
    
    
    
    
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


        const chat = await prismadb.chat.create({
            data: {
                fromUserId,
                chatName,
                toUserId,
                productId,
                storeId: params.storeId,
                messages : {
                    createMany : {
                        data : [
                            ...messages.map((message: {text: string})=> message)
                        ]
                    }
                }
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
            }, 
            include : {
                messages: true
            },
            orderBy: {
                createdAt: 'desc'
            }
            
        });
    
        return NextResponse.json(chat);
    } catch (error) {
        console.log('[CHAT_GET]', error);
        return new NextResponse("Internal erorr", {status : 500});
    }
}
