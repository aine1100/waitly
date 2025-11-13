"use client";

import { useEffect, useMemo, useState } from "react";

interface VerifyResponse {
  status: string | null;
  customer_email?: string | null;
  customer_name?: string | null;
  device_quantity?: number | null;
  tx_ref?: string;
  error?: string;
}

export default function TrackOrderModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [txRef, setTxRef] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<VerifyResponse | null>(null);

  useEffect(() => {
    if (open) {
      const stored = sessionStorage.getItem("flutterwave_tx_ref");
      if (stored) setTxRef(stored);
    } else {
      setError(null);
      setData(null);
      setLoading(false);
    }
  }, [open]);

  const verify = async (ref: string) => {
    try {
      setLoading(true);
      setError(null);
      setData(null);
      const res = await fetch("/api/track-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tx_ref: ref.trim() }),
      });
      const json: VerifyResponse = await res.json();
      if (!res.ok) throw new Error(json.error || "Unable to verify order");
      setData(json);
    } catch (e: any) {
      setError(e.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txRef.trim()) {
      setError("Please enter your order reference (tx_ref)");
      return;
    }
    await verify(txRef);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg mx-auto bg-background border border-border rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-foreground">Track your order</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Enter the reference shown after payment (tx_ref).</p>

        <form onSubmit={onSubmit} className="flex gap-2 mb-4">
          <input
            type="text"
            value={txRef}
            onChange={(e) => setTxRef(e.target.value)}
            placeholder="e.g. NEUROLAB-1731412345-abc123"
            className="flex-1 bg-background border border-border text-foreground px-4 py-3 rounded-xl focus:outline-1 focus:outline-offset-4 focus:outline-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-3 rounded-xl disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Checking..." : "Check"}
          </button>
        </form>

        {error && <div className="mb-3 text-sm text-red-600 dark:text-red-400">{error}</div>}

        {data && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <StatusBadge status={data.status} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Customer</span>
              <span className="text-foreground font-medium">{data.customer_name || "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-foreground font-medium truncate max-w-[60%] text-right">{data.customer_email || "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Devices</span>
              <span className="text-foreground font-medium">{data.device_quantity ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Reference</span>
              <span className="text-foreground font-mono text-xs">{data.tx_ref || txRef}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const cls =
    status === "successful"
      ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
      : status === "pending"
      ? "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800"
      : "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800";
  return <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${cls}`}>{status ?? "unknown"}</span>;
}
