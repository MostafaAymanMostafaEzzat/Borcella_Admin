import Collection from "@/lib/models/Collections";
import Product from "@/lib/models/Product";
import connectToDB from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";

import { NextRequest, NextResponse } from "next/server";



export const POST = async (req:NextRequest) => {

    try {

            const { userId } =await  auth();
        
            if (!userId) {
              return new NextResponse("Unauthorized", { status: 401 });
            }
        await connectToDB();
        const {
            title,
            description,
            media,
            category,
            collections,
            tags,
            sizes,
            colors,
            price,
            expense,
          } = await req.json();

          if (!title || !description || !media || !category || !price || !expense) {
            return new NextResponse("Not enough data to create a product", {
              status: 400,
            });
          };

        const newProduct =await Product.create({
            title,
            description,
            media,      
            category,
            collections,
            tags,
            sizes,
            colors,
            price,
            expense,
        });

        if(collections){

            const collection = await Collection.findById(collections);
            if (!collection) {
              return new NextResponse("Collection not found", { status: 404 });
            }
            collection.products.push(newProduct._id);
            await collection.save();
        }

        return NextResponse.json(newProduct, { status: 201 });

    } catch (error) {
        console.log("[products_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }


}



export const GET = async (req:NextRequest) => {
    try {
        await connectToDB();
        const products = await Product.find({}).populate("collections").sort({ createdAt: -1 });
        console.log('products' , products)
        return NextResponse.json(products, { status: 200 });
    } catch (error) {

        console.log("[GET_products]", error)
        return new NextResponse("Internal Error", { status: 500 });
        
    }


}