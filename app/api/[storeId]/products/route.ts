import prismadb from "@/lib/prismadb";

import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: {params: { storeId : string}}
){
    try {

        const body = await req.json();
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
            return new NextResponse("Unauthenticated", { status: 401 })
        }
        
        console.log(userId)
        if(!name){
            return new NextResponse("Name is required", { status: 400 })
        }
    
        if(!images || !images.length){
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

        const products = await prismadb.product.create({
        data: {
                userId,
                storeId: params.storeId,
                name,
                description, 
                price,
                categoryId,
                condition,
                location,
                images : {
                    createMany:{
                        data: [
                            ...images.map((image: {url:string}) => image)
                        ]
                    }
                }, 
            }
        });
    
        return NextResponse.json(products);
    } catch (error) {
        console.log('[PRODUCTS_POST]', error);
        return new NextResponse("Internal erorr", {status : 500});
    }
}


export async function GET(
    req: Request,
    { params }: {params: {storeId : string}}
){
    try {

        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId") || undefined

        if(!params.storeId) {
            return new NextResponse("Store id is required", { status: 400 })
        }


        const products = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
            },
            include : {
                images: true,
                category: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    
        return NextResponse.json(products);
    } catch (error) {
        console.log('[PRODUCTS_GET]', error);
        return new NextResponse("Internal erorr", {status : 500});
    }
}
