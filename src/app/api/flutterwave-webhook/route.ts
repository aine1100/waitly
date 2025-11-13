import { NextRequest, NextResponse } from "next/server";
import { Client } from "@notionhq/client";
import { Resend } from "resend";
import WaitlistEmail from "~/emails";
import crypto from "crypto";

const notion = new Client({ auth: process.env.NOTION_SECRET });
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  console.log("🔔 Flutterwave Webhook received!");

  try {
    const body = await req.json();
    const signature = req.headers.get("verif-hash");

    // Verify webhook signature
    if (!signature) {
      console.error("❌ No signature provided");
      return NextResponse.json(
        { error: "No signature provided" },
        { status: 400 }
      );
    }

    // Check if webhook secret is configured
    if (!process.env.FLUTTERWAVE_WEBHOOK_SECRET) {
      console.error("❌ FLUTTERWAVE_WEBHOOK_SECRET not configured!");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    // Verify the webhook signature
    const secretHash = process.env.FLUTTERWAVE_WEBHOOK_SECRET;
    if (signature !== secretHash) {
      console.error("❌ Invalid webhook signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    console.log("✅ Webhook signature verified. Event:", body.event);

    // Handle successful payment
    if (body.event === "charge.completed" && body.data.status === "successful") {
      console.log("💳 Processing successful payment");

      const { customer, amount, tx_ref, id } = body.data;
      const metadata = body.data.meta || {};

      const customer_name = metadata.customer_name || customer.name;
      const customer_email = metadata.customer_email.split('_').pop()?.trim() || customer.email.split('_').pop()?.trim();
      const device_quantity = metadata.device_quantity;

      console.log("📋 Payment data:", { customer_name, customer_email, device_quantity, amount });

      if (!customer_name || !customer_email || !device_quantity) {
        console.error("❌ Missing metadata in payment");
        return NextResponse.json(
          { error: "Missing metadata" },
          { status: 400 }
        );
      }

      // Verify the transaction with Flutterwave
      console.log("🔍 Verifying transaction with Flutterwave...");
      const verifyResponse = await fetch(
        `https://api.flutterwave.com/v3/transactions/${id}/verify`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
          },
        }
      );

      const verifyData = await verifyResponse.json();

      if (verifyData.status !== "success" || verifyData.data.status !== "successful") {
        console.error("❌ Transaction verification failed");
        return NextResponse.json(
          { error: "Transaction verification failed" },
          { status: 400 }
        );
      }

      console.log("✅ Transaction verified successfully");

      // Check environment variables
      if (!process.env.NOTION_DB) {
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
            database_id: process.env.NOTION_DB!,
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
            amount: {
              number: amount,
            },
            // Add Order ID (Flutterwave Transaction ID)
            order_id: {
              rich_text: [
                {
                  text: {
                    content: tx_ref,
                  },
                },
              ],
            },
            // Add Status
            Status: {
              status: {
                name: "Waiting",
              },
            },
          },
        });
        console.log("✅ Added to Notion:", notionResponse.id);

        // Send confirmation email
        console.log("📧 Sending confirmation email...");
        await resend.emails.send({
          from: "Neurolab <info@neurolab.cc>",
          to: customer_email,
          subject: "Your Neurolab Device Preorder is Confirmed! 🎉",
          react: WaitlistEmail({
            userFirstname: customer_name.split(" ")[0],
            orderId: tx_ref,
            deviceQuantity: parseInt(device_quantity),
            amountPaid: amount * 100, // Convert to cents for email template
            customerEmail: customer_email,
            orderDate: new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          }),
        });
        console.log("✅ Email sent to:", customer_email);

        console.log("🎉 Successfully processed Flutterwave payment:", customer_email);
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

    return NextResponse.json({ status: "success" });
  } catch (error: any) {
    console.error("❌ Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed", details: error.message },
      { status: 500 }
    );
  }
}
