import Product from "@/lib/models/Product";
import connectToDB from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { query: string } }
) => {
  try {
    await connectToDB();
    const { query } = params;
console.log('query', query)
    // Search for products by title or description
    const products = await Product.find({
      $or: [
        { title: { $regex: query, $options: "i" }  },
        { category: { $regex: query, $options: "i" } },
        { tags: { $in: [new RegExp(query, "i")] } },
      ],
    });
console.log('22222222222')

    return NextResponse.json(products, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": `*`,
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });

  } catch (error) {
    console.error("[search_GET]", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
