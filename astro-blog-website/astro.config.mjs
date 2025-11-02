import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import rehypeExternalLinks from "rehype-external-links";
import { thisWebsite } from "./src/utils/constants";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
    site: thisWebsite,
    integrations: [
        mdx({
            rehypePlugins: [[rehypeExternalLinks, { target: "_blank" }]],
        }),
        sitemap({
            changefreq: "weekly",
            priority: 0.7,
            lastmod: new Date(),
        }),
    ],
    devToolbar: {
        enabled: false,
    },
});
