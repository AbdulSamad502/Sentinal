/**
 * First-run friction on unsigned builds.
 *
 * DELETE THIS FILE and its one usage in sections/Install.tsx once the installers
 * are signed and notarized. It is deliberately self-contained so that removing
 * it is a two-line change.
 */
export function UnsignedBuildNote() {
  return (
    <div className="rounded-lg border border-rule bg-surface-sunk px-5 py-4">
      <h4 className="mb-2 text-sm font-semibold tracking-tight">
        On first launch
      </h4>
      <p className="text-sm leading-relaxed text-ink-soft">
        The builds are not yet signed, so both systems will hold them once. On
        macOS, right-click the app and choose Open. On Windows, choose More info,
        then Run anyway. Neither prompt reappears after the first launch.
      </p>
    </div>
  );
}
