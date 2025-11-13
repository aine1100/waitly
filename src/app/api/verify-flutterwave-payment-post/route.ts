import { NextRequest, NextResponse } from "next/server";
import { Client } from "@notionhq/client";
import { Resend } from "resend";
import WaitlistEmail from "~/emails";

const notion = new Client({ auth: process.env.NOTION_SECRET });
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tx_ref, transaction_id } = body;

    if (!tx_ref && !transaction_id) {
      return NextResponse.json(
        { error: "Missing transaction reference" },
        { status: 400 }
      );
    }

    console.log("🔍 Verifying Flutterwave transaction:", { tx_ref, transaction_id });

    // Query Flutterwave API using tx_ref (our reference)
    const reference = tx_ref;
    console.log("📌 Making API call with tx_ref:", reference);
    
    const response = await fetch(
      `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        },
      }
    );

    const data = await response.json();

    console.log("📡 Flutterwave API response status:", data.status);
    console.log("📡 Flutterwave API full response:", JSON.stringify(data, null, 2));

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

        console.log("Processing successful payment:", {
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
                {
                  status: "successful",
                  message: "Payment verified but Notion not configured",
                },
                { status: 200 }
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
                        email: customer_email.includes('_') ? customer_email.split('_').slice(-1)[0].trim() : customer_email,
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
              to: customer_email.split('_').pop()?.trim(),
              subject: "Your Neurolab Device Preorder is Confirmed! 🎉",
              react: WaitlistEmail({
                userFirstname: customer_name.split(" ")[0],
                orderId: tx_ref,
                deviceQuantity: parseInt(device_quantity),
                amountPaid: amount * 100, // Convert to cents for email template
                customerEmail: customer_email.split('_').pop()?.trim(),
                orderDate: new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }),
              }),
            });
            console.log("✅ Email sent to:", customer_email.split('_').pop()?.trim());
            console.log("🎉 Successfully processed payment:", customer_email.split('_').pop()?.trim());
          } catch (error: any) {
            console.error("⚠️ Error processing payment confirmation:", error.message);
            // Still return success as payment was verified
          }
        } else {
          console.warn("⚠️ Missing customer details in transaction metadata");
        }
      }

      return NextResponse.json({
        status: transactionData.status, // "successful", "failed", "cancelled", etc.
        amount: transactionData.amount,
        customer_email: transactionData.customer?.email.split('_').pop()?.trim(),
        customer_name: transactionData.customer?.name,
        tx_ref: transactionData.tx_ref,
        flutterwave_id: transactionData.id,
      });
    } else {
      console.error("❌ Flutterwave verification failed:", data);
      return NextResponse.json(
        {
          error: data.message || "Unable to verify transaction with Flutterwave",
          status: "failed",
          details: data,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("❌ Error verifying Flutterwave payment:", error);
    return NextResponse.json(
      { error: "Failed to verify payment", details: error.message },
      { status: 500 }
    );
  }
}
