import { parse } from "ical.js";
import { parsed } from "./stores";

export const parseFile = (content: string): Array<{}> => {
    const parsedFile = parse(content);
    if (!parsedFile) {
        return [];
    }
    if (!Array.isArray(parsedFile)) {
        return [];
    }
    if (parsedFile.length > 0 && parsedFile[0] === "vcard") {
        return [parsedFile];
    }
    return parsedFile;
};

export const parseVCard = (content: string) => {
    try {
        const parsedContent = parseFile(content);
        parsed.set(parsedContent);
    } catch (e) {
        console.error(e);
    }
};

export async function digestMessage(message = "", sha = "SHA-1") {
    const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest(sha, msgUint8); // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join(""); // convert bytes to hex string
    return hashHex;
}
