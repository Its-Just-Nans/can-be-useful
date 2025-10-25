const matter = (inputFile) => {
    const separator = "---";
    const matterKeySplit = ["keywords"];
    const lines = inputFile.toString().split("\n");
    if (!lines[0].startsWith(separator)) {
        throw `Head (matter) must be present`;
        // or
        // return {content, data: {}}
    }
    let idxMatter = 0;
    for (const oneLine of lines) {
        if (oneLine.startsWith(separator) && idxMatter !== 0) {
            break;
        }
        idxMatter++;
    }
    const data = lines.slice(1, idxMatter).reduce((acc, oneLineTag) => {
        const [key, value] = oneLineTag.split(": ");
        const cleanValue = matterKeySplit.includes(key) ? value.split(", ") : value;
        return {
            [key]: cleanValue,
            ...acc,
        };
    }, {});
    const content = lines.slice(idxMatter + 1).join("\n");
    return { content, data };
};
