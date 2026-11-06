"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { FaWhatsapp } from "react-icons/fa";

import { Button } from "@/components/button";
import { Chip } from "@/components/chip";
import { messages, waLink } from "@/lib/whatsapp";

type WattageOption = {
  wattage: number;
  count: number;
};

type WattageFilterProps = {
  /** Wattages present in this group, with the number of matching lights. */
  options: readonly WattageOption[];
  /** Number of lights in the group, before filtering. */
  total: number;
  /**
   * The server-rendered product grid. Keeping it as a child means the cards
   * stay server components; only the chips and the visibility toggle run in
   * the browser.
   */
  children: ReactNode;
  className?: string;
};

/** Shown when no light matches the chosen wattage (design.md 6.3). */
export function WattageEmptyState({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-md border border-stone-300 bg-white p-8 text-center shadow-1 ${className}`}
    >
      <p className="type-body-lg">
        No lights at this wattage yet. Ask us on WhatsApp.
      </p>
      <Button
        href={waLink(messages.general)}
        target="_blank"
        rel="noreferrer"
        icon={<FaWhatsapp />}
        className="mt-5"
      >
        Ask on WhatsApp
      </Button>
    </div>
  );
}

function readWattParam(): string | null {
  return new URLSearchParams(window.location.search).get("watt");
}

/**
 * Solar Lighting wattage filter (design.md 6.3). Chips are generated from the
 * data, selection lives in `?watt=120`, and the count is announced politely.
 * The grid itself is rendered on the server and only hidden or shown here, so
 * filtering does not ship the product cards as client JavaScript.
 */
export function WattageFilter({
  options,
  total,
  children,
  className = "",
}: WattageFilterProps) {
  // `null` means "All"; a string keeps a present-but-unknown value so it can
  // show the empty state instead of silently falling back to All.
  const [wattParam, setWattParam] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sync = () => setWattParam(readWattParam());
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  const requested = wattParam === null ? null : Number(wattParam);
  const selected =
    wattParam === null
      ? undefined
      : options.some((option) => option.wattage === requested)
        ? requested
        : null;

  const visibleCount =
    selected === undefined
      ? total
      : selected === null
        ? 0
        : (options.find((option) => option.wattage === selected)?.count ?? 0);

  useEffect(() => {
    const root = gridRef.current;
    if (!root) return;

    for (const card of root.querySelectorAll<HTMLElement>("[data-wattage]")) {
      const matches =
        selected === undefined || Number(card.dataset.wattage) === selected;
      card.style.display = matches ? "" : "none";
    }
  }, [selected]);

  function choose(wattage: number | null) {
    const params = new URLSearchParams(window.location.search);
    if (wattage === null) {
      params.delete("watt");
    } else {
      params.set("watt", String(wattage));
    }

    const query = params.toString();
    const url = `${window.location.pathname}${query ? `?${query}` : ""}${
      window.location.hash
    }`;
    window.history.replaceState(window.history.state, "", url);
    setWattParam(wattage === null ? null : String(wattage));
  }

  return (
    <div className={className}>
      <div
        role="group"
        aria-label="Filter street lights by wattage"
        className="flex flex-nowrap gap-2 overflow-x-auto pb-2"
      >
        <Chip
          selected={selected === undefined}
          onClick={() => choose(null)}
          className="shrink-0"
        >
          All
        </Chip>
        {options.map((option) => (
          <Chip
            key={option.wattage}
            selected={selected === option.wattage}
            onClick={() => choose(option.wattage)}
            className="shrink-0"
          >
            {option.wattage}W
          </Chip>
        ))}
      </div>

      <p aria-live="polite" className="type-small mt-3 text-text-muted">
        Showing {visibleCount} of {total}
      </p>

      <div ref={gridRef} hidden={visibleCount === 0}>
        {children}
      </div>

      {visibleCount === 0 ? <WattageEmptyState className="mt-6" /> : null}
    </div>
  );
}
