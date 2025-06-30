import Collection from "@/lib/models/Collections";
import Product from "@/lib/models/Product";
import connectToDB from "@/lib/mongoDB";
import { auth, getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {

    await connectToDB();

    const product = await Product.findById(params.productId).populate(
      "collections"
    );
    console.log('1')

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(product, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": `${process.env.ECOMMERCE_STORE_URL}`,
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.log("[product_GET]", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};


export const POST = async (
    req: NextRequest,
    { params }: { params: { productId: string } }
  ) => {

    try {
        const { userId } =await auth();
        if(!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        await connectToDB();
        
        const product = await Product.findById(params.productId);
        if (!product) {
          return NextResponse.json(
            { message: "Product not found" },
            { status: 404 }
          );
        }
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
            return NextResponse.json(
              { message: "Not enough data to create a new product" },
              { status: 400 }
            );
          }

          const addCollections = collections.filter(
            (collection: string) => !product.collections.includes(collection)
          )
            const removeCollections = product.collections.filter(
                (collection: string) => !collections.includes(collection)
            );

            await Promise.all([ 
                ...addCollections.map((collection: string) => Collection.findByIdAndUpdate(collection, {  $push: { products: product._id }})),
                ...removeCollections.map((collection: string) => Collection.findByIdAndDelete(collection, { $pull: { products: product._id } }))
            ])

            const updatedProduct = await Product.findByIdAndUpdate({
                _id: params.productId,
            }, {
                title,
                description,
                media,
                category,
                collections,
                tags,
                sizes,
                colors,
                price,
                expense
            }, { new: true })
            .populate("collections")
            
            return NextResponse.json(updatedProduct, {
                status: 200,
            });


    } catch (error) {
        console.log("[productId_POST]", error);
        return new NextResponse("Internal error", { status: 500 });
    }

  }


  export const DELETE = async (
    req: NextRequest,
    { params }: { params: { productId: string } }
  ) => {
    try {
      const { userId } =await auth();
  
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      await connectToDB();
  
      const product = await Product.findById(params.productId);
  
      if (!product) {
        return new NextResponse(
          JSON.stringify({ message: "Product not found" }),
          { status: 404 }
        );
      }
  
      await Product.findByIdAndDelete(product._id);
  
      // Update collections
      await Promise.all(
        product.collections.map((collectionId: string) =>
          Collection.findByIdAndUpdate(collectionId, {
            $pull: { products: product._id },
          })
        )
      );
  
      return new NextResponse(JSON.stringify({ message: "Product deleted" }), {
        status: 200,
      });
    } catch (err) {
      console.log("[productId_DELETE]", err);
      return new NextResponse("Internal error", { status: 500 });
    }
  };
  
  export const dynamic = "force-dynamic";