import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Client } from "@notionhq/client";
import { Resend } from "resend";
import WaitlistEmail from "~/emails";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  console.log("🔔 Webhook received!");
  
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    console.error("❌ No signature provided");
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    );
  }

  // Check if webhook secret is configured
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("❌ STRIPE_WEBHOOK_SECRET not configured!");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log("✅ Webhook signature verified. Event type:", event.type);
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    console.log("💳 Processing checkout.session.completed event");
    const session = event.data.object as Stripe.Checkout.Session;

    const { customer_name, customer_email, device_quantity } = session.metadata || {};
    console.log("📋 Metadata:", { customer_name, customer_email, device_quantity });

    if (!customer_name || !customer_email || !device_quantity) {
      console.error("❌ Missing metadata in session");
      return NextResponse.json(
        { error: "Missing metadata" },
        { status: 400 }
      );
    }

    // Check environment variables
    if (!process.env.NOTION_DATABASE_ID) {
      console.error("❌ NOTION_DATABASE_ID not configured!");
      return NextResponse.json(
        { error: "Notion database not configured" },
        { status: 500 }
      );
    }

    try {
      console.log("💾 Adding to Notion database...");
      // Add to Notion database
      const notionResponse = await notion.pages.create({
        parent: {
          database_id: process.env.NOTION_DATABASE_ID!,
        },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: customer_name,
                },
              },
            ],
          },
          Email: {
            email: customer_email,
          },
          PreOrders: {
            number: parseInt(device_quantity),
          },
          Status: {
            select: {
              name: "Waiting",
            },
          },
          amount: {
            number: session.amount_total ? session.amount_total / 100 : 0,
          },
        },
      });
      console.log("✅ Added to Notion:", notionResponse.id);

      // Send confirmation email
      console.log("📧 Sending confirmation email...");
      await resend.emails.send({
        from: "Neurolab <onboarding@resend.dev>", // Update with your verified domain
        to: customer_email,
        subject: "Your Neurolab Device Preorder is Confirmed! 🎉",
        react: WaitlistEmail({ userFirstname: customer_name.split(" ")[0] }),
      });
      console.log("✅ Email sent to:", customer_email);

      console.log("🎉 Successfully processed payment and added to waitlist:", customer_email);
    } catch (error: any) {
      console.error("❌ Error processing payment confirmation:", error);
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
      return NextResponse.json(
        { error: "Failed to process payment confirmation", details: error.message },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
