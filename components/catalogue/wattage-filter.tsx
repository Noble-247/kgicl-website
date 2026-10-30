"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { FaWhatsapp } from "react-icons/fa";

import { Button } from "@/components/button";
import { Chip } from "@/components/chip";
import { ProductGrid } from "@/components/catalogue/product-grid";
import type { Product } from "@/lib/schemas/product";
import { messages, waLink } from "@/lib/whatsapp";

type WattageFilterProps = {
  products: readonly Product[];
  /** Canonical site base URL, passed to the product cards. */
  baseUrl: string;
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

/**
 * Solar Lighting wattage filter (design.md 6.3). Chips are generated from the
 * data, selection lives in `?watt=120`, and the count is announced politely.
 */
export function WattageFilter({
  products,
  baseUrl,
  className = "",
}: WattageFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const wattages = useMemo(
    () =>
      Array.from(
        new Set(
          products
            .map((product) => product.wattage)
            .filter((wattage): wattage is number => typeof wattage === "number"),
        ),
      ).sort((left, right) => left - right),
    [products],
  );

  const requested = Number(searchParams.get("watt"));
  const selected = wattages.includes(requested) ? requested : null;

  const filtered =
    selected === null
      ? products
      : products.filter((product) => product.wattage === selected);

  function choose(wattage: number | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (wattage === null) {
      params.delete("watt");
    } else {
      params.set("watt", String(wattage));
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  return (
    <div className={className}>
      <div
        role="group"
        aria-label="Filter street lights by wattage"
        className="flex flex-nowrap gap-2 overflow-x-auto pb-2"
      >
        <Chip
          selected={selected === null}
          onClick={() => choose(null)}
          className="shrink-0"
        >
          All
        </Chip>
        {wattages.map((wattage) => (
          <Chip
            key={wattage}
            selected={selected === wattage}
            onClick={() => choose(wattage)}
            className="shrink-0"
          >
            {wattage}W
          </Chip>
        ))}
      </div>

      <p
        aria-live="polite"
        className="type-small mt-3 text-text-muted"
      >
        Showing {filtered.length} of {products.length}
      </p>

      {filtered.length > 0 ? (
        <ProductGrid
          products={filtered}
          baseUrl={baseUrl}
          className="mt-6"
        />
      ) : (
        <WattageEmptyState className="mt-6" />
      )}
    </div>
  );
}
