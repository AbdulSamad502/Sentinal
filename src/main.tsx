import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Self-hosted so there is no render-blocking request to a font CDN.
// Latin only -- see fonts.css for why.
import "./fonts.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/ibm-plex-mono/latin-500.css";

import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
