import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";

export async function getAllPosts(): Promise<CollectionEntry<"post">[]> {
    const slugs = new Set();
    return await getCollection("post", (post) => {
        const { data } = post;
        const slug = getEntrySlug(post);
        if (slugs.has(slug)) {
            throw new Error(`Duplicate slug found: ${slug} in ${data.title}`);
        } else {
            slugs.add(slug);
        }
        if (import.meta.env.DEV && data.draft) {
            console.log(`Draft post found: ${data.title}`);
        }
        // if (import.meta.env.DEV && data.hidden) {
        //     console.log(`Hidden post found: ${data.title}`);
        // }
        return import.meta.env.PROD ? data.draft !== true : true;
    });
}

export const filterHidden = (posts: CollectionEntry<"post">[], value = false): CollectionEntry<"post">[] => {
    return posts.filter((post) => post.data.hidden == value);
};

export function sortMDByDate(posts: CollectionEntry<"post">[], useUpdatedDate = false): CollectionEntry<"post">[] {
    return posts.sort((a, b) => {
        if (a.data.noDate) {
            return 1;
        }
        if (b.data.noDate) {
            return -1;
        }
        const aDate = new Date(
            useUpdatedDate ? (a.data.updatedDate ?? a.data.publishDate) : a.data.publishDate
        ).valueOf();
        const bDate = new Date(
            useUpdatedDate ? (b.data.updatedDate ?? b.data.publishDate) : b.data.publishDate
        ).valueOf();
        return bDate - aDate;
    });
}

export const getEntrySlug = (post: CollectionEntry<"post">): string => {
    if (post.data.customSlug) {
        return post.data.customSlug;
    }
    const idxSlash = post.slug.lastIndexOf("/");
    if (idxSlash >= 0) {
        return post.slug.substring(idxSlash + 1);
    }
    return post.slug;
};

export const getAllTags = (posts: CollectionEntry<"post">[]): string[] => {
    const tags = new Set<string>();
    posts.forEach((post) => {
        if (post.data.tags) {
            post.data.tags.forEach((tag) => {
                tags.add(tag);
            });
        }
    });
    tags.delete("thought"); // basic one
    return Array.from(tags);
};
