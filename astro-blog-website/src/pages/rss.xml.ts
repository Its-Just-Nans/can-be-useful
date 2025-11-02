import type { APIContext } from "astro";
import rss from "@astrojs/rss";
import { filterHidden, getAllPosts, getEntrySlug, sortMDByDate } from "@utils/posts";
import { thisWebsite } from "@utils/constants";

export async function GET(context: APIContext) {
    const allPosts = filterHidden(await getAllPosts());
    const allPostsByDate = sortMDByDate(allPosts, true);
    const customData = {
        language: "en-EN",
        lastBuildDate: new Date().toUTCString(),
        generator: context.generator ?? "Astro",
        copyright: `Copyright ${new Date().getFullYear()} n4n5`,
    };
    const objToXml = (data: object) =>
        Object.entries(data).reduce((acc, [key, value]) => {
            acc += `<${key}>${value}</${key}>\n`;
            return acc;
        }, "");
    return rss({
        title: "Thoughts of n4n5",
        description: "RSS feed for thoughts by n4n5",
        site: context.site || new URL(thisWebsite),
        items: allPostsByDate.map((post) => {
            const { updatedDate, publishDate } = post.data;
            const pubDate = updatedDate ?? publishDate;
            const slug = getEntrySlug(post);
            return {
                title: post.data.title,
                pubDate,
                link: `/${slug}/`,
                ...(updatedDate && {
                    customData: objToXml({
                        updatedDate: updatedDate.toISOString(),
                        publishDate: publishDate.toISOString(),
                    }),
                }),
            };
        }),
        customData: objToXml(customData),
    });
}
