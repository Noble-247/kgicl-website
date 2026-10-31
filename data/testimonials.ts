export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  isPlaceholder: boolean;
};

/**
 * Three placeholders so the layout can be reviewed.
 *
 * Live mode never renders a placeholder, and the pre-launch audit fails while
 * any `isPlaceholder: true` record remains. Replace each one with a real
 * customer's words and set `isPlaceholder: false`.
 */
export const TESTIMONIALS = [
  {
    quote: "Placeholder text for layout only. Replace with a real customer's words.",
    name: "Customer Name",
    role: "Role, Company",
    isPlaceholder: true,
  },
  {
    quote: "Placeholder text for layout only. Replace with a real customer's words.",
    name: "Customer Name",
    role: "Role, Company",
    isPlaceholder: true,
  },
  {
    quote: "Placeholder text for layout only. Replace with a real customer's words.",
    name: "Customer Name",
    role: "Role, Company",
    isPlaceholder: true,
  },
] as const satisfies readonly Testimonial[];
