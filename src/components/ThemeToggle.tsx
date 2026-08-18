import { useThemeContext } from "../lib/theme";

export function ThemeToggle() {
  const { theme, toggle } = useThemeContext();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={theme === "dark"}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className="rounded-md border border-rule p-2 text-ink-soft transition-colors hover:border-accent hover:text-accent active:bg-accent-wash"
    >
      <svg
        viewBox="0 0 20 20"
        aria-hidden="true"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        {theme === "dark" ? (
          <>
            <circle cx="10" cy="10" r="3.5" fill="currentColor" stroke="none" />
            <path d="M10 1.5v2M10 16.5v2M18.5 10h-2M3.5 10h-2M16 4l-1.4 1.4M5.4 14.6 4 16M16 16l-1.4-1.4M5.4 5.4 4 4" />
          </>
        ) : (
          <path
            d="M16.5 11.8A7 7 0 1 1 8.2 3.5a5.6 5.6 0 0 0 8.3 8.3Z"
            fill="currentColor"
            stroke="none"
          />
        )}
      </svg>
    </button>
  );
}
