import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function GET(
    req: Request,
    { params }: {params: {messageId : string}}
) {

    try {
        if(!params.messageId){
            return new NextResponse("Message ID is required", {status: 400})
        }

        const message = await prismadb.message.findUnique
        ({
            where: {
                id: params.messageId,
            }
        });

        return NextResponse.json(message);
    }   catch(error){
        console.log('[MESSAGE_GET]', error);
        return new NextResponse("Internal erorr", {status : 500});
    }
};

export async function PATCH(
    req: Request,
    { params }: {params: {storeId : string, messageId : string}}
) {

    try {
        const body = await req.json()

        const { text, userId } = body;


        if(!userId){
            return new NextResponse("Unauthorised", { status: 401 })
        }

        if(!text){
            return new NextResponse("text is required", {status: 400})
        }

        if(!params.messageId){
            return new NextResponse("Message ID is required", {status: 400})
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

        const billboard = await prismadb.message.updateMany({
            where: {
                id: params.messageId
                
            },
            data: {
                text,
                userId,
            }
        });

        return NextResponse.json(billboard);
    }

    catch(error){
        console.log('[MESSAGE_PATCH]', error);
        return new NextResponse("Internal erorr", {status : 500});
    }
};

export async function DELETE(
    req: Request,
    { params }: {params: {storeId : string, messageId : string}}
) {

    try {
        const { userId } = auth();


        if(!userId){
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if(!params.messageId){
            return new NextResponse("message ID is required", {status: 400})
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


        const message = await prismadb.message.deleteMany({
            where: {
                id: params.messageId,
            }
        });

        return NextResponse.json(message);
    }

    catch(error){
        console.log('[MESSAGE_DELETE]', error);
        return new NextResponse("Internal erorr", {status : 500});
    }
};