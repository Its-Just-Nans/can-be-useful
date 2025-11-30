import { readdir } from "node:fs/promises";

export const getData = async () => {
    return (await readdir("public/"))
        .filter((file) => file.endsWith(".json"))
        .sort()
        .map((year) => {
            return year.replace(".json", "").replace(/.*_/g, "");
        });
};
