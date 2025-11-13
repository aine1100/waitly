import { NextRequest, NextResponse } from "next/server";
import { Client } from "@notionhq/client";
import { Resend } from "resend";
import WaitlistEmail from "~/emails";

const notion = new Client({ auth: process.env.NOTION_SECRET });
const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tx_ref = searchParams.get("tx_ref");

    if (!tx_ref) {
      return NextResponse.json(
        { error: "Missing transaction reference" },
        { status: 400 }
      );
    }

    console.log("Verifying Flutterwave transaction:", tx_ref);

    // Query Flutterwave API to get transaction status
    const response = await fetch(
      `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${tx_ref}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        },
      }
    );

    const data = await response.json();

    if (data.status === "success") {
      const transactionData = data.data;

      console.log("✅ Transaction verified:", transactionData.status);

      // If transaction is successful, save to Notion and send email
      if (transactionData.status === "successful") {
        const customer_name = transactionData.customer?.name;
        const customer_email = transactionData.customer?.email;
        const amount = transactionData.amount;
        const metadata = transactionData.meta || {};
        const device_quantity = metadata.device_quantity;

        console.log(" Processing successful payment:", {
          customer_name,
          customer_email,
          device_quantity,
          amount,
        });

        if (customer_name && customer_email && device_quantity) {
          try {
            // Check environment variables
            if (!process.env.NOTION_DB) {
              console.error("❌ NOTION_DATABASE_ID not configured!");
              return NextResponse.json(
                { error: "Notion database not configured" },
                { status: 500 }
              );
            }

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
            console.log("🎉 Successfully processed payment:", customer_email);
          } catch (error: any) {
            console.error("⚠️ Error processing payment confirmation:", error.message);
            // Still return success as payment was verified
            // Notion/email errors shouldn't block the success response
          }
        }
      }

      return NextResponse.json({
        status: transactionData.status, // "successful", "failed", "cancelled", etc.
        amount: transactionData.amount,
        customer_email: transactionData.customer?.email,
        customer_name: transactionData.customer?.name,
        tx_ref: transactionData.tx_ref,
        flutterwave_id: transactionData.id,
      });
    } else {
      console.error("Flutterwave verify_by_reference failed:", data);
      return NextResponse.json(
        { error: data.message || "Unable to verify transaction", status: "failed", details: data },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error verifying Flutterwave payment:", error);
    return NextResponse.json(
      { error: "Failed to verify payment", details: error.message },
      { status: 500 }
    );
  }
}
