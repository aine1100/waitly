"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Confetti, ConfettiRef } from "~/components/magicui/confetti";

interface PaymentData {
  status: string;
  amount?: number;
  customer_email?: string;
  customer_name?: string;
  tx_ref?: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const txRef = searchParams.get("tx_ref");
  const paymentMethod = searchParams.get("payment_method");
  const confettiRef = useRef<ConfettiRef>(null);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        setIsLoading(true);

        // If Flutterwave payment, verify the transaction
        if (paymentMethod === "flutterwave") {
          // Try to get tx_ref from URL, or from sessionStorage if not in URL
          let transactionRef = txRef;
          if (!transactionRef) {
            transactionRef = sessionStorage.getItem("flutterwave_tx_ref");
          }

          if (!transactionRef) {
            console.error("No transaction reference found");
            throw new Error("Transaction reference not found");
          }

          console.log("Verifying Flutterwave transaction:", transactionRef);
          
          // Use POST endpoint with tx_ref in body
          const response = await fetch("/api/verify-flutterwave-payment-post", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              tx_ref: transactionRef,
            }),
          });

          const data = await response.json();

          console.log("API response:", { status: response.status, data });

          if (!response.ok) {
            console.error("API response error:", data);
            throw new Error(data.error || "Failed to verify payment");
          }

          // Check if payment was successful
          if (data.status === "successful") {
            setPaymentData(data);
            // Clear the stored tx_ref
            sessionStorage.removeItem("flutterwave_tx_ref");
            // Trigger confetti on success
            setTimeout(() => {
              confettiRef.current?.fire({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: [
                  "#ff0000",
                  "#00ff00",
                  "#0000ff",
                  "#ffff00",
                  "#ff00ff",
                  "#00ffff",
                ],
              });
            }, 500);
          } else if (data.status === "cancelled") {
            router.push(`/failed?reason=cancelled`);
          } else {
            console.warn("Payment not successful, status:", data.status);
            router.push(`/failed?reason=failed`);
          }
        } else if (paymentMethod === "stripe" && sessionId) {
          // Handle Stripe verification (if needed in future)
          setPaymentData({
            status: "successful",
            tx_ref: sessionId,
          });
        } else {
          throw new Error("Invalid payment parameters");
        }
      } catch (err: any) {
        console.error("Error verifying payment:", err);
        setError(err.message || "Failed to verify payment");
        router.push(`/failed?reason=timeout`);
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [txRef, paymentMethod, sessionId, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-background border border-border rounded-2xl p-8 shadow-lg">
            <div className="flex flex-col items-center gap-4">
              <svg
                className="animate-spin h-12 w-12 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <h2 className="text-xl font-semibold text-foreground">Verifying Payment...</h2>
              <p className="text-muted-foreground">Please wait while we confirm your transaction.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Only show success page when verification definitively succeeded
  if (!paymentData || paymentData.status !== "successful") {
    // If verification failed, we already navigated to /failed via router.push
    // Return a minimal placeholder to avoid flashing the success UI
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-background border border-border rounded-2xl p-8 shadow-lg">
            <h2 className="text-xl font-semibold text-foreground">Redirecting...</h2>
            <p className="text-muted-foreground text-sm">Taking you to the appropriate page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Confetti
        ref={confettiRef}
        className="fixed inset-0 z-50 pointer-events-none"
        manualstart={true}
      />

      <div className="max-w-md w-full text-center">
        <div className="bg-background border border-border rounded-2xl p-8 shadow-lg">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-10 h-10 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Payment Successful! 🎉
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Thank you for your preorder! You're now on the exclusive waitlist for the Neurolab Device at $250 per device.
          </p>

          {/* Details */}
          <div className="bg-muted/50 rounded-xl p-6 mb-6 text-left">
            <h2 className="font-semibold text-foreground mb-3">What's Next?</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>You'll receive a confirmation email shortly</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>We'll keep you updated on production progress</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Your device will ship in early 2026</span>
              </li>
            </ul>
          </div>

          {/* Order ID (for reference) */}
          {(txRef || sessionId) && (
            <p className="text-xs text-muted-foreground mb-6">
              Order ID: {(txRef || sessionId)?.slice(-12) || "N/A"}
            </p>
          )}

          {/* Back to Home Button */}
          <Link
            href="/"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background p-4"><div className="text-muted-foreground">Loading...</div></div>}>
      <SuccessContent />
    </Suspense>
  );
}
