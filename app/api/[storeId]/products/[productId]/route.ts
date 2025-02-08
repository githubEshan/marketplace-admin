import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";


export async function GET(
    req: Request,
    { params }: {params: {productId : string}}
) {

    try {
        if(!params.productId){
            return new NextResponse("Product ID is required", {status: 400})
        }

        const products = await prismadb.product.findUnique
        ({
            where: {
                id: params.productId,
            },
            include: {
                images: true,
                category: true,
            }
        });

        return NextResponse.json(products);
    }   catch(error){
        console.log('[PRODUCT_GET]', error);
        return new NextResponse("Internal erorr", {status : 500});
    }
};

export async function PATCH(
    req: Request,
    { params }: {params: {storeId : string, productId : string}}
) {

    try {
        const body = await req.json()

        const { 
            userId,
            images, 
            name,
            description, 
            price,
            categoryId,
            condition,
            location,
         } = body

        

        if(!userId){
            return new NextResponse("Unauthorised", { status: 401 })
        }

        if(!name){
            return new NextResponse("Name is required", { status: 400 })
        }
    
        if(!images){
            return new NextResponse("Images for product is required", { status: 400 })
        }
        if(!description){
            return new NextResponse("Description for product is required", { status: 400 })
        }
        if(!price){
            return new NextResponse("Price for product is required", { status: 400 })
        }
        if(!categoryId){
            return new NextResponse("Product Category is required", { status: 400 })
        }
        if(!condition){
            return new NextResponse("Condition of product is required", { status: 400 })
        }
        if(!location){
            return new NextResponse("Location for product exchange is required", { status: 400 })
        }

        if(!params.productId){
            return new NextResponse("Product ID is required", {status: 400})
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

        await prismadb.product.update({
            where: {
                id: params.productId,
                userId
                
            },
            data: { 
                userId,
                name,
                description, 
                price,
                categoryId,
                condition,
                location,
                images: {
                    deleteMany : {}
                },
            }
        });

        const product = await prismadb.product.update({
            where: {
                id: params.productId
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map((image : { url: string }) => image),
                        ]
                    }
                }
            }
        });

        return NextResponse.json(product);
    }

    catch(error){
        console.log('[PRODUCT_PATCH]', error);
        return new NextResponse("Internal erorr", {status : 500});
    }
};

export async function DELETE(
    req: Request,
    { params }: {params: {storeId : string, productId : string}}
) {

    try {

        const body = await req.json()

        const { 
            userId,
            
         } = body

        if(!userId){
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if(!params.productId){
            return new NextResponse("Product ID is required", {status: 400})
        }

        const product = await prismadb.product.deleteMany({
            where: {
                id: params.productId,
                userId
            }
        });

        return NextResponse.json(product);
    }

    catch(error){
        console.log('[PRODUCT_DELETE]', error);
        return new NextResponse("Internal erorr", {status : 500});
    }
};