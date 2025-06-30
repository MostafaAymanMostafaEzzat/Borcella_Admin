import Collection from "@/lib/models/Collections";
import Product from "@/lib/models/Product";
import connectToDB from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";



export const GET = async (req: NextRequest, { params }: { params: { collectionId: string } }) => {

    try {
    await connectToDB()

    const collection = await Collection.findById(params.collectionId).populate("products")

    if (!collection) {
        return NextResponse.json("Collection not found", { status: 404 })
    }
  return NextResponse.json(collection, { status: 200 });
} catch (err) {
    console.log("[collection_GET]", err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }

} 

export const POST = async (
    req: NextRequest,
    { params }: { params: { collectionId: string } }
  ) => {
    try {
      const { userId } = await auth();
  
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      await connectToDB();
  
      let collection = await Collection.findById(params.collectionId);
  
      if (!collection) {
        return new NextResponse("Collection not found", { status: 404 });
      }
  
      const { title, description, image } = await req.json();
  
      if (!title || !image) {
        return new NextResponse("Title and image are required", { status: 400 });
      }
  
      collection = await Collection.findByIdAndUpdate(
        params.collectionId,
        { title, description, image },
        { new: true }
      );
  
      await collection.save();
  
      return NextResponse.json(collection, { status: 200 });
    } catch (err) {
      console.log("[collectionId_POST]", err);
      return new NextResponse("Internal error", { status: 500 });
    }
  };

  export const DELETE = async (
    req: NextRequest,
    { params }: { params: { collectionId: string } }
  ) => {
    try {
      const { userId } =await auth();
  
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      await connectToDB();
  
       const collectionDeleted = await Collection.findByIdAndDelete(params.collectionId);
       console.log("collectionDeleted", collectionDeleted);
      if (!collectionDeleted) {
        console.log("Collection not found");
        return new NextResponse("Collection not found", { status: 404 });
      }
  
      await Product.updateMany(
        { collections: params.collectionId },
        { $pull: { collections: params.collectionId } }
      );
      
      return new NextResponse("Collection is deleted", { status: 200 });
    } catch (err) {
      console.log("[collectionId_DELETE]", err);
      return new NextResponse("Internal error", { status: 500 });
    }
  };
