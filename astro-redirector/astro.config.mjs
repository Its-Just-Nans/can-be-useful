// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
    site: `https://n4n5.dev/can-be-useful/astro-redirector/`,
    integrations: [mdx(), sitemap()],
});
