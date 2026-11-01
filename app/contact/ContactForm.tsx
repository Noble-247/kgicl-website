"use client";

import { useEffect, useRef, useState, useActionState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Phone,
  Send,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { Button } from "@/components/button";
import { SITE } from "@/data/site";
import { messages, telLink, waLink } from "@/lib/whatsapp";

import { sendEnquiry } from "./actions";
import { NEED_OPTIONS } from "./options";
import type { ContactInput, ContactState } from "./schema";

const initial: ContactState = { status: "idle" };

const WHATSAPP = waLink(messages.general);
const PHONE = telLink(SITE.phones[0].e164);

function fieldClass(error?: string): string {
  return `w-full rounded-[10px] bg-white px-3.5 text-base text-text placeholder:text-stone-400 focus:border-text ${
    error ? "border-2 border-danger" : "border border-stone-300"
  }`;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;

  return (
    <p
      id={id}
      className="type-small mt-1.5 flex items-start gap-1.5 text-danger"
    >
      <AlertCircle aria-hidden="true" size={16} className="mt-0.5 shrink-0" />
      {message}
    </p>
  );
}

export function ContactForm({ product = "" }: { product?: string }) {
  const [state, formAction, pending] = useActionState(sendEnquiry, initial);
  const [startedAt, setStartedAt] = useState("");
  const successRef = useRef<HTMLHeadingElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setStartedAt(String(Date.now()));
  }, []);

  useEffect(() => {
    if (state.status === "success") successRef.current?.focus();
    if (state.status === "error") errorRef.current?.focus();
  }, [state.status]);

  if (state.status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-md border border-stone-300 bg-white p-6 shadow-1 md:p-8"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
          <CheckCircle2 aria-hidden="true" size={26} />
        </span>

        <h2
          ref={successRef}
          tabIndex={-1}
          className="type-h2 mt-5 text-text outline-none"
        >
          Thank you. Your message has been sent.
        </h2>

        <p className="type-body mt-3 text-text-muted">
          We will get back to you shortly. For a faster reply, message us on
          WhatsApp.
        </p>

        <Button
          href={WHATSAPP}
          target="_blank"
          rel="noreferrer"
          icon={<FaWhatsapp />}
          className="mt-6"
        >
          Chat on WhatsApp
        </Button>
      </div>
    );
  }

  const errors = state.fieldErrors ?? {};
  const values = state.values ?? {};

  return (
    <form
      action={formAction}
      className="rounded-md border border-stone-300 bg-white p-6 shadow-1 md:p-8"
      noValidate
    >
      {state.status === "error" && state.message ? (
        <div
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          className="mb-6 border-l-4 border-danger bg-danger/5 p-4 outline-none"
        >
          <p className="type-body font-semibold text-danger">{state.message}</p>
          <p className="type-small mt-3 text-text-muted">
            You can also reach us directly:
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Button
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              icon={<FaWhatsapp />}
              size="compact"
            >
              Chat on WhatsApp
            </Button>
            <Button
              href={PHONE}
              variant="secondary-light"
              icon={<Phone aria-hidden="true" size={18} />}
              size="compact"
            >
              Call us
            </Button>
          </div>
        </div>
      ) : null}

      {/* Honeypot: hidden from people and screen readers, and out of the tab order. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <input type="hidden" name="startedAt" value={startedAt} />
      <input type="hidden" name="product" value={product} />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="type-small font-semibold">
            Your name
          </label>
          <input
            id="name"
            name="name"
            required
            defaultValue={values.name}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-err" : undefined}
            autoComplete="name"
            className={`mt-1.5 h-[52px] ${fieldClass(errors.name)}`}
          />
          <FieldError id="name-err" message={errors.name} />
        </div>

        <div>
          <label htmlFor="phone" className="type-small font-semibold">
            Phone / WhatsApp number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            defaultValue={values.phone}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-err" : undefined}
            autoComplete="tel"
            className={`mt-1.5 h-[52px] ${fieldClass(errors.phone)}`}
          />
          <FieldError id="phone-err" message={errors.phone} />
        </div>

        <div>
          <label htmlFor="email" className="type-small font-semibold">
            Email (optional)
          </label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue={values.email}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-err" : undefined}
            autoComplete="email"
            className={`mt-1.5 h-[52px] ${fieldClass(errors.email)}`}
          />
          <FieldError id="email-err" message={errors.email} />
        </div>

        <div>
          <label htmlFor="location" className="type-small font-semibold">
            Your location
          </label>
          <input
            id="location"
            name="location"
            required
            defaultValue={values.location}
            aria-invalid={Boolean(errors.location)}
            aria-describedby={errors.location ? "location-err" : undefined}
            autoComplete="address-level2"
            className={`mt-1.5 h-[52px] ${fieldClass(errors.location)}`}
          />
          <FieldError id="location-err" message={errors.location} />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="need" className="type-small font-semibold">
          What do you need?
        </label>
        <div className="relative mt-1.5">
          <select
            id="need"
            name="need"
            required
            defaultValue={values.need ?? ""}
            aria-invalid={Boolean(errors.need)}
            aria-describedby={errors.need ? "need-err" : undefined}
            className={`h-[52px] appearance-none pr-10 ${fieldClass(errors.need)}`}
          >
            <option value="" disabled>
              Choose one
            </option>
            {NEED_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden="true"
            size={18}
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted"
          />
        </div>
        <FieldError id="need-err" message={errors.need} />
      </div>

      <div className="mt-5">
        <label htmlFor="message" className="type-small font-semibold">
          Message (power needs, application, quantity)
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          minLength={10}
          maxLength={1000}
          defaultValue={values.message}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-err" : "message-hint"}
          className={`mt-1.5 min-h-[132px] py-3 ${fieldClass(errors.message)}`}
        />
        {errors.message ? (
          <FieldError id="message-err" message={errors.message} />
        ) : (
          <p id="message-hint" className="type-small mt-1.5 text-text-muted">
            1000 characters max.
          </p>
        )}
      </div>

      <div className="mt-5">
        <label htmlFor="consent" className="flex items-start gap-3">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            required
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? "consent-err" : undefined}
            className="mt-0.5 h-6 w-6 shrink-0 accent-red"
          />
          <span className="type-small text-text-muted">
            I agree that KGICL may use these details to reply to my enquiry, as
            explained in the{" "}
            <a
              href="/privacy"
              className="font-semibold text-red-deep underline underline-offset-2"
            >
              privacy notice
            </a>
            .
          </span>
        </label>
        <FieldError id="consent-err" message={errors.consent} />
      </div>

      <Button
        type="submit"
        disabled={pending}
        icon={
          pending ? (
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-dashed border-white"
            />
          ) : (
            <Send aria-hidden="true" size={18} />
          )
        }
        className="mt-6 w-full sm:w-auto"
      >
        {pending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}

export type { ContactInput };
