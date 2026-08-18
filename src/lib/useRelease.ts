import { useEffect, useState } from "react";
import { fetchLatestRelease, type ReleaseState } from "./releases";

/**
 * Resolves the release state exactly once per page load. The result is cached in
 * sessionStorage by fetchLatestRelease, so scrolling around never re-fetches.
 */
export function useRelease(): ReleaseState {
  const [state, setState] = useState<ReleaseState>({ status: "loading" });

  useEffect(() => {
    let active = true;
    fetchLatestRelease().then((next) => {
      if (active) setState(next);
    });
    return () => {
      active = false;
    };
  }, []);

  return state;
}
