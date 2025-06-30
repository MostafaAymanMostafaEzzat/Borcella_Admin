import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";
import connectToDB from "@/lib/mongoDB";
import { stripe } from "@/lib/Stripe";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    console.log("[webhook_POST]");
    const body = await req.text();
    const signature = req.headers.get("stripe-signature") || "";

    // Verify the webhook signature
    console.log("Verifying webhook signature...");
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
    console.log("Webhook signature verified successfully.");
    // Handle the event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      // console.log("Checkout session completed:", session);
      const customerInfo = {
        clerkId: session.client_reference_id,
        email: session.customer_details?.email,
        name: session.customer_details?.name,
      };

      const shippingAddress = {
        street: (session as any)?.shipping_details?.address?.line1,
        city: (session as any)?.shipping_details?.address?.city,
        state: (session as any)?.shipping_details?.address?.state,
        postalCode: (session as any)?.shipping_details?.address?.postal_code,
        country: (session as any)?.shipping_details?.address?.country,
      };

      const retrivedSession = await stripe.checkout.sessions.retrieve(
        session.id,
        {
          expand: ["line_items.data.price.product"],
        }
      );
      const line_items = retrivedSession?.line_items?.data;
      console.log("Retrieved session:", line_items);

      await connectToDB();
      
      const orderDetails = {
        customerClerkId: customerInfo.clerkId,
        products: line_items?.map((item: any) => ({
          product:JSON.parse(item.price.product.metadata.productId),
          color: item.price.product.metadata.color || null,
          size: item.price.product.metadata.size || null,
          quantity: item.quantity,
        })),
        shippingAddress: shippingAddress,
        shippingRate: session?.shipping_cost?.shipping_rate,
        totalAmount: session.amount_total ? session.amount_total / 100 : 0,
      };
      const order = await Order.create(orderDetails);
      console.log("Order created successfully:", order);

      const customer = await Customer.findOne({
        clerkId: customerInfo.clerkId,
      });
      if (customer) {
        customer.orders.push(order._id);
        await customer.save();
      } else {
        const newCustomer = await Customer.create({
          ...customerInfo,
          orders: [order._id],
        });
      }
      
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
};
