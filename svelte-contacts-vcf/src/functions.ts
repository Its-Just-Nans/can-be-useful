import { get, set } from "idb-keyval";
import { filename, size, content, fileHandle, parsed } from "./stores";
import { get as getStore } from "svelte/store";
import { parseVCard } from "./vcard";

export const getFile = async (showFilePicker = false) => {
    let currentFileHandle;
    if (!showFilePicker) {
        try {
            currentFileHandle = await get("file");
            if (!currentFileHandle) {
                throw new Error("No file found in cache");
            }
        } catch (error) {
            [currentFileHandle] = await window.showOpenFilePicker();
            if (currentFileHandle) {
                await set("file", currentFileHandle);
            }
        }
    } else {
        [currentFileHandle] = await window.showOpenFilePicker();
        if (currentFileHandle) {
            await set("file", currentFileHandle);
        }
    }
    if (!currentFileHandle) {
        return;
    }
    if ((await currentFileHandle.queryPermission({ mode: "readwrite" })) == "granted") {
        fileHandle.set(currentFileHandle);
        return;
    }
    if ((await currentFileHandle.requestPermission({ mode: "readwrite" })) === "granted") {
        fileHandle.set(currentFileHandle);
        return;
    }
    if ((await currentFileHandle.requestPermission({ mode: "read" })) === "granted") {
        fileHandle.set(currentFileHandle);
    }
};

export const readFile = async () => {
    const currentFileHandle = getStore(fileHandle);
    if (!currentFileHandle) {
        return;
    }
    const file = await currentFileHandle.getFile();
    filename.set(file.name);
    size.set(file.size);
    content.set(await file.text());
    parseVCard(getStore(content));
};

export const writeToFile = async (content: string = "") => {
    const currentFileHandle = getStore(fileHandle);
    if (!currentFileHandle) {
        return;
    }
    // Create a FileSystemWritableFileStream to write to.
    const writable = await currentFileHandle.createWritable();
    // Write the contents of the file to the stream.
    await writable.write(content);
    // Close the file and write the contents to disk.
    await writable.close();
};

export function isAsciiLetter(char) {
    let charCode = char.charCodeAt(0);
    return (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122);
}

export function getName(data) {
    const arrayName = data.find((oneValue) => oneValue[0] === "fn");
    if (arrayName && arrayName.length > 3) {
        return arrayName[3];
    }
    return "";
}
