// @ts-check
import { defineConfig } from "astro/config";

// The Cloudflare adapter is injected by Alchemy at deploy time (see alchemy.run.ts),
// so don't declare one here.
export default defineConfig({
  site: "https://arghyasarkar.com",
  output: "static",
  // Collapse whitespace like regular HTML (Astro 7 defaults to JSX-style, which eats spaces before links).
  compressHTML: true,
  devToolbar: { enabled: false },
});
