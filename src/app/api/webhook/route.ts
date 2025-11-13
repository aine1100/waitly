import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { error: "Stripe webhook is disabled. Please use the Flutterwave webhook." },
    { status: 410 }
  );
}