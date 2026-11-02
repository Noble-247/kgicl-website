export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  isPlaceholder: boolean;
};

/**
 * Client-provided testimonials, used on the home page.
 *
 * Live mode never renders a placeholder, and the pre-launch audit fails while
 * any `isPlaceholder: true` record remains. If a new quote is added before the
 * client approves it, mark it `isPlaceholder: true` so it stays in review only.
 */
export const TESTIMONIALS = [
  {
    quote:
      "Kris Goodnews Int'l Co Ltd handled the procurement and installation of our 300 kVA transformer at our Ikoyi branch with exceptional professionalism and technical expertise. Their team ensured everything was executed safely, efficiently, and to the highest industry standards. They are a reliable partner for any heavy-duty electrical needs.",
    name: "Mr. Charles",
    role: "Manager, Mr Biggs (Ikoyi, Lagos)",
    isPlaceholder: false,
  },
  {
    quote:
      "We engaged Kris Goodnews Int'l Co Ltd for our electrical installations at Foodco Eateries in Ikotun, and they delivered beyond our expectations. Their meticulous attention to detail and adherence to safety best practices made the entire process seamless for our operations.",
    name: "Engineer Godwin Onyeka",
    role: "Manager, Foodco Eateries (Ikotun, Lagos)",
    isPlaceholder: false,
  },
  {
    quote:
      "As a property owner looking to invest in sustainable energy, getting high-quality equipment is crucial. Kris Goodnews supplied us with top-tier industrial all-in-one solar street lights that have completely transformed our security and illumination. Their commitment to the renewable energy sector truly shows in the quality of their products.",
    name: "Mrs. Onyeka Obiadinma",
    role: "Property Owner",
    isPlaceholder: false,
  },
] as const satisfies readonly Testimonial[];
