import data from "@emoji-mart/data";
import type { Emoji, Skin } from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

async function copyText(text: string) {
    if (navigator.clipboard && window.isSecureContext) {
        // Modern API
        return navigator.clipboard.writeText(text);
    } else {
        // Fallback
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
    }
}

export default function App() {
    return (
        <Picker
            data={data}
            onEmojiSelect={(emoji: Emoji & Skin) => {
                console.log(emoji);
                copyText(emoji.native);
            }}
        />
    );
}
