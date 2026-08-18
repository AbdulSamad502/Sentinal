import { config } from "../config";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "#what-it-is", label: "What it is" },
  { href: "#features", label: "Features" },
  { href: "#principles", label: "Principles" },
  { href: "#install", label: "Install" },
  { href: "#download", label: "Download" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-rule bg-ground/85 backdrop-blur-md">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5 sm:px-8"
      >
        <a
          href="#top"
          className="flex shrink-0 items-center gap-2.5 font-semibold tracking-tight"
        >
          <Aperture />
          Sentinel
        </a>

        <ul className="ml-auto hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-ink-soft transition-colors hover:text-accent"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <a
            href={config.repoUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-md border border-rule px-3 py-1.5 text-sm text-ink-soft transition-colors hover:border-accent hover:text-accent active:bg-accent-wash"
          >
            GitHub
          </a>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}

/** The watching lens, used as the mark. */
export function Aperture({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3.25" fill="currentColor" stroke="none" />
      <path d="M12 3v5.2M21 12h-5.2M12 21v-5.2M3 12h5.2" />
    </svg>
  );
}
