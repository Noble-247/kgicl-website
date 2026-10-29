import { isReview } from "@/lib/mode";

/** Shown only in review mode; never blocks the action bar or form controls. */
export function ReviewBadge() {
  if (!isReview()) return null;

  return (
    <p className="pointer-events-none fixed bottom-[calc(4.3125rem+env(safe-area-inset-bottom))] left-3 z-[46] rounded-full border border-white/18 bg-ink-3 px-3 py-1 text-xs font-semibold text-white shadow-2 md:bottom-4 md:left-6">
      <span className="pointer-events-auto">Review version</span>
    </p>
  );
}
