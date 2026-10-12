import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Effect from "effect/Effect";

// Fully static Astro build, served straight from Cloudflare's asset layer.
export const Website = Cloudflare.Website.Astro("Website", {
  name: "arghyasarkar",
  astro: { output: "static" },
  assets: { notFoundHandling: "404-page" },
  domain: "arghyasarkar.com",
});

export default Alchemy.Stack(
  "ArghyaSarkar",
  {
    providers: Cloudflare.providers(),
    // State lives in Cloudflare too, so nothing about the deploy is local-only.
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    const site = yield* Website;
    return { url: site.url };
  }),
);
