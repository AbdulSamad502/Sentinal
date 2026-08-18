import { ThemeProvider } from "./lib/theme";
import { SmoothScroll } from "./lib/SmoothScroll";
import { Nav } from "./components/Nav";
import { Hero } from "./sections/Hero";
import { WhatItIs } from "./sections/WhatItIs";
import { Problem } from "./sections/Problem";
import { Purpose } from "./sections/Purpose";
import { Features } from "./sections/Features";
import { Principles } from "./sections/Principles";
import { Runtime } from "./sections/Runtime";
import { Media } from "./sections/Media";
import { Install } from "./sections/Install";
import { Download } from "./sections/Download";
import { Footer } from "./sections/Footer";

export default function App() {
  return (
    <ThemeProvider>
      <SmoothScroll>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-100 focus:rounded-md focus:bg-surface focus:px-4 focus:py-2 focus:text-ink focus:shadow-[var(--shadow-card)]"
        >
          Skip to content
        </a>

        <Nav />

        <main id="main">
          <Hero />
          <WhatItIs />
          <Problem />
          <Purpose />
          <Features />
          <Principles />
          <Runtime />
          <Install />
          <Download />
          <Media />
        </main>

        <Footer />
      </SmoothScroll>
    </ThemeProvider>
  );
}
