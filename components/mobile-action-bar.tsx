"use client";

import { useEffect, useState } from "react";
import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";

import { SITE } from "@/data/site";
import { messages, telLink, waLink } from "@/lib/whatsapp";

type MobileActionBarProps = {
  hidden: boolean;
};

/**
 * Text-entry controls that can raise the on-screen keyboard. Focus is the
 * reliable proxy: `visualViewport` also shrinks on pinch-zoom and browser
 * chrome, so a height threshold would hide the bar at the wrong time.
 */
const TEXT_ENTRY =
  'input:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="color"]):not([type="file"]), textarea, select, [contenteditable="true"]';

/** Fixed bottom bar below 768 px. Hidden while the menu is open or typing. */
export function MobileActionBar({ hidden }: MobileActionBarProps) {
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      cancelAnimationFrame(frame);
      // Wait one frame so focusout can hand over to the next field without flicker.
      frame = requestAnimationFrame(() => {
        setTyping(document.activeElement?.closest(TEXT_ENTRY) != null);
      });
    };

    document.addEventListener("focusin", update);
    document.addEventListener("focusout", update);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("focusin", update);
      document.removeEventListener("focusout", update);
    };
  }, []);

  if (hidden || typing) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[45] border-t border-white/12 bg-black pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="flex items-center gap-2 p-1">
        <a
          href={waLink(messages.general)}
          target="_blank"
          rel="noopener noreferrer"
          className="type-button flex h-12 flex-1 items-center justify-center gap-2 rounded-md bg-red text-white"
        >
          <FaWhatsapp aria-hidden="true" size={20} />
          WhatsApp
        </a>
        <a
          href={telLink(SITE.phones[0].e164)}
          className="type-button flex h-12 flex-1 items-center justify-center gap-2 rounded-md border border-white/35 text-white"
        >
          <FaPhoneAlt aria-hidden="true" size={18} />
          Call
        </a>
      </div>
    </div>
  );
}
