import { defineCollection, z } from "astro:content";

const redirections = defineCollection({
    type: "content",
    // Type-check frontmatter using a schema
    schema: z.object({
        title: z.string(),
        url: z.string(),
    }),
});

export const collections = { redirections };
