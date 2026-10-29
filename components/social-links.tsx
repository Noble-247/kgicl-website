import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const NETWORKS = [
  { name: "Facebook", env: "FACEBOOK_URL", Icon: FaFacebookF },
  { name: "Instagram", env: "INSTAGRAM_URL", Icon: FaInstagram },
  { name: "LinkedIn", env: "LINKEDIN_URL", Icon: FaLinkedinIn },
] as const;

function validUrl(value: string | undefined): string | null {
  if (!value) return null;

  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

/** Renders only the networks whose environment variable holds a real URL. */
export function SocialLinks() {
  const links = NETWORKS.flatMap(({ name, env, Icon }) => {
    const href = validUrl(process.env[env]);
    return href ? [{ name, href, Icon }] : [];
  });

  if (links.length === 0) return null;

  return (
    <ul aria-label="Social media" className="mt-5 flex items-center gap-2">
      {links.map(({ name, href, Icon }) => (
        <li key={name}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`KGICL on ${name}`}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/35 text-white transition-colors hover:border-white hover:bg-white/[0.06]"
          >
            <Icon aria-hidden="true" size={18} />
          </a>
        </li>
      ))}
    </ul>
  );
}
