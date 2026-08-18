import { useEffect, useState } from "react";

/** Copy-to-clipboard for install commands, with the result announced politely. */
export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      /* clipboard blocked -- the command is visible and selectable anyway */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${label}`}
      className="shrink-0 rounded-md border border-rule px-2.5 py-1 font-mono text-[0.6875rem] text-ink-soft transition-colors hover:border-accent hover:text-accent active:bg-accent-wash"
    >
      <span aria-hidden="true">{copied ? "copied" : "copy"}</span>
      <span className="sr-only" role="status">
        {copied ? `${label} copied to clipboard` : ""}
      </span>
    </button>
  );
}
