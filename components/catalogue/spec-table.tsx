import type { Product } from "@/lib/schemas/product";

type SpecTableProps = {
  specs: Product["specs"];
  heading?: string;
  className?: string;
};

/**
 * Two-column specification table: label muted, value semibold, zebra rows
 * (design.md 6.3). No unverified lines are added here; the page decides.
 */
export function SpecTable({
  specs,
  heading = "Specifications",
  className = "",
}: SpecTableProps) {
  if (specs.length === 0) return null;

  return (
    <div className={className}>
      <h2 className="type-h2">{heading}</h2>
      <table className="mt-4 w-full border-collapse text-left">
        <caption className="sr-only">{heading}</caption>
        <tbody>
          {specs.map((spec, index) => (
            <tr
              key={`${spec.label}-${index}`}
              className={`border-b border-stone-300 ${
                index % 2 === 1 ? "bg-stone-100/50" : ""
              }`}
            >
              <th
                scope="row"
                className="type-body w-2/5 py-3 pr-4 align-top font-normal text-text-muted"
              >
                {spec.label}
              </th>
              <td className="type-spec py-3 align-top text-text">
                {spec.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
