import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

import {
  getSocialLinks,
  type SocialLink,
  type SocialNetwork,
} from "@/lib/social";

const ICONS: Record<SocialNetwork, typeof FaFacebookF> = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
};

const TONES = {
  dark: "border-white/35 text-white hover:border-white hover:bg-white/[0.06]",
  light:
    "border-stone-300 text-text hover:border-text hover:bg-stone-100",
} as const;

type SocialLinksProps = {
  /** Dark for the footer, light for the contact page. */
  tone?: keyof typeof TONES;
  className?: string;
  /** Test seam; defaults to the validated environment links. */
  links?: readonly SocialLink[];
};

/** Renders only the networks whose environment variable holds a real URL. */
export function SocialLinks({
  tone = "dark",
  className = "",
  links = getSocialLinks(),
}: SocialLinksProps) {
  if (links.length === 0) return null;

  return (
    <ul
      aria-label="Social media"
      className={`flex items-center gap-2 ${className}`}
    >
      {links.map(({ network, name, href }) => {
        const Icon = ICONS[network];

        return (
          <li key={network}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`KGICL on ${name}`}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors ${TONES[tone]}`}
            >
              <Icon aria-hidden="true" size={18} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
