"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

// Re-fetches the dashboard on an interval (and on demand) so new form submissions appear without a reload.
export default function AutoRefresh({ seconds }: { seconds: number }) {
  const router = useRouter();
  const [updatedAt, setUpdatedAt] = useState(() => new Date());
  const [pending, startTransition] = useTransition();
  function refresh() {
    startTransition(() => { router.refresh(); setUpdatedAt(new Date()); });
  }
  useEffect(() => {
    const interval = setInterval(refresh, seconds * 1000);
    return () => clearInterval(interval);
  });
  return (
    <>
      <span className="hidden items-center gap-2 text-xs text-ink/60 md:flex" title={`Refreshes every ${seconds}s`}>
        <span className="size-2 animate-pulse rounded-full bg-green-500" aria-hidden="true" />
        Live · {updatedAt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
      </span>
      <button type="button" onClick={refresh} disabled={pending} className="flex h-10 cursor-pointer items-center gap-2 rounded-full border border-ink/15 bg-white px-4 text-sm font-medium transition-colors hover:border-brand hover:text-brand disabled:cursor-wait" aria-label="Refresh leads">
        <svg viewBox="0 0 24 24" className={`size-4 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] ${pending ? "animate-spin" : ""}`} aria-hidden="true"><path d="M21 12a9 9 0 1 1-2.64-6.36L21 8" /><path d="M21 3v5h-5" /></svg>
        <span className="max-sm:sr-only">Refresh</span>
      </button>
    </>
  );
}
