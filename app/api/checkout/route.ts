import { NextRequest, NextResponse } from "next/server";

import { stripe } from "@/lib/Stripe";
import connectToDB from "@/lib/mongoDB";
import Product from "@/lib/models/Product";
import { auth } from "@clerk/nextjs/server";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
     
      
    console.log("[checkout_POST]");
    const { cartItems, customer } = await req.json();
    if (!cartItems || !cartItems.length) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 });
    }
    if (!(customer.clerkId)) {
      return NextResponse.json(
        { error: "Customer email is required" },
        { status: 400 }
      );
    }
    await connectToDB();
    const cartItems_From_DataBase = await Promise.all(
      cartItems.map(
        async (card: {
          item: ProductType;
          quantity: number;
          color?: string;
          size?: string;
        }) => {
          const product_data = await Product.findOne({
            _id: card.item._id,
          });
          if (!product_data) {
            return NextResponse.json(
              { error: `Product with id ${card.item._id} not found` },
              { status: 404 }
            );
          }
          return {
            item: product_data,
            quantity: card.quantity,
            color: card.color,
            size: card.size,
          };
        }
      )
    );

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: cartItems_From_DataBase.map(
        (cart: {
          item: ProductType;
          quantity: number;
          color?: string;
          size?: string;
        }) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: cart.item.title,
              description: cart.item.description,
              metadata: {
                productId:JSON.stringify(cart.item._id),
                ...(cart.size && { size: cart.size }),
                ...(cart.color && { color: cart.color }),
              },
              images: [cart.item.media[0]],
            },
            unit_amount:Math.round( cart.item.price * 100),
          },
          quantity: cart.quantity,
        })
      ),

      shipping_address_collection: {
        allowed_countries: ["US", "EG"],
      },
      shipping_options: [
        { shipping_rate: "shr_1RdDFPIowy0UfmuCaku5GsFD" },
        { shipping_rate: "shr_1RdDGgIowy0UfmuCQrjrVh88" },
      ],
      client_reference_id: customer.clerkId,
      mode: "payment",
      success_url: `${process.env.ECOMMERCE_STORE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.ECOMMERCE_STORE_URL}/?canceled=true`,
    });
    return NextResponse.json(
      { sessionUrl: session.url },
      { headers: corsHeaders }
    );
  } catch (err) {
    console.log("[checkout_POST]", err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
