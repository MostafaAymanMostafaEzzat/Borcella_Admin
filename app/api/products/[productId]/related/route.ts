import Product from "@/lib/models/Product";
import connectToDB from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";



export const GET = async (  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
   try {
    await connectToDB();
    const product = await Product.findById(params.productId);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
    const relatedProducts = await Product.find({
      $or:[
        {collections: { $in: product.collections } },
        {category: product.category },
      ],
      _id: { $ne: product._id }
    })
    if(!relatedProducts || relatedProducts.length === 0) {
      return NextResponse.json(
        { message: "No related products found" },
        { status: 404 }
      );        
    }

    return NextResponse.json(relatedProducts, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": `${process.env.ECOMMERCE_STORE_URL}`,
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });

   } catch (error) {

    console.error("Error fetching related products:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
   }
   
}
export const dynamic = "force-dynamic";