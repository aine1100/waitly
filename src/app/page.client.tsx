"use client";

import { useRef } from "react";

import Faq from "~/components/faq";
import Footer from "~/components/footer";
import Hero from "~/components/hero";
import { Confetti, ConfettiRef } from "~/components/magicui/confetti";
import Powered from "~/components/powered";

export function LandingPage({ waitlistPeople }: { waitlistPeople: number }) {
  const confettiRef = useRef<ConfettiRef>(null);

  return (
    <main className="flex flex-col gap-8 row-start-2 items-center">
      <Hero waitlistPeople={waitlistPeople} confettiRef={confettiRef} />
      <Powered />
      <Faq />
      <Footer />
      <Confetti
        ref={confettiRef}
        className="absolute left-0 top-0 z-0 size-full pointer-events-none"
        manualstart={true}
      />
    </main>
  );
}
