import { CopyButton } from "./CopyButton";

/**
 * A shell command with a copy button. Wide commands scroll inside this box --
 * the page body never scrolls horizontally.
 */
export function CommandBlock({
  commands,
  label,
}: {
  commands: string[];
  label: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-rule bg-surface-sunk">
      {commands.map((command, index) => (
        <div
          key={command}
          className={`flex items-center gap-3 px-3 py-2.5 ${
            index > 0 ? "border-t border-rule" : ""
          }`}
        >
          <span aria-hidden="true" className="font-mono text-xs text-ink-soft/60">
            $
          </span>
          <code className="min-w-0 flex-1 overflow-x-auto font-mono text-[0.8125rem] whitespace-pre text-ink">
            {command}
          </code>
          <CopyButton value={command} label={`${label} command`} />
        </div>
      ))}
    </div>
  );
}
