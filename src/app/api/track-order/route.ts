import { NextRequest, NextResponse } from "next/server";
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_SECRET });

export async function POST(req: NextRequest) {
  try {
    const { tx_ref } = await req.json();

    if (!tx_ref) {
      return NextResponse.json({ error: "Missing tx_ref" }, { status: 400 });
    }

    if (!process.env.NOTION_DB) {
      return NextResponse.json({ error: "Notion database not configured" }, { status: 500 });
    }

    // Query Notion by exact order_id rich_text match
    const resp = await notion.databases.query({
      database_id: process.env.NOTION_DB!,
      filter: {
        property: "order_id",
        rich_text: {
          equals: tx_ref,
        },
      },
      page_size: 1,
    });

    if (!resp.results.length) {
      return NextResponse.json(
        { error: "Order not found", status: "not_found" },
        { status: 404 }
      );
    }

    const page: any = resp.results[0];
    const props = page.properties || {};

    const name = props?.Name?.title?.[0]?.plain_text || null;
    const email = props?.Email?.email || null;
    const quantity = props?.PreOrders?.number ?? null;
    const status = props?.Status?.status?.name || null;

    return NextResponse.json({
      status: status,
      customer_name: name,
      customer_email: email,
      device_quantity: quantity,
      tx_ref,
    });
  } catch (err: any) {
    console.error("Track-order API error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch order" },
      { status: 500 }
    );
  }
}
