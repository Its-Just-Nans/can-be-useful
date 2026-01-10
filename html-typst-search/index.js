import fs from "fs";

// Simple HTML parser mock
function dmparser(html) {
    return {
        innerText: html.replace(/<[^>]*>/g, ""),
    };
}

function parseObj(obj, route = "/", id = "") {
    // Ignore non-objects (null, primitives)
    if (obj === null || typeof obj !== "object") {
        return [];
    }
    const results = [];

    // Handle arrays
    if (Array.isArray(obj)) {
        for (const item of obj) {
            results.push(...parseObj(item, route));
        }
        return results;
    }

    // Update route if present
    const currentRoute = typeof obj.route === "string" ? obj.route : route;
    const currentId = typeof obj.id === "string" ? obj.id : id;

    // Parse HTML content
    if (typeof obj.content === "string" && obj.content.trim().startsWith("<")) {
        const parsedHtml = dmparser(obj.content).innerText;
        results.push({
            id: currentId,
            route: currentRoute,
            text: parsedHtml,
        });
    }

    // Walk all object properties
    for (const key of Object.keys(obj)) {
        const value = obj[key];

        if (typeof value !== "string") {
            results.push(...parseObj(value, currentRoute, currentId));
        }
    }

    return results;
}

const data = JSON.parse(fs.readFileSync("data.json", "utf8"));

const parsed = parseObj(data);

fs.writeFileSync("index.json", JSON.stringify(parsed));
