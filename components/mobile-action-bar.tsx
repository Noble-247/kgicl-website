import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";

import { SITE } from "@/data/site";
import { messages, telLink, waLink } from "@/lib/whatsapp";

type MobileActionBarProps = {
  hidden: boolean;
};

/** Fixed bottom bar below 768 px. Hidden while the mobile menu is open. */
export function MobileActionBar({ hidden }: MobileActionBarProps) {
  if (hidden) return null;

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
