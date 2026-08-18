import { createContext, useContext, type ReactNode } from "react";
import { useTheme, type Theme } from "./useTheme";

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * One source of theme truth. The toggle writes it and the WebGL hero reads it --
 * the 3D scene has to rebuild its textures when the theme changes, so it cannot
 * rely on CSS custom properties the way the rest of the page does.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const value = useTheme();
  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useThemeContext must be used inside ThemeProvider");
  return context;
}
