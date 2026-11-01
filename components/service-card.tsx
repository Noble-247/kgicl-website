import type { LucideIcon } from "lucide-react";

import type { Service } from "@/data/services";

type ServiceCardProps = {
  service: Service;
  icon: LucideIcon;
  className?: string;
};

/** Service card: red-tinted icon circle, H3 and a short description (design.md 6.4). */
export function ServiceCard({
  service,
  icon: Icon,
  className = "",
}: ServiceCardProps) {
  return (
    <article
      className={`flex h-full flex-col rounded-md border border-stone-300 bg-white p-5 shadow-1 ${className}`}
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red/10 text-red-deep">
        <Icon aria-hidden="true" size={22} />
      </span>

      <h3 className="type-h3 mt-4">{service.title}</h3>
      <p className="type-small mt-2 text-text-muted">{service.description}</p>

      {service.note ? (
        <p className="type-small mt-3 font-semibold text-red-deep">
          {service.note}
        </p>
      ) : null}
    </article>
  );
}
