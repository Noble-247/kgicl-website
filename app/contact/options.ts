/**
 * Options shared by the form and the schema. Kept out of `schema.ts` so the
 * client bundle never pulls in Zod or the validation messages.
 */
export const NEED_OPTIONS = [
  "Solar lighting",
  "CCTV & security",
  "Electrical supplies",
  "Industrial supply",
  "Other",
] as const;
