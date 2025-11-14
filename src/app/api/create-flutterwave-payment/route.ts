import { NextRequest, NextResponse } from "next/server";

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

    const amount = 250 * parseInt(quantity); // $250 per device
    const tx_ref = `NEUROLAB-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Create payment payload using Flutterwave Standard API
    const payload = {
      tx_ref: tx_ref,
      amount: amount,
      currency: "USD",
      redirect_url: `${req.headers.get("origin")}/success?tx_ref=${tx_ref}&payment_method=flutterwave`,
      payment_options: "card,banktransfer,ussd",
      customer: {
        email: email.includes('_') ? email.split('_').slice(-1)[0].trim() : email,
        name: name,
      },
      customizations: {
        title: "Neurolab Device Preorder",
        description: `Preorder for ${quantity} Neurolab Device(s) - Early Bird Special`,
        logo: "https://neurolab.cc/logo.png", // Update with your actual logo URL
      },
      meta: {
        customer_name: name,
        customer_email:email.includes('_') ? email.split('_').slice(-1)[0].trim() : email,
        device_quantity: quantity,
      },
    };

    // Initialize payment using Flutterwave API
    const response = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (data.status === "success") {
      return NextResponse.json({
        status: "success",
        link: data.data.link,
        tx_ref: tx_ref,
      });
    } else {
      throw new Error(data.message || "Failed to initialize payment");
    }
  } catch (error: any) {
    console.error("Flutterwave payment error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create payment" },
      { status: 500 }
    );
  }
}
