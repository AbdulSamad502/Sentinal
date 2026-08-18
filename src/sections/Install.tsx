import { Section, Reveal } from "../components/Section";
import { CommandBlock } from "../components/CommandBlock";
import { UnsignedBuildNote } from "./UnsignedBuildNote";
import { config } from "../config";

export function Install() {
  return (
    <Section
      id="install"
      eyebrow="Install"
      title="Two ways in."
      lede="Either path ends the same way: Sentinel watching a repository you point it at."
      width="wide"
      className="border-y border-rule bg-surface-sunk"
    >
      {/* min-w-0 on both grid items: without it the long clone URL in the
          second card sets the column's min-content width and both cards stop
          fitting on narrow screens. */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal className="min-w-0">
          <div className="flex h-full flex-col rounded-xl border border-rule bg-surface p-6 shadow-[var(--shadow-card)] sm:p-7">
            <p className="font-mono text-xs tracking-[0.16em] text-ink-soft uppercase">
              Path one
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight">
              Installer
            </h3>
            <p className="mt-3 leading-relaxed text-ink-soft">
              Download the build for your platform, install it, and point it at a
              repository. Nothing else to configure — the runtime defaults to a
              hosted brain, and you can switch it to local or your own AWS
              afterwards.
            </p>

            <ol className="mt-6 space-y-3 text-sm">
              {[
                "Download the .exe (Windows) or .dmg (macOS)",
                "Install and launch",
                "Point it at a repository to supervise",
              ].map((step, index) => (
                <li key={step} className="flex gap-3.5">
                  <span className="font-mono text-xs text-ink-soft tabular-nums">
                    {index + 1}
                  </span>
                  <span className="text-ink-soft">{step}</span>
                </li>
              ))}
            </ol>

            <div className="mt-auto pt-7">
              <a
                href="#download"
                className="inline-block rounded-md bg-ink px-4 py-2 text-sm font-medium text-ground transition-opacity hover:opacity-88 active:opacity-75"
              >
                Go to downloads
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.06} className="min-w-0">
          <div className="flex h-full flex-col rounded-xl border border-rule bg-surface p-6 shadow-[var(--shadow-card)] sm:p-7">
            <p className="font-mono text-xs tracking-[0.16em] text-ink-soft uppercase">
              Path two
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight">
              From source
            </h3>
            <p className="mt-3 leading-relaxed text-ink-soft">
              Python 3.11 or newer. Clone the repository, install the
              requirements, and run the watcher against a repository.
            </p>

            <div className="mt-6">
              <CommandBlock
                label="install from source"
                commands={[
                  `git clone ${config.repoUrl}.git`,
                  `cd ${config.githubRepo}`,
                  "pip install -r requirements.txt",
                  "python -m sentinel watch /path/to/your/repo",
                ]}
              />
            </div>

            <p className="mt-4 text-sm text-ink-soft">
              The watcher prints its verdict to the terminal. The Telegram bot and
              web dashboard are optional and configured separately.
            </p>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.1} className="mt-6">
        <UnsignedBuildNote />
      </Reveal>
    </Section>
  );
}
