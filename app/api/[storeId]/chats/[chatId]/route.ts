import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";




export async function GET(
    req: Request,
    { params }: {params: {chatId : string}}
) {

    try {
        if(!params.chatId){
            return new NextResponse("Chat ID is required", {status: 400})
        }

        const chat = await prismadb.chat.findUnique
        ({
            where: {
                id: params.chatId,
            },
            include: {
                messages: true
            }
        });

        return NextResponse.json(chat);
    }   catch(error){
        console.log('[CHAT_GET]', error);
        return new NextResponse("Internal erorr", {status : 500});
    }
};

export async function PATCH(
    req: Request,
    { params }: {params: {storeId : string, chatId : string}}
) {

    try {
        const { userId } = auth();
        const body = await req.json()

        const { fromUserId, toUserId, productId, chatName, messages } = body;

        if(!userId){
            return new NextResponse("Unauthorised", { status: 401 })
        }
        if(!messages){
            return new NextResponse("Message is missing", { status: 401 })
        }

        if(!fromUserId){
            return new NextResponse("From UserId is required", { status: 400 })
        }
    
        if(!toUserId){
            return new NextResponse("To whichUserId is required", { status: 400 })
        }

        if(!params.chatId){
            return new NextResponse("Chat ID is required", {status: 400})
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id : params.storeId,
                userId
            }, 
        })

        if(!storeByUserId) {
            return new NextResponse("Unauthorized", {status: 403})
        }

        await prismadb.chat.update({
            where: {
                id: params.chatId
            },
            data: {
                chatName,
                fromUserId,
                toUserId,
                productId,
                messages : {
                    deleteMany : {}
                }
            }
        });

        const chat = await prismadb.chat.update({
            where: {
                id: params.chatId
            },
            data: {
                messages: {
                    createMany: {
                        data: [
                            ...messages.map((message : { text: string }) => message),
                        ]
                    }
                }
            }
        });

        return NextResponse.json(chat);
    }

    catch(error){
        console.log('[CHAT_PATCH]', error);
        return new NextResponse("Internal erorr", {status : 500});
    }
};

export async function DELETE(
    req: Request,
    { params }: {params: {storeId : string, chatId : string}}
) {

    try {
        const { userId } = auth();


        if(!userId){
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if(!params.chatId){
            return new NextResponse("Chat ID is required", {status: 400})
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id : params.storeId,
                userId
            }
        })

        if(!storeByUserId) {
            return new NextResponse("Unauthorized", {status: 403})
        }


        const chat = await prismadb.chat.deleteMany({
            where: {
                id: params.chatId,
            }, 
        });

        return NextResponse.json(chat);
    }

    catch(error){
        console.log('[CHAT_DELETE]', error);
        return new NextResponse("Internal erorr", {status : 500});
    }
};


