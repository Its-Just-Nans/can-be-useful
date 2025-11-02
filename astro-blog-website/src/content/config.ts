import { defineCollection, z } from "astro:content";

function removeDupsAndLowerCase(array: string[]) {
    if (!array.length) return array;
    const lowercaseItems = array.map((str) => str.toLowerCase());
    const distinctItems = new Set(lowercaseItems);
    return Array.from(distinctItems);
}

const assertOrder = (array: string[]) => {
    // assert that the array is in alphabetical order
    const sortedArray = [...array].sort((a, b) => a.localeCompare(b));
    const isSorted = array.every((item, index) => item === sortedArray[index]);
    if (!isSorted) {
        throw new Error(`Tags ${JSON.stringify(array)} must be in alphabetical order`);
    }
    return array;
};

const post = defineCollection({
    type: "content",
    schema: ({ image }) =>
        z.object({
            title: z.string().max(28),
            description: z.string().min(20).max(160).optional(),
            publishDate: z
                .string()
                .or(z.date())
                .transform((val) => (val ? new Date(val) : new Date())),
            updatedDate: z
                .string()
                .or(z.date())
                .optional()
                .transform((str) => (str ? new Date(str) : undefined))
                .optional(),
            coverImage: z
                .object({
                    src: image(),
                    alt: z.string(),
                })
                .optional(),
            noDate: z.boolean().default(false),
            draft: z.boolean().default(false),
            hidden: z.boolean().default(false),
            tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase).transform(assertOrder),
            ogImage: z.string().optional(),
            customSlug: z
                .string()
                .transform((str) => (str.endsWith("/") ? str : `${str}/`))
                .optional(),
        }),
});

export const collections = { post };
