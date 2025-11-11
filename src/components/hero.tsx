"use client";

import { useState } from "react";
import People from "./people";
import { Logo } from "./svgs";
import Form from "./form";
import { ConfettiRef } from "./magicui/confetti";

export default function Hero({ 
  waitlistPeople, 
  confettiRef 
}: { 
  waitlistPeople: number;
  confettiRef?: React.RefObject<ConfettiRef>;
}) {
  const [isSuccess, setIsSuccess] = useState(false);
  const year = new Date().getFullYear();

  return (
    <div className="flex flex-col items-center justify-center gap-8 py-8 text-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex items-center justify-center">
          <Logo />
        </div>

        <div className="flex flex-col items-center justify-center gap-2">
          <p className="uppercase text-sm font-medium">
            launching early {year + 1}
          </p>
        </div>

        <h2 className="text-4xl font-bold text-foreground">
          {isSuccess ? "Preorder Confirmed!" : "Preorder Neurolab Device"}
        </h2>
        <p className="text-muted-foreground max-w-md">
          {isSuccess
            ? "Thank you for your preorder! We'll contact you with shipping details and updates as we prepare your Neurolab device."
            : "Reserve your Neurolab device today. Experience the next generation of AI-powered brain-computer interface technology. Limited quantities available."}
        </p>
      </div>

      <Form onSuccessChange={setIsSuccess} confettiRef={confettiRef} />

      <div className="flex items-center justify-center gap-2">
        <People count={waitlistPeople} />
      </div>
    </div>
  );
}
