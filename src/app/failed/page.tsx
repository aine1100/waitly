"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function FailedContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") || "unknown";

  const getFailureMessage = () => {
    switch (reason) {
      case "cancelled":
        return "You cancelled the payment.";
      case "failed":
        return "The payment failed. Please try again.";
      case "timeout":
        return "The payment request timed out. Please try again.";
      default:
        return "An error occurred during payment processing.";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-background border border-border rounded-2xl p-8 shadow-lg">
          {/* Error Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-10 h-10 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Payment Failed 
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            {getFailureMessage()}
          </p>

          {/* Details */}
          <div className="bg-red-50 dark:bg-red-950/50 rounded-xl p-6 mb-6 text-left border border-red-200 dark:border-red-800">
            <h2 className="font-semibold text-foreground mb-3">What happened?</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>Your preorder was not confirmed</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>No charges have been made to your account</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>Please try again or contact support</span>
              </li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <Link
              href="/"
              className="flex-1 bg-background  h text-white font-semibold px-6 py-3 rounded-xl transition-all"
            >
              Back to Home
            </Link>
            <a
              href="mailto:info@neurolab.cc"
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition-all text-center"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FailedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background p-4"><div className="text-muted-foreground">Loading...</div></div>}>
      <FailedContent />
    </Suspense>
  );
}
