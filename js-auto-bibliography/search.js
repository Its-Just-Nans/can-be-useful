import { readFileSync, writeFileSync } from "fs";

export const search = (query) => {
    const regex = new RegExp(query, "i");
    const lines = file.split("\n");
    return lines.filter((line) => regex.test(line));
};

const crossref = "https://api.crossref.org";
const format = "application/x-bibtex";
const mailto = "mail@template";

const fetchOneCitation = async (citation) => {
    const respCit = await fetch(
        `${crossref}/works?query.bibliographic=${encodeURIComponent(citation)}&rows=3&mailto=${mailto}`
    );
    const data = await respCit.json();

    if (data.message.items.length == 0) {
        return null;
    }
    const item = data.message.items[0];
    if (item.score < 100) {
        return { item, bib: null };
    }
    console.log(`Citation: ${citation}`);
    console.log(`Title: ${item.title[0]}`);
    console.log(`DOI: ${item.DOI}`);
    console.log(item.resource.primary.URL);

    const bibUrl = `${crossref}/works/${encodeURIComponent(item.DOI)}/transform/${encodeURIComponent(
        format
    )}?mailto=${mailto}`;
    console.log(`BibTeX URL: ${bibUrl}`);
    const resp = await fetch(bibUrl);
    const bibData = await resp.text();
    console.log(bibData);
    return { item: item, bib: bibData };
};

async function processWithPool(items, task, concurrency = 10) {
    const results = new Array(items.length);
    let currentIndex = 0;

    async function worker() {
        while (currentIndex < items.length) {
            const i = currentIndex++;
            try {
                console.log(`Processing item ${i + 1}/${items.length}`);
                const res = await task(items[i], i);
                results[i] = { success: true, data: res, item: items[i] };
            } catch (err) {
                results[i] = { success: false, data: err, item: items[i] };
            }
        }
    }

    const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => worker());

    await Promise.all(workers);
    return results;
}

const main = async () => {
    const file = readFileSync("./file.txt", "utf8").toString();
    const allCitations = file.split("\n").filter((line) => line.trim().length > 0);

    const res = await processWithPool(allCitations, fetchOneCitation);

    writeFileSync("./output.json", JSON.stringify(res, null, 2), "utf8");

    const filterNull = res.filter((r) => r.success && r.data !== null);

    writeFileSync("./output_filtered.json", JSON.stringify(filterNull, null, 2), "utf8");

    writeFileSync("finded.bib", filterNull.map((r) => r.data.bib).join("\n\n\n"), "utf8");
};

main();
