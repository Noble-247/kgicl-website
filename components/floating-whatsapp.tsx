import { FaWhatsapp } from "react-icons/fa";

import { messages, waLink } from "@/lib/whatsapp";

/** Floating WhatsApp button, 768 px and above. */
export function FloatingWhatsApp() {
  return (
    <div className="fixed right-6 bottom-6 z-50 hidden md:block">
      <a
        href={waLink(messages.general)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-red text-white shadow-3 transition-colors hover:bg-red-deep"
      >
        <FaWhatsapp aria-hidden="true" size={26} />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-full mr-3 rounded-sm bg-ink-3 px-3 py-1.5 text-sm font-semibold whitespace-nowrap text-white opacity-0 shadow-2 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          Chat on WhatsApp
        </span>
      </a>
    </div>
  );
}
