import { Section, Reveal } from "../components/Section";
import { config } from "../config";

/**
 * The demo video and architecture diagram are not ready yet. Both render a
 * designed placeholder that reads as intentional -- a labelled empty frame, not
 * a broken embed -- and swap to the real thing the moment their config value is
 * filled in.
 */
export function Media() {
  return (
    <Section
      id="demo"
      eyebrow="Demo and architecture"
      title="Sentinel, running."
      lede="A walkthrough of a real supervised session, and the system diagram behind it."
      width="wide"
      className="border-t border-rule"
    >
      <div className="space-y-6">
        <Reveal>
          <MediaSlot
            title="Demo video"
            note="Five minutes, no narration over silence."
            ratio="aspect-video"
          >
            {config.demoVideoUrl ? (
              <VideoEmbed url={config.demoVideoUrl} />
            ) : null}
          </MediaSlot>
        </Reveal>

        <Reveal delay={0.06}>
          <MediaSlot
            title="Architecture diagram"
            note="Strands Agents SDK, Bedrock, AgentCore, GitHub, Telegram, file watcher."
            ratio="aspect-[16/9]"
          >
            {config.architectureDiagram ? (
              <img
                src={config.architectureDiagram}
                alt="Sentinel system architecture: the file watcher and git hooks feed the analyzers, which produce a deterministic verdict surfaced through the terminal, Telegram bot, web dashboard and MCP server."
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain"
              />
            ) : null}
          </MediaSlot>
        </Reveal>
      </div>
    </Section>
  );
}

function MediaSlot({
  title,
  note,
  ratio,
  children,
}: {
  title: string;
  note: string;
  ratio: string;
  children: React.ReactNode;
}) {
  const filled = Boolean(children);

  return (
    <figure className="overflow-hidden rounded-xl border border-rule bg-surface shadow-[var(--shadow-card)]">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-rule px-5 py-3.5">
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
        <p className="font-mono text-xs text-ink-soft">{note}</p>
      </figcaption>

      <div className={`${ratio} w-full bg-surface-sunk`}>
        {filled ? (
          children
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
            {/* A measured frame, drawn deliberately -- this is a slot waiting to
                be filled, and it should look like one. */}
            <svg
              viewBox="0 0 64 40"
              aria-hidden="true"
              className="h-10 w-16 text-ink-soft/45"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <rect x="0.5" y="0.5" width="63" height="39" rx="2" />
              <path d="M0.5 8.5h63M8.5 8.5v31" strokeDasharray="2 3" />
              <circle cx="36" cy="24" r="6" />
              <path d="M36 15v3M45 24h-3M36 33v-3M27 24h3" />
            </svg>
            <p className="font-mono text-xs tracking-wider text-ink-soft uppercase">
              Not yet published
            </p>
          </div>
        )}
      </div>
    </figure>
  );
}

function VideoEmbed({ url }: { url: string }) {
  // A direct video file plays inline; anything else is treated as an embed URL.
  if (/\.(mp4|webm|mov)$/i.test(url)) {
    return (
      <video
        src={url}
        controls
        preload="none"
        playsInline
        className="h-full w-full"
      />
    );
  }

  return (
    <iframe
      src={url}
      title="Sentinel demo video"
      loading="lazy"
      allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
      allowFullScreen
      className="h-full w-full border-0"
    />
  );
}
