import { Section, Reveal } from "../components/Section";
import { useRelease } from "../lib/useRelease";
import { useOS } from "../lib/useOS";
import { releasesUrl, config } from "../config";
import {
  formatBytes,
  formatDate,
  platformLabel,
  type Installer,
  type Platform,
} from "../lib/releases";

/**
 * Downloads come from the GitHub Releases API at runtime -- the installers are
 * published on the code repo, not hosted here, so a new build appears on this
 * page with no code change and no redeploy.
 *
 * All four states below are designed. The empty state is the one that will be
 * live longest before launch, so it is treated as a real piece of the page
 * rather than an error path.
 */
export function Download() {
  const state = useRelease();
  const os = useOS();

  return (
    <Section
      id="download"
      eyebrow="Download"
      title="Get Sentinel."
      lede="Builds are published as releases on the repository. This page reads them directly, so what you see here is whatever shipped last."
      width="default"
    >
      {/* A fixed minimum height across every state keeps the page from shifting
          when the request resolves. */}
      <Reveal>
        <div className="min-h-[19rem]">
          {state.status === "loading" && <LoadingState />}
          {state.status === "ready" && (
            <ReadyState
              installers={state.release.installers}
              version={state.release.version}
              publishedAt={state.release.publishedAt}
              os={os}
            />
          )}
          {state.status === "no-release" && <NoReleaseState />}
          {state.status === "error" && <ErrorState reason={state.reason} />}
        </div>
      </Reveal>
    </Section>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-rule bg-surface p-6 shadow-[var(--shadow-card)] sm:p-8">
      {children}
    </div>
  );
}

function LoadingState() {
  return (
    <Frame>
      <p className="sr-only" role="status">
        Checking for the latest release.
      </p>
      <div aria-hidden="true" className="space-y-4">
        <div className="h-4 w-40 rounded bg-surface-sunk" />
        <div className="h-14 rounded-lg bg-surface-sunk" />
        <div className="h-14 rounded-lg bg-surface-sunk" />
        <div className="h-3 w-56 rounded bg-surface-sunk" />
      </div>
    </Frame>
  );
}

function ReadyState({
  installers,
  version,
  publishedAt,
  os,
}: {
  installers: Installer[];
  version: string;
  publishedAt: string;
  os: Platform | null;
}) {
  // The visitor's platform leads. The other is never hidden, only demoted.
  const primary = os ? installers.find((i) => i.platform === os) : undefined;
  const ordered = primary
    ? [primary, ...installers.filter((i) => i !== primary)]
    : installers;

  const totalDownloads = installers.reduce((sum, i) => sum + i.downloadCount, 0);

  return (
    <Frame>
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="font-mono text-sm text-ink">
          {version}
          <span className="text-ink-soft"> · {formatDate(publishedAt)}</span>
        </p>
        <a
          href={releasesUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="text-sm text-accent underline underline-offset-4 hover:no-underline"
        >
          All releases
        </a>
      </div>

      <ul className="space-y-3">
        {ordered.map((installer, index) => (
          <li key={installer.platform}>
            <DownloadLink
              installer={installer}
              emphasis={index === 0 && Boolean(primary)}
            />
          </li>
        ))}
      </ul>

      <p className="mt-6 border-t border-rule pt-5 font-mono text-xs text-ink-soft">
        Apache 2.0
        {totalDownloads > 0 && ` · ${totalDownloads.toLocaleString()} downloads`}
      </p>
    </Frame>
  );
}

function DownloadLink({
  installer,
  emphasis,
}: {
  installer: Installer;
  emphasis: boolean;
}) {
  const label = platformLabel[installer.platform];

  const base =
    "flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg px-5 py-4 transition-colors";
  const styles = emphasis
    ? "bg-ink text-ground hover:opacity-88 active:opacity-75"
    : "border border-rule text-ink hover:border-accent hover:text-accent active:bg-accent-wash";

  return (
    <a href={installer.url} className={`${base} ${styles}`}>
      <span className="font-medium">
        Download for {label}
        {emphasis && (
          <span className="ml-2 font-mono text-xs opacity-70">
            detected
          </span>
        )}
      </span>
      <span
        className={`ml-auto font-mono text-xs ${emphasis ? "opacity-70" : "text-ink-soft"}`}
      >
        {installer.name} · {formatBytes(installer.size)}
      </span>
    </a>
  );
}

function NoReleaseState() {
  return (
    <Frame>
      <div className="flex items-start gap-4">
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="mt-0.5 h-5 w-5 shrink-0 text-ink-soft"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M12 3v11M8.5 10.5 12 14l3.5-3.5" strokeLinecap="round" />
          <path d="M4 17.5v2a1.5 1.5 0 0 0 1.5 1.5h13a1.5 1.5 0 0 0 1.5-1.5v-2" />
        </svg>
        <div>
          <h3 className="text-lg font-semibold tracking-tight">
            Builds are on the way.
          </h3>
          <p className="mt-2 max-w-lg leading-relaxed text-ink-soft">
            The installers are not published yet. When they are, they will appear
            here automatically — this page reads the repository's releases
            directly, so there is nothing to wait on but the build itself.
          </p>
          <p className="mt-4 max-w-lg leading-relaxed text-ink-soft">
            In the meantime, Sentinel runs from source today. Star the repository
            to hear about the first release.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={config.repoUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-ground transition-opacity hover:opacity-88 active:opacity-75"
            >
              Star the repository
            </a>
            <a
              href="#install"
              className="rounded-md border border-rule px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent active:bg-accent-wash"
            >
              Run from source
            </a>
          </div>
        </div>
      </div>
    </Frame>
  );
}

function ErrorState({ reason }: { reason: string }) {
  const explanation =
    reason === "rate-limited"
      ? "GitHub is rate-limiting this network for the moment."
      : "The release list could not be reached from here.";

  return (
    <Frame>
      <h3 className="text-lg font-semibold tracking-tight">
        Downloads are on GitHub.
      </h3>
      <p className="mt-2 max-w-lg leading-relaxed text-ink-soft">
        {explanation} The releases page has every build, and it does not depend on
        this page working.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={releasesUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-ground transition-opacity hover:opacity-88 active:opacity-75"
        >
          Open releases on GitHub
        </a>
        <a
          href="#install"
          className="rounded-md border border-rule px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent active:bg-accent-wash"
        >
          Run from source
        </a>
      </div>
    </Frame>
  );
}
