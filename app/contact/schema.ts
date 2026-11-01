import { z } from "zod";

import { NEED_OPTIONS } from "./options";

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name").max(80),
  phone: z
    .string()
    .regex(/^[+()\d\s-]{7,20}$/, "Please enter a valid phone number"),
  email: z.union([
    z.literal(""),
    z.string().email("Please enter a valid email address").max(120),
  ]),
  location: z.string().min(2, "Please enter your location").max(100),
  need: z
    .string()
    .refine(
      (value) => (NEED_OPTIONS as readonly string[]).includes(value),
      "Please choose an option",
    ),
  message: z
    .string()
    .min(10, "Please tell us a little more (at least 10 characters)")
    .max(1000, "Please keep your message under 1000 characters"),
  product: z.string().max(120),
  consent: z
    .string()
    .refine((value) => value === "on", "Please tick the box so we can reply to you"),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<keyof ContactInput, string>>;
  values?: Partial<Record<keyof ContactInput, string>>;
};
