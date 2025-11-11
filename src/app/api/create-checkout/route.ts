import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

export async function POST(req: NextRequest) {
  try {
    const { name, email, quantity } = await req.json();

    // Validate inputs
    if (!name || !email || !quantity) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Neurolab Device Preorder",
              description: `Preorder for ${quantity} Neurolab Device(s) - Early Bird Special`,
              images: ["https://neurolab.cc/logo.png"], // Update with your actual logo URL
            },
            unit_amount: 25000, // $250.00 per device
          },
          quantity: parseInt(quantity),
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}?canceled=true`,
      customer_email: email,
      metadata: {
        customer_name: name,
        customer_email: email,
        device_quantity: quantity,
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
