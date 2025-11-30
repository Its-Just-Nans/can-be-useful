const colors: { [d: number]: string } = {};

export const getColorOfCodePoint = (codePoint: number) => {
    if (colors[codePoint]) {
        return colors[codePoint];
    }
    colors[codePoint] = "#" + (((1 << 24) * Math.random()) | 0).toString(16).padStart(6, "0");
    return colors[codePoint];
};

export const getByteOfCodePoint = (codePoint: number) => {
    if (codePoint <= 0x7f) {
        // 1 byte encoding
        return [codePoint];
    } else if (codePoint <= 0x7ff) {
        // 2 byte encoding
        return [((codePoint >> 6) & 0x1f) | 0xc0, (codePoint & 0x3f) | 0x80];
    } else if (codePoint <= 0xffff) {
        // 3 byte encoding
        return [((codePoint >> 12) & 0x0f) | 0xe0, ((codePoint >> 6) & 0x3f) | 0x80, (codePoint & 0x3f) | 0x80];
    } else if (codePoint <= 0x10ffff) {
        // 4 byte encoding
        return [
            ((codePoint >> 18) & 0x07) | 0xf0,
            ((codePoint >> 12) & 0x3f) | 0x80,
            ((codePoint >> 6) & 0x3f) | 0x80,
            (codePoint & 0x3f) | 0x80,
        ];
    }
    return [];
};
