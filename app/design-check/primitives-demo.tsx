"use client";

import { useState } from "react";

import { Button } from "@/components/button";
import { Chip } from "@/components/chip";

const WATTAGES = ["All", "80W", "120W", "150W"];

/** Temporary interactive states for the /design-check reference page. */
export function ChipDemo() {
  const [selected, setSelected] = useState("All");

  return (
    <div>
      <div role="group" aria-label="Wattage" className="flex flex-wrap gap-2">
        {WATTAGES.map((watt) => (
          <Chip
            key={watt}
            selected={selected === watt}
            onClick={() => setSelected(watt)}
          >
            {watt}
          </Chip>
        ))}
      </div>
      <p aria-live="polite" className="type-small mt-3 text-text-muted">
        Selected: {selected}
      </p>
    </div>
  );
}

export function ClickDemo() {
  const [count, setCount] = useState(0);

  return (
    <Button onClick={() => setCount((value) => value + 1)}>
      Clicked {count} {count === 1 ? "time" : "times"}
    </Button>
  );
}
