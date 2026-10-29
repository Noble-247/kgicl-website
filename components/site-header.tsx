"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { isActivePath, PRIMARY_NAV } from "@/data/nav";
import { messages, waLink } from "@/lib/whatsapp";

import { MobileActionBar } from "./mobile-action-bar";
import { MobileMenu } from "./mobile-menu";

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b bg-black ${
          scrolled ? "border-white/12" : "border-transparent"
        }`}
      >
        <div className="container-site flex h-16 items-center justify-between gap-3 lg:h-[72px]">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5"
          >
            <Image
              src="/assets/img/logo-mark-white.svg"
              alt=""
              width={44}
              height={44}
              priority
              className="h-11 w-11"
            />
            <span className="flex flex-col leading-none">
              <span className="text-base font-bold tracking-[0.12em] text-white">
                KGICL
              </span>
              <span className="mt-1 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-text-muted-on-dark">
                Goodnews Solar
              </span>
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-2 lg:flex xl:gap-4"
          >
            {PRIMARY_NAV.map((item) => {
              const active = isActivePath(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  aria-current={active ? "page" : undefined}
                  className={`relative inline-flex h-11 items-center whitespace-nowrap text-xs font-semibold transition-colors after:absolute after:inset-x-0 after:bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:transition-transform after:duration-150 hover:text-white hover:after:scale-x-100 hover:after:bg-red-soft xl:text-sm ${
                    active
                      ? "text-white after:scale-x-100 after:bg-red"
                      : "text-text-muted-on-dark"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href={waLink(messages.general)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-red text-white lg:hidden"
            >
              <FaWhatsapp aria-hidden="true" size={22} />
            </a>

            <a
              href={waLink(messages.general)}
              target="_blank"
              rel="noopener noreferrer"
              className="type-button hidden h-11 items-center gap-1.5 rounded-md bg-red px-3 text-[0.8125rem] text-white transition-colors hover:bg-red-deep lg:inline-flex"
            >
              <FaWhatsapp aria-hidden="true" size={16} />
              WhatsApp
            </a>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md text-white lg:hidden"
            >
              <Menu aria-hidden="true" size={24} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={closeMenu} />
      <MobileActionBar hidden={menuOpen} />
    </>
  );
}
