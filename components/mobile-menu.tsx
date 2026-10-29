"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";

import { isActivePath, PRIMARY_NAV } from "@/data/nav";
import { GENERAL_WHATSAPP_HREF, PRIMARY_PHONE_HREF } from "@/lib/site-links";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    returnFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((element) => element.offsetParent !== null);

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      returnFocusRef.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <div
        className="mobile-menu-backdrop absolute inset-0 bg-black/70"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className="mobile-menu-panel on-dark absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col bg-black shadow-3"
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/12 px-5">
          <span className="type-label text-text-muted-on-dark">Menu</span>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-sm text-white"
          >
            <X aria-hidden="true" size={22} />
          </button>
        </div>

        <nav aria-label="Primary" className="flex-1 overflow-y-auto px-5">
          <ul>
            {PRIMARY_NAV.map((item) => {
              const active = isActivePath(pathname, item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    prefetch={false}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={`flex h-14 items-center border-b border-white/10 text-lg font-semibold ${
                      active ? "text-white" : "text-text-muted-on-dark"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="shrink-0 space-y-3 border-t border-white/12 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
          <a
            href={GENERAL_WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="type-button flex h-[52px] items-center justify-center gap-2 rounded-md bg-red text-white"
          >
            <FaWhatsapp aria-hidden="true" size={20} />
            WhatsApp
          </a>
          <a
            href={PRIMARY_PHONE_HREF}
            className="type-button flex h-[52px] items-center justify-center gap-2 rounded-md border border-white/35 text-white"
          >
            <FaPhoneAlt aria-hidden="true" size={18} />
            Call us
          </a>
        </div>
      </div>
    </div>
  );
}
