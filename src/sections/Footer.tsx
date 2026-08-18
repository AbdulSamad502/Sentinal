import { config, releasesUrl } from "../config";
import { Aperture } from "../components/Nav";

export function Footer() {
  return (
    <footer className="border-t border-rule bg-surface-sunk px-5 py-14 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div>
            <p className="flex items-center gap-2.5 font-semibold tracking-tight">
              <Aperture />
              Sentinel
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-soft">
              A supervisory agent for AI coding agents. It watches, it reports, and
              it never acts.
            </p>
          </div>

          <nav aria-label="Footer" className="flex gap-12 text-sm sm:gap-16">
            <div>
              <h2 className="mb-3 font-mono text-xs tracking-[0.16em] text-ink-soft uppercase">
                Project
              </h2>
              <ul className="space-y-2">
                <li>
                  <FooterLink href={config.repoUrl}>Source</FooterLink>
                </li>
                <li>
                  <FooterLink href={releasesUrl}>Releases</FooterLink>
                </li>
                <li>
                  <FooterLink href={`${config.repoUrl}/blob/main/LICENSE`}>
                    Apache 2.0
                  </FooterLink>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="mb-3 font-mono text-xs tracking-[0.16em] text-ink-soft uppercase">
                On this page
              </h2>
              <ul className="space-y-2">
                <li>
                  <FooterLink href="#features">Features</FooterLink>
                </li>
                <li>
                  <FooterLink href="#principles">Principles</FooterLink>
                </li>
                <li>
                  <FooterLink href="#download">Download</FooterLink>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-rule pt-6 font-mono text-xs text-ink-soft sm:flex-row sm:justify-between">
          <p>Built for the AWS Agents for Humans hackathon, Professional Agents track.</p>
          <p>Licensed under Apache 2.0.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      className="text-ink-soft transition-colors hover:text-accent"
    >
      {children}
    </a>
  );
}
